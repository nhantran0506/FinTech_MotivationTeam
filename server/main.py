from typing import Union
from fastapi import FastAPI, Depends, HTTPException, status
from pydantic import BaseModel
import models, schemas
from database import SessionLocal, engine
from sqlalchemy.orm import Session
from auth import *
from typing import List
import qrcode
import base64
from io import BytesIO

app = FastAPI()

models.Base.metadata.create_all(bind=engine)



def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/register", response_model=schemas.User)
def register(user: schemas.UserCreate, db : Session = Depends(get_db)):
    db_user = models.get_user_by_phone(db, phonenumber=user.phonenumber)
    if db_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User already exists")
    
    

    return models.create_user(
        db, 
        phonenumber=user.phonenumber,
        password=user.password,
        name=user.name,
        social_id=user.social_id
    )

@app.post("/login", response_model=schemas.Token)
def login(user: schemas.UserLogin, db : Session = Depends(get_db)):
    db_user = authenticate_user(db, user.phonenumber, user.password)
    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid phone number or password")
    acess_token = create_access_token(data={"sub": db_user.phonenumber})
    return {"access_token": acess_token, "token_type": "bearer"}

@app.post("/transfer", response_model=schemas.Transfer)
def transfer(transfer: schemas.Transfer, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.balance < transfer.amount:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Insufficient balance")
    
    receiver = models.get_user_by_phone(db, transfer.phonenumber_reciver)
    if not receiver:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    current_user.balance -= transfer.amount
    receiver.balance += transfer.amount

    transaction = models.Transaction(
        sender_id=current_user.id,
        receiver_id=receiver.id,
        amount=transfer.amount,
    )
    db.add(transaction)
    db.commit()
    return {"status": "Transfer successful"}


@app.post("/transactions", response_model=List[schemas.Transaction])
def get_transactions(current_user: models.User = Depends(get_current_user), db : Session = Depends(get_db)):
    return db.query(models.Transaction).filter(models.Transaction.sender_id == current_user.id).all() + db.query(models.Transaction).filter(models.Transaction.receiver_id == current_user.id).all()


@app.post("/balance", response_model=schemas.Balance)
def get_balance(current_user: models.User = Depends(get_current_user)):
    return {"balance": current_user.balance}

# @app.post("/request_loan")
# def request_loan(curr

class QRRequest(BaseModel):
    qr_text: str

@app.post("/qr")
def generate_qr(qr: QRRequest):
    qr_image = qrcode.make(qr.qr_text, box_size=15)
    qr_image_pil = qr_image.get_image()
    stream = BytesIO()
    qr_image_pil.save(stream, format='PNG')
    qr_image_data = stream.getvalue()
    qr_image_base64 = base64.b64encode(qr_image_data).decode('utf-8')
    return {"qr_image_base64": qr_image_base64, "variable": qr.qr_text}
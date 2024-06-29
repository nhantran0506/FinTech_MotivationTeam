from typing import Union
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import models, schemas
from database import SessionLocal, engine
from sqlalchemy.orm import Session
from auth import *
from typing import List
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
    return {"access_token": acess_token, "token_type": "Bearer"}

@app.post("/get_user", response_model=schemas.User)
def get_user(current_user: models.User = Depends(get_current_user)):
    return current_user

@app.post("/transfer", response_model=schemas.Transfer)
def transfer(transfer: schemas.Transfer, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.balance < transfer.amount and transfer.amount > 0:
        return JSONResponse(content={"status": "Insufficient balance"}, status_code=status.HTTP_400_BAD_REQUEST)
        
    receiver = models.get_user_by_phone(db, transfer.phonenumber_reciver)
    if not receiver:
        return JSONResponse(content={"status": "User not found!"}, status_code=status.HTTP_404_NOT_FOUND)
    
    current_user.balance -= transfer.amount
    receiver.balance += transfer.amount

    transaction = models.Transaction(
        sender_id=current_user.id,
        reciver_id=receiver.id,
        amount=transfer.amount,
    )
    db.add(transaction)
    db.commit()
    return JSONResponse(content={"status": "Transfer successful"}, status_code=status.HTTP_200_OK)


@app.post("/get_transactions", response_model=List[schemas.Transaction])
def get_transactions(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    sent_transactions = db.query(models.Transaction).filter(models.Transaction.sender_id == current_user.id).all()
    received_transactions = db.query(models.Transaction).filter(models.Transaction.reciver_id == current_user.id).all()
    

    all_transactions = sent_transactions + received_transactions
    all_transactions.sort(key=lambda x: x.timestamp, reverse=True)
    
    result = []
    for trans in all_transactions:  
        if current_user.id == trans.sender_id:
            result.append(schemas.Transaction(
                amount = - trans.amount,
                timestamp = trans.timestamp,
                name = models.get_user_by_id(db, trans.sender_id).name
            ))
        else:
            result.append(schemas.Transaction(
                amount = trans.amount,
                timestamp = trans.timestamp,
                name = models.get_user_by_id(db, trans.reciver_id).name
            ))
    
    return result


    
    return all_transactions

@app.post("/add_familiar_transactions")
def add_familiar_transactions(
    familiar_user : schemas.Familiar,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    familiar = models.FamiliarReciever(
        account_id = current_user.id,
        familiar_id = get_user_by_phone(db, familiar_user.phonenumber).id
    )
    db.add(familiar)
    db.commit()
    return JSONResponse(content={"status": "Familiar added successfully"}, status_code=status.HTTP_200_OK)

@app.post("/get_familiars", response_model=List[schemas.FamiliarGet])
def get_familiars(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    familiars = db.query(models.FamiliarReciever).filter(models.FamiliarReciever.account_id == current_user.id).all()
    familiars_list = []

    for familiar in familiars:
        atrr = models.get_user_by_id(db, familiar.familiar_id)
        familiars_list.append(schemas.FamiliarGet(phonenumber=atrr.phonenumber, name=atrr.name))
    return familiars_list

@app.post("/balance", response_model=schemas.Balance)
def get_balance(current_user: models.User = Depends(get_current_user)):
    return {"balance": current_user.balance}

@app.post("/request_loan")
def request_loan(loan : schemas.Loan ,current_user: models.User = Depends(get_current_user), db : Session = Depends(get_db)):
    if current_user.roles != "USER":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="You are not authorized to perform this action")
    
    loan_history = db.query(models.Loan).filter(models.Loan.user_id == current_user.id).order_by(models.Loan.request_date.desc()).first()
    if loan_history and loan_history.status != "PAID" :
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="You already have a loan")
    
    loan = models.Loan(
        user_id = current_user.id,
        amount = loan.amount,
        status = "PENDING",
    )
    db.add(loan)
    db.commit()
    return {"Status" : "Request sent successfully!"}

@app.post("/update_loan_status", response_model=schemas.Loan)
def update_loan_status(loan_update: schemas.LoanUpdate, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.roles != "LOAN OFFICER":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="You are not authorized to perform this action")
    
    loan_history = db.query(models.Loan).filter(models.Loan.user_id == current_user.id).order_by(models.Loan.request_date.desc()).first()

    if not loan_history:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Loan not found")

    loan_history.status = loan_update.status


    if loan_history.status == "APPROVED":
        loan_history.on_date = datetime.utcnow()
        loan_history.dl_date = datetime.utcnow() + timedelta(days=60)

    db.commit()
    db.refresh(loan_history)
    return {"Status" : "Updated successfully!"}




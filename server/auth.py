from datetime import datetime, timedelta
from typing import Optional, Any
from jose import JWSError, jwt
from fastapi import HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from models import get_user_by_phone
from database import SessionLocal
import os
from dotenv import load_dotenv
from pathlib import Path

load_dotenv(dotenv_path='.env')



SECRET_KEY = os.getenv('SECRET_KEY')
ALGORTHIM = os.getenv('ALGORITHM')
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv('ACCESS_TOKEN_EXPIRE_MINUTES'))

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Fix local_kw
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_access_token(data : dict, expires_delta : Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORTHIM)
    return encoded_jwt


def get_current_user(token: str = Depends(oauth2_scheme), db : Session = Depends(get_db)):
    credentials_exceptions = HTTPException(
        status_code= status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers = {"WWW-Authenticate": "Bearer"}

    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORTHIM])
        phonenumber : str = payload.get("sub")
        if phonenumber is None:
            raise credentials_exceptions
    except:
        raise credentials_exceptions
    user = get_user_by_phone(db, phonenumber)
    if user is None:
        raise credentials_exceptions
    return user


def authenticate_user (db : Session, phonenumber : str, password: str):
    user = get_user_by_phone(db, phonenumber)
    if not user:
        return False
    if not user.verify_password(password):
        return False
    return user
        
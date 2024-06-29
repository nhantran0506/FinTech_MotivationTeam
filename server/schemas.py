from pydantic import BaseModel, validator
from datetime import datetime
from typing import List
class UserBase(BaseModel):
    phonenumber: str
    social_id : str
    name :str

    @validator("phonenumber")
    def validate_phonenumber(cls, v):
        if len(v) != 10:
            raise ValueError("Phone number must be 10 digits long")
        return v
class UserCreate(UserBase):
    password: str

class User(UserBase):
    phonenumber: str
    social_id : str
    name :str
    balance: float
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class UserLogin(BaseModel):
    phonenumber : str
    password: str

class Balance(BaseModel):
    balance: float

class Transfer(BaseModel):
    phonenumber_reciver : str
    amount: float

class Transaction(BaseModel):
    id : str
    sender_id : str
    reciver_id : str
    amount : float
    timestamp : datetime 

    class Config:
        from_attributes = True
        
class Balance(BaseModel):
    balance: str

class Loan(BaseModel):
    phonenumber : str
    amount : float

class LoanUpdate(BaseModel):
    status : str

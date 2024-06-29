from sqlalchemy import Column, String, Float, ForeignKey, DateTime, Enum as SQLEnum, PrimaryKeyConstraint
from sqlalchemy.orm import relationship
from database import Base, SessionLocal
from passlib.context import CryptContext
import uuid
from datetime import datetime, timedelta
import enum
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class UserEnum(enum.Enum):
    ADMIN = "ADMIN",
    LOAN_OFFICER = "LOAN OFFICER",
    USER = "USER"

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    social_id = Column(String, unique=True)
    name = Column(String, index=True)
    phonenumber = Column(String)
    roles = Column(SQLEnum(UserEnum), default=UserEnum.USER)
    hash_pwd = Column(String)
    balance = Column(Float, default=0.0)

    def verify_password(self, plain_password: str) -> bool:
        return pwd_context.verify(plain_password, self.hash_pwd)
    

def get_user_by_phone(db: SessionLocal , phonenumber: str):
    return db.query(User).filter(User.phonenumber == phonenumber).first()

def get_user_by_id(db: SessionLocal , id: str):
    return db.query(User).filter(User.id == id).first()

def create_user(db : SessionLocal , name : str, social_id : str,  phonenumber: str, password: str):
    hased_pwd = pwd_context.hash(password)
    user = User(name = name , social_id=social_id, phonenumber = phonenumber, hash_pwd=hased_pwd)
    db.add(user)
    db.commit()
    db.refresh(user) # reload default values back in user object
    return user




# Transaction 
class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    sender_id = Column(String, ForeignKey("users.id"))
    reciver_id = Column(String, ForeignKey("users.id"))
    amount = Column(Float, default=0.0)
    timestamp = Column(DateTime, default=datetime.utcnow)

    sender = relationship("User", foreign_keys=[sender_id])
    reciver = relationship("User", foreign_keys=[reciver_id])


# Loans
class LoanStatus(enum.Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    CANCELLED = "CANCELLED"
    PAID = "PAID"

class Loan(Base):
    __tablename__ = "loans"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"))
    amount = Column(Float, default=0.0)
    request_date = Column(DateTime, default=datetime.utcnow)
    on_date = Column(DateTime)
    dl_date = Column(DateTime)

    status = Column(SQLEnum(LoanStatus), default=LoanStatus.PENDING)
    loander = relationship("User", foreign_keys=[user_id])


# Familiar name
class FamiliarReciever(Base):
    __tablename__ = "familiar_recievers"

    account_id = Column(String, ForeignKey("users.id"), primary_key=True)
    familiar_id = Column(String, ForeignKey("users.id"), primary_key=True)

    familiar = relationship("User", foreign_keys=[familiar_id])
    account = relationship("User", foreign_keys=[account_id])

    __table_args__ = (
        PrimaryKeyConstraint('account_id', 'familiar_id'),
    )




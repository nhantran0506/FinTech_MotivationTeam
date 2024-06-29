from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "sqlite:///./FinaceApp.db"

engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autoflush=False, bind=engine) 
# autocommit -> database doesn't commit changes until commit() is called
# autoflush -> SQLAlchemy automatically flushes the session to the database after each operation

Base = declarative_base()
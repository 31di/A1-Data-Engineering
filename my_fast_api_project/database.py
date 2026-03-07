from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

engine=create_engine('postgresql://postgres:admin@localhost:5432/odai')

Base=declarative_base()

session=sessionmaker(bind=engine,autocommit=False,autoflush=False)


def get_db():
    db = session()
    try:
        yield db
    finally:
        db.close()


import os 
from sqlalchemy import create_engine 
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

dotenv_path = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv(dotenv_path)

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL, future=True, echo=False)

# sessionmaker: cria uma fábrica de sessions
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, future=True)

# Base para modelos
Base = declarative_base()

# helper: dependência para uso 
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


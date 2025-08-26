import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv


load_dotenv()


URL = f"postgresql+psycopg://{os.environ['POSTGRES_USER']}:{os.environ['POSTGRES_PASSWORD']}@{os.environ['POSTGRES_HOST']}:{os.environ['POSTGRES_PORT']}/{os.environ['POSTGRES_DB']}"
engine = create_engine(URL, future=True)

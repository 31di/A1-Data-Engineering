import os


# You can override these values using environment variables:
# - SQLITE_PATH: full path to the Olist SQLite database file
# - PG_URI: PostgreSQL connection string

SQLITE_PATH = os.getenv(
    "SQLITE_PATH", r"C:\\Users\\odai\\Desktop\\sqllite\\olist.sqlite"
)
PG_URI = os.getenv("PG_URI", "postgresql://postgres:admin@localhost:5432/new-DWH")

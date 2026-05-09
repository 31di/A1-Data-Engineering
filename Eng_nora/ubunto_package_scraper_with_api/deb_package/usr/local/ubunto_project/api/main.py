from fastapi import FastAPI
from .routers import laptop

app = FastAPI()


@app.get("/")
def root():
    return {
        "message": "API is running",
        "docs": "/docs",
        "endpoints": ["/laptops/", "/laptops/{id}", "/laptops/search/{name}"],
    }


app.include_router(laptop.router)

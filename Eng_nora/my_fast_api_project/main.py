from fastapi import FastAPI
from database import Base, engine
from routers import user,project,task
from fastapi.middleware.cors import CORSMiddleware



Base.metadata.create_all(bind=engine)
app=FastAPI()


app.include_router(user.router)
app.include_router(project.router)  
app.include_router(task.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
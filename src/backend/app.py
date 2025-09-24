from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api import router

app = FastAPI(title="Issue Tracker API")

# Allow Angular dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*", "http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

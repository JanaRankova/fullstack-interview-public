from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.database import create_tables
from src.routers import employees, teams


@asynccontextmanager
async def lifespan(_: FastAPI):
    create_tables()
    yield


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(employees.router)
app.include_router(teams.router)


@app.get("/", operation_id="health_check", tags=["Status"])
async def health_check():
    return {"status": "ok"}


if __name__ == "__main__":
    import argparse
    import uvicorn

    parser = argparse.ArgumentParser()
    parser.add_argument("-p", "--port", type=int, default=80)
    args = parser.parse_args()
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=args.port,
        log_level="debug",
        reload=True,
    )

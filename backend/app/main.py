from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import documents, projects

app = FastAPI(title="EPIP API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(projects.router)
app.include_router(documents.router)


@app.get("/api/health")
def health():
    return {"status": "ok", "service": "epip-api", "version": "0.1.0"}
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routes import auth, vault

app = FastAPI(
    title="Secure Password Vault API",
    description="Zero-knowledge password vault with client-side encryption",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["authentication"])
app.include_router(vault.router, prefix="/api/vault", tags=["vault"])

@app.get("/")
async def root():
    return {"message": "Secure Password Vault API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
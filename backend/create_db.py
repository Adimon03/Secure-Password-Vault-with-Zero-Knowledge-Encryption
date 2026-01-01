#!/usr/bin/env python3
"""
Database initialization script for the Password Vault
"""

from sqlalchemy import create_engine
from app.database import Base
from app.models.user import User
from app.models.vault_entry import VaultEntry
from app.core.config import settings

def create_tables():
    """Create all database tables"""
    engine = create_engine(settings.DATABASE_URL)
    
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    print("Database tables created successfully!")

if __name__ == "__main__":
    create_tables()
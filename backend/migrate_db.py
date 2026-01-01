#!/usr/bin/env python3
"""
Database migration script to add reset token columns
"""

import sqlite3
from app.core.config import settings

def migrate_database():
    """Add reset token columns to existing users table"""
    # Extract database path from DATABASE_URL
    db_path = settings.DATABASE_URL.replace('sqlite:///', '')
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Check if columns already exist
        cursor.execute("PRAGMA table_info(users)")
        columns = [column[1] for column in cursor.fetchall()]
        
        if 'reset_token' not in columns:
            print("Adding reset_token column...")
            cursor.execute("ALTER TABLE users ADD COLUMN reset_token TEXT")
            
        if 'reset_token_expires' not in columns:
            print("Adding reset_token_expires column...")
            cursor.execute("ALTER TABLE users ADD COLUMN reset_token_expires DATETIME")
            
        conn.commit()
        print("Database migration completed successfully!")
        
    except Exception as e:
        print(f"Migration failed: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    migrate_database()
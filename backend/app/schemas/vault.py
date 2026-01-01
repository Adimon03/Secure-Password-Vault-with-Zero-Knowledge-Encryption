from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class VaultEntryCreate(BaseModel):
    title: str
    encrypted_data: str  # JSON string of encrypted fields

class VaultEntryUpdate(BaseModel):
    title: Optional[str] = None
    encrypted_data: Optional[str] = None

class VaultEntry(BaseModel):
    id: int
    user_id: int
    title: str
    encrypted_data: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True
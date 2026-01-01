from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.vault_entry import VaultEntry
from app.schemas.vault import VaultEntryCreate, VaultEntryUpdate, VaultEntry as VaultEntrySchema
from app.api.routes.auth import get_current_user

router = APIRouter()

@router.post("/entries", response_model=VaultEntrySchema)
async def create_vault_entry(
    entry: VaultEntryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_entry = VaultEntry(
        user_id=current_user.id,
        title=entry.title,
        encrypted_data=entry.encrypted_data
    )
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    return db_entry

@router.get("/entries", response_model=List[VaultEntrySchema])
async def get_vault_entries(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    entries = db.query(VaultEntry).filter(VaultEntry.user_id == current_user.id).all()
    return entries

@router.get("/entries/{entry_id}", response_model=VaultEntrySchema)
async def get_vault_entry(
    entry_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    entry = db.query(VaultEntry).filter(
        VaultEntry.id == entry_id,
        VaultEntry.user_id == current_user.id
    ).first()
    
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    
    return entry

@router.put("/entries/{entry_id}", response_model=VaultEntrySchema)
async def update_vault_entry(
    entry_id: int,
    entry_update: VaultEntryUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    entry = db.query(VaultEntry).filter(
        VaultEntry.id == entry_id,
        VaultEntry.user_id == current_user.id
    ).first()
    
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    
    if entry_update.title is not None:
        entry.title = entry_update.title
    if entry_update.encrypted_data is not None:
        entry.encrypted_data = entry_update.encrypted_data
    
    db.commit()
    db.refresh(entry)
    return entry

@router.delete("/entries/{entry_id}")
async def delete_vault_entry(
    entry_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    entry = db.query(VaultEntry).filter(
        VaultEntry.id == entry_id,
        VaultEntry.user_id == current_user.id
    ).first()
    
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    
    db.delete(entry)
    db.commit()
    return {"message": "Entry deleted successfully"}
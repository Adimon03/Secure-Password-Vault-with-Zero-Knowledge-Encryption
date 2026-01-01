#!/usr/bin/env pwsh

Write-Host "🔒 Setting up Secure Password Vault..." -ForegroundColor Cyan

# Backend setup
Write-Host "📦 Setting up backend..." -ForegroundColor Yellow
Set-Location backend

# Create virtual environment
python -m venv venv
& "venv\Scripts\Activate.ps1"

# Install dependencies
pip install -r requirements.txt

# Create .env file
if (-not (Test-Path .env)) {
    Copy-Item .env.example .env
    Write-Host "⚠️  Please edit backend\.env with your configuration" -ForegroundColor Yellow
}

# Initialize database
python create_db.py

Set-Location ..

# Frontend setup
Write-Host "🎨 Setting up frontend..." -ForegroundColor Yellow
Set-Location frontend

# Install dependencies
npm install

Set-Location ..

Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 To start the application:" -ForegroundColor Cyan
Write-Host "1. Backend: cd backend; .\venv\Scripts\Activate.ps1; python run.py" -ForegroundColor White
Write-Host "2. Frontend: cd frontend; npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "🌐 Access the app at: http://localhost:3000" -ForegroundColor Green
#!/bin/bash

echo "🔒 Setting up Secure Password Vault..."

# Backend setup
echo "📦 Setting up backend..."
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
if [ ! -f .env ]; then
    cp .env.example .env
    echo "⚠️  Please edit backend/.env with your configuration"
fi

# Initialize database
python create_db.py

cd ..

# Frontend setup
echo "🎨 Setting up frontend..."
cd frontend

# Install dependencies
npm install

cd ..

echo "✅ Setup complete!"
echo ""
echo "🚀 To start the application:"
echo "1. Backend: cd backend && source venv/bin/activate && python run.py"
echo "2. Frontend: cd frontend && npm run dev"
echo ""
echo "🌐 Access the app at: http://localhost:3000"
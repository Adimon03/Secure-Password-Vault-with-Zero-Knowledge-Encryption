@echo off
echo 🔒 Setting up Secure Password Vault...

REM Backend setup
echo 📦 Setting up backend...
cd backend

REM Create virtual environment
python -m venv venv
call venv\Scripts\activate

REM Install dependencies
pip install -r requirements.txt

REM Create .env file
if not exist .env (
    copy .env.example .env
    echo ⚠️  Please edit backend\.env with your configuration
)

REM Initialize database
python create_db.py

cd ..

REM Frontend setup
echo 🎨 Setting up frontend...
cd frontend

REM Install dependencies
npm install

cd ..

echo ✅ Setup complete!
echo.
echo 🚀 To start the application:
echo 1. Backend: cd backend ^&^& venv\Scripts\activate ^&^& python run.py
echo 2. Frontend: cd frontend ^&^& npm run dev
echo.
echo 🌐 Access the app at: http://localhost:3000
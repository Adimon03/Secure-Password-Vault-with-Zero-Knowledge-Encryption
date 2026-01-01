<<<<<<< HEAD
# 🔐 Secure Password Vault

A zero-knowledge password manager with client-side encryption built with FastAPI and React. Your master password never leaves your device, and all encryption happens in your browser.

![Password Vault Demo](https://img.shields.io/badge/Demo-Live-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)
![React](https://img.shields.io/badge/React-18+-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-Latest-green.svg)

## ✨ Features

### 🛡️ Security Features
- **Zero-Knowledge Architecture**: Master password never sent to server
- **Client-Side Encryption**: AES-256-CBC encryption in browser
- **PBKDF2 Key Derivation**: 100,000 iterations with random salt
- **Session-Based Security**: Encryption keys cleared on logout
- **JWT Authentication**: Secure API access
- **Password Reset**: Secure token-based password recovery

### 🎯 User Features
- **Password Management**: Add, edit, delete password entries
- **Search & Filter**: Quickly find any password entry
- **Password Generator**: Create strong, unique passwords
- **Copy to Clipboard**: One-click password copying
- **Responsive Design**: Works on desktop and mobile
- **Beautiful UI**: Modern design with animated watermark

### 🔧 Technical Features
- **Full-Stack Application**: FastAPI backend + React frontend
- **Database Support**: SQLite (dev) / PostgreSQL (production)
- **Email Integration**: Password reset via email (demo mode)
- **Hot Reload**: Development-friendly setup
- **Type Safety**: TypeScript frontend + Pydantic backend

## 🏗️ Architecture

```
Frontend (React + TypeScript)
├── Client-side encryption (AES-256-CBC)
├── Master password handling
├── Secure key derivation (PBKDF2)
└── JWT token management

Backend (FastAPI + Python)
├── User authentication
├── Encrypted data storage
├── JWT token validation
├── Password reset system
└── RESTful API endpoints
```

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/secure-password-vault.git
cd secure-password-vault
```

2. **Backend Setup**
```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
python create_db.py
```

3. **Frontend Setup**
```bash
cd ../frontend
npm install
```

4. **Start the Application**
```bash
# Terminal 1 - Backend
cd backend
venv\Scripts\activate  # Windows
python run.py

# Terminal 2 - Frontend
cd frontend
npm run dev
```

5. **Access the Application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## 🔐 How It Works

### Encryption Process
1. **User Registration**: Account created with hashed password
2. **Master Password**: User enters master password (never sent to server)
3. **Key Derivation**: PBKDF2 derives encryption key from master password + salt
4. **Data Encryption**: Vault entries encrypted with AES-256-CBC
5. **Storage**: Only encrypted data stored in database

### Security Model
```
Account Password (Server Auth) ≠ Master Password (Encryption Key)
                ↓                           ↓
        Hashed & Stored              Never Stored/Sent
        (PBKDF2-SHA256)              (Client-side only)
```

## 📁 Project Structure

```
password-vault/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── api/routes/     # API endpoints
│   │   ├── core/           # Security & config
│   │   ├── models/         # Database models
│   │   └── schemas/        # Pydantic schemas
│   ├── requirements.txt
│   ├── create_db.py
│   └── run.py
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API client
│   │   ├── store/          # State management
│   │   └── utils/          # Crypto utilities
│   ├── package.json
│   └── vite.config.ts
├── docs/                   # Documentation
├── README.md
└── .gitignore
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login and get JWT token
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token
- `GET /api/auth/me` - Get current user info

### Vault Management
- `GET /api/vault/entries` - Get all encrypted entries
- `POST /api/vault/entries` - Create new encrypted entry
- `PUT /api/vault/entries/{id}` - Update encrypted entry
- `DELETE /api/vault/entries/{id}` - Delete entry

## 🛡️ Security Considerations

### What We Store
- User email and hashed account password
- Encrypted vault entries (JSON strings)
- JWT tokens (temporary, server-side)
- Password reset tokens (temporary, hashed)

### What We Never Store
- Master passwords
- Plaintext vault data
- Encryption keys
- Decrypted passwords

### Encryption Details
- **Algorithm**: AES-256-CBC
- **Key Derivation**: PBKDF2 with 100,000 iterations
- **Salt**: Random 128-bit salt per entry
- **IV**: Random 128-bit initialization vector per entry

## 🎨 Screenshots

### Login Page
Beautiful login interface with animated RGB watermark

### Dashboard
Modern password management interface with search and filtering

### Password Generator
Built-in secure password generator with customizable options

## 🚧 Development

### Running Tests
```bash
# Backend tests
cd backend
python -m pytest

# Frontend tests
cd frontend
npm test
```

### Building for Production
```bash
# Frontend build
cd frontend
npm run build

# Backend (use gunicorn)
cd backend
gunicorn app.main:app
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

This is a demonstration project. For production use, consider additional security measures like:
- Hardware security modules
- Multi-factor authentication
- Security audits
- Penetration testing
- Compliance certifications

## 👨‍💻 Author

**Built by Adi with 💕**

- GitHub: [@yourusername](https://github.com/yourusername)
- Email: adimonpubg@gmail.com

## 🙏 Acknowledgments

- FastAPI for the excellent Python web framework
- React team for the amazing frontend library
- CryptoJS for client-side encryption
- Tailwind CSS for beautiful styling

---

⭐ **Star this repository if you found it helpful!**
=======
# Secure-Password-Vault-with-Zero-Knowledge-Encryption-
>>>>>>> f84e6f79c97560fc2a6435f5a8c45fea8bc4a8d5

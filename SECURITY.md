# Security Architecture

## Zero-Knowledge Design

This password vault implements a zero-knowledge architecture where:

1. **Master Password Never Leaves Client**: The master password used for encryption is never transmitted to the server
2. **Client-Side Encryption**: All encryption/decryption happens in the browser using Web Crypto APIs
3. **Server Stores Only Encrypted Data**: The backend only stores encrypted blobs, never plaintext

## Encryption Implementation

### Key Derivation
- **Algorithm**: PBKDF2-SHA256
- **Iterations**: 100,000 (recommended by OWASP)
- **Salt**: Random 128-bit salt per entry
- **Key Size**: 256 bits

### Data Encryption
- **Algorithm**: AES-256-CBC
- **IV**: Random 128-bit initialization vector per entry
- **Padding**: PKCS#7

### Data Flow

```
User Input → PBKDF2 → AES Key → Encrypt Data → Store Encrypted Blob
                ↑                    ↓
            Random Salt         Random IV
```

## Authentication vs Encryption

The system uses two separate password systems:

1. **Account Password**: For server authentication (hashed with bcrypt)
2. **Master Password**: For client-side encryption (never stored)

## Session Security

- Master password stored only in memory during session
- Encryption keys cleared on logout
- JWT tokens for API authentication
- No persistent storage of sensitive data

## Threat Model

### Protected Against
- Server-side data breaches (data is encrypted)
- Network interception (master password never transmitted)
- Database compromise (only encrypted data stored)

### Not Protected Against
- Client-side malware/keyloggers
- Compromised browser environment
- Physical access to unlocked device
- Weak master passwords

## Best Practices

1. Use strong, unique master passwords
2. Log out when finished
3. Use on trusted devices only
4. Keep browser updated
5. Enable 2FA on your account (if implemented)
import CryptoJS from 'crypto-js';

export interface EncryptedData {
  iv: string;
  salt: string;
  data: string;
}

export interface VaultEntryData {
  website: string;
  username: string;
  password: string;
  notes?: string;
}

/**
 * Derives a key from master password using PBKDF2
 */
export function deriveKey(masterPassword: string, salt: string): string {
  return CryptoJS.PBKDF2(masterPassword, salt, {
    keySize: 256 / 32,
    iterations: 100000,
  }).toString();
}

/**
 * Generates a random salt
 */
export function generateSalt(): string {
  return CryptoJS.lib.WordArray.random(128 / 8).toString();
}

/**
 * Generates a random IV
 */
export function generateIV(): string {
  return CryptoJS.lib.WordArray.random(128 / 8).toString();
}

/**
 * Encrypts data using AES-256-CBC
 */
export function encryptData(data: VaultEntryData, masterPassword: string): EncryptedData {
  const salt = generateSalt();
  const iv = generateIV();
  const key = deriveKey(masterPassword, salt);
  
  const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), key, {
    iv: CryptoJS.enc.Hex.parse(iv),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return {
    iv,
    salt,
    data: encrypted.toString(),
  };
}

/**
 * Decrypts data using AES-256-CBC
 */
export function decryptData(encryptedData: EncryptedData, masterPassword: string): VaultEntryData {
  const key = deriveKey(masterPassword, encryptedData.salt);
  
  const decrypted = CryptoJS.AES.decrypt(encryptedData.data, key, {
    iv: CryptoJS.enc.Hex.parse(encryptedData.iv),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
  
  if (!decryptedString) {
    throw new Error('Failed to decrypt data - invalid master password');
  }

  return JSON.parse(decryptedString);
}

/**
 * Generates a secure random password
 */
export function generatePassword(length: number = 16): string {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  
  return password;
}
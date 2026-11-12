import crypto from 'crypto';
import { env } from '../config/env.js';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // 96 bits recommended for GCM
const AUTH_TAG_LENGTH = 16; // 128 bits authentication tag

/**
 * Ensures a valid 32-byte Buffer from hex or string.
 * Uses a secure dev fallback with prominent warnings if not configured.
 */
function getEncryptionKey(): Buffer {
  const keyHex = env.panEncryptionKey;
  if (!keyHex) {
    if (env.isProduction) {
      throw new Error('CRITICAL SECURITY ERROR: PAN_ENCRYPTION_KEY is required in production.');
    }
    // Safe deterministic development key for local testing only
    return crypto.scryptSync('dev-insecure-pan-secret-key-salt', 'ipotrack-salt', 32);
  }

  const keyBuffer = Buffer.from(keyHex, 'hex');
  if (keyBuffer.length !== 32) {
    throw new Error('PAN_ENCRYPTION_KEY must be a 64-character hex string (32 bytes).');
  }
  return keyBuffer;
}

function getBlindIndexKey(): Buffer {
  const keyHex = env.panBlindIndexKey;
  if (!keyHex) {
    if (env.isProduction) {
      throw new Error('CRITICAL SECURITY ERROR: PAN_BLIND_INDEX_KEY is required in production.');
    }
    return crypto.scryptSync('dev-insecure-blind-index-salt', 'ipotrack-salt', 32);
  }

  const keyBuffer = Buffer.from(keyHex, 'hex');
  if (keyBuffer.length !== 32) {
    throw new Error('PAN_BLIND_INDEX_KEY must be a 64-character hex string (32 bytes).');
  }
  return keyBuffer;
}

/**
 * Validates Indian PAN format: 5 letters, 4 digits, 1 letter (e.g. ABCDE1234F).
 */
export function isValidPan(pan: string): boolean {
  if (!pan || typeof pan !== 'string') return false;
  const normalized = pan.trim().toUpperCase();
  return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(normalized);
}

/**
 * Generates a masked PAN representation: ABCDE****F
 */
export function maskPan(pan: string): string {
  const clean = pan.trim().toUpperCase();
  if (clean.length !== 10) {
    return '**********';
  }
  return `${clean.slice(0, 5)}****${clean.slice(9)}`;
}

/**
 * Computes an HMAC-SHA256 blind index for duplicate detection without exposing or decrypting PAN.
 */
export function computePanBlindIndex(pan: string): string {
  const normalized = pan.trim().toUpperCase();
  const key = getBlindIndexKey();
  return crypto.createHmac('sha256', key).update(normalized).digest('hex');
}

export interface EncryptedPanResult {
  panEncrypted: string;
  panMasked: string;
  panBlindIndex: string;
}

/**
 * Encrypts a plaintext PAN using AES-256-GCM.
 * Output format: <iv_hex>:<auth_tag_hex>:<ciphertext_hex>
 */
export function encryptPan(plainPan: string): EncryptedPanResult {
  const normalized = plainPan.trim().toUpperCase();
  if (!isValidPan(normalized)) {
    throw new Error('Invalid PAN format. Expected 5 uppercase letters, 4 digits, 1 letter.');
  }

  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });

  let encrypted = cipher.update(normalized, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  const panEncrypted = `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
  const panMasked = maskPan(normalized);
  const panBlindIndex = computePanBlindIndex(normalized);

  return {
    panEncrypted,
    panMasked,
    panBlindIndex,
  };
}

/**
 * Decrypts an AES-256-GCM encrypted PAN string.
 * Strictly internal to server-side registrar queries; NEVER return output to client or logs.
 */
export function decryptPan(encryptedPayload: string): string {
  const parts = encryptedPayload.split(':');
  if (parts.length !== 3) {
    throw new Error('Malformed encrypted PAN payload.');
  }

  const [ivHex, tagHex, cipherHex] = parts;
  const key = getEncryptionKey();
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(tagHex, 'hex');

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });

  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(cipherHex, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

/**
 * Deep sanitization utility to strip plaintext PANs and credentials from log objects.
 */
export function sanitizeForLogs(obj: unknown): unknown {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'string') {
    // Scrub standard PAN pattern if leaked into string
    return obj.replace(/\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b/g, (match) => maskPan(match));
  }
  if (Array.isArray(obj)) {
    return obj.map(sanitizeForLogs);
  }
  if (typeof obj === 'object') {
    const sanitized: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(obj)) {
      const lowerKey = key.toLowerCase();
      if (
        lowerKey.includes('pan') &&
        !lowerKey.includes('masked') &&
        !lowerKey.includes('index')
      ) {
        sanitized[key] = '[REDACTED_PAN]';
      } else if (lowerKey.includes('secret') || lowerKey.includes('password') || lowerKey.includes('token')) {
        sanitized[key] = '[REDACTED_SECRET]';
      } else {
        sanitized[key] = sanitizeForLogs(val);
      }
    }
    return sanitized;
  }
  return obj;
}


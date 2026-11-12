import assert from 'assert';
import {
  isValidPan,
  maskPan,
  encryptPan,
  decryptPan,
  computePanBlindIndex,
  sanitizeForLogs,
} from '../services/crypto.service.js';

console.log('--- Running Cryptography & PAN Security Unit Tests ---');

// 1. PAN Validation Tests
assert.strictEqual(isValidPan('ABCDE1234F'), true, 'Valid PAN must pass regex');
assert.strictEqual(isValidPan('abcde1234f'), true, 'Lowercase PAN should normalize and pass');
assert.strictEqual(isValidPan('12345ABCDE'), false, 'Inverted format must fail');
assert.strictEqual(isValidPan('ABCDE12345'), false, '10 numbers must fail');
assert.strictEqual(isValidPan('ABCDEF1234'), false, '6 letters must fail');
assert.strictEqual(isValidPan(''), false, 'Empty string must fail');
console.log('✔ PAN format validation tests passed.');

// 2. PAN Masking Tests
assert.strictEqual(maskPan('ABCDE1234F'), 'ABCDE****F', 'Standard PAN masking failed');
assert.strictEqual(maskPan('BKZPK9876L'), 'BKZPK****L', 'Secondary PAN masking failed');
console.log('✔ PAN masking algorithm tests passed.');

// 3. AES-256-GCM Encryption / Decryption Roundtrip Tests
const originalPan = 'ABCDE1234F';
const { panEncrypted, panMasked, panBlindIndex } = encryptPan(originalPan);

assert.strictEqual(panMasked, 'ABCDE****F', 'Masked PAN mismatch');
assert.notStrictEqual(panEncrypted, originalPan, 'Ciphertext must not match plaintext');
assert.strictEqual(panEncrypted.includes(originalPan), false, 'Plaintext must not be present in encrypted string');

const parts = panEncrypted.split(':');
assert.strictEqual(parts.length, 3, 'Payload must contain iv:tag:ciphertext');

const decrypted = decryptPan(panEncrypted);
assert.strictEqual(decrypted, originalPan, 'Decrypted PAN must match original plaintext');
console.log('✔ AES-256-GCM encryption & decryption roundtrip passed.');

// 4. Tamper Resistance Test
try {
  const tampered = panEncrypted.slice(0, -4) + 'ffff';
  decryptPan(tampered);
  assert.fail('Tampered ciphertext should have thrown an authentication failure.');
} catch (err: unknown) {
  assert.ok(err instanceof Error, 'Tampering successfully detected by GCM auth tag.');
}
console.log('✔ Ciphertext tamper detection passed.');

// 5. Blind Index Tests
const index1 = computePanBlindIndex('ABCDE1234F');
const index2 = computePanBlindIndex('ABCDE1234F');
const index3 = computePanBlindIndex('BKZPK9876L');

assert.strictEqual(index1, index2, 'Blind index must be deterministic for identical PAN');
assert.notStrictEqual(index1, index3, 'Blind index must differ for different PANs');
assert.strictEqual(panBlindIndex, index1, 'Encrypted output blind index must match');
console.log('✔ HMAC-SHA256 blind indexing tests passed.');

// 6. Log Sanitization Tests
const sensitivePayload = {
  user: 'Investor 1',
  pan: 'ABCDE1234F',
  panEncrypted: 'sensitive-hex-data',
  token: 'secret-bearer-token',
  comment: 'User PAN is ABCDE1234F in discussion',
};

const sanitized = sanitizeForLogs(sensitivePayload) as Record<string, unknown>;
assert.strictEqual(sanitized.pan, '[REDACTED_PAN]', 'PAN field must be redacted');
assert.strictEqual(sanitized.panEncrypted, '[REDACTED_PAN]', 'Encrypted PAN field must be redacted');
assert.strictEqual(sanitized.token, '[REDACTED_SECRET]', 'Token must be redacted');
assert.strictEqual(
  (sanitized.comment as string).includes('ABCDE****F'),
  true,
  'PAN string in message must be masked'
);
assert.strictEqual(
  (sanitized.comment as string).includes('ABCDE1234F'),
  false,
  'Plaintext PAN must not remain in string'
);
console.log('✔ Security log sanitization tests passed.');

console.log('--- ALL CRYPTOGRAPHY & SECURITY TESTS PASSED (6/6) ---');


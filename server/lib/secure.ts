import crypto from 'crypto';

export function encrypt(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export function verifyPassword(password: string, hash: string): boolean {
  return encrypt(password) === hash;
}

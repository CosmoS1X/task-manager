import crypto from 'crypto';

export default (password: string) => crypto.createHash('sha256').update(password).digest('hex');

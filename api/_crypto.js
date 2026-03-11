import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';

const getEncryptionKey = () => {
  const secret = String(process.env.AI_KEY_ENCRYPTION_SECRET || '').trim();
  if (!secret) {
    throw new Error('AI_KEY_ENCRYPTION_SECRET is not configured');
  }
  return crypto.createHash('sha256').update(secret).digest();
};

export const encryptSecret = (plainText = '') => {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, getEncryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(String(plainText || ''), 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return {
    iv: iv.toString('base64'),
    tag: tag.toString('base64'),
    content: encrypted.toString('base64'),
    alg: ALGORITHM,
  };
};

export const decryptSecret = (payload = {}) => {
  const iv = Buffer.from(String(payload?.iv || ''), 'base64');
  const tag = Buffer.from(String(payload?.tag || ''), 'base64');
  const content = Buffer.from(String(payload?.content || ''), 'base64');
  const decipher = crypto.createDecipheriv(ALGORITHM, getEncryptionKey(), iv);
  decipher.setAuthTag(tag);
  const decrypted = Buffer.concat([decipher.update(content), decipher.final()]);
  return decrypted.toString('utf8');
};

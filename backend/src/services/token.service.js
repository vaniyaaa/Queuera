const crypto = require('crypto');

const { JWT_SECRET } = require('../config/env.js');

const ALGORITHM = 'aes-256-cbc';
const key = Buffer.alloc(32);
Buffer.from(JWT_SECRET.slice(0, 32), 'utf8').copy(key);

function encryptToken(plainText) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(String(plainText), 'utf8'),
    cipher.final(),
  ]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decryptToken(encryptedText) {
  const [ivHex, encryptedHex] = encryptedText.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const encrypted = Buffer.from(encryptedHex, 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);
  return decrypted.toString('utf8');
}

module.exports = {
  encryptToken,
  decryptToken,
};

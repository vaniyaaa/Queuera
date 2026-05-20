require('dotenv').config();

const REQUIRED_KEYS = [
  'MONGODB_URI',
  'REDIS_URL',
  'META_APP_ID',
  'META_APP_SECRET',
  'META_REDIRECT_URI',
  'META_WEBHOOK_VERIFY_TOKEN',
  'JWT_SECRET',
  'LINKEDIN_CLIENT_ID',
  'LINKEDIN_CLIENT_SECRET',
  'LINKEDIN_REDIRECT_URI',
  'FRONTEND_URL',
];

const missing = REQUIRED_KEYS.filter((key) => {
  const value = process.env[key];
  return value === undefined || String(value).trim() === '';
});

if (missing.length > 0) {
  const list = missing.join(', ');
  throw new Error(`Missing required environment variables: ${list}`);
}

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;
const REDIS_URL = process.env.REDIS_URL;
const META_APP_ID = process.env.META_APP_ID;
const META_APP_SECRET = process.env.META_APP_SECRET;
const META_REDIRECT_URI = process.env.META_REDIRECT_URI;
const META_WEBHOOK_VERIFY_TOKEN = process.env.META_WEBHOOK_VERIFY_TOKEN;
const JWT_SECRET = process.env.JWT_SECRET;
const LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID;
const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;
const LINKEDIN_REDIRECT_URI = process.env.LINKEDIN_REDIRECT_URI;
const FRONTEND_URL = process.env.FRONTEND_URL;

module.exports = {
  PORT,
  MONGODB_URI,
  REDIS_URL,
  META_APP_ID,
  META_APP_SECRET,
  META_REDIRECT_URI,
  META_WEBHOOK_VERIFY_TOKEN,
  JWT_SECRET,
  LINKEDIN_CLIENT_ID,
  LINKEDIN_CLIENT_SECRET,
  LINKEDIN_REDIRECT_URI,
  FRONTEND_URL,
};

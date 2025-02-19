// src/config/config.js
require('dotenv').config({
  path: require('path').resolve(__dirname, '../../.env')
});
module.exports = {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  SUPABASE_URL: process.env.SUPABASE_URL || '',
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || '',
  JWT_SECRET: process.env.JWT_SECRET || '',
  CLIENT_URL: process.env.CLIENT_URL || '*',
  PORT: process.env.PORT || 3000,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || ''
};

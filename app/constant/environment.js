require('dotenv').config();

const env = {
  PORT: process.env.PORT,
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_HOST: process.env.DB_HOST,
  NODE_ENV: process.env.NODE_ENV,

  DIALECT: process.env.DIALECT,

  SECRET_KEY: process.env.SECRET_KEY,
  TOKEN_EXPIRES_IN: process.env.TOKEN_EXPIRES_IN,
  OTP_EXPIRES_IN: process.env.OTP_EXPIRES_IN,

  API_KEY: process.env.API_KEY,

  SALT_ROUND: process.env.SALT_ROUND * 1,

  PAGE: process.env.PAGE * 1,
  LIMIT: process.env.LIMIT * 1,
  DEFAULT_SORT_KEY: process.env.DEFAULT_SORT_KEY,

};

const env_type = {
  PRODUCTION: 'PRODUCTION',
  DEVELOPMENT: 'DEVELOPMENT',
  TEST: 'TEST'
};

module.exports = {
  env,
  env_type
};

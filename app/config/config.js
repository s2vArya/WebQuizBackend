const { env } = require('../constant/index');

module.exports = {
  development: {
    username: 'root',
    password: 'root@123',
    database: 'QUIZ',
    host: 'localhost',
    dialect: 'mysql'
  },
  test: {
    username: 'root',
    password: null,
    database: 'database_test',
    host: '127.0.0.1',
    dialect: 'mysql'
  },
  production: {
    username: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    host: env.DB_HOST,
    dialect: env.DIALECT
  }
};

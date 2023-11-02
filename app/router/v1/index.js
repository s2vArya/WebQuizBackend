const app = require('express')();
const { verifyApiKey } = require('../../middleware/auth');
app.use('/user', verifyApiKey ,require('./user/user'));
app.use('/admin', verifyApiKey ,require('./admin/admin'));
module.exports = app;

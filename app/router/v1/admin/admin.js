const router = require('express').Router();
const controller = require('../../../controller/auth');
const {validate, verifyAuthToken} = require("../../../middleware");
const schema = require("../../../validation/auth")

router.post(`/add-admin`,validate(schema.addAdmin) ,controller.addAdmin);
router.post(`/login`,validate(schema.login),controller.login,controller.createSession);
router.post(`/add-question`,verifyAuthToken,validate(schema.addQuestion),controller.addQuestion);
router.post(`/logout`,verifyAuthToken,controller.logout);


module.exports = router;
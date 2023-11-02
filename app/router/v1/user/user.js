const router = require('express').Router();
const controller = require('../../../controller/user');
const {validate} = require("../../../middleware");
const schema = require("../../../validation/user")

router.post(`/save-user`,validate(schema.userDetail) ,controller.saveUser);
router.get(`/friends-list`,validate(schema.friendsList,'query'),controller.getFriends);
router.get(`/question`,validate(schema.question,'query'),controller.getQuestion);
router.get(`/all-questions`,controller.getAllQuestionsId);


module.exports = router;
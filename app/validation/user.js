const Joi = require('joi');

const userDetail = Joi.object({
  name: Joi.string().max(20).required(),
  score: Joi.number().integer().required(),
  friend_id: Joi.string().optional()
});

const friendsList = Joi.object({
  id: Joi.string().min(5).max(50).required()
});

const question = Joi.object({
  id: Joi.string().required(),
  lang:Joi.string().optional()
});



module.exports = {
  userDetail,
  friendsList,
  question
};

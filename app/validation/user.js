const Joi = require('joi');

const userDetail = Joi.object({
  name: Joi.string().max(20).required(),
  score: Joi.number().integer().required(),
  friend_id: Joi.string().optional()
});

const friendsList = Joi.object({
  id: Joi.string().min(5).max(50).required()
});

module.exports = {
  userDetail,
  friendsList
};

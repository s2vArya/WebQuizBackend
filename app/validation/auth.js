const Joi = require("joi");

const login = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
  device_id: Joi.string().required(),
  device_token: Joi.string().required(),
  device_type: Joi.string().required(),
});

const addAdmin = Joi.object({
  email: Joi.string().email().min(5).required(),
  password: Joi.string()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[a-zA-Z\d\W_]{8,}$/)
    .min(8)
    .required()
    .messages({
      "string.pattern.base":
        "Password must contain at least one lowercase letter, one uppercase letter, and one number",
      "string.min": "Password should have a minimum length of 8 characters",
    }),
});

const customJoi = Joi.extend((joi) => ({
  base: joi.object(),
  type: 'questionObject',
  coerce: (value, state, options) => ({
    type: 'questionObject',
    value
  }),
  rules: {
    hasKey: {
      validate(keys, helpers, args, options) {
        const { key } = args;
        if (!keys.includes(key)) {
          return helpers.error('object.hasKey', { key });
        }
        return keys;
      }
    }
  }
}));

const addQuestion = Joi.object({
  question: customJoi.object()
    .keys({
      en: Joi.string().required(),
    })
    .unknown(true),
  answer: Joi.array().items(
    customJoi.object()
      .keys({
        en: Joi.string().required(),
      })
      .unknown(true)
  ),
  answerIndex: Joi.number().required().min(0)
  .max(Joi.ref('answer', { adjust: (value) => value.length - 1 }))
  .messages({
    'number.base': 'answerIndex must be a number',
    'number.min': 'answerIndex must be greater than or equal to 0',
    'number.max': 'answerIndex must be within the range of the answer array length',
  }),
});

module.exports = {
  login,
  addAdmin,
  addQuestion
};

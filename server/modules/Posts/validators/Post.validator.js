const Joi = require("joi");

const updatePostSchema = Joi.object({
  content: Joi.string().min(10).max(3000).required(),
  imageUrl: Joi.string().uri().allow(null, "").optional(),
  imageCredit: Joi.string().allow(null, "").optional(),
});

function validateUpdatePost(data) {
  return updatePostSchema.validate(data, { abortEarly: false });
}

module.exports = { validateUpdatePost };

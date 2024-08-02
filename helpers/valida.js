const Joi = require("joi");

const pageSchema = Joi.object({
  url: Joi.string().min(3).max(30).required(),
  imgUrl: Joi.string().uri().allow(""),
  description: Joi.string().min(10).max(400).required(),
  name: Joi.string()
    .regex(/^[a-zA-Z\s]+$/) // Apenas letras e espaços
    .max(50)
    .required(),
  classification: Joi.string().required(),
});

module.exports = pageSchema;

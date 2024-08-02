const Joi = require("joi");

const pageSchema = Joi.object({
  url: Joi.string()
    .min(3)
    .max(30)
    .required()
    .messages({
      'string.base': 'A URL deve ser uma string.',
      'string.empty': 'A URL não pode estar vazia.',
      'string.min': 'A URL deve ter pelo menos 3 caracteres.',
      'string.max': 'A URL deve ter no máximo 30 caracteres.',
      'any.required': 'A URL é um campo obrigatório.',
    }),
  
  imgUrl: Joi.string()
    .uri()
    .allow("")
    .messages({
      'string.base': 'A URL da imagem deve ser uma string.',
      'string.uri': 'A URL da imagem deve ser um URI válido.',
    }),

  description: Joi.string()
    .min(10)
    .max(400)
    .required()
    .messages({
      'string.base': 'A descrição deve ser uma string.',
      'string.empty': 'A descrição não pode estar vazia.',
      'string.min': 'A descrição deve ter pelo menos 10 caracteres.',
      'string.max': 'A descrição deve ter no máximo 400 caracteres.',
      'any.required': 'A descrição é um campo obrigatório.',
    }),

  name: Joi.string()
    .regex(/^[a-zA-Z\s]+$/)
    .max(50)
    .required()
    .messages({
      'string.base': 'O nome deve ser uma string.',
      'string.empty': 'O nome não pode estar vazio.',
      'string.pattern.base': 'O nome deve conter apenas letras e espaços.',
      'string.max': 'O nome deve ter no máximo 50 caracteres.',
      'any.required': 'O nome é um campo obrigatório.',
    }),

  classification: Joi.string()
    .required()
    .messages({
      'string.base': 'A classificação deve ser uma string.',
      'string.empty': 'A classificação não pode estar vazia.',
      'any.required': 'A classificação é um campo obrigatório.',
    }),
});

module.exports = pageSchema;

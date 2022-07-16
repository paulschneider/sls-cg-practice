import Joi, { ValidationError } from "joi"
import { messages } from "../errors/messages"

export const schema = Joi.object({
  name: Joi.string()
    .min(1)
    .max(15)
    .required()
    .messages({
      "any.required": messages.createUser.attrs.name.required,
      "string.empty": messages.createUser.attrs.name.minLength,
      "string.min": messages.createUser.attrs.name.minLength,
      "string.max": messages.createUser.attrs.name.maxLength,
    }),

  email: Joi.string()
    .email()
    .required()
    .messages({
      "any.required": messages.createUser.attrs.email.required,
      "string.email": messages.createUser.attrs.email.invalid,
    }),

  dob: Joi.string()
    .pattern(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/)
    .required()
    .messages({
      "any.required": messages.createUser.attrs.dob.required,
      "string.pattern.base": messages.createUser.attrs.dob.format,
    }),
})

export type CreateUserValidationError = ValidationError
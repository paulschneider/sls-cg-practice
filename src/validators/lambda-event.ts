import Joi, { ValidationError } from "joi"
import { messages } from "../errors/messages"

export const schema = Joi.object()
  .required()
  .messages({
    "object.base": messages.lambdaEvent.notAnObject,
    "any.required": messages.lambdaEvent.requiredAttributes,
  })

export type LambdaEventValidationError = ValidationError

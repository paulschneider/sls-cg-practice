import Joi, { ValidationError } from "joi"
import { messages } from "../errors/messages"

export const schema = Joi.object()
  .required()
  .messages({ "any.required": messages.lambdaEvent.requiredAttributes })

export type LambdaEventValidationError = ValidationError

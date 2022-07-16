"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.schema = void 0;
const joi_1 = __importDefault(require("joi"));
const messages_1 = require("../errors/messages");
exports.schema = joi_1.default.object({
    name: joi_1.default.string()
        .min(1)
        .max(15)
        .required()
        .messages({
        "any.required": messages_1.messages.createUser.attrs.name.required,
        "string.empty": messages_1.messages.createUser.attrs.name.minLength,
        "string.min": messages_1.messages.createUser.attrs.name.minLength,
        "string.max": messages_1.messages.createUser.attrs.name.maxLength,
    }),
    email: joi_1.default.string()
        .email()
        .required()
        .messages({
        "any.required": messages_1.messages.createUser.attrs.email.required,
        "string.email": messages_1.messages.createUser.attrs.email.invalid,
    }),
    dob: joi_1.default.string()
        .pattern(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/)
        .required()
        .messages({
        "any.required": messages_1.messages.createUser.attrs.dob.required,
        "string.pattern.base": messages_1.messages.createUser.attrs.dob.format,
    }),
});
//# sourceMappingURL=create-user.js.map
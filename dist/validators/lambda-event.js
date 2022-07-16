"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.schema = void 0;
const joi_1 = __importDefault(require("joi"));
const messages_1 = require("../errors/messages");
exports.schema = joi_1.default.object()
    .required()
    .messages({ "any.required": messages_1.messages.lambdaEvent.requiredAttributes });
//# sourceMappingURL=lambda-event.js.map
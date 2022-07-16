"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messages = void 0;
exports.messages = Object.freeze({
    lambdaEvent: {
        requiredAttributes: "No lambda event data supplied in request",
    },
    createUser: {
        attrs: {
            name: {
                minLength: "Name parameter does not meet minimum length requirements",
                maxLength: "Name parameter exceeds maximum length restrictions",
                required: "Name parameter is required",
            },
            email: {
                required: "Email parameter is required",
                invalid: "The provided email address is invalid",
            },
            dob: {
                required: "Date of birth parameter is required",
                format: "Date of birth must be in the format yyyy-mm-dd",
            },
        },
    },
});
//# sourceMappingURL=messages.js.map
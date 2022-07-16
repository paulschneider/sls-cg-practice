"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handle = void 0;
const create_user_1 = require("../../validators/create-user");
const lambda_event_1 = require("../../validators/lambda-event");
const database_1 = require("../../database");
const handle = async (event, context) => {
    const { error: eventError } = lambda_event_1.schema.validate(event);
    if (eventError) {
        return {
            statusCode: 400,
            body: eventError.details[0].message,
        };
    }
    const { error: createError } = create_user_1.schema.validate(event);
    if (createError) {
        return {
            statusCode: 400,
            body: createError.details[0].message,
        };
    }
    await (0, database_1.insertDatabaseRecord)(event);
    return {
        statusCode: 200,
        body: "User created!",
    };
};
exports.handle = handle;
//# sourceMappingURL=create.js.map
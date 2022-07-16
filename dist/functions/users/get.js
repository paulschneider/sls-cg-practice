"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handle = void 0;
const lambda_event_1 = require("../../validators/lambda-event");
const handle = async (event, context) => {
    const { error: eventError } = lambda_event_1.schema.validate(event);
    if (eventError) {
        return {
            statusCode: 400,
            body: eventError.details[0].message,
        };
    }
    return Promise.resolve({
        statusCode: 200,
        body: "User located!",
    });
};
exports.handle = handle;
//# sourceMappingURL=get.js.map
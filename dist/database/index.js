"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchAllDatabaseRecords = exports.insertDatabaseRecord = exports.dbConnection = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
exports.dbConnection = new aws_sdk_1.default.DynamoDB({
    region: "localhost",
    endpoint: "http://localhost:8000",
    accessKeyId: "DEFAULT_ACCESS_KEY",
    secretAccessKey: "DEFAULT_SECRET",
});
async function insertDatabaseRecord(data) {
    const input = {
        TableName: "coates-test-userTable-dev",
        Item: aws_sdk_1.default.DynamoDB.Converter.marshall(data),
    };
    return exports.dbConnection.putItem(input).promise().catch((e) => {
        console.log(e);
    });
}
exports.insertDatabaseRecord = insertDatabaseRecord;
async function fetchAllDatabaseRecords() {
    return exports.dbConnection.scan({ TableName: "coates-test-userTable-dev" }).promise()
        .then((response) => {
        return response.Items;
    })
        .catch((e) => {
        console.log(e);
    });
}
exports.fetchAllDatabaseRecords = fetchAllDatabaseRecords;
//# sourceMappingURL=index.js.map
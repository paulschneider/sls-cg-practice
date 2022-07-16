const expect = require( "chai" ).expect
const LambdaTester = require( "lambda-tester" )
const faker = require("@faker-js/faker")

const { messages } = require("../dist/errors/messages")
const createUser = require( "../dist/functions/users/create").handle;

const { fetchAllDatabaseRecords } = require("../dist/database/index")

const testParameters = {
  name: "Paul Schneider",
  email: "pauljohn.schneider@gmail.com",
  dob: "1980-03-25"
}

describe("Create user handler", function () {

  describe("User created with a fully formed request object", function () {
    it.only("should return a successful response", async function () {
      await LambdaTester( createUser )
        .event(testParameters)
        .expectResult(async (response) => {
          expect(response.statusCode).to.equal(200)
          expect(response.body).to.equal("User created!")

          const result = await fetchAllDatabaseRecords()

          expect(result.length).to.equal(1)
        })
    });
  });

  describe("User created called with no event data", function () {
    it("should return a failure response (missing event data)", async function () {
      await LambdaTester( createUser )
        .event()
        .expectResult((response) => {
          expect(response.statusCode).to.equal(400)
          expect(response.body).to.equal(messages.lambdaEvent.requiredAttributes)
        })
    });
  });

  describe("User created called with missing event data [name]", function () {
    it("should return a failure response (missing event data)", async function () {
      await LambdaTester( createUser )
        .event({ 
          "email": testParameters.email, 
          "dob": testParameters.dob 
        })
        .expectResult((response) => {
          expect(response.statusCode).to.equal(400)
          expect(response.body).to.equal(messages.createUser.attrs.name.required)
        })
    });
  });

  describe("User created called with missing event data [email]", function () {
    it("should return a failure response (missing event data)", async function () {
      await LambdaTester( createUser )
        .event({ 
          "name": testParameters.name, 
          "dob": testParameters.dob 
        })
        .expectResult((response) => {
          expect(response.statusCode).to.equal(400)
          expect(response.body).to.equal(messages.createUser.attrs.email.required)
        })
    });
  });

  describe("User created called with missing event data [dob]", function () {
    it("should return a failure response (missing event data)", async function () {
      await LambdaTester( createUser )
        .event({ 
          "name": testParameters.name, 
          "email": testParameters.email
        })
        .expectResult((response) => {
          expect(response.statusCode).to.equal(400)
          expect(response.body).to.equal(messages.createUser.attrs.dob.required)
        })
    });
  });

  describe("User created called with invalid event data [name, short]", function () {
    it("should return a failure response (invalid event data)", async function () {
      await LambdaTester( createUser )
        .event({ 
          "name": "", 
          "email": testParameters.email, 
          "dob": testParameters.dob 
        })
        .expectResult((response) => {
          expect(response.statusCode).to.equal(400)
          expect(response.body).to.equal(messages.createUser.attrs.name.minLength)
        })
    });
  });

  describe("User created called with invalid event data [name, long]", function () {
    it("should return a failure response (invalid event data)", async function () {
      await LambdaTester( createUser )
        .event({ 
          "name": "Guy With Areallylongnamethatwecantstore", 
          "email": testParameters.email, 
          "dob": testParameters.dob 
        })
        .expectResult((response) => {
          expect(response.statusCode).to.equal(400)
          expect(response.body).to.equal(messages.createUser.attrs.name.maxLength)
        })
    });
  });

  describe("User created called with invalid event data [email, invalid]", function () {
    it("should return a failure response (invalid event data)", async function () {
      await LambdaTester( createUser )
        .event({ 
          "name": testParameters.name, 
          "email": "tim@apple", 
          "dob": testParameters.dob 
        })
        .expectResult((response) => {
          expect(response.statusCode).to.equal(400)
          expect(response.body).to.equal(messages.createUser.attrs.email.invalid)
        })
    });
  });

  describe("User created called with invalid event data [dob, bad format]", function () {
    it("should return a failure response (invalid event data)", async function () {
      await LambdaTester( createUser )
        .event({ 
          "name": testParameters.name, 
          "email": testParameters.email, 
          "dob": "1980/03/25"
        })
        .expectResult((response) => {
          expect(response.statusCode).to.equal(400)
          expect(response.body).to.equal(messages.createUser.attrs.dob.format)
        })
    });
  });
});
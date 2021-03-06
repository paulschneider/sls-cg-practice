[![codecov](https://codecov.io/gh/paulschneider/sls-cg-practice/branch/master/graph/badge.svg?token=66WLE75V5I)](https://codecov.io/gh/paulschneider/sls-cg-practice)

## Overview
Currently implemented is:

* the POST (create) method for the user
* the GET (fetch) method for the user
* the DELETE (remove) method for the user
## TO DO

* Test with AWS deployment

## Usage

Steps to run this all locally. No deployments or remote calls needed:

### Steps to install

* Download the repository
* run ```npm install```
  

### Steps to run from Postman

* Open a tab in your terminal
* Run ```sls dynamodb install``` [to install DynamoDB locally] 
* Run ```sls offline start```
* Note the URL's provided by Serverless Offline
* Open Postman, paste a url, change the method, hit send

### Sample requests & Payloads

#### Create a user
```javascript
POST http://localhost:3000/dev/users
{
    "name": "Paul Schneider",
    "email": "email@example.com",
    "dob": "1980-03-25"
}

200 "User created!"
```

#### Fetch a user
```javascript
GET http://localhost:3000/dev/users/uuid-123

200 "Found!" | 404 "Not Found"
```

### Steps to run test suite

Uses Jest with mocks, no need for serverless offline.

* Run ```npm run test```

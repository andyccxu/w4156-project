# OptiStaff API

OptiStaff API provides a Smart Dynamic Scheduler, streamlining the task of building and managing schedules, onboarding the new staff, and more.

## Install packages

```bash
npm install express mongoose dotenv nodemon cors bcryptjs morgan jsonwebtoken jest
```

### Packages Explanation

- **express**: Manages the server and routes.
- **mongoose**: Interface for MongoDB connection and schema definition.
- **dotenv**: Loads environment variables from a .env file.
- **nodemon**: Automatically restarts the node application when file changes in the directory are detected.
- **cors**: Enables Cross-Origin Resource Sharing, allowing API access from different domains.
- **bcryptjs**: Securely hashes passwords before storage.
- **morgan**: Logs HTTP requests and errors, helping with debugging.
- **jsonwebtoken**: Facilitates authentication via JSON Web Tokens.
- **jest**: Delightful JavaScript testing framework.

#### To run the server

```bash
node server.js
```

#### To stop the server

```bash
ctrl + c
```

For API testing, we recommend [Postman](https://www.postman.com/). It offers a comprehensive suite to test, develop, and document APIs.

## Running Tests

To run tests, simply use the following command:

```bash
npm test
```

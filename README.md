# OptiStaff API

OptiStaff API provides a Smart Dynamic Scheduler, streamlining the task of building and managing schedules, onboarding the new staff, and more.

## Client Link

Link to our client app repo: 
https://github.com/andyccxu/w4156-project-frontend


## Install packages

```bash
npm install
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
- **node-mock-https**: Mock out responses from the https module, useful for testing HTTP calls without making actual external requests.

#### To run the server

```bash
node server.js
```

#### To stop the server

```bash
ctrl + c
```

## Running Tests

### Static Analysis

We use [ESLint](https://eslint.org) as our style checker and static analysis bug finder.

To run the tool for static analysis, run

```bash
npm run lint
```

The style check report is located at `reports/style-check-report.html`.

### Unit Testing

To run the unit tests using Jest, simply use the following command:

```bash
npm test
```

The unit test report is located at `reports/unittest-report.html`.

The coverage report is located at `reports/coverage/index.html`.


### API Testing
We use [Postman](https://www.postman.com/) for API testing. It offers a comprehensive suite to test, develop, and document APIs.

To go to our Postman Workspace, please follow this [link][def].

[def]: https://fourloop-w4156.postman.co/workspace/FourLoop-Workspace~7d14ccca-960e-46d4-8e9a-f136067db94f/collection/30540115-e83a1e38-5a7c-4bb3-ab6f-9df20d19ed42?action=share&creator=30515967



## Endpoints

### User Authentication

Before using any other endpoint, user must create an account by signing up, then obtain the auth token via login and use the appropriate bearer token in subsequent requests. Each user acts as a manager of the facility and thus can have at most one facility at any time.

#### `POST /auth/signup`

- **Description:**
    Signup a new user.
- **Request Body:**
  - `name: string`
  - `email: string`
  - `password: string`
- **Response Codes:**
  - `201: User registered successfully`
  - `400: User already exists or other error`
  
#### `POST /auth/login`

- **Description:**
    Login a user and retrieve an authentication token.
- **Request Body:**
  - `email: string`
  - `password: string`
- **Response Codes:**
  - `200: Logged in successfully`
  - `400: Email or password is incorrect or other error`

### Facilities

#### `GET /facilities`

- **Description:**
    Retrieve the user's facility from the database.
- **Response Codes:**
  - `200: Success`
  - `500: Internal Server Error`

#### `POST /facilities`

- **Description:**
    Create a new facility with the specified details.
- **Request Body:**
  - `facilityName: string`
  - `facilityType: string`
  - `operatingHours: string`
  - `numberEmployees: int`
  - `numberShifts: int`
  - `numberDays: int`
- **Response Codes:**
  - `201: Success`
  - `400: User already manages a facility`

#### `PATCH /facilities`

- **Description:**
    Update the details of the user's facility.
- **Request Body (any of the following optional):**
  - `facilityName: string`
  - `facilityType: string`
  - `operatingHours: string`
  - `numberEmployees: int`
  - `numberShifts: int`
  - `numberDays: int`
- **Response Codes:**
  - `200: Success`
  - `404: No facility managed by this user`

#### `DELETE /facilities`

- **Description:**
    Delete user's facility.
- **Response Codes:**
  - `200: Success`
  - `404: No facility managed by this user`

### Employees

#### `GET /employees`

- **Description:**
    Retrieves all user's employees from the database.
- **Response Codes:**
  - `200: Success`
  - `404: No facility managed by this user`

#### `GET /employees/:id`

- **Description:**
    Retrieves a specific employee by ID from the database.
- **Request Parameters:**
  - `id: string`
- **Response Codes:**
  - `200: Success`
  - `404: Cannot find the employee`

#### `POST /employees`

- **Description:**
    Adds an employee to the facility with the specified details.
- **Request Body:**
  - `name: string`
  - `email: string`
  - `phoneNumber: string`
  - `address: string` (optional)
  - `skillLevel: string` (optional)

- **Response Codes:**
  - `201: Success`
  - `400: User does not manage a facility`

#### `PATCH /employees/:id`

- **Description:**
    Updates the details of a specific employee by ID.
- **Request Parameters:**
  - `id: string`
- **Request Body (any of the following optional):**
  - `name: string`
  - `email: string`
  - `phoneNumber: string`
  - `address: string`
  - `skillLevel: string`
- **Response Codes:**
  - `200: Success`
  - `404: Cannot find the employee`

#### `DELETE /employees/:id`

- **Description:**
    Deletes an employee by ID from the database.
- **Request Parameters:**
  - `id: string`
- **Response Codes:**
  - `200: Success`
  - `404: Cannot find the employee`

### Schedules

#### `GET /schedules`

- **Description:**
    Retrieve all shifting schedules from the database.
- **Response Codes:**
  - `200: Success`
  - `500: Internal Server Error`

#### `GET /schedules/:id`

- **Description:**
    Retrieve a specific shifting schedule by ID from the database.
- **Request Parameters:**
  - `id: string`
- **Response Codes:**
  - `200: Success`
  - `404: Schedule Not Found`

#### `POST /schedules`

- **Description:**
    Create a new schedule for a specific facility.
- **Request Body:**
  - `facility: string` (The facility ID for which the schedule is being created)
- **Response Codes:**
  - `201: Success`
  - `400: Invalid Input`

#### `PATCH /schedules/:id`

- **Description:**
    Update the shift hours of a specific schedule by ID.
- **Request Parameters:**
  - `id: string`
- **Response Codes:**
  - `200: Success`
  - `404: Schedule Not Found`
  - `405: Shifts Already Scheduled`
  - `500: Internal Server Error`

#### `DELETE /schedules/:id`

- **Description:**
    Delete a specific schedule by ID from the database.
- **Request Parameters:**
  - `id: string`
- **Response Codes:**
  - `200: Success`
  - `404: Schedule Not Found`
  - `500: Internal Server Error`

### Notifications

#### `GET /notifications`

- **Description:**
    Retrieve all notifications from the database.
- **Response Codes:**
  - `200: Success`
  - `500: Internal Server Error`

#### `GET /notifications/:id`

- **Description:**
    Retrieve a specific notification by ID from the database.
- **Request Parameters:**
  - `id: string`
- **Response Codes:**
  - `200: Success`
  - `404: Notification Not Found`

#### `POST /notifications`

- **Description:**
    Create a new notification with the specified title and content.
- **Request Body:**
  - `title: string`
  - `content: string`
- **Response Codes:**
  - `201: Success`
  - `400: Invalid Input`

#### `PATCH /notifications/:id`

- **Description:**
    Update the title or content of a specific notification by ID.
- **Request Parameters:**
  - `id: string`
- **Request Body (any of the following optional):**
  - `title: string`
  - `content: string`
- **Response Codes:**
  - `200: Success`
  - `400: Invalid Input`
  - `404: Notification Not Found`

#### `DELETE /notifications/:id`

- **Description:**
    Delete a specific notification by ID from the database.
- **Request Parameters:**
  - `id: string`
- **Response Codes:**
  - `200: Success`
  - `404: Notification Not Found`
  - `500: Internal Server Error`



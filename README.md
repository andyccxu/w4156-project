# OptiStaff API

OptiStaff API provides a Smart Dynamic Scheduler, streamlining the task of building and managing schedules, onboarding the new staff, and more.

## Install packages

```bash
npm install express mongoose dotenv nodemon cors bcryptjs morgan jsonwebtoken jest node-mocks-https
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

For API testing, we recommend [Postman](https://www.postman.com/). It offers a comprehensive suite to test, develop, and document APIs.

## Running Tests

To run tests, simply use the following command:

```bash
npm test
```

## Endpoints

### Facilities

#### `GET /facilities`

- **Description:**
    Retrieve all facilities from the database.
- **Response Codes:**
  - `200: Success`
  - `500: Internal Server Error`

#### `GET /facilities/:id`

- **Description:**
    Retrieve a specific facility by ID from the database.
- **Request Parameters:**
  - `id: string`
- **Response Codes:**
  - `200: Success`
  - `404: Facility Not Found`

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
  - `400: Invalid Input`

#### `PATCH /facilities/:id`

- **Description:**
    Update the details of a specific facility by ID.
- **Request Parameters:**
  - `id: string`
- **Request Body (any of the following optional):**
  - `facilityName: string`
  - `facilityType: string`
  - `operatingHours: string`
  - `numberEmployees: int`
  - `numberShifts: int`
  - `numberDays: int`
- **Response Codes:**
  - `200: Success`
  - `400: Invalid Input`
  - `404: Facility Not Found`

#### `DELETE /facilities/:id`

- **Description:**
    Delete a specific facility by ID from the database.
- **Request Parameters:**
  - `id: string`
- **Response Codes:**
  - `200: Success`
  - `404: Facility Not Found`
  - `500: Internal Server Error`

### Staff

#### `GET /staff`

- **Description:**
    Retrieves all staff members from the database.
- **Response Codes:**
  - `200: Success`
  - `500: Internal Server Error`

#### `GET /staff/:id`

- **Description:**
    Retrieves a specific staff member by ID from the database.
- **Request Parameters:**
  - `id: string`
- **Response Codes:**
  - `200: Success`
  - `404: Staff Member Not Found`

#### `POST /staff`

- **Description:**
    Adds a staff member to the database with the specified details.
- **Request Body:**
  - `name: string`
  - `location: string`
  - `skill: string`
  - `phoneNumber: string`
- **Response Codes:**
  - `201: Success`
  - `400: Invalid Input`

#### `PATCH /staff/:id`

- **Description:**
    Updates the details of a specific staff member by ID.
- **Request Parameters:**
  - `id: string`
- **Request Body (any of the following optional):**
  - `name: string`
  - `location: string`
  - `skill: string`
  - `phoneNumber: string`
- **Response Codes:**
  - `200: Success`
  - `400: Invalid Input`
  - `404: Staff Member Not Found`

#### `DELETE /staff/:id`

- **Description:**
    Deletes a specific staff member by ID from the database.
- **Request Parameters:**
  - `id: string`
- **Response Codes:**
  - `200: Success`
  - `404: Staff Member Not Found`
  - `500: Internal Server Error`

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

## Postman Workspace for API Test

Please follow this [link][def]

[def]: https://fourloop-w4156.postman.co/workspace/FourLoop-Workspace~7d14ccca-960e-46d4-8e9a-f136067db94f/collection/30540115-e83a1e38-5a7c-4bb3-ab6f-9df20d19ed42?action=share&creator=30515967

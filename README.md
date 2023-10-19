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

## Endpoints

### `POST /staff`

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

### `GET /staff`

- **Description:**
    Retrieves all staff members from the database.
- **Response Codes:**
  - `200: Success`
  - `500: Internal Server Error`

### `GET /staff/:id`

- **Description:**
    Retrieves a specific staff member by ID from the database.
- **Request Parameters:**
  - `id: int`
- **Response Codes:**
  - `200: Success`
  - `404: Staff Member Not Found`

### `PATCH /staff/:id`

- **Description:**
    Updates the details of a specific staff member by ID.
- **Request Parameters:**
  - `id: int`
- **Request Body (any of the following optional):**
  - `name: string`
  - `location: string`
  - `skill: string`
  - `phoneNumber: string`
- **Response Codes:**
  - `200: Success`
  - `400: Invalid Input`
  - `404: Staff Member Not Found`

### `DELETE /staff/:id`

- **Description:**
    Deletes a specific staff member by ID from the database.
- **Request Parameters:**
  - `id: int`
- **Response Codes:**
  - `200: Success`
  - `404: Staff Member Not Found`
  - `500: Internal Server Error`

### `GET /schedules`

- **Description:**
    Retrieve all shifting schedules from the database.
- **Response Codes:**
  - `200: Success`
  - `500: Internal Server Error`

### `GET /schedules/:id`

- **Description:**
    Retrieve a specific shifting schedule by ID from the database.
- **Request Parameters:**
  - `id: int`
- **Response Codes:**
  - `200: Success`
  - `404: Schedule Not Found`

### `POST /schedules`

- **Description:**
    Create a new schedule for a specific facility.
- **Request Body:**
  - `facility: string` (The facility ID for which the schedule is being created)
- **Response Codes:**
  - `201: Success`
  - `400: Invalid Input`

### `PATCH /schedules/:id`

- **Description:**
    Update the shift hours of a specific schedule by ID.
- **Request Parameters:**
  - `id: int`
- **Response Codes:**
  - `200: Success`
  - `404: Schedule Not Found`
  - `405: Shifts Already Scheduled`
  - `500: Internal Server Error`

### `DELETE /schedules/:id`

- **Description:**
    Delete a specific schedule by ID from the database.
- **Request Parameters:**
  - `id: int`
- **Response Codes:**
  - `200: Success`
  - `404: Schedule Not Found`
  - `500: Internal Server Error`

### `GET /facilities`

- **Description:**
    Retrieve all facilities from the database.
- **Response Codes:**
  - `200: Success`
  - `500: Internal Server Error`

### `GET /facilities/:id`

- **Description:**
    Retrieve a specific facility by ID from the database.
- **Request Parameters:**
  - `id: int`
- **Response Codes:**
  - `200: Success`
  - `404: Facility Not Found`

### `POST /facilities`

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

### `PATCH /facilities/:id`

- **Description:**
    Update the details of a specific facility by ID.
- **Request Parameters:**
  - `id: int`
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

### `DELETE /facilities/:id`

- **Description:**
    Delete a specific facility by ID from the database.
- **Request Parameters:**
  - `id: int`
- **Response Codes:**
  - `200: Success`
  - `404: Facility Not Found`
  - `500: Internal Server Error`

### `GET /notifications`

- **Description:**
    Retrieve all notifications from the database.
- **Response Codes:**
  - `200: Success`
  - `500: Internal Server Error`

### `GET /notifications/:id`

- **Description:**
    Retrieve a specific notification by ID from the database.
- **Request Parameters:**
  - `id: int`
- **Response Codes:**
  - `200: Success`
  - `404: Notification Not Found`

### `POST /notifications`

- **Description:**
    Create a new notification with the specified title and content.
- **Request Body:**
  - `title: string`
  - `content: string`
- **Response Codes:**
  - `201: Success`
  - `400: Invalid Input`

### `PATCH /notifications/:id`

- **Description:**
    Update the title or content of a specific notification by ID.
- **Request Parameters:**
  - `id: int`
- **Request Body (any of the following optional):**
  - `title: string`
  - `content: string`
- **Response Codes:**
  - `200: Success`
  - `400: Invalid Input`
  - `404: Notification Not Found`

### `DELETE /notifications/:id`

- **Description:**
    Delete a specific notification by ID from the database.
- **Request Parameters:**
  - `id: int`
- **Response Codes:**
  - `200: Success`
  - `404: Notification Not Found`
  - `500: Internal Server Error`

# Unified dradic technologies applications APIS

A collection of APIs for various applications built by Dradic Technologies.

## APIs

### Authentication (`/api/v1/auth`)

- `POST /login` - Login a user
- `POST /register` - Register a new user
- `POST /logout` - Logout a user
- `GET /me` - Get current user

### Portfolio (`/api/v1/portfolio`)

- `GET /` - Get all projects
- `GET /{project_id}` - Get specific project
- `POST /` - Create new project
- `PUT /{project_id}` - Update project
- `DELETE /{project_id}` - Delete project

### Blog (`/api/v1/blog`)

- `GET /` - Get all blog posts
- `GET /{post_id}` - Get specific blog post
- `POST /` - Create new blog post
- `PUT /{post_id}` - Update blog post
- `DELETE /{post_id}` - Delete blog post

### Expense Tracker (`/api/v1/expense-tracker`)

- `GET /` - Get all expenses
- `GET /{expense_id}` - Get specific expense
- `POST /` - Create new expense
- `PUT /{expense_id}` - Update expense
- `DELETE /{expense_id}` - Delete expense

## Authentication

Authentication is handled by the `/api/v1/auth` endpoints. The `login` and `register` endpoints return a JSON Web Token (JWT) which should be sent in the `Authorization` header for all subsequent requests.

## Authorization

Authorization is handled by the `Authorization` header. The header should contain a valid JWT token.

## Error Handling

All endpoints return a JSON response with a `status` and `error` property. The `status` property is a boolean indicating whether the request was successful. The `error` property is a string containing an error message if the request was not successful.

## CORS

The API is configured to allow CORS requests from any origin. This means that the API can be accessed from any website or application.

## Development

The API is built using FastAPI. To run the API locally, run the following command in the root directory of the repository:

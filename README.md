# Market Product Manager

Market Product Manager is a full-stack MERN web application for managing a product catalog. Users can register, log in, and manage products from a responsive dashboard with search, filtering, sorting, stock tracking, image URL support, and product descriptions.

## Features

- User registration and login
- JWT-based authorization
- Protected dashboard route
- Create, read, update, and delete products
- View a single product by id
- Search, filter, and sort products
- Product description, category, image URL, price, and stock fields
- Frontend and backend validation with clear error messages
- Responsive interface built with Tailwind CSS
- Docker and Docker Compose support

## Technology Stack

### Frontend

- React
- TypeScript
- Vite
- Axios
- React Router DOM
- Tailwind CSS

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (`jsonwebtoken`)
- bcryptjs
- CORS
- dotenv

### DevOps

- Docker
- Docker Compose

## Project Structure

```text
Project_Web/
|-- backend/
|   |-- src/
|   |   |-- config/
|   |   |-- controllers/
|   |   |-- middleware/
|   |   |-- models/
|   |   |-- routes/
|   |   `-- index.js
|   |-- Dockerfile
|   `-- package.json
|-- frontend/
|   `-- market_pr/
|       |-- src/
|       |   |-- components/
|       |   |-- pages/
|       |   |-- services/
|       |   `-- types/
|       |-- Dockerfile
|       `-- package.json
|-- docker-compose.yml
`-- README.md
```

## API Endpoints

### Authentication

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Log in and receive a JWT token |

### Products

| Method | Endpoint | Description | Auth required |
| --- | --- | --- | --- |
| GET | `/api/market` | Get all products | No |
| GET | `/api/market/:id` | Get one product by id | No |
| POST | `/api/market` | Create a product | Yes |
| PUT | `/api/market/:id` | Update a product | Yes |
| DELETE | `/api/market/:id` | Delete a product | Yes |

## Validation

The application uses explicit validation on both frontend and backend.

### Authentication Validation

- Email and password are required.
- Email must use a valid email format.
- Password must contain at least 6 characters during registration.
- Duplicate email registration returns `400 Bad Request`.
- Invalid login credentials return a clear error response.

### Product Validation

- Product name, price, and category are required.
- Price must be a valid non-negative number.
- Stock must be a non-negative whole number.
- Product name, category, and description have length limits.
- Image URL must be a valid `http` or `https` URL when provided.
- Invalid product ids return `400 Bad Request`.
- Missing products return `404 Not Found`.

## Running Locally

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend/market_pr
npm install
npm run dev
```

## Environment Variables

Create a `.env` file in the `backend` folder:

```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

## Running with Docker

From the project root:

```bash
docker compose up --build
```

Application URLs:

```text
Frontend: http://localhost:5173
Backend: http://localhost:5001
```

To stop the containers:

```bash
docker compose down
```

## Testing

The backend API was tested using Postman. The frontend was tested manually in the browser.

Verified scenarios:

- User registration
- User login
- Protected route access
- Frontend validation messages
- Backend validation responses
- Product creation
- Product list loading
- Single product retrieval by id
- Product editing
- Product deletion
- Search, filtering, and sorting
- Logout
- Dockerized application startup

## Future Improvements

- Upload product images from the local computer
- Pagination for large product lists
- User-specific product ownership
- Cloud deployment

## Author

Semester project for the Web Application / IT Project course.

Technology stack: MERN (MongoDB, Express.js, React, Node.js).

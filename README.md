# Market Product Manager

Market Product Manager is a full-stack web application developed using the MERN stack (MongoDB, Express.js, React, and Node.js). The application allows users to register, log in, and manage products through a modern and responsive dashboard.

## Features

- User registration and authentication
- JWT-based authorization
- Protected routes
- Create, read, update, and delete products
- Product image support using image URLs
- Responsive user interface built with Tailwind CSS
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
- jsonwebtoken
- bcryptjs
- CORS
- dotenv

### DevOps

- Docker
- Docker Compose

## Project Structure

```text
PROJECT_WEB/
├── backend/
├── frontend/
│   └── market_pr/
```text

# Market Product Manager

Market Product Manager is a full-stack web application developed using the MERN stack (MongoDB, Express.js, React, and Node.js). The application allows users to register, log in, and manage products through a modern and responsive dashboard.

## Features

- User registration and authentication
- JWT-based authorization
- Protected routes
- Create, read, update, and delete products
- Product image support using image URLs
- Responsive user interface built with Tailwind CSS
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
- jsonwebtoken
- bcryptjs
- CORS
- dotenv

### DevOps

- Docker
- Docker Compose

## Project Structure

```text
PROJECT_WEB/
├── backend/
├── frontend/
│   └── market_pr/
├── docker-compose.yml
├── .gitignore
└── README.md
API Endpoints

**Authentication**
Method	Endpoint	Description
POST	/api/auth/register	Register a new user
POST	/api/auth/login	Login and receive JWT token

**Products**
Method	Endpoint	Description
GET	/api/market	Get all products
POST	/api/market	Create a product
PUT	/api/market/:id	Update a product
DELETE	/api/market/:id	Delete a product
Running Locally

**Backend**
cd backend
npm install
npm run dev

**Frontend**
cd frontend/market_pr
npm install
npm run dev
Environment Variables

**Create a .env file in the backend folder:**
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
Running with Docker

**From the root folder, run:**
docker compose up --build

**Application URLs:**
Frontend: http://localhost:5173
Backend: http://localhost:5001

**To stop the containers:**
docker compose down

**Testing**
The backend API was tested using Postman, and the frontend was tested manually in the browser.

**The following scenarios were verified:**
User registration
User login
Protected route access
Product creation
Product editing
Product deletion
Logout
Dockerized application startup
Future Improvements
Upload product images from the local computer
Search and filter products
Pagination
User-specific product ownership
Cloud deployment

**Author**
Semester project for the Web Application / IT Project course.
Technology stack: MERN (MongoDB, Express.js, React, Node.js).
├── docker-compose.yml
├── .gitignore
└── README.md

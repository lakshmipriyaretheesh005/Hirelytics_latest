# Hirelytics Backend API

MERN Stack backend for Hirelytics - Campus Placement Management System

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env` file in the backend directory with the following:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hirelytics
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### 3. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

### 4. Run the Server

Development mode with hot reload:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Profile
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile
- `POST /api/profile/onboarding` - Complete onboarding

### Companies
- `GET /api/companies` - Get all companies
- `GET /api/companies/eligible` - Get eligible companies for user
- `GET /api/companies/:id` - Get single company
- `POST /api/companies` - Create company (Admin)
- `PUT /api/companies/:id` - Update company (Admin)
- `DELETE /api/companies/:id` - Delete company (Admin)

### Drives
- `GET /api/drives` - Get all drives
- `GET /api/drives/:id` - Get single drive
- `GET /api/drives/my-applications` - Get user's applications
- `POST /api/drives/:id/apply` - Apply to drive
- `POST /api/drives` - Create drive (Admin)
- `PUT /api/drives/:id` - Update drive (Admin)

### Mock Tests
- `GET /api/mock-tests` - Get all mock tests
- `GET /api/mock-tests/:id` - Get single test
- `GET /api/mock-tests/my-attempts` - Get user's attempts
- `POST /api/mock-tests/:id/submit` - Submit test attempt
- `POST /api/mock-tests` - Create test (Admin)

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification

## Project Structure

```
backend/
├── config/
│   └── db.js             # MongoDB connection
├── controllers/
│   ├── authController.js
│   ├── profileController.js
│   ├── companyController.js
│   ├── driveController.js
│   ├── mockTestController.js
│   └── notificationController.js
├── middleware/
│   ├── auth.js           # JWT authentication
│   └── errorHandler.js   # Error handling
├── models/
│   ├── User.js
│   ├── Company.js
│   ├── Drive.js
│   ├── MockTest.js
│   └── Notification.js
├── routes/
│   ├── auth.js
│   ├── profile.js
│   ├── company.js
│   ├── drive.js
│   ├── mockTest.js
│   └── notification.js
├── utils/
│   └── jwt.js            # JWT utilities
├── .env
├── .gitignore
├── package.json
└── server.js             # Entry point
```

## Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

The token is returned on successful login/registration.

## Error Handling

All endpoints return errors in the following format:

```json
{
  "error": "Error message here"
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

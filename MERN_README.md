# Hirelytics - MERN Stack

Complete MERN Stack Campus Placement Management System

## 🚀 Tech Stack

### Backend
- **Node.js** + **Express.js** - REST API server
- **MongoDB** + **Mongoose** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **React Router** - Routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Shadcn UI** - UI components
- **Lucide React** - Icons

## 📁 Project Structure

```
Hirelytics_latest/
├── backend/                 # Express API server
│   ├── config/             # Database configuration
│   ├── controllers/        # Business logic
│   ├── middleware/         # Auth & error handling
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API endpoints
│   ├── utils/              # Helper functions
│   ├── .env                # Environment variables
│   ├── package.json        
│   └── server.js           # Entry point
│
├── frontend/               # React application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React context (Auth)
│   │   ├── pages/         # Page components
│   │   ├── utils/         # API client
│   │   ├── lib/           # Utilities
│   │   ├── App.jsx        # Main app
│   │   ├── main.jsx       # Entry point
│   │   └── index.css      # Global styles
│   ├── .env               # Environment variables
│   ├── package.json
│   └── vite.config.js
│
├── src/                   # Original Next.js app (reference)
└── README.md             # This file
```

## ⚙️ Features

### Authentication
- ✅ User registration with email/password
- ✅ JWT-based authentication
- ✅ Protected routes
- ✅ Onboarding flow for new users

### Student Features
- ✅ Profile management
- ✅ Browse eligible companies
- ✅ View placement drives
- ✅ Apply to drives
- ✅ Track application status
- ✅ Take mock tests
- ✅ View notifications

### Data Management
- ✅ Companies with eligibility criteria
- ✅ Placement drives
- ✅ Mock tests with scoring
- ✅ Notifications system

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB installed and running
- npm or yarn

### 1. Backend Setup

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Configure environment variables
# Edit .env file with your settings:
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/hirelytics
# JWT_SECRET=your_secret_key
# FRONTEND_URL=http://localhost:5173

# Start MongoDB (if not running)
# Windows: net start MongoDB
# macOS/Linux: sudo systemctl start mongod

# Start backend server
npm run dev
```

Backend will run on http://localhost:5000

### 2. Frontend Setup

```bash
# Navigate to frontend folder  
cd frontend

# Install dependencies
npm install

# Configure environment variables
# Edit .env file:
# VITE_API_URL=http://localhost:5000/api

# Start frontend development server
npm run dev
```

Frontend will run on http://localhost:5173

### 3. Access the Application

1. Open browser to http://localhost:5173
2. Register a new account
3. Complete onboarding
4. Explore the dashboard!

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Profile
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update profile
- `POST /api/profile/onboarding` - Complete onboarding

### Companies
- `GET /api/companies` - Get all companies
- `GET /api/companies/eligible` - Get eligible companies
- `GET /api/companies/:id` - Get single company

### Drives
- `GET /api/drives` - Get all drives
- `GET /api/drives/:id` - Get single drive
- `POST /api/drives/:id/apply` - Apply to drive
- `GET /api/drives/my-applications` - Get user's applications

### Mock Tests
- `GET /api/mock-tests` - Get all tests
- `GET /api/mock-tests/:id` - Get single test
- `POST /api/mock-tests/:id/submit` - Submit test attempt
- `GET /api/mock-tests/my-attempts` - Get user's attempts

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read

## 🔐 Authentication Flow

1. User registers with email, password, and full name
2. Backend hashes password and stores user in MongoDB
3. JWT token is generated and returned
4. Frontend stores token in localStorage
5. Token is sent with every API request via Authorization header
6. Backend verifies token before processing protected requests

## 💾 Database Models

### User
- Authentication credentials
- Profile information (branch, CGPA, skills)
- Onboarding status

### Company
- Company details
- Eligibility criteria
- Tags and ratings

### Drive
- Company reference
- Role and package details
- Application tracking
- Status management

### MockTest
- Questions and answers
- Test metadata
- User attempts with scores

### Notification
- User-specific notifications
- Read/unread status
- Priority levels

## 🎨 UI Components

The frontend uses:
- **Tailwind CSS** for utility-first styling
- **Radix UI** for accessible component primitives
- **Framer Motion** for smooth animations
- **Sonner** for toast notifications
- **Lucid React** for beautiful icons

## 🔄 Migration from Next.js + Supabase

This project was converted from Next.js + Supabase to MERN stack:
- ✅ Supabase Auth → JWT Authentication
- ✅ Supabase Database → MongoDB
- ✅ Next.js Server Actions → Express REST APIs
- ✅ Next.js Pages → React Router pages
- ✅ Maintained exact same UI/UX

## 📝 Development

### Backend Development
```bash
cd backend
npm run dev  # Starts with nodemon for hot reload
```

### Frontend Development
```bash
cd frontend
npm run dev  # Starts Vite dev server
```

### Build for Production

Backend:
```bash
cd backend
npm start
```

Frontend:
```bash
cd frontend
npm run build
npm run preview
```

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `net start MongoDB` (Windows)
- Check MONGODB_URI in backend/.env
- Verify MongoDB is accessible on port 27017

### CORS Errors
- Check FRONTEND_URL in backend/.env matches frontend port
- Verify backend CORS configuration in server.js

### Token/Auth Issues
- Clear localStorage and re-login
- Check JWT_SECRET is set in backend/.env
- Verify token expiry settings

## 📚 Next Steps

To enhance this project further:

1. **Admin Panel**: Add admin routes for managing companies, drives, tests
2. **File Upload**: Implement resume upload functionality  
3. **Real-time Updates**: Add WebSocket for live notifications
4. **Analytics**: Add charts and insights on dashboard
5. **Email Integration**: Send email notifications
6. **Advanced Filtering**: Add search, filters, and sorting
7. **Testing**: Add unit and integration tests
8. **Deployment**: Deploy to cloud (AWS, Heroku, Vercel)

## 📄 License

MIT License - Feel free to use this project for learning and development

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

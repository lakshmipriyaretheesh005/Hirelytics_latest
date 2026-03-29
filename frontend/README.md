# Hirelytics Frontend

React + Vite frontend for Hirelytics Campus Placement Management System

## Tech Stack

- React 18
- Vite
- React Router
- Axios
- Tailwind CSS
- Framer Motion
- Shadcn UI Components
- Lucide React Icons

## Setup

```bash
npm install
npm run dev
```

## Environment Variables

Create `.env` file:
```
VITE_API_URL=http://localhost:5000/api
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Project Structure

```
src/
├── components/        # Reusable components
│   └── ProtectedRoute.jsx
├── context/          # React Context
│   └── AuthContext.jsx
├── pages/            # Page components
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── OnboardingPage.jsx
│   ├── DashboardPage.jsx
│   ├── CompaniesPage.jsx
│   ├── DrivesPage.jsx
│   ├── MockTestsPage.jsx
│   ├── ProfilePage.jsx
│   └── NotificationsPage.jsx
├── utils/            # Utilities
│   └── apiClient.js  # Axios instance
├── lib/              # Libraries
│   └── utils.js      # Helper functions
├── App.jsx           # Main app component
├── main.jsx          # Entry point
└── index.css         # Global styles
```

## Features

- JWT Authentication
- Protected Routes
- Responsive Design
- Dark Theme
- Toast Notifications
- Form Validation
- API Integration

## API Integration

All API calls go through `src/utils/apiClient.js` which:
- Adds JWT token to requests automatically
- Handles 401 errors (redirects to login)
- Provides centralized error handling

## Authentication Flow

1. User logs in → Token stored in localStorage
2. AuthContext provides auth state globally
3. ProtectedRoute checks authentication
4. API client includes token in requests
5. Automatic logout on 401 errors

## Development

The frontend runs on http://localhost:5173 and proxies API calls to http://localhost:5000

## Building for Production

```bash
npm run build
```

Output will be in `dist/` folder.

# Quick Start Guide - Hirelytics MERN Stack

## 🚀 Get Up and Running in 5 Minutes

### Step 1: Start MongoDB (30 seconds)

```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod

# Verify it's running
mongo --version
```

### Step 2: Start Backend (1 minute)

```bash
# Open Terminal/PowerShell #1
cd backend

# Install dependencies (first time only)
npm install

# Start the server
npm run dev
```

You should see:
```
✅ MongoDB connected successfully
✅ Server running on port 5000
```

### Step 3: Start Frontend (1 minute)

```bash
# Open Terminal/PowerShell #2
cd frontend

# Install dependencies (first time only)
npm install

# Start development server
npm run dev
```

You should see:
```
VITE v5.x.x ready in xxx ms
➜  Local:   http://localhost:5173/
```

### Step 4: Open Browser

Go to **http://localhost:5173**

### Step 5: Create Your Account

1. Click **"Create an account"**
2. Fill in:
   - Full Name: John Doe
   - Email: john@mits.ac.in
   - Password: password123
   - Confirm Password: password123
3. Click **"Create Account"**

### Step 6: Complete Onboarding

Fill in your profile:
- Branch: CSE
- Semester: 6
- CGPA: 8.5
- Graduation Year: 2026
- Skills: React, Node.js, MongoDB (click "Add" after each)

Click **"Complete Profile"**

### 🎉 Done! You're in the Dashboard!

## 📋 Default Credentials (if you want to test login)

After registration, use your own credentials to login.

## 🔧 Troubleshooting

### Backend won't start?
- **Issue**: MongoDB connection error
- **Fix**: Run `net start MongoDB` (Windows) or check if MongoDB is installed

### Frontend shows blank page?
- **Fix**: Clear browser cache and reload (Ctrl+Shift+R)

### Can't login?
- **Fix**: Check backend terminal for errors
- **Fix**: Verify backend is running on port 5000
- **Fix**: Check browser console (F12) for errors

### Port already in use?
```bash
# Kill process on port 5000 (backend)
npx kill-port 5000

# Kill process on port 5173 (frontend)
npx kill-port 5173
```

## 📁 Project Ports

- **Backend API**: http://localhost:5000
- **Frontend UI**: http://localhost:5173
- **MongoDB**: mongodb://localhost:27017

## 🎯 Quick Test Checklist

- [ ] MongoDB is running
- [ ] Backend shows "MongoDB connected"
- [ ] Backend shows "Server running on port 5000"
- [ ] Frontend running on port 5173
- [ ] Can register new account
- [ ] Can complete onboarding
- [ ] Dashboard loads with stats
- [ ] Can navigate to Companies page
- [ ] Can navigate to Profile page

## 💡 Key Features to Test

1. **Dashboard**: View stats and quick actions
2. **Companies**: Browse eligible companies
3. **Drives**: View drives and apply
4. **Mock Tests**: See available tests
5. **Profile**: Update your information
6. **Notifications**: Check notifications

## 📝 Environment Files

### Backend `.env` (already configured)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hirelytics
JWT_SECRET=hirelytics_jwt_secret_key_change_in_production_2026
JWT_EXPIRE=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Frontend `.env` (already configured)
```
VITE_API_URL=http://localhost:5000/api
```

## 🔄 Restart Everything

If something goes wrong, restart both servers:

**Backend:**
```bash
# In backend terminal
Ctrl + C (to stop)
npm run dev (to restart)
```

**Frontend:**
```bash
# In frontend terminal
Ctrl + C (to stop)
npm run dev (to restart)
```

## 📊 Sample Data

The application starts empty. To add sample data:

1. **Companies**: Create via admin endpoints or add directly to MongoDB
2. **Drives**: Add after companies exist
3. **Mock Tests**: Add via API or MongoDB

## 🎓 Learning Resources

- **Express.js**: https://expressjs.com/
- **React**: https://react.dev/
- **MongoDB**: https://www.mongodb.com/docs/
- **Mongoose**: https://mongoosejs.com/docs/
- **Vite**: https://vitejs.dev/

## ❓ Common Questions

**Q: Do I need to run both backend and frontend?**
A: Yes! Backend provides the API, frontend provides the UI.

**Q: Can I use a different database?**
A: Yes, but you'll need to modify the backend connection code.

**Q: How do I add admin functionality?**
A: Update user role to 'admin' in MongoDB, then create admin routes.

**Q: Where is data stored?**
A: MongoDB database named 'hirelytics' on your local machine.

## 🚀 Next Steps

After getting it running:
1. Explore the codebase
2. Add your own companies and drives
3. Customize the UI to match your needs
4. Add new features
5. Deploy to production

## 💬 Need Help?

Check the main README.md for detailed documentation and API endpoints.

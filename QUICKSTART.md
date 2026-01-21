# Quick Start Guide

## ⚡ Running the Application

### Step 1: Start MongoDB
- **Local MongoDB**: Make sure MongoDB is running on your system
- **Or use MongoDB Atlas**: Update `MONGODB_URI` in `.env`

### Step 2: Start Backend Server

Open PowerShell/Terminal in the `backend` folder:

```powershell
# Install dependencies (first time only)
npm install

# Copy environment file
Copy-Item .env.example .env

# Edit .env and add your MongoDB URI and JWT_SECRET

# Start development server
npm run dev
```

Expected output:
```
Server running on port 5000
MongoDB Connected: localhost
```

### Step 3: Start Frontend App

Open another PowerShell/Terminal in the `frontend` folder:

```powershell
# Install dependencies (first time only)
npm install

# Start React development server
npm start
```

This will automatically open `http://localhost:3000` in your browser.

## 📝 Testing the Application

1. **Register a new account**
   - Go to http://localhost:3000/register
   - Create an account with email and password
   - You'll be logged in automatically

2. **Create a project**
   - Click "Create New Project" on Dashboard
   - Enter project title and description
   - Project will be created with default columns: To-Do, In-Progress, Done

3. **Create tasks**
   - Click on a project to open the kanban board
   - Click "+ Add Task" on any column
   - Fill in task details (title, description, priority, due date)
   - Click "Create Task"

4. **Drag and drop tasks**
   - Drag tasks between columns
   - Watch real-time updates (if multiple browsers are open)

5. **View activity timeline**
   - Click "Activity Timeline" to see all project activities

## 🔧 Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/trello-clone
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

## 📦 Useful Commands

### Backend
```bash
npm run dev      # Start with nodemon (auto-reload)
npm start        # Start production server
npm install      # Install dependencies
```

### Frontend
```bash
npm start        # Start development server
npm run build    # Build for production
npm test         # Run tests
npm install      # Install dependencies
```

## 🐛 Troubleshooting

### Backend won't start
- Check if port 5000 is already in use
- Verify MongoDB is running: `mongod`
- Check `.env` file exists and has correct values

### Frontend won't connect to backend
- Ensure backend is running on port 5000
- Check `REACT_APP_API_URL` in frontend `.env`
- Clear browser cache and cookies
- Check browser console for errors

### WebSocket connection failed
- Backend and frontend must be on same network
- Check CORS in `backend/server.js`
- Verify Socket.io is installed: `npm list socket.io`

### "Cannot find module" errors
- Run `npm install` in the folder with missing dependencies
- Delete `node_modules` and `package-lock.json`, then run `npm install`

## 📊 Database

### Accessing MongoDB Locally
```bash
# Start MongoDB shell
mongosh

# Show databases
show dbs

# Use trello-clone database
use trello-clone

# Show collections
show collections

# View users
db.users.find()

# View projects
db.projects.find()

# View tasks
db.tasks.find()
```

## 🚀 Deployment Notes

### Backend Deployment (Heroku/Railway)
1. Push code to Git repository
2. Set environment variables on platform
3. Deploy with: `PORT=5000` environment variable

### Frontend Deployment (Vercel/Netlify)
1. Build: `npm run build`
2. Set `REACT_APP_API_URL` to production backend URL
3. Deploy `build` folder

## 📚 API Documentation

Full API documentation is in [backend/README.md](./backend/README.md)

## 🎨 UI Features

- **Responsive Design**: Works on desktop, tablet, mobile
- **Dark Mode Ready**: Tailwind CSS configured
- **Toast Notifications**: Success/error messages
- **Modal Dialogs**: For creating/editing tasks
- **Drag-and-Drop**: React Beautiful DnD
- **Real-time Updates**: Socket.io integration

## 💡 Tips

1. Use different browsers or incognito windows to test real-time collaboration
2. Open browser DevTools to see WebSocket messages (Network tab)
3. Check backend logs for detailed error information
4. Use MongoDB Compass for GUI database management

## 📞 Support

For issues or questions:
1. Check terminal/console logs for errors
2. Verify all environment variables are set
3. Ensure all ports (3000, 5000) are available
4. Check MongoDB connection string format

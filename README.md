# 🚀 Trello Clone - MERN Stack

A modern, fully functional Trello clone built with the MERN stack featuring real-time collaboration, drag-and-drop task management, and a beautiful dark blue UI.

## ✨ Features

- 🔐 **User Authentication** - Register, login with JWT token-based authentication
- 📋 **Project Management** - Create, update, and delete projects with ease
- 🎯 **Task Management** - Create, edit, and delete tasks with rich descriptions
- 🔄 **Drag & Drop** - Smooth task movement between columns using React Beautiful DnD
- 🌙 **Dark UI Theme** - Beautiful dark blue gradient design with cyan accents
- 📊 **Activity Logging** - Track all project and task activities in real-time
- 🔗 **Real-time Updates** - Socket.io integration for live collaboration
- 💾 **Mock Database Mode** - Works without MongoDB for rapid development

## 🛠 Tech Stack

### Frontend
- **React 18** - UI library
- **React Router v6** - Client-side routing
- **React Beautiful DnD** - Drag and drop functionality
- **Tailwind CSS** - Styling with custom dark blue theme
- **Axios** - HTTP client
- **Socket.io Client** - Real-time communication
- **React Toastify** - Toast notifications

### Backend
- **Node.js + Express** - REST API server
- **MongoDB + Mongoose** - Database (optional, mock mode available)
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Socket.io** - Real-time events
- **Express Validator** - Input validation

## 📦 Installation

### Prerequisites
- **Node.js** v14+ and npm
- **MongoDB** (optional - app runs in mock mode without it)

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your configuration (optional if using mock mode)
# MONGODB_URI=mongodb://localhost:27017/trello-clone
# JWT_SECRET=your_jwt_secret_key

# Start the server
npm start

# Or for development with auto-reload
npm run dev
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The frontend will open at `http://localhost:3000` and the backend runs on `http://localhost:5000`.

## 🚀 Running the Application

### Quick Start (Development Mode)

Open two terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
npm start
# Server runs at http://localhost:5000
# ✅ Works with or without MongoDB (auto mock mode)
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
# App opens at http://localhost:3000
```

### Production Mode (with MongoDB)

1. Install and start MongoDB locally or use MongoDB Atlas
2. Update `.env` file with `MONGODB_URI`
3. Run the same commands as above

## 📚 API Documentation

All API routes require authentication unless otherwise noted.

### Authentication Routes (`/api/auth`)

#### 1. Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### 2. Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:** (Same as register)

#### 3. Get Profile
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

---

### Project Routes (`/api/projects`)

#### 1. Create Project
```http
POST /api/projects
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "My Awesome Project"
}
```

**Response:**
```json
{
  "message": "Project created successfully",
  "project": {
    "_id": "project_id",
    "title": "My Awesome Project",
    "owner": "user_id",
    "columns": [
      { "_id": "col_1", "name": "To-Do" },
      { "_id": "col_2", "name": "In-Progress" },
      { "_id": "col_3", "name": "Done" }
    ],
    "createdAt": "2026-01-21T10:00:00Z"
  }
}
```

#### 2. Get All Projects
```http
GET /api/projects
Authorization: Bearer <token>
```

#### 3. Get Project by ID
```http
GET /api/projects/:projectId
Authorization: Bearer <token>
```

#### 4. Update Project
```http
PUT /api/projects/:projectId
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Project Title"
}
```

#### 5. Delete Project
```http
DELETE /api/projects/:projectId
Authorization: Bearer <token>
```

#### 6. Add Team Member
```http
POST /api/projects/:projectId/members
Authorization: Bearer <token>
Content-Type: application/json

{
  "email": "teammate@example.com"
}
```

#### 7. Remove Team Member
```http
DELETE /api/projects/:projectId/members
Authorization: Bearer <token>
Content-Type: application/json

{
  "memberId": "member_user_id"
}
```

---

### Task Routes (`/api/projects/:projectId/tasks`)

#### 1. Create Task
```http
POST /api/projects/:projectId/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Design homepage",
  "description": "Create mockups for the landing page",
  "columnId": "col_id_1",
  "priority": "high",
  "dueDate": "2026-02-01"
}
```

**Response:**
```json
{
  "message": "Task created successfully",
  "task": {
    "_id": "task_id",
    "title": "Design homepage",
    "description": "Create mockups for the landing page",
    "project": "project_id",
    "column": "col_id_1",
    "priority": "high",
    "assignee": "user_id",
    "position": 0,
    "dueDate": "2026-02-01",
    "createdAt": "2026-01-21T10:00:00Z"
  }
}
```

#### 2. Get All Tasks
```http
GET /api/projects/:projectId/tasks
Authorization: Bearer <token>
```

#### 3. Update Task
```http
PUT /api/projects/:projectId/tasks/:taskId
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated task title",
  "description": "Updated description",
  "priority": "medium",
  "dueDate": "2026-02-15"
}
```

#### 4. Move Task (Drag & Drop)
```http
PUT /api/projects/:projectId/tasks/:taskId/move
Authorization: Bearer <token>
Content-Type: application/json

{
  "columnId": "col_id_2",
  "position": 0
}
```

**Response:**
```json
{
  "message": "Task moved successfully",
  "task": {
    "_id": "task_id",
    "column": "col_id_2",
    "position": 0
  }
}
```

#### 5. Delete Task
```http
DELETE /api/projects/:projectId/tasks/:taskId
Authorization: Bearer <token>
```

#### 6. Add Comment
```http
POST /api/projects/:projectId/tasks/:taskId/comments
Authorization: Bearer <token>
Content-Type: application/json

{
  "text": "This looks great!"
}
```

---

### Activity Routes (`/api/projects/:projectId/activities`)

#### Get Project Activities
```http
GET /api/projects/:projectId/activities
Authorization: Bearer <token>
```

**Response:**
```json
{
  "activities": [
    {
      "_id": "activity_id",
      "project": "project_id",
      "user": "user_id",
      "action": "created_task",
      "task": "task_id",
      "details": "Created task 'Design homepage'",
      "createdAt": "2026-01-21T10:00:00Z"
    }
  ]
}
```

---

## 🔄 Real-time Events (Socket.io)

The application emits real-time events for live collaboration:

- `task_created` - New task added
- `task_updated` - Task details changed
- `task_moved` - Task moved to different column
- `task_deleted` - Task removed
- `project_updated` - Project details changed
- `activity_logged` - New activity entry

---

## 📁 Project Structure

```
projectsecond/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── projectController.js
│   │   ├── taskController.js
│   │   └── activityController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── validation.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Project.js
│   │   ├── Task.js
│   │   └── Activity.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── projects.js
│   │   ├── tasks.js
│   │   └── activities.js
│   ├── utils/
│   │   ├── mockData.js
│   │   └── socket.js
│   ├── .env
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Board.js
│   │   │   ├── Column.js
│   │   │   └── TaskCard.js
│   │   ├── pages/
│   │   │   ├── Dashboard.js
│   │   │   ├── Login.js
│   │   │   └── Register.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   ├── tailwind.config.js
│   └── package.json
│
└── README.md
```

---

## 🎨 Customization

### Color Scheme

The app uses a custom dark blue theme. Modify colors in `tailwind.config.js`:

```javascript
colors: {
  'dark-blue': '#0d1419',
  'matte-blue': '#1f3247',
  'cyan': '#1abc9c',
  'accent-blue': '#4a90e2',
}
```

---

## 🐛 Troubleshooting

### Backend Port Already in Use
```bash
# Windows
taskkill /F /IM node.exe

# macOS/Linux
lsof -ti:5000 | xargs kill -9
```

### MongoDB Connection Error
The app automatically runs in mock mode if MongoDB is unavailable. No setup required!

### Drag & Drop Not Working
- Clear browser cache (Ctrl+Shift+Delete)
- Restart development server
- Ensure React 18+ is installed

### CORS Errors
- Verify backend and frontend URLs match in `.env`
- Check `CLIENT_URL` in backend `.env`

---

## 📝 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/trello-clone
JWT_SECRET=your_secret_key_here
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_SOCKET_URL=http://localhost:5000
```
---

##  License

ISC

---

##  Building With

Built with  for efficient task management and real-time collaboration

---

**Happy Task Managing! **

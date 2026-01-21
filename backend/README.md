# Trello Clone Backend

MERN stack backend for real-time collaboration project management tool.

## Features

- User authentication with JWT
- Project management (CRUD)
- Task management with drag-and-drop support
- Real-time updates via WebSockets
- Activity logging
- Role-based access control

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Configure MongoDB connection in `.env`

## Running

Development:
```bash
npm run dev
```

Production:
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### Projects
- `POST /api/projects` - Create project
- `GET /api/projects` - Get user projects
- `GET /api/projects/:projectId` - Get project details
- `PUT /api/projects/:projectId` - Update project
- `DELETE /api/projects/:projectId` - Delete project
- `POST /api/projects/:projectId/members` - Add member
- `DELETE /api/projects/:projectId/members` - Remove member

### Tasks
- `POST /api/projects/:projectId/tasks` - Create task
- `GET /api/projects/:projectId/tasks` - Get tasks
- `PUT /api/projects/:projectId/tasks/:taskId` - Update task
- `PUT /api/projects/:projectId/tasks/:taskId/move` - Move task
- `DELETE /api/projects/:projectId/tasks/:taskId` - Delete task
- `POST /api/projects/:projectId/tasks/:taskId/comments` - Add comment

### Activities
- `GET /api/projects/:projectId/activities` - Get project activities

## WebSocket Events

- `join_project` - Join project room
- `task_created` - Task created
- `task_updated` - Task updated
- `task_moved` - Task moved between columns
- `comment_added` - Comment added to task
- `activity_logged` - Activity logged

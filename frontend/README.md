# Trello Clone Frontend

React-based frontend for real-time collaboration project management tool.

## Features

- User authentication (login/register)
- Responsive dashboard with project listing
- Kanban board with drag-and-drop tasks
- Real-time updates via WebSockets
- Activity timeline
- Priority-based task management
- Task assignments and due dates

## Installation

1. Install dependencies:
```bash
npm install
```

2. Update `.env` file with backend API URL:
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

## Running

Development:
```bash
npm start
```

Build for production:
```bash
npm run build
```

## Project Structure

```
src/
  ├── pages/           # Page components (Login, Register, Dashboard, Board)
  ├── components/      # Reusable components (TaskCard, TaskModal, etc)
  ├── services/        # API service calls
  ├── hooks/           # Custom React hooks (useAuth, useSocket)
  ├── context/         # Context API (AuthContext)
  └── styles/          # Global CSS and Tailwind config
```

## Technologies

- React 18
- React Router v6
- Axios for API calls
- Socket.io for real-time updates
- React Beautiful DnD for drag-and-drop
- Tailwind CSS for styling
- React Toastify for notifications

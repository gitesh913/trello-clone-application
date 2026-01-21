import api from './api';

export const authService = {
  register: (name, email, password) =>
    api.post('/auth/register', { name, email, password }),

  login: (email, password) =>
    api.post('/auth/login', { email, password }),

  getProfile: () =>
    api.get('/auth/profile'),
};

export const projectService = {
  createProject: (title, description) =>
    api.post('/projects', { title, description }),

  getProjects: (page = 1, limit = 10) =>
    api.get('/projects', { params: { page, limit } }),

  getProjectById: (projectId) =>
    api.get(`/projects/${projectId}`),

  updateProject: (projectId, title, description) =>
    api.put(`/projects/${projectId}`, { title, description }),

  deleteProject: (projectId) =>
    api.delete(`/projects/${projectId}`),

  addMember: (projectId, memberId) =>
    api.post(`/projects/${projectId}/members`, { memberId }),

  removeMember: (projectId, memberId) =>
    api.delete(`/projects/${projectId}/members`, { data: { memberId } }),
};

export const taskService = {
  createTask: (projectId, { title, description, priority, columnId, assignee, dueDate }) =>
    api.post(`/projects/${projectId}/tasks`, { title, description, priority, columnId, assignee, dueDate }),

  getTasks: (projectId) =>
    api.get(`/projects/${projectId}/tasks`),

  updateTask: (projectId, taskId, data) =>
    api.put(`/projects/${projectId}/tasks/${taskId}`, data),

  moveTask: (projectId, taskId, columnId, position) =>
    api.put(`/projects/${projectId}/tasks/${taskId}/move`, { columnId, position }),

  deleteTask: (projectId, taskId) =>
    api.delete(`/projects/${projectId}/tasks/${taskId}`),

  addComment: (projectId, taskId, text) =>
    api.post(`/projects/${projectId}/tasks/${taskId}/comments`, { text }),
};

export const activityService = {
  getActivities: (projectId, page = 1, limit = 20) =>
    api.get(`/projects/${projectId}/activities`, { params: { page, limit } }),
};

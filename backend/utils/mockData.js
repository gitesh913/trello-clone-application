// In-memory data store for testing without MongoDB
const mockData = {
  users: {
    'test-user-123': {
      _id: 'test-user-123',
      name: 'Test User',
      email: 'test@example.com',
      password: 'test123',
      role: 'admin',
    },
  },
  projects: {},
  tasks: {},
  activities: {},
};

// Helper to generate IDs
function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

// Mock database API
const mockDB = {
  // Projects
  createProject(data) {
    const id = generateId();
    const project = {
      _id: id,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockData.projects[id] = project;
    return project;
  },

  getProjectById(id) {
    return mockData.projects[id] || null;
  },

  getProjectsByUserId(userId) {
    return Object.values(mockData.projects).filter(
      (p) =>
        p.owner === userId ||
        p.members?.some((m) => m.user === userId)
    );
  },

  updateProject(id, data) {
    if (mockData.projects[id]) {
      mockData.projects[id] = {
        ...mockData.projects[id],
        ...data,
        updatedAt: new Date(),
      };
      return mockData.projects[id];
    }
    return null;
  },

  deleteProject(id) {
    delete mockData.projects[id];
    return true;
  },

  // Tasks
  createTask(data) {
    const id = generateId();
    const task = {
      _id: id,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockData.tasks[id] = task;
    return task;
  },

  getTasksByProjectId(projectId) {
    return Object.values(mockData.tasks).filter(
      (t) => t.project === projectId
    );
  },

  updateTask(id, data) {
    if (mockData.tasks[id]) {
      mockData.tasks[id] = {
        ...mockData.tasks[id],
        ...data,
        updatedAt: new Date(),
      };
      return mockData.tasks[id];
    }
    return null;
  },

  deleteTask(id) {
    delete mockData.tasks[id];
    return true;
  },

  // Activities
  createActivity(data) {
    const id = generateId();
    const activity = {
      _id: id,
      ...data,
      createdAt: new Date(),
    };
    mockData.activities[id] = activity;
    return activity;
  },

  getActivitiesByProjectId(projectId) {
    return Object.values(mockData.activities)
      .filter((a) => a.project === projectId)
      .sort((a, b) => b.createdAt - a.createdAt);
  },
};

module.exports = { mockData, mockDB, generateId };

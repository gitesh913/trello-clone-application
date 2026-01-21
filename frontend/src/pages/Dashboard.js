import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { projectService } from '../services/apiService';
import { useAuth } from '../hooks/useAuth';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await projectService.getProjects();
      setProjects(response.data.projects);
    } catch (error) {
      toast.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();

    try {
      await projectService.createProject(title, description);
      toast.success('Project created successfully!');
      setTitle('');
      setDescription('');
      setShowModal(false);
      fetchProjects();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create project');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleProjectClick = (projectId) => {
    navigate(`/board/${projectId}`);
  };

  const handleDeleteProject = async (e, projectId) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      try {
        await projectService.deleteProject(projectId);
        toast.success('Project deleted successfully!');
        fetchProjects();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete project');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-matte-blue-900 via-dark-blue-800 to-matte-blue-800">
      {/* Header */}
      <header className="border-b border-matte-blue-600 bg-gradient-to-r from-matte-blue-800 to-dark-blue-800 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-accent-cyan to-accent-blue bg-clip-text text-transparent">Trello Clone</h1>
            <p className="text-matte-blue-300 mt-1">Welcome, {user?.name}! 👋</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-2 rounded-lg hover:from-red-700 hover:to-red-800 transition shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Create Project Button */}
        <button
          onClick={() => setShowModal(true)}
          className="mb-12 bg-gradient-to-r from-accent-blue to-accent-cyan text-white px-8 py-4 rounded-lg hover:shadow-2xl hover:shadow-accent-blue/50 transition font-semibold text-lg transform hover:scale-105"
        >
          + Create New Project
        </button>

        {/* Projects Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-matte-blue-300 text-lg">Loading projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-matte-blue-300 text-lg">No projects yet. Create one to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div
                key={project._id}
                className="bg-gradient-to-br from-matte-blue-700 to-dark-blue-700 rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-2xl hover:shadow-accent-blue/20 transition transform hover:scale-105 border border-matte-blue-600 hover:border-accent-blue group relative"
              >
                {/* Delete Button */}
                <button
                  onClick={(e) => handleDeleteProject(e, project._id)}
                  className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-lg"
                  title="Delete project"
                >
                  ×
                </button>

                {/* Project Content */}
                <div onClick={() => handleProjectClick(project._id)}>
                  <h2 className="text-xl font-bold text-white mb-2">{project.title}</h2>
                  <p className="text-matte-blue-200 mb-4">{project.description}</p>
                  <div className="text-sm text-matte-blue-300 space-y-1">
                    <p>👥 Members: {project.members.length}</p>
                    <p>📅 Created: {new Date(project.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create Project Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-matte-blue-800 to-dark-blue-800 rounded-xl p-8 w-full max-w-md shadow-2xl border border-matte-blue-600">
            <h2 className="text-2xl font-bold mb-6 text-white">Create New Project</h2>

            <form onSubmit={handleCreateProject}>
              <div className="mb-4">
                <label className="block text-matte-blue-200 font-semibold mb-2">Project Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 bg-matte-blue-700 border border-matte-blue-600 text-white rounded-lg focus:outline-none focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/30"
                  placeholder="My Project"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-matte-blue-200 font-semibold mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 bg-matte-blue-700 border border-matte-blue-600 text-white rounded-lg focus:outline-none focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/30"
                  placeholder="Project description..."
                  rows={4}
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-accent-blue to-accent-cyan text-white py-2 rounded-lg hover:shadow-lg hover:shadow-accent-blue/50 transition font-semibold"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-matte-blue-700 border border-matte-blue-600 text-matte-blue-200 py-2 rounded-lg hover:border-accent-blue hover:text-white transition font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

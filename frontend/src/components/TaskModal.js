import React, { useState } from 'react';

const TaskModal = ({ onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      priority,
      dueDate: dueDate ? new Date(dueDate) : null,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-matte-blue-800 to-dark-blue-800 rounded-xl p-8 w-full max-w-md border border-matte-blue-600 shadow-2xl">
        <h2 className="text-2xl font-bold mb-6 text-white">Create New Task</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-matte-blue-200 font-semibold mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 bg-matte-blue-700 border border-matte-blue-600 text-white rounded-lg focus:outline-none focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/30"
              placeholder="Task title"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-matte-blue-200 font-semibold mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 bg-matte-blue-700 border border-matte-blue-600 text-white rounded-lg focus:outline-none focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/30"
              placeholder="Task description..."
              rows={4}
            />
          </div>

          <div className="mb-4">
            <label className="block text-matte-blue-200 font-semibold mb-2">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-4 py-2 bg-matte-blue-700 border border-matte-blue-600 text-white rounded-lg focus:outline-none focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/30"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-matte-blue-200 font-semibold mb-2">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-2 bg-matte-blue-700 border border-matte-blue-600 text-white rounded-lg focus:outline-none focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/30"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-accent-blue to-accent-cyan text-white py-2 rounded-lg hover:shadow-lg hover:shadow-accent-blue/50 transition font-semibold"
            >
              Create Task
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-matte-blue-700 border border-matte-blue-600 text-matte-blue-200 py-2 rounded-lg hover:border-accent-blue hover:text-white transition font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;

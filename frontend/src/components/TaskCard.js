import React from 'react';
import { toast } from 'react-toastify';
import { taskService } from '../services/apiService';
import { useSocket } from '../hooks/useSocket';

const TaskCard = ({ task, projectId }) => {
  const socket = useSocket();

  const handleDeleteTask = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.deleteTask(projectId, task._id);

        // Emit socket event
        if (socket) {
          socket.emit('task_deleted', {
            projectId,
            taskId: task._id,
          });
        }

        toast.success('Task deleted');
      } catch (error) {
        toast.error('Failed to delete task');
      }
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-900 text-red-200 border border-red-700';
      case 'medium':
        return 'bg-yellow-900 text-yellow-200 border border-yellow-700';
      case 'low':
        return 'bg-green-900 text-green-200 border border-green-700';
      default:
        return 'bg-matte-blue-700 text-matte-blue-200 border border-matte-blue-600';
    }
  };

  return (
    <div className="bg-gradient-to-br from-matte-blue-600 to-dark-blue-700 rounded-lg p-4 shadow-md hover:shadow-xl transition border border-matte-blue-500 hover:border-accent-blue">
      <h3 className="font-semibold text-white mb-2">{task.title}</h3>

      {task.description && (
        <p className="text-sm text-matte-blue-200 mb-3 line-clamp-2">{task.description}</p>
      )}

      <div className="flex gap-2 mb-3 flex-wrap">
        <span className={`text-xs px-2 py-1 rounded font-semibold ${getPriorityColor(task.priority)}`}>
          {task.priority}
        </span>

        {task.dueDate && (
          <span className="text-xs bg-matte-blue-700 text-matte-blue-200 px-2 py-1 rounded border border-accent-cyan">
            {new Date(task.dueDate).toLocaleDateString()}
          </span>
        )}
      </div>

      {task.assignee && (
        <div className="text-xs text-matte-blue-300 mb-3">
          👤 {task.assignee.name}
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={handleDeleteTask}
          className="text-xs text-red-400 hover:text-red-300 underline transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;

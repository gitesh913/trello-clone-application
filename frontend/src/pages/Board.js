import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { projectService, taskService, activityService } from '../services/apiService';
import { useSocket } from '../hooks/useSocket';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import ActivityTimeline from '../components/ActivityTimeline';

const Board = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const socket = useSocket();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [showActivityTimeline, setShowActivityTimeline] = useState(false);

  useEffect(() => {
  fetchProjectData();
}, [fetchProjectData]);


  useEffect(() => {
    if (socket) {
      socket.emit('join_project', projectId);

      socket.on('task_created', (data) => {
        setTasks((prev) => [...prev, data.task]);
        toast.info('New task created');
      });

      socket.on('task_updated', (data) => {
        setTasks((prev) =>
          prev.map((task) => (task._id === data.task._id ? data.task : task))
        );
        toast.info('Task updated');
      });

      socket.on('task_moved', (data) => {
        setTasks((prev) =>
          prev.map((task) => (task._id === data.task._id ? data.task : task))
        );
        toast.info(`Task moved to ${data.toColumn}`);
      });

      socket.on('task_deleted', (data) => {
        setTasks((prev) => prev.filter((task) => task._id !== data.taskId));
        toast.info('Task deleted');
      });

      socket.on('activity_logged', (data) => {
        setActivities((prev) => [data.activity, ...prev]);
      });

      return () => {
        socket.emit('leave_project', projectId);
        socket.off('task_created');
        socket.off('task_updated');
        socket.off('task_moved');
        socket.off('task_deleted');
        socket.off('activity_logged');
      };
    }
  }, [socket, projectId]);

 const fetchProjectData = useCallback(async () => {
  try {
    const projectResponse = await projectService.getProjectById(projectId);
    setProject(projectResponse.data.project);

    const tasksResponse = await taskService.getTasks(projectId);
    setTasks(tasksResponse.data.tasks);

    const activitiesResponse = await activityService.getActivities(projectId);
    setActivities(activitiesResponse.data.activities);
  } catch (error) {
    toast.error('Failed to load project');
    navigate('/dashboard');
  } finally {
    setLoading(false);
  }
}, [projectId, navigate]);

  const handleDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    console.log('[Drag End] Source:', source, 'Destination:', destination, 'Task ID:', draggableId);

    // If dropped outside a droppable, do nothing
    if (!destination) {
      console.log('[Drag End] Dropped outside droppable area');
      return;
    }

    // If dropped in the same position, do nothing
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      console.log('[Drag End] Dropped in same position');
      return;
    }

    const task = tasks.find((t) => t._id === draggableId);
    if (!task) {
      console.log('[Drag End] Task not found:', draggableId);
      console.log('[Drag End] Available tasks:', tasks.map(t => ({ id: t._id, title: t.title })));
      toast.error('Task not found in list');
      return;
    }

    try {
      console.log('[Drag End] Sending move request:', {
        projectId,
        taskId: draggableId,
        columnId: destination.droppableId,
        position: destination.index,
      });

      console.log('[Drag End] Project columns:', project?.columns?.map(c => ({ id: c._id, name: c.name })));

      // Update task position on backend
      const response = await taskService.moveTask(
        projectId,
        draggableId,
        destination.droppableId,
        destination.index
      );

      console.log('[Drag End] Move successful, response:', response.data);

      // Emit socket event
      if (socket) {
        socket.emit('task_moved', {
          projectId,
          task,
          fromColumn: source.droppableId,
          toColumn: destination.droppableId,
        });
      }

      toast.success('Task moved successfully!');
      
      // Refresh data to ensure consistency
      setTimeout(() => {
        fetchProjectData();
      }, 300);
    } catch (error) {
      console.error('[Drag End] Error moving task:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to move task';
      toast.error(`Error: ${errorMessage}`);
      
      // Refresh to restore previous state
      fetchProjectData();
    }
  };

  const handleCreateTask = (columnId) => {
    setSelectedColumn(columnId);
    setShowTaskModal(true);
  };

  const handleTaskSubmit = async (taskData) => {
    try {
      const response = await taskService.createTask(projectId, {
        ...taskData,
        columnId: selectedColumn,
      });

      // Emit socket event
      if (socket) {
        socket.emit('task_created', {
          projectId,
          task: response.data.task,
        });
      }

      setShowTaskModal(false);
      toast.success('Task created');
      fetchProjectData();
    } catch (error) {
      toast.error('Failed to create task');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!project) {
    return <div className="flex items-center justify-center h-screen">Project not found</div>;
  }

  const groupedTasks = {};
  project.columns.forEach((column) => {
    groupedTasks[column._id] = tasks.filter((task) => task.column === column._id);
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-matte-blue-900 via-dark-blue-800 to-matte-blue-800">
      {/* Header */}
      <header className="border-b shadow-2xl border-matte-blue-600 bg-gradient-to-r from-matte-blue-800 to-dark-blue-800">
        <div className="flex items-center justify-between px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex-1">
            <button
              onClick={() => navigate('/dashboard')}
              className="mb-2 font-semibold transition text-accent-cyan hover:text-accent-blue"
            >
              ← Back to Dashboard
            </button>
            <h1 className="text-4xl font-bold text-white">{project.title}</h1>
            <p className="mt-1 text-matte-blue-300">{project.description}</p>
          </div>
          <button
            onClick={() => setShowActivityTimeline(true)}
            className="px-6 py-2 text-white transition rounded-lg bg-gradient-to-r from-accent-purple to-accent-blue hover:shadow-lg hover:shadow-accent-purple/50"
          >
            Activity Timeline
          </button>
        </div>
      </header>

      {/* Board */}
      <main className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-6 pb-6 overflow-x-auto">
            {project.columns && project.columns.length > 0 ? (
              project.columns.map((column) => (
                <Droppable key={column._id} droppableId={column._id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-shrink-0 w-80 rounded-lg p-4 transition-all duration-200 ${
                        snapshot.isDraggingOver
                          ? 'bg-gradient-to-br from-accent-blue/30 to-accent-cyan/30 border-2 border-accent-cyan shadow-lg shadow-accent-cyan/30'
                          : 'bg-gradient-to-br from-matte-blue-700 to-dark-blue-700 border border-matte-blue-600'
                      }`}
                    >
                      <h2 className="mb-4 text-lg font-bold text-white">{column.name}</h2>

                      <div className="space-y-3 min-h-96">
                        {groupedTasks[column._id] && groupedTasks[column._id].length > 0 ? (
                          groupedTasks[column._id].map((task, index) => (
                            <Draggable
                              key={task._id}
                              draggableId={task._id}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`transition-all duration-200 ${
                                    snapshot.isDragging
                                      ? 'rotate-3 shadow-2xl shadow-accent-blue/50 opacity-95'
                                      : 'shadow-md hover:shadow-lg'
                                  }`}
                                >
                                  <TaskCard task={task} projectId={projectId} />
                                </div>
                              )}
                            </Draggable>
                          ))
                        ) : (
                          <div className="py-8 text-center text-matte-blue-400">
                            <p className="text-sm">No tasks yet</p>
                          </div>
                        )}
                        {provided.placeholder}
                      </div>

                      <button
                        onClick={() => handleCreateTask(column._id)}
                        className="w-full py-2 mt-4 font-semibold text-white transition border-2 border-dashed rounded-lg bg-matte-blue-600 hover:bg-matte-blue-500 border-matte-blue-500 hover:border-accent-cyan"
                      >
                        + Add Task
                      </button>
                    </div>
                  )}
                </Droppable>
              ))
            ) : (
              <div className="text-center text-matte-blue-300">
                <p>Loading board...</p>
              </div>
            )}
          </div>
        </DragDropContext>
      </main>

      {/* Modals */}
      {showTaskModal && (
        <TaskModal
          onClose={() => setShowTaskModal(false)}
          onSubmit={handleTaskSubmit}
        />
      )}

      {showActivityTimeline && (
        <ActivityTimeline
          activities={activities}
          onClose={() => setShowActivityTimeline(false)}
        />
      )}
    </div>
  );
};

export default Board;

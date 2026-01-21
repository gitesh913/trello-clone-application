const Activity = require('../models/Activity');

const setupSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Join project room
    socket.on('join_project', (projectId) => {
      socket.join(`project_${projectId}`);
      console.log(`Socket ${socket.id} joined project_${projectId}`);
    });

    // Leave project room
    socket.on('leave_project', (projectId) => {
      socket.leave(`project_${projectId}`);
      console.log(`Socket ${socket.id} left project_${projectId}`);
    });

    // Task created
    socket.on('task_created', (data) => {
      io.to(`project_${data.projectId}`).emit('task_created', data);
    });

    // Task updated
    socket.on('task_updated', (data) => {
      io.to(`project_${data.projectId}`).emit('task_updated', data);
    });

    // Task moved
    socket.on('task_moved', (data) => {
      io.to(`project_${data.projectId}`).emit('task_moved', data);
    });

    // Task deleted
    socket.on('task_deleted', (data) => {
      io.to(`project_${data.projectId}`).emit('task_deleted', data);
    });

    // Comment added
    socket.on('comment_added', (data) => {
      io.to(`project_${data.projectId}`).emit('comment_added', data);
    });

    // Activity log update
    socket.on('activity_logged', (data) => {
      io.to(`project_${data.projectId}`).emit('activity_logged', data);
    });

    // Member joined
    socket.on('member_joined', (data) => {
      io.to(`project_${data.projectId}`).emit('member_joined', data);
    });

    // Member left
    socket.on('member_left', (data) => {
      io.to(`project_${data.projectId}`).emit('member_left', data);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};

module.exports = setupSocketHandlers;

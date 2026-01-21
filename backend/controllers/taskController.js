const Task = require('../models/Task');
const Project = require('../models/Project');
const Activity = require('../models/Activity');
const { mockDB, mockData, generateId } = require('../utils/mockData');
const { validationResult } = require('express-validator');

// Check if using mock data
const isMockMode = () => {
  try {
    const mongoose = require('mongoose');
    // readyState: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    // Return true (mock mode) if NOT connected (readyState !== 1)
    const isConnected = mongoose.connection.readyState === 1;
    return !isConnected;
  } catch {
    return true;
  }
};

exports.createTask = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { projectId } = req.params;
    const { title, description, priority, columnId, assignee, dueDate } = req.body;
    const userId = req.user.userId;

    console.log(`[createTask] Creating task in project ${projectId}, column ${columnId}`);

    if (isMockMode()) {
      // Verify project exists
      const project = mockDB.getProjectById(projectId);
      if (!project) {
        console.log(`[createTask] Project not found: ${projectId}`);
        return res.status(404).json({ message: 'Project not found' });
      }

      // Verify column exists
      const columnExists = project.columns?.some((c) => c._id === columnId);
      if (!columnExists) {
        console.log(`[createTask] Column not found: ${columnId}`);
        console.log(`[createTask] Available columns:`, project.columns?.map(c => c._id));
        return res.status(404).json({ message: 'Column not found' });
      }

      const task = mockDB.createTask({
        title,
        description,
        project: projectId,
        column: columnId,
        priority: priority || 'medium',
        assignee: assignee || null,
        position: mockDB.getTasksByProjectId(projectId).length,
        dueDate: dueDate || null,
      });

      console.log(`[createTask] Task created:`, task);

      mockDB.createActivity({
        project: projectId,
        user: userId,
        action: 'created_task',
        task: task._id,
        details: `Created task "${title}"`,
      });

      return res.status(201).json({
        message: 'Task created successfully',
        task,
      });
    }

    // Real MongoDB mode
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const isMember =
      project.owner.toString() === userId ||
      project.members.some((m) => m.user.toString() === userId);

    if (!isMember) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const maxPosition = await Task.findOne({ column: columnId }).sort({ position: -1 });
    const position = maxPosition ? maxPosition.position + 1 : 0;

    const task = new Task({
      title,
      description,
      project: projectId,
      column: columnId,
      priority,
      assignee: assignee || null,
      position,
      dueDate: dueDate || null,
    });

    await task.save();

    await Activity.create({
      project: projectId,
      user: userId,
      action: 'created_task',
      task: task._id,
      details: `Created task "${title}"`,
    });

    res.status(201).json({
      message: 'Task created successfully',
      task,
    });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.userId;

    if (isMockMode()) {
      const tasks = mockDB.getTasksByProjectId(projectId);
      return res.status(200).json({ tasks });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const isMember =
      project.owner.toString() === userId ||
      project.members.some((m) => m.user.toString() === userId);

    if (!isMember) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const tasks = await Task.find({ project: projectId })
      .populate('assignee', 'name email')
      .sort({ column: 1, position: 1 });

    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, description, priority, assignee, dueDate } = req.body;
    const userId = req.user.userId;

    if (isMockMode()) {
      const updatedTask = mockDB.updateTask(taskId, {
        title,
        description,
        priority,
        assignee,
        dueDate,
      });

      if (!updatedTask) {
        return res.status(404).json({ message: 'Task not found' });
      }

      return res.status(200).json({
        message: 'Task updated successfully',
        task: updatedTask,
      });
    }

    const task = await Task.findById(taskId).populate('project');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.priority = priority || task.priority;
    task.assignee = assignee || task.assignee;
    task.dueDate = dueDate || task.dueDate;

    await task.save();

    await Activity.create({
      project: task.project._id,
      user: userId,
      action: 'updated_task',
      task: task._id,
      details: `Updated task "${task.title}"`,
    });

    res.status(200).json({
      message: 'Task updated successfully',
      task,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.moveTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    let { columnId, position } = req.body;
    const userId = req.user.userId;

    console.log(`[moveTask] Moving task ${taskId} to column ${columnId} at position ${position}`);

    if (isMockMode()) {
      // Validate inputs
      if (!taskId || !columnId) {
        console.log(`[moveTask] Missing taskId or columnId`);
        return res.status(400).json({ message: 'Task ID and Column ID are required' });
      }

      // Find task
      const task = mockData.tasks[taskId];
      if (!task) {
        console.log(`[moveTask] Task not found in mock data: ${taskId}`);
        console.log(`[moveTask] Available tasks:`, Object.keys(mockData.tasks));
        return res.status(404).json({ message: 'Task not found' });
      }

      // Find project
      const project = mockDB.getProjectById(task.project);
      if (!project) {
        console.log(`[moveTask] Project not found: ${task.project}`);
        return res.status(404).json({ message: 'Project not found' });
      }

      // Verify column exists
      const targetColumn = project.columns?.find((c) => c._id === columnId);
      if (!targetColumn) {
        console.log(`[moveTask] Column not found: ${columnId}`);
        console.log(`[moveTask] Available columns:`, project.columns?.map(c => c._id));
        return res.status(404).json({ message: 'Target column not found' });
      }

      // Update task
      const fromColumn = task.column;
      task.column = columnId;
      task.position = position !== undefined ? position : 0;
      task.updatedAt = new Date();

      const fromColumnObj = project.columns?.find((c) => c._id === fromColumn);
      const fromColumnName = fromColumnObj?.name || 'Unknown';
      const toColumnName = targetColumn?.name || 'Unknown';

      console.log(`[moveTask] Task moved from ${fromColumnName} to ${toColumnName}`);

      // Log activity
      mockDB.createActivity({
        project: task.project,
        user: userId,
        action: 'moved_task',
        task: task._id,
        fromColumn: fromColumnName,
        toColumn: toColumnName,
        details: `Moved task from ${fromColumnName} to ${toColumnName}`,
      });

      return res.status(200).json({
        message: 'Task moved successfully',
        task,
      });
    }

    // MongoDB mode
    const task = await Task.findById(taskId).populate('project');

    if (!task) {
      console.log(`[moveTask] Task not found in MongoDB: ${taskId}`);
      return res.status(404).json({ message: 'Task not found' });
    }

    const project = task.project;
    if (!project) {
      console.log(`[moveTask] Project not found for task: ${taskId}`);
      return res.status(404).json({ message: 'Project not found' });
    }

    // Verify column exists in project
    const targetColumn = project.columns.find((c) => c._id.toString() === columnId.toString());
    if (!targetColumn) {
      console.log(`[moveTask] Column not found in project: ${columnId}`);
      return res.status(404).json({ message: 'Target column not found' });
    }

    const fromColumn = task.column.toString();
    const toColumn = columnId.toString();

    task.column = columnId;
    task.position = position !== undefined ? position : 0;

    await task.save();

    const fromColumnObj = project.columns.find((c) => c._id.toString() === fromColumn);
    const fromColumnName = fromColumnObj?.name || 'Unknown';
    const toColumnName = targetColumn?.name || 'Unknown';

    await Activity.create({
      project: task.project._id,
      user: userId,
      action: 'moved_task',
      task: task._id,
      fromColumn: fromColumnName,
      toColumn: toColumnName,
      details: `Moved task "${task.title}" from ${fromColumnName} to ${toColumnName}`,
    });

    console.log(`[moveTask] Successfully moved task in MongoDB`);

    res.status(200).json({
      message: 'Task moved successfully',
      task,
    });
  } catch (error) {
    console.error('[moveTask] Error moving task:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message,
      details: error.stack 
    });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.user.userId;

    if (isMockMode()) {
      mockDB.deleteTask(taskId);
      return res.status(200).json({
        message: 'Task deleted successfully',
      });
    }

    const task = await Task.findById(taskId).populate('project');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await Task.findByIdAndDelete(taskId);

    await Activity.create({
      project: task.project._id,
      user: userId,
      action: 'deleted_task',
      task: task._id,
      details: `Deleted task "${task.title}"`,
    });

    res.status(200).json({
      message: 'Task deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { text } = req.body;
    const userId = req.user.userId;

    if (isMockMode()) {
      const task = mockDB.mockData.tasks[taskId];
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }

      if (!task.comments) task.comments = [];
      task.comments.push({
        user: userId,
        text,
        createdAt: new Date(),
      });

      mockDB.createActivity({
        project: task.project,
        user: userId,
        action: 'added_comment',
        task: task._id,
        details: `Added comment to task`,
      });

      return res.status(200).json({
        message: 'Comment added successfully',
        task,
      });
    }

    const task = await Task.findById(taskId).populate('project');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.comments.push({
      user: userId,
      text,
      createdAt: new Date(),
    });

    await task.save();

    await Activity.create({
      project: task.project._id,
      user: userId,
      action: 'added_comment',
      task: task._id,
      details: `Added comment to task "${task.title}"`,
    });

    res.status(200).json({
      message: 'Comment added successfully',
      task,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

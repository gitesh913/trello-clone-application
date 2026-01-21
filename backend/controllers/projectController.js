const Project = require('../models/Project');
const Task = require('../models/Task');
const Activity = require('../models/Activity');
const { mockDB, generateId } = require('../utils/mockData');
const { validationResult } = require('express-validator');

// Check if using mock data
const isMockMode = () => {
  try {
    return !require('mongoose').connection.readyState;
  } catch {
    return true;
  }
};

exports.createProject = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description } = req.body;
    const userId = req.user.userId;

    if (isMockMode()) {
      // Mock mode - use in-memory storage
      const project = mockDB.createProject({
        title,
        description,
        owner: userId,
        members: [{ user: userId, role: 'admin' }],
        columns: [
          { _id: generateId(), name: 'To-Do', position: 1 },
          { _id: generateId(), name: 'In-Progress', position: 2 },
          { _id: generateId(), name: 'Done', position: 3 },
        ],
        isActive: true,
      });

      mockDB.createActivity({
        project: project._id,
        user: userId,
        action: 'created_project',
        details: `Created project "${title}"`,
      });

      return res.status(201).json({
        message: 'Project created successfully',
        project,
      });
    }

    // Real MongoDB mode
    const project = new Project({
      title,
      description,
      owner: userId,
      members: [{ user: userId, role: 'admin' }],
    });

    await project.save();

    await Activity.create({
      project: project._id,
      user: userId,
      action: 'created_project',
      details: `Created project "${title}"`,
    });

    res.status(201).json({
      message: 'Project created successfully',
      project,
    });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getProjects = async (req, res) => {
  try {
    const userId = req.user.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (isMockMode()) {
      const projects = mockDB.getProjectsByUserId(userId);
      const skip = (page - 1) * limit;
      const paginatedProjects = projects.slice(skip, skip + limit);

      return res.status(200).json({
        projects: paginatedProjects,
        pagination: {
          page,
          limit,
          total: projects.length,
          pages: Math.ceil(projects.length / limit),
        },
      });
    }

    const skip = (page - 1) * limit;

    const projects = await Project.find({
      $or: [{ owner: userId }, { 'members.user': userId }],
      isActive: true,
    })
      .populate('owner', 'name email')
      .populate('members.user', 'name email')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Project.countDocuments({
      $or: [{ owner: userId }, { 'members.user': userId }],
      isActive: true,
    });

    res.status(200).json({
      projects,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.userId;

    if (isMockMode()) {
      const project = mockDB.getProjectById(projectId);
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }

      return res.status(200).json({ project });
    }

    const project = await Project.findById(projectId)
      .populate('owner', 'name email')
      .populate('members.user', 'name email');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const isMember =
      project.owner._id.toString() === userId ||
      project.members.some((m) => m.user._id.toString() === userId);

    if (!isMember) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.status(200).json({ project });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description } = req.body;
    const userId = req.user.userId;

    if (isMockMode()) {
      const project = mockDB.getProjectById(projectId);
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }

      const updatedProject = mockDB.updateProject(projectId, {
        title: title || project.title,
        description: description || project.description,
      });

      mockDB.createActivity({
        project: projectId,
        user: userId,
        action: 'updated_project',
        details: `Updated project`,
      });

      return res.status(200).json({
        message: 'Project updated successfully',
        project: updatedProject,
      });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.owner.toString() !== userId) {
      return res.status(403).json({ message: 'Only owner can update project' });
    }

    project.title = title || project.title;
    project.description = description || project.description;

    await project.save();

    await Activity.create({
      project: projectId,
      user: userId,
      action: 'updated_project',
      details: `Updated project "${project.title}"`,
    });

    res.status(200).json({
      message: 'Project updated successfully',
      project,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.userId;

    if (isMockMode()) {
      const project = mockDB.getProjectById(projectId);
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }

      mockDB.deleteProject(projectId);

      return res.status(200).json({
        message: 'Project deleted successfully',
      });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.owner.toString() !== userId) {
      return res.status(403).json({ message: 'Only owner can delete project' });
    }

    project.isActive = false;
    await project.save();

    await Task.deleteMany({ project: projectId });

    res.status(200).json({
      message: 'Project deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.addMember = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { memberId } = req.body;
    const userId = req.user.userId;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.owner.toString() !== userId) {
      return res.status(403).json({ message: 'Only owner can add members' });
    }

    const memberExists = project.members.some((m) => m.user.toString() === memberId);
    if (memberExists) {
      return res.status(400).json({ message: 'Member already added' });
    }

    project.members.push({ user: memberId, role: 'member' });
    await project.save();

    await Activity.create({
      project: projectId,
      user: userId,
      action: 'added_member',
      details: `Added new member to project`,
    });

    res.status(200).json({
      message: 'Member added successfully',
      project,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.removeMember = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { memberId } = req.body;
    const userId = req.user.userId;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.owner.toString() !== userId) {
      return res.status(403).json({ message: 'Only owner can remove members' });
    }

    project.members = project.members.filter((m) => m.user.toString() !== memberId);
    await project.save();

    await Activity.create({
      project: projectId,
      user: userId,
      action: 'removed_member',
      details: `Removed member from project`,
    });

    res.status(200).json({
      message: 'Member removed successfully',
      project,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

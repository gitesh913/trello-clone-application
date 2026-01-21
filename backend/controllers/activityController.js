const Activity = require('../models/Activity');
const Project = require('../models/Project');
const { mockDB } = require('../utils/mockData');

// Check if using mock data
const isMockMode = () => {
  try {
    return !require('mongoose').connection.readyState;
  } catch {
    return true;
  }
};

exports.getActivities = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const skip = (page - 1) * limit;

    if (isMockMode()) {
      const activities = mockDB.getActivitiesByProjectId(projectId);
      const paginatedActivities = activities.slice(skip, skip + limit);

      return res.status(200).json({
        activities: paginatedActivities,
        pagination: {
          page,
          limit,
          total: activities.length,
          pages: Math.ceil(activities.length / limit),
        },
      });
    }

    // Verify user is member of project
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

    const activities = await Activity.find({ project: projectId })
      .populate('user', 'name email avatar')
      .populate('task', 'title')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Activity.countDocuments({ project: projectId });

    res.status(200).json({
      activities,
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

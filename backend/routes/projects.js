const express = require('express');
const { body, param } = require('express-validator');
const authMiddleware = require('../middleware/auth');
const handleValidationErrors = require('../middleware/validation');
const projectController = require('../controllers/projectController');

const router = express.Router();

router.post(
  '/',
  authMiddleware,
  [body('title').notEmpty().withMessage('Project title is required')],
  handleValidationErrors,
  projectController.createProject
);

router.get('/', authMiddleware, projectController.getProjects);

router.get('/:projectId', authMiddleware, projectController.getProjectById);

router.put(
  '/:projectId',
  authMiddleware,
  [body('title').optional().notEmpty()],
  handleValidationErrors,
  projectController.updateProject
);

router.delete('/:projectId', authMiddleware, projectController.deleteProject);

router.post('/:projectId/members', authMiddleware, projectController.addMember);

router.delete('/:projectId/members', authMiddleware, projectController.removeMember);

module.exports = router;

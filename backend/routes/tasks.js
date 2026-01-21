const express = require('express');
const { body } = require('express-validator');
const authMiddleware = require('../middleware/auth');
const handleValidationErrors = require('../middleware/validation');
const taskController = require('../controllers/taskController');

const router = express.Router({ mergeParams: true });

router.post(
  '/',
  authMiddleware,
  [body('title').notEmpty().withMessage('Task title is required'), body('columnId').notEmpty().withMessage('Column ID is required')],
  handleValidationErrors,
  taskController.createTask
);

router.get('/', authMiddleware, taskController.getTasks);

router.put(
  '/:taskId',
  authMiddleware,
  [body('title').optional().notEmpty()],
  handleValidationErrors,
  taskController.updateTask
);

router.put('/:taskId/move', authMiddleware, taskController.moveTask);

router.delete('/:taskId', authMiddleware, taskController.deleteTask);

router.post('/:taskId/comments', authMiddleware, [body('text').notEmpty().withMessage('Comment text is required')], handleValidationErrors, taskController.addComment);

module.exports = router;

const express = require('express');
const { body } = require('express-validator');
const authMiddleware = require('../middleware/auth');
const handleValidationErrors = require('../middleware/validation');
const authController = require('../controllers/authController');

const router = express.Router();

router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  handleValidationErrors,
  authController.register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  handleValidationErrors,
  authController.login
);

router.get('/profile', authMiddleware, authController.getProfile);

module.exports = router;

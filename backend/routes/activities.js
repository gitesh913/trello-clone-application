const express = require('express');
const authMiddleware = require('../middleware/auth');
const activityController = require('../controllers/activityController');

const router = express.Router({ mergeParams: true });

router.get('/', authMiddleware, activityController.getActivities);

module.exports = router;

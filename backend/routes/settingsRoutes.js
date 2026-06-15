const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Public read access for settings so Contact page and Product catalog can read them
router.get('/', settingsController.getSettings);

// Admin-only write access
router.put('/', verifyToken, isAdmin, settingsController.updateSettings);

module.exports = router;

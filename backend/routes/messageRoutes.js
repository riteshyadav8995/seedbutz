const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.post('/', messageController.createMessage);
router.get('/', verifyToken, isAdmin, messageController.getMessages);

module.exports = router;

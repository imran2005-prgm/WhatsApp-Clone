const router = require('express').Router();
const messageController = require('../controllers/messageController');

router.post('/', messageController.addMessage);
router.get('/:senderId/:receiverId', messageController.getMessages);

module.exports = router;

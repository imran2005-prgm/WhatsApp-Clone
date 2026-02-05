const router = require('express').Router();
const conversationController = require('../controllers/conversationController');

router.post('/', conversationController.createConversation);
router.get('/:userId', conversationController.getConversations);
router.put('/add-member', conversationController.addMember);
router.put('/make-admin', conversationController.makeAdmin);

module.exports = router;

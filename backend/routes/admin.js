const express = require('express');
const router = express.Router();
const {
  getStats,
  getAllUsersAdmin,
  getAllSwapsAdmin,
  getAllFeedbackAdmin,
  createMessage,
  getMessages,
  updateMessage,
  deleteMessage,
  getReports
} = require('../controllers/adminController');

const { protect } = require('../middleware/authMiddleware');

// All routes protected
router.use(protect);

router.get('/stats', getStats);
router.get('/users', getAllUsersAdmin);
router.get('/swaps', getAllSwapsAdmin);
router.get('/feedback', getAllFeedbackAdmin);

router.post('/messages', createMessage);
router.get('/messages', getMessages);
router.put('/messages/:id', updateMessage);
router.delete('/messages/:id', deleteMessage);

router.get('/reports', getReports);

module.exports = router;

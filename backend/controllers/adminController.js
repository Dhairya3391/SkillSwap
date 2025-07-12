const User = require('../models/User');
const Swap = require('../models/SwapRequest');
const Feedback = require('../models/Feedback');
const AdminMessage = require('../models/AdminMessage');

// Middleware check
const isAdmin = (user) => user?.isAdmin;

// GET /api/admin/stats
exports.getStats = async (req, res) => {
  if (!isAdmin(req.user)) return res.sendStatus(403);
  const totalUsers = await User.countDocuments();
  const totalSwaps = await Swap.countDocuments();
  const totalFeedback = await Feedback.countDocuments();
  res.json({ totalUsers, totalSwaps, totalFeedback });
};

// GET /api/admin/users
exports.getAllUsersAdmin = async (req, res) => {
  if (!isAdmin(req.user)) return res.sendStatus(403);
  const users = await User.find().select('-password');
  res.json(users);
};

// GET /api/admin/swaps
exports.getAllSwapsAdmin = async (req, res) => {
  if (!isAdmin(req.user)) return res.sendStatus(403);
  const swaps = await Swap.find().populate('fromUserId toUserId');
  res.json(swaps);
};

// GET /api/admin/feedback
exports.getAllFeedbackAdmin = async (req, res) => {
  if (!isAdmin(req.user)) return res.sendStatus(403);
  const feedbacks = await Feedback.find().populate('fromUserId toUserId');
  res.json(feedbacks);
};

// CRUD for Admin Messages
exports.createMessage = async (req, res) => {
  if (!isAdmin(req.user)) return res.sendStatus(403);
  const msg = await AdminMessage.create(req.body);
  res.status(201).json(msg);
};

exports.getMessages = async (req, res) => {
  const messages = await AdminMessage.find({ isActive: true }).sort({ createdAt: -1 });
  res.json(messages);
};

exports.updateMessage = async (req, res) => {
  if (!isAdmin(req.user)) return res.sendStatus(403);
  const msg = await AdminMessage.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!msg) return res.sendStatus(404);
  res.json(msg);
};

exports.deleteMessage = async (req, res) => {
  if (!isAdmin(req.user)) return res.sendStatus(403);
  await AdminMessage.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted successfully' });
};

// GET /api/admin/reports
exports.getReports = async (req, res) => {
  if (!isAdmin(req.user)) return res.sendStatus(403);

  const users = await User.find().select('-password');
  const swaps = await Swap.find().populate('fromUserId toUserId');
  const feedbacks = await Feedback.find().populate('fromUserId toUserId');

  res.json({
    users,
    swaps,
    feedbacks
  });
};

const User = require('../models/User');

// GET /api/users - Get all users (with optional filters)
exports.getAllUsers = async (req, res) => {
  try {
    const { skill, location } = req.query;
    let filter = {};

    if (skill) filter.skillsOffered = { $regex: skill, $options: 'i' };
    if (location) filter.location = { $regex: location, $options: 'i' };

    const users = await User.find(filter).select('-password');
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/users/:id - Get single user
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/users/:id - Update profile (owner or admin)
exports.updateUser = async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/users/:id - Delete account (admin or owner)
exports.deleteUser = async (req, res) => {
  try {

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/users/:id/ban - Admin bans user
exports.banUser = async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: 'Admin only' });

  const user = await User.findByIdAndUpdate(req.params.id, { isBanned: true }, { new: true });
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ message: 'User banned', user });
};

// POST /api/users/:id/unban - Admin unbans user
exports.unbanUser = async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: 'Admin only' });

  const user = await User.findByIdAndUpdate(req.params.id, { isBanned: false }, { new: true });
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ message: 'User unbanned', user });
};

// GET /api/users/search?skill=&location= - Search API
exports.searchUsers = async (req, res) => {
  const { skill, location } = req.query;
  const filter = {};

  if (skill) filter.skillsOffered = { $regex: skill, $options: 'i' };
  if (location) filter.location = { $regex: location, $options: 'i' };

  const users = await User.find(filter).select('-password');
  res.json(users);
};

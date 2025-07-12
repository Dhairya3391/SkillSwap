const SwapRequest = require('../models/SwapRequest');

// Create Swap
exports.createSwap = async (req, res) => {
  const { toUserId, skillOffered, skillWanted, message } = req.body;
  const swap = await SwapRequest.create({
    fromUserId: req.user._id,
    toUserId,
    skillOffered,
    skillWanted,
    message
  });
  res.status(201).json(swap);
};

// Get All Swaps (Admin or user-specific)
exports.getAllSwaps = async (req, res) => {
  const filter = req.user.isAdmin ? {} : {
    $or: [{ fromUserId: req.user._id }, { toUserId: req.user._id }]
  };
  const swaps = await SwapRequest.find(filter)
    .populate('fromUserId', 'name email')
    .populate('toUserId', 'name email');
  res.json(swaps);
};

// Get Swap by ID
exports.getSwapById = async (req, res) => {
  const swap = await SwapRequest.findById(req.params.id)
    .populate('fromUserId', 'name email')
    .populate('toUserId', 'name email');
  if (!swap) return res.status(404).json({ message: 'Swap not found' });
  if (!req.user.isAdmin && ![swap.fromUserId._id, swap.toUserId._id].includes(req.user._id.toString())) {
    return res.status(403).json({ message: 'Unauthorized' });
  }
  res.json(swap);
};

// Update Swap Status
exports.updateSwapStatus = async (req, res) => {
  const swap = await SwapRequest.findById(req.params.id);
  if (!swap) return res.status(404).json({ message: 'Swap not found' });

  if (swap.toUserId.toString() !== req.user._id.toString() && !req.user.isAdmin) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  swap.status = req.body.status;
  await swap.save();
  res.json(swap);
};

// Delete/Cancel Swap
exports.deleteSwap = async (req, res) => {
  const swap = await SwapRequest.findById(req.params.id);
  if (!swap) return res.status(404).json({ message: 'Swap not found' });

  if (
    swap.fromUserId.toString() !== req.user._id.toString() &&
    swap.toUserId.toString() !== req.user._id.toString() &&
    !req.user.isAdmin
  ) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  await swap.deleteOne();
  res.json({ message: 'Swap request deleted' });
};

// Get Sent Requests
exports.getSentSwaps = async (req, res) => {
  const swaps = await SwapRequest.find({ fromUserId: req.user._id })
    .populate('toUserId', 'name email');
  res.json(swaps);
};

// Get Received Requests
exports.getReceivedSwaps = async (req, res) => {
  const swaps = await SwapRequest.find({ toUserId: req.user._id })
    .populate('fromUserId', 'name email');
  res.json(swaps);
};

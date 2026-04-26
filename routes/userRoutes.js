import express from 'express';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// @desc    Fetch all users
// @route   GET /api/users
// @access  Private/Admin
router.route('/').get(protect, admin, asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password');
  res.json(users);
}));

router.route('/:id').put(protect, admin, asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.username = req.body.username ?? user.username;
  user.email = req.body.email ?? user.email;
  user.phone = req.body.phone ?? user.phone;
  user.tags = req.body.tags ?? user.tags;
  user.notes = req.body.notes ?? user.notes;
  user.subscribedEmail = req.body.subscribedEmail ?? user.subscribedEmail;
  user.subscribedSms = req.body.subscribedSms ?? user.subscribedSms;

  const updatedUser = await user.save();
  const userObject = updatedUser.toObject();
  delete userObject.password;
  res.json(userObject);
}));

export default router;

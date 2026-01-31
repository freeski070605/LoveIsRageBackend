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

export default router;

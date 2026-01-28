import express from 'express';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post(
  '/register',
  asyncHandler(async (req, res, next) => {
      const { username, email, password } = req.body;
  
      const userExists = await User.findOne({ email });
  
      if (userExists) {
        res.status(400);
        throw new Error('User already exists');
      }
  
      try {
        const user = await User.create({
          username,
          email,
          password,
        });
  
        if (user) {
          res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
          });
        } else {
          res.status(400);
          throw new Error('Invalid user data provided during registration');
        }
      } catch (error) {
        res.status(400);
        // Check for Mongoose validation errors
        if (error.name === 'ValidationError') {
          const messages = Object.values(error.errors).map((val) => val.message);
          return next(new Error(`Validation Error: ${messages.join(', ')}`));
        } else {
          return next(error);
        }
      }
    })
);

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  })
);

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
};

export default router;

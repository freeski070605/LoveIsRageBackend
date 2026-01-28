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
      console.log('Backend: Register route hit.');
      console.log('Backend: Request body:', req.body);
      const { username, email, password } = req.body;
  
      const userExists = await User.findOne({ email });
      console.log('Backend: User exists check result:', userExists);
  
      if (userExists) {
        res.status(400);
        console.log('Backend: User already exists. Throwing error.');
        throw new Error('User already exists');
      }
  
      try {
        const user = await User.create({
          username,
          email,
          password,
        });
  
        if (user) {
          console.log('Backend: User created successfully.', user);
          res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
          });
        } else {
          res.status(400);
          console.log('Backend: Invalid user data. Throwing error.');
          throw new Error('Invalid user data provided during registration');
        }
      } catch (error) {
        console.log('Backend: Caught error in registration:', error.message, error.stack);
        res.status(400);
        // Check for Mongoose validation errors
        if (error.name === 'ValidationError') {
          const messages = Object.values(error.errors).map((val) => val.message);
          console.log('Backend: Validation Error messages:', messages);
          console.log("Type of next (ValidationError):", typeof next, next);
          return next(new Error(`Validation Error: ${messages.join(', ')}`));
        } else {
          console.log('Backend: Generic Error message:', error.message);
          console.log("Type of next (Generic Error):", typeof next, next);
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

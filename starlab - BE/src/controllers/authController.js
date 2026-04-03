import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import nacl from 'tweetnacl';
import bs58 from 'bs58';

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// @desc    Register a new user
// @route   POST /auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'An account with this email already exists.',
      });
    }

    // Create user (password hashed via pre-save hook)
    const user = await User.create({ name, email, password });

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error. Please try again.',
    });
  }
};

// @desc    Login user
// @route   POST /auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user with password field included
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password.',
      });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password.',
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error. Please try again.',
    });
  }
};

// @desc    Wallet login / signup
// @route   POST /auth/wallet-login
// @access  Public
const walletLogin = async (req, res) => {
  try {
    const { publicKey, signature, message } = req.body;

    if (!publicKey || !signature || !message) {
      return res.status(400).json({
        success: false,
        error: 'Please provide publicKey, signature, and message.',
      });
    }

    // Verify the signature
    const signatureUint8 = bs58.decode(signature);
    const messageUint8 = new TextEncoder().encode(message);
    const pubKeyUint8 = bs58.decode(publicKey);

    const isVerified = nacl.sign.detached.verify(messageUint8, signatureUint8, pubKeyUint8);

    if (!isVerified) {
      return res.status(401).json({
        success: false,
        error: 'Invalid wallet signature.',
      });
    }

    // Find user by wallet address
    let user = await User.findOne({ walletAddress: publicKey });

    // If user does not exist, create a new one (as an investor)
    if (!user) {
      user = await User.create({
        walletAddress: publicKey,
        // Optional Fields: We leave name, email, password undefined.
        // The conditionally required logic in User.js handles it.
        tokensOwned: 0,
        totalInvested: 0,
        fanTokenBalance: 0,
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: 'Wallet login successful.',
      token,
      user: {
        id: user._id,
        walletAddress: user.walletAddress,
        role: user.role,
        tokensOwned: user.tokensOwned,
        totalInvested: user.totalInvested,
        fanTokenBalance: user.fanTokenBalance,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Wallet Login error:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error. Please try again.',
    });
  }
};

export { register, login, walletLogin };

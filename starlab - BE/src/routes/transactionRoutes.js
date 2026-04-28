import express from 'express';
import {
  createTransaction,
  getUserTransactions,
  getUserStats,
  getAllTransactions,
  getStatistics,
  getTopInvestors
} from '../controllers/transactionController.js';

const router = express.Router();

import rateLimit from 'express-rate-limit';

const transactionLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 requests per minute
  message: { success: false, error: 'Too many requests from this IP, please try again after a minute' }
});

// Create a new transaction
router.post('/transactions', transactionLimiter, createTransaction);

// Get all transactions (admin/public view)
router.get('/transactions', getAllTransactions);

// Get overall statistics
router.get('/statistics', getStatistics);

// Get top investors
router.get('/top-investors', getTopInvestors);

// Get transactions for a specific user by public key (Alias)
router.get('/transactions/:publicKey', getUserTransactions);

// Get transactions for a specific user by public key
router.get('/users/:publicKey/transactions', getUserTransactions);

// Get user stats (total invested, tokens, etc.)
router.get('/users/:publicKey/stats', getUserStats);

export default router;

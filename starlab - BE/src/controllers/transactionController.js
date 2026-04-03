import Transaction from '../models/Transaction.js';
import User from '../models/User.js';
import { Connection } from '@solana/web3.js';

const connection = new Connection(process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com', 'confirmed');

export const createTransaction = async (req, res) => {
  try {
    const { publicKey, transactionHash, paymentCurrency, amountPaid, tokensReceived, exchangeRate } = req.body;

    // Validate required fields
    if (!publicKey || !transactionHash || !paymentCurrency || !amountPaid || !tokensReceived || !exchangeRate) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    // Verify transaction hash on Solana RPC
    try {
      const tx = await connection.getTransaction(transactionHash, { maxSupportedTransactionVersion: 0 });
      if (!tx) {
        return res.status(400).json({
          success: false,
          error: 'Transaction not found on Solana network'
        });
      }
    } catch (rpcError) {
      console.error('RPC Error checking transaction:', rpcError);
      return res.status(400).json({
        success: false,
        error: 'Error verifying transaction on Solana network'
      });
    }

    // Check if transaction already exists
    const existingTx = await Transaction.findOne({ transactionHash });
    if (existingTx) {
      return res.status(409).json({
        success: false,
        error: 'Transaction already recorded'
      });
    }

    // Find or create user
    let user = await User.findOne({ walletAddress: publicKey });
    if (!user) {
      user = await User.create({
        walletAddress: publicKey,
        tokensOwned: 0,
        totalInvested: 0,
        fanTokenBalance: 0
      });
    }

    // Create transaction
    const transaction = await Transaction.create({
      user: user._id,
      transactionHash,
      paymentCurrency,
      amountPaid,
      tokensReceived,
      exchangeRate,
      status: 'completed'
    });

    // Update user investment totals
    user.investorTransactions.push(transaction._id);
    user.tokensOwned += Number(tokensReceived);
    if (paymentCurrency === 'SOL' || paymentCurrency === 'USDT' || paymentCurrency === 'USDC') {
      user.totalInvested += Number(amountPaid); 
    }
    await user.save();

    res.status(201).json({
      success: true,
      data: transaction
    });
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create transaction'
    });
  }
};

export const getUserTransactions = async (req, res) => {
  try {
    const { publicKey } = req.params;
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;

    const user = await User.findOne({ walletAddress: publicKey });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const transactions = await Transaction.find({ user: user._id })
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit);
    
    const count = await Transaction.countDocuments({ user: user._id });

    res.json({
      success: true,
      data: {
        publicKey: user.walletAddress,
        transactions,
        count
      }
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch transactions'
    });
  }
};

export const getUserStats = async (req, res) => {
  try {
    const { publicKey } = req.params;

    const user = await User.findOne({ walletAddress: publicKey });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        tokensOwned: user.tokensOwned,
        totalInvested: user.totalInvested,
        fanTokenBalance: user.fanTokenBalance
      }
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user stats'
    });
  }
};

export const getAllTransactions = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;

    const transactions = await Transaction.find()
      .populate('user', 'walletAddress name email')
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit);

    const count = await Transaction.countDocuments();

    res.json({
      success: true,
      data: {
        transactions,
        count
      }
    });
  } catch (error) {
    console.error('Error fetching all transactions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch transactions'
    });
  }
};

export const getStatistics = async (req, res) => {
  try {
    const statsResult = await Transaction.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: null,
          total_transactions: { $sum: 1 },
          total_sol_raised: {
            $sum: { $cond: [{ $eq: ['$paymentCurrency', 'SOL'] }, '$amountPaid', 0] }
          },
          total_usdt_raised: {
            $sum: { $cond: [{ $eq: ['$paymentCurrency', 'USDT'] }, '$amountPaid', 0] }
          },
          total_tokens_sold: { $sum: '$tokensReceived' },
          unique_investors: { $addToSet: '$user' }
        }
      }
    ]);

    let stats = {
      total_transactions: 0,
      total_sol_raised: 0,
      total_usdt_raised: 0,
      total_tokens_sold: 0,
      unique_investors: 0
    };

    if (statsResult.length > 0) {
      stats = statsResult[0];
      stats.unique_investors = stats.unique_investors.length;
      delete stats._id;
    }

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics'
    });
  }
};

export const getTopInvestors = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const topInvestors = await User.find({ walletAddress: { $exists: true, $ne: null } })
      .sort({ tokensOwned: -1 })
      .limit(limit)
      .select('walletAddress tokensOwned totalInvested');

    res.json({
      success: true,
      data: topInvestors
    });
  } catch (error) {
    console.error('Error fetching top investors:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch top investors'
    });
  }
};

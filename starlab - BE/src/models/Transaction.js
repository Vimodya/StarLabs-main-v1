import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    transactionHash: {
      type: String,
      required: [true, 'Transaction hash is required'],
      unique: true,
    },
    paymentCurrency: {
      type: String,
      enum: ['SOL', 'USDT', 'USDC'],
      required: [true, 'Payment currency is required'],
    },
    amountPaid: {
      type: Number,
      required: [true, 'Amount paid is required'],
      min: 0,
    },
    tokensReceived: {
      type: Number,
      required: [true, 'Tokens received is required'],
      min: 0,
    },
    exchangeRate: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'completed',
    },
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;

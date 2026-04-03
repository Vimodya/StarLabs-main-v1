import mongoose from 'mongoose';

const payoutSchema = new mongoose.Schema(
  {
    investor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: 'USDT',
    },
    relatedProduct: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
    },
    transactionHash: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Payout = mongoose.model('Payout', payoutSchema);
export default Payout;

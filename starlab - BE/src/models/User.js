import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: function() { return !this.walletAddress; },
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: function() { return !this.walletAddress; },
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: function() { return !this.walletAddress; },
      minlength: 6,
      select: false, // never return password in queries by default
    },
    profilePicture: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      maxlength: 500,
      default: '',
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    followedCelebrities: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Celebrity',
      },
    ],
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
      },
    ],
    notifiedProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
    walletAddress: {
      type: String,
      unique: true,
      sparse: true,
    },
    tokensOwned: {
      type: Number,
      default: 0,
    },
    totalInvested: {
      type: Number,
      default: 0,
    },
    fanTokenBalance: {
      type: Number,
      default: 0,
    },
    investorTransactions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;

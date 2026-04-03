import mongoose from 'mongoose';

const celebritySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Celebrity name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Beauty', 'Fashion', 'Fitness', 'Lifestyle', 'Entertainment', 'Music', 'Sports', 'Other'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    bio: {
      type: String,
      maxlength: 1000,
      default: '',
    },
    profilePicture: {
      type: String,
      default: '',
    },
    coverImage: {
      type: String,
      default: '',
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    followerCount: {
      type: Number,
      default: 0,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
    socialLinks: {
      instagram: { type: String, default: '' },
      twitter: { type: String, default: '' },
      youtube: { type: String, default: '' },
      tiktok: { type: String, default: '' },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Celebrity = mongoose.model('Celebrity', celebritySchema);
export default Celebrity;

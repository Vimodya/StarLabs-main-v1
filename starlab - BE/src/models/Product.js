import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: 2000,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    images: [
      {
        type: String,
      },
    ],
    category: {
      type: String,
      required: [true, 'Category is required'],
    },
    celebrity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Celebrity',
      required: true,
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    tags: [
      {
        type: String,
        lowercase: true,
        trim: true,
      },
    ],
    ratings: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0 },
    },
    totalRevenue: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);
export default Product;

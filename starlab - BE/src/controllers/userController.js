import mongoose from 'mongoose';
import User from '../models/User.js';
import Celebrity from '../models/Celebrity.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

// @desc    Get current user's profile
// @route   GET /user/profile
// @access  Protected
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('followedCelebrities', 'name category profilePicture isVerified followerCount slug')
      .populate('notifiedProducts', 'name price images category isAvailable stock currency')
      .populate({
        path: 'orders',
        populate: {
          path: 'items.product',
          model: 'Product',
          select: 'name images price currency category'
        },
        options: { sort: { createdAt: -1 } },
      });

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found.' });
    }

    // Extract buy product list from orders
    const buyProductList = [];
    const seenProducts = new Set();

    user.orders.forEach(order => {
      // Only include products from paid or delivered orders if preferred, 
      // but usually buy list includes anything already ordered.
      order.items.forEach(item => {
        if (item.product && !seenProducts.has(item.product._id.toString())) {
          seenProducts.add(item.product._id.toString());
          buyProductList.push(item.product);
        }
      });
    });

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        profilePicture: user.profilePicture,
        role: user.role,
        followedCelebrityList: user.followedCelebrities,
        buyProductList: buyProductList,
        notifiedProductList: user.notifiedProducts,
        orders: user.orders,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({ success: false, error: 'Server error.' });
  }
};

// @desc    Follow or unfollow a celebrity
// @route   POST /user/follow
// @access  Protected
const followCelebrity = async (req, res) => {
  try {
    const { celebrityId } = req.body;
    const userId = req.user._id;

    const isId = mongoose.Types.ObjectId.isValid(celebrityId);
    let celebrity;

    if (isId) {
      celebrity = await Celebrity.findById(celebrityId);
    } else {
      celebrity = await Celebrity.findOne({ slug: celebrityId.toLowerCase() });
    }

    if (!celebrity) {
      return res.status(404).json({ success: false, error: 'Celebrity not found' });
    }

    const actualId = celebrity._id;
    const user = await User.findById(userId);
    const alreadyFollowing = user.followedCelebrities.includes(actualId);

    if (alreadyFollowing) {
      // Unfollow
      await User.findByIdAndUpdate(userId, {
        $pull: { followedCelebrities: actualId },
      });
      await Celebrity.findByIdAndUpdate(actualId, {
        $pull: { followers: userId },
        $inc: { followerCount: -1 },
      });

      return res.status(200).json({
        success: true,
        message: `You unfollowed ${celebrity.name}.`,
        following: false,
      });
    } else {
      // Follow
      await User.findByIdAndUpdate(userId, {
        $addToSet: { followedCelebrities: actualId },
        $inc: { fanTokenBalance: 5 }, // Reward 5 fan tokens for following
      });
      await Celebrity.findByIdAndUpdate(actualId, {
        $addToSet: { followers: userId },
        $inc: { followerCount: 1 },
      });

      return res.status(200).json({
        success: true,
        message: `You are now following ${celebrity.name}. Earned 5 FAN tokens!`,
        following: true,
      });
    }
  } catch (error) {
    console.error('Follow error:', error);
    return res.status(500).json({ success: false, error: 'Server error.' });
  }
};

// @desc    Notify me for a product
// @route   POST /user/notify
// @access  Protected
const notifyProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, error: 'Invalid product ID' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    const user = await User.findById(userId);
    const alreadyNotified = user.notifiedProducts.includes(productId);

    if (alreadyNotified) {
      // Remove notification
      await User.findByIdAndUpdate(userId, {
        $pull: { notifiedProducts: productId },
      });

      return res.status(200).json({
        success: true,
        message: `Notification removed for ${product.name}.`,
        notified: false,
      });
    } else {
      // Add notification
      await User.findByIdAndUpdate(userId, {
        $addToSet: { notifiedProducts: productId },
      });

      return res.status(200).json({
        success: true,
        message: `You will be notified for ${product.name}.`,
        notified: true,
      });
    }
  } catch (error) {
    console.error('Notify error:', error);
    return res.status(500).json({ success: false, error: 'Server error.' });
  }
};

export { getProfile, followCelebrity, notifyProduct };

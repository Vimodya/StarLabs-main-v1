import Order from '../models/Order.js';
import User from '../models/User.js';
import Product from '../models/Product.js';

// @desc    Create a new order
// @route   POST /order/create
// @access  Protected
const createOrder = async (req, res) => {
  try {
    const { items, totalAmount, paymentMethod, shippingAddress, notes } = req.body;
    const userId = req.user._id;

    // Create order
    const order = await Order.create({
      user: userId,
      items,
      totalAmount,
      paymentMethod: paymentMethod || 'card',
      shippingAddress: shippingAddress || {},
      notes: notes || '',
    });

    // Calculate fan tokens reward (10 tokens for each dollar/unit)
    const fanTokensEarned = Math.floor(totalAmount * 10);

    // Push order reference to user and add fan tokens
    await User.findByIdAndUpdate(userId, {
      $push: { orders: order._id },
      $inc: { fanTokenBalance: fanTokensEarned },
    });

    // Update Product revenue
    for (const item of items) {
      if (item.product) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { totalRevenue: item.price * item.quantity },
        });
      }
    }

    // Populate product refs for the response
    const populatedOrder = await Order.findById(order._id).populate(
      'items.product',
      'name price images'
    );

    return res.status(201).json({
      success: true,
      message: 'Order placed successfully.',
      order: populatedOrder,
      fanTokensEarned,
      // Optional Stripe mock payload for frontend
      clientSecret: paymentMethod === 'card' ? 'mock_stripe_client_secret' : null,
    });
  } catch (error) {
    console.error('Create order error:', error);
    return res.status(500).json({ success: false, error: 'Server error.' });
  }
};

// @desc    Get all orders for current user
// @route   GET /order/my-orders
// @access  Protected
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('items.product', 'name price images');

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error('Get orders error:', error);
    return res.status(500).json({ success: false, error: 'Server error.' });
  }
};

// @desc    Get a single order by ID
// @route   GET /order/:id
// @access  Protected
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      'items.product',
      'name price images'
    );

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found.' });
    }

    // Ensure user owns this order
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: 'Not authorized.' });
    }

    return res.status(200).json({ success: true, order });
  } catch (error) {
    console.error('Get order error:', error);
    return res.status(500).json({ success: false, error: 'Server error.' });
  }
};

export { createOrder, getMyOrders, getOrderById };

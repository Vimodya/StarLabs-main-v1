import Celebrity from '../models/Celebrity.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import { sendBulkNotification } from '../utils/emailService.js';

// @desc    Create a celebrity
// @route   POST /api/admin/celebrity
export const createCelebrity = async (req, res) => {
  try {
    const celebrity = await Celebrity.create(req.body);
    res.status(201).json({ success: true, data: celebrity });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update a celebrity
// @route   PUT /api/admin/celebrity/:id
export const updateCelebrity = async (req, res) => {
  try {
    const celebrity = await Celebrity.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!celebrity) return res.status(404).json({ success: false, error: 'Not found' });
    res.status(200).json({ success: true, data: celebrity });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/admin/product
export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update an order status
// @route   PUT /api/admin/order/:id/status
export const updateOrderStatus = async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id, 
      { status, paymentStatus }, 
      { new: true, runValidators: true }
    );
    if (!order) return res.status(404).json({ success: false, error: 'Not found' });
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get system settings / ICO params
// @route   GET /api/admin/settings
export const getSettings = async (req, res) => {
  // In a real app this would query a Settings collection. 
  // Returning mocked ICO parameters for now based on env.
  res.status(200).json({
    success: true,
    data: {
      tokenRate: process.env.TOKEN_RATE || 2000,
      minPurchase: process.env.MIN_PURCHASE || 10,
      totalRaised: 154000,
      icoStatus: 'active'
    }
  });
};

// @desc    Trigger notifications for a product launch
// @route   POST /api/admin/product/:id/notify
export const triggerNotification = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, error: 'Product not found' });

    // Find all users who asked to be notified about this product and have an email
    const users = await User.find({ notifiedProducts: product._id, email: { $exists: true, $ne: null } });
    if (users.length === 0) {
      return res.status(200).json({ success: true, message: 'No users found to notify.' });
    }

    const emails = users.map(user => user.email);
    const subject = `🚀 ${product.name} is now available on StarLabs!`;
    const htmlBody = `
      <h1>Great news!</h1>
      <p>The product <strong>${product.name}</strong> you expressed interest in is now available.</p>
      <p>Hurry and grab yours before stock runs out!</p>
    `;

    const sent = await sendBulkNotification(emails, subject, htmlBody);
    if (sent) {
      res.status(200).json({ success: true, message: `Emails sent to ${emails.length} users.` });
    } else {
      res.status(500).json({ success: false, error: 'Failed to send some or all emails.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

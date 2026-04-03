import express from 'express';
import {
  createCelebrity,
  updateCelebrity,
  createProduct,
  updateOrderStatus,
  getSettings,
  triggerNotification
} from '../controllers/adminController.js';

const router = express.Router();

// Note: In a real app we'd add an admin protect middleware here:
// router.use(protect, adminOnly);

router.route('/celebrity')
  .post(createCelebrity);

router.route('/celebrity/:id')
  .put(updateCelebrity);

router.route('/product')
  .post(createProduct);

router.route('/order/:id/status')
  .put(updateOrderStatus);

router.route('/settings')
  .get(getSettings);

router.route('/product/:id/notify')
  .post(triggerNotification);

export default router;

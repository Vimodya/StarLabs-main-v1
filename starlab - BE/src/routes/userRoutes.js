import express from 'express';
import { getProfile, followCelebrity, notifyProduct } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { validate, followSchema, notifySchema } from '../middleware/validation.js';

const router = express.Router();

// GET /user/profile  — protected
router.get('/profile', protect, getProfile);

// POST /user/follow  — protected
router.post('/follow', protect, validate(followSchema), followCelebrity);

// POST /user/notify  — protected
router.post('/notify', protect, validate(notifySchema), notifyProduct);

export default router;

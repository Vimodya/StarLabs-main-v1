import express from 'express';
import { register, login, walletLogin } from '../controllers/authController.js';
import { validate, registerSchema, loginSchema } from '../middleware/validation.js';

const router = express.Router();

// POST /auth/register
router.post('/register', validate(registerSchema), register);

// POST /auth/login
router.post('/login', validate(loginSchema), login);

// POST /auth/wallet-login
router.post('/wallet-login', walletLogin);

export default router;

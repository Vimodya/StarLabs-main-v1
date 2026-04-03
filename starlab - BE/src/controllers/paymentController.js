import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mockkey');

// @desc    Create Stripe Payment Intent
// @route   POST /api/payment/create-intent
export const createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency = 'usd' } = req.body;
    
    // In production we calculate the exact amount on backend based on products!
    // But for simplicity of this demo...
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe uses cents
      currency,
      automatic_payment_methods: { enabled: true },
    });

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Stripe Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

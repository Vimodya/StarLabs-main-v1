import Joi from 'joi';

// Generic validation middleware factory
const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const messages = error.details.map((d) => d.message);
    return res.status(400).json({ success: false, error: messages });
  }
  next();
};

// Validation schemas
const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const followSchema = Joi.object({
  celebrityId: Joi.string().required(),
});

const notifySchema = Joi.object({
  productId: Joi.string().required(),
});

const orderSchema = Joi.object({
  items: Joi.array()
    .items(
      Joi.object({
        product: Joi.string().required(),
        name: Joi.string().required(),
        price: Joi.number().min(0).required(),
        quantity: Joi.number().integer().min(1).required(),
      })
    )
    .min(1)
    .required(),
  totalAmount: Joi.number().min(0).required(),
  paymentMethod: Joi.string()
    .valid('card', 'crypto', 'paypal', 'bank_transfer')
    .default('card'),
  shippingAddress: Joi.object({
    fullName: Joi.string().allow(''),
    addressLine1: Joi.string().allow(''),
    addressLine2: Joi.string().allow(''),
    city: Joi.string().allow(''),
    state: Joi.string().allow(''),
    postalCode: Joi.string().allow(''),
    country: Joi.string().allow(''),
  }),
  notes: Joi.string().max(500).allow(''),
});

export { validate, registerSchema, loginSchema, followSchema, notifySchema, orderSchema };

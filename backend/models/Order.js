const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Product'
  }],
  razorpay_order_id: { type: String, required: true },
  razorpay_payment_id: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);

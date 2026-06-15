const Razorpay = require('razorpay');
const crypto = require('crypto');
const User = require('../models/User');
const emailService = require('../services/emailService');

exports.createOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    
    if (!amount) {
      return res.status(400).json({ message: 'Amount is required' });
    }

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: Math.round(amount * 100), // amount in smallest currency unit (paise)
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`
    };

    const order = await instance.orders.create(options);
    if (!order) return res.status(500).json({ message: 'Some error occurred' });

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // Payment is successfully verified
      
      // Try to send email to user
      try {
        const user = await User.findById(req.user.userId);
        if (user && user.email) {
          const subject = "Payment Confirmation - Seednutz";
          const text = `Hi ${user.name || 'Customer'},\n\nYour payment (Order ID: ${razorpay_order_id}) was successful! Thank you for shopping with Seednutz.\n\nBest Regards,\nSeednutz Team`;
          await emailService.sendPaymentEmail(user.email, subject, text);
        }
      } catch (err) {
        console.error("Failed to send payment confirmation email:", err);
      }

      return res.status(200).json({ message: 'Payment verified successfully' });
    } else {
      return res.status(400).json({ message: 'Invalid signature sent!' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

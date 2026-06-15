const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendOtpEmail } = require('../services/emailService');

// In-memory store for OTPs. In production, use Redis or DB.
const otpStore = new Map();

exports.sendOtp = async (req, res) => {
  try {
    const { email, mobile_no, method } = req.body;
    
    // Domain validation
    if (!email.endsWith('@seednutz.co.in') && !email.endsWith('@gmail.com')) {
      return res.status(400).json({ message: 'Invalid email domain. Must be @seednutz.co.in or @gmail.com' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });
    
    const existingMobile = await User.findOne({ mobile_no });
    if (existingMobile) return res.status(400).json({ message: 'Mobile number already registered' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP with 5 minute expiration
    otpStore.set(email, { otp, expiresAt: Date.now() + 5 * 60 * 1000 });

    if (method === 'email') {
      try {
        await sendOtpEmail(email, otp);
      } catch (err) {
        return res.status(500).json({ message: 'Some issue occurred while sending OTP. Please try again.', error: err.message });
      }
    } else {
      // Mock SMS
      console.log(`[MOCK SMS] Sending OTP ${otp} to mobile ${mobile_no}`);
    }

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.register = async (req, res) => {
  try {
    const { name, email, mobile_no, password, otp } = req.body;
    
    const storedData = otpStore.get(email);
    if (!storedData) {
      return res.status(400).json({ message: 'OTP expired or not requested' });
    }
    if (storedData.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }
    if (Date.now() > storedData.expiresAt) {
      otpStore.delete(email);
      return res.status(400).json({ message: 'OTP has expired' });
    }

    // Determine admin status
    let isAdmin = false;
    if (email.endsWith('@seednutz.co.in')) isAdmin = true;
    else if (!email.endsWith('@gmail.com')) return res.status(400).json({ message: 'Invalid email domain' });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const defaultName = name || email.split('@')[0];
    const newUser = new User({ name: defaultName, email, mobile_no, password: hashedPassword, isAdmin });
    await newUser.save();

    // Clear OTP after successful registration
    otpStore.delete(email);

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { name: user.name, email: user.email, mobile_no: user.mobile_no, isAdmin: user.isAdmin } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, mobile_no, password } = req.body;
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name) user.name = name;
    if (mobile_no) user.mobile_no = mobile_no;
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();
    
    // Return updated user without password
    const updatedUser = await User.findById(req.user.userId).select('-password');
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

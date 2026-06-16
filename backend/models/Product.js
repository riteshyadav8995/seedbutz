const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  name: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String },
  images: [{ type: String }],
  type: { type: String, required: true }, // e.g., 'Raw', 'Roasted', 'Flavored'
  flavor: { type: String }, // e.g., 'Salted', 'Spicy', 'Honey'
  dietaryRestrictions: [{ type: String }], // e.g., 'Vegan', 'Gluten-Free', 'Keto'
  nutritionFacts: {
    calories: Number,
    fat: String,
    protein: String,
    carbs: String
  },
  ingredients: { type: String },
  reviews: [reviewSchema],
  rating: { type: Number, required: true, default: 0 },
  numReviews: { type: Number, required: true, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);

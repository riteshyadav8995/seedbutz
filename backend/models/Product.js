const mongoose = require('mongoose');

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
  ingredients: { type: String }
});

module.exports = mongoose.model('Product', productSchema);

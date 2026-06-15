const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  contactFormFields: {
    type: Array,
    default: [
      { id: 'name', label: 'Name', type: 'text', required: true },
      { id: 'email', label: 'Email', type: 'email', required: true },
      { id: 'subject', label: 'Subject', type: 'text', required: true },
      { id: 'message', label: 'Message', type: 'textarea', required: true }
    ]
  },
  productTypes: {
    type: [String],
    default: ['Raw', 'Roasted']
  },
  productFlavors: {
    type: [String],
    default: ['Salted', 'Sweet', 'Spicy', 'Plain', 'Mixed']
  },
  productDietary: {
    type: [String],
    default: ['Vegan', 'Gluten-Free', 'Keto', 'Organic', 'None']
  }
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);

const Settings = require('../models/Settings');

exports.getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
    }
    
    if (req.body.contactFormFields) settings.contactFormFields = req.body.contactFormFields;
    if (req.body.productTypes) settings.productTypes = req.body.productTypes;
    if (req.body.productFlavors) settings.productFlavors = req.body.productFlavors;
    if (req.body.productDietary) settings.productDietary = req.body.productDietary;

    await settings.save();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

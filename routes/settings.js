const express = require('express');
const router = express.Router();
const SiteSetting = require('../models/siteSetting');

// Get all settings
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const query = category ? { category } : {};
    const settings = await SiteSetting.find(query);
    
    // Convert to key-value object
    const settingsObj = {};
    settings.forEach(setting => {
      settingsObj[setting.key] = setting.value;
    });
    
    res.json(settingsObj);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single setting
router.get('/:key', async (req, res) => {
  try {
    const setting = await SiteSetting.findOne({ key: req.params.key });
    res.json(setting ? setting.value : null);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update setting
router.put('/:key', async (req, res) => {
  try {
    const { value, updatedBy } = req.body;
    
    const setting = await SiteSetting.findOneAndUpdate(
      { key: req.params.key },
      { value, updatedBy, updatedAt: new Date() },
      { new: true, upsert: true }
    );
    
    res.json(setting);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Bulk update settings
router.post('/bulk', async (req, res) => {
  try {
    const { settings, updatedBy } = req.body;
    
    const promises = Object.keys(settings).map(key => 
      SiteSetting.findOneAndUpdate(
        { key },
        { value: settings[key], updatedBy, updatedAt: new Date() },
        { new: true, upsert: true }
      )
    );
    
    await Promise.all(promises);
    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Initialize default settings
router.post('/init', async (req, res) => {
  try {
    const { defaultSettings } = require('../models/siteSetting');
    
    for (const setting of defaultSettings) {
      await SiteSetting.findOneAndUpdate(
        { key: setting.key },
        setting,
        { upsert: true }
      );
    }
    
    res.json({ message: 'Default settings initialized' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

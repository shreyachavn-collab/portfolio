const express = require('express');
const router = express.Router();
const PortfolioData = require('../models/PortfolioData');

// GET all portfolio data
router.get('/', async (req, res) => {
  try {
    let data = await PortfolioData.findOne();
    if (!data) {
      data = new PortfolioData();
      await data.save();
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE about data
router.post('/about', async (req, res) => {
  try {
    let data = await PortfolioData.findOne();
    if (!data) data = new PortfolioData();
    data.aboutData = req.body;
    await data.save();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE education list
router.post('/education', async (req, res) => {
  try {
    let data = await PortfolioData.findOne();
    if (!data) data = new PortfolioData();
    data.educations = req.body;
    await data.save();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE experience list
router.post('/experience', async (req, res) => {
  try {
    let data = await PortfolioData.findOne();
    if (!data) data = new PortfolioData();
    data.experiences = req.body;
    await data.save();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE projects list
router.post('/projects', async (req, res) => {
  try {
    let data = await PortfolioData.findOne();
    if (!data) data = new PortfolioData();
    data.projects = req.body;
    await data.save();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE social links
router.post('/social', async (req, res) => {
  try {
    let data = await PortfolioData.findOne();
    if (!data) data = new PortfolioData();
    data.socialData = req.body;
    await data.save();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE resume
router.post('/resume', async (req, res) => {
  try {
    let data = await PortfolioData.findOne();
    if (!data) data = new PortfolioData();
    data.resumeData = req.body;
    await data.save();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE settings
router.post('/settings', async (req, res) => {
  try {
    let data = await PortfolioData.findOne();
    if (!data) data = new PortfolioData();
    data.siteSettings = req.body;
    await data.save();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

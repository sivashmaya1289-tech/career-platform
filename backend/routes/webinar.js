const express = require('express');
const router = express.Router();
const User = require('../models/User');
const WebinarRegistration = require('../models/WebinarRegistration');

// POST /api/webinar/register
router.post('/register', async (req, res) => {
  try {
    const { name, phone, class: studentClass } = req.body;

    // Validate required fields
    if (!name || !phone || !studentClass) {
      return res.status(400).json({
        success: false,
        message: 'Name, phone, and class are required.',
      });
    }

    // Check if phone already registered for webinar
    const existingUser = await User.findOne({ phone, type: 'webinar' });
    if (existingUser) {
      const existingReg = await WebinarRegistration.findOne({ userId: existingUser._id });
      if (existingReg) {
        return res.status(409).json({
          success: false,
          message: 'This phone number is already registered for the webinar.',
        });
      }
    }

    // Create user
    const user = await User.create({
      name: name.trim(),
      phone: phone.trim(),
      class: studentClass,
      type: 'webinar',
    });

    // Create webinar registration
    const registration = await WebinarRegistration.create({
      userId: user._id,
    });

    return res.status(201).json({
      success: true,
      message: 'Successfully registered for the webinar! Details will be sent via SMS.',
      data: {
        registrationId: registration._id,
        name: user.name,
        webinarDate: registration.webinarDate,
      },
    });
  } catch (error) {
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
      });
    }

    console.error('Webinar registration error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error. Please try again.',
    });
  }
});

// GET /api/webinar/registrations (admin use)
router.get('/registrations', async (req, res) => {
  try {
    const registrations = await WebinarRegistration.find()
      .populate('userId', 'name phone class createdAt')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: registrations.length,
      data: registrations,
    });
  } catch (error) {
    console.error('Fetch registrations error:', error);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;

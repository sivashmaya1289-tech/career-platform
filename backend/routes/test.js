const express = require('express');
const router = express.Router();
const User = require('../models/User');
const TestResult = require('../models/TestResult');

/**
 * Scoring System:
 * Questions 1–5:  Engineering/Tech stream indicators
 * Questions 6–10: Medical/Life Sciences stream indicators
 * Questions 11–15: Commerce/Business stream indicators
 *
 * Scoring per answer:
 *   yes       = 3 points
 *   sometimes = 1 point
 *   no        = 0 points
 *
 * Result = stream with highest total score
 */

const RESULT_DESCRIPTIONS = {
  'Engineering & Technology':
    'Your analytical mindset and passion for problem-solving make you a great fit for Engineering & Technology. Consider streams like Computer Science, Mechanical, Electronics, or Data Science.',
  'Medical & Life Sciences':
    'Your empathy, curiosity about the human body, and interest in biology point toward a rewarding career in Medical & Life Sciences. Consider MBBS, BDS, Pharmacy, Biotech, or Nursing.',
  'Commerce & Business':
    'Your leadership instincts, financial acumen, and communication skills are a perfect match for Commerce & Business. Consider CA, MBA, BBA, Economics, or Entrepreneurship.',
};

const calculateScores = (answers) => {
  let engineering = 0;
  let medical = 0;
  let commerce = 0;

  const pointMap = { yes: 3, sometimes: 1, no: 0 };

  answers.forEach((answer, index) => {
    const points = pointMap[answer.toLowerCase()] || 0;
    if (index < 5) engineering += points;
    else if (index < 10) medical += points;
    else commerce += points;
  });

  return { engineering, medical, commerce };
};

const determineResult = (scores) => {
  const { engineering, medical, commerce } = scores;

  if (engineering >= medical && engineering >= commerce) {
    return 'Engineering & Technology';
  } else if (medical >= engineering && medical >= commerce) {
    return 'Medical & Life Sciences';
  } else {
    return 'Commerce & Business';
  }
};

// POST /api/test/submit
router.post('/submit', async (req, res) => {
  try {
    const { name, phone, class: studentClass, answers } = req.body;

    // Validate required fields
    if (!name || !phone || !studentClass) {
      return res.status(400).json({
        success: false,
        message: 'Name, phone, and class are required.',
      });
    }

    if (!answers || !Array.isArray(answers) || answers.length !== 15) {
      return res.status(400).json({
        success: false,
        message: 'Please answer all 15 questions.',
      });
    }

    // Validate answer values
    const validAnswers = ['yes', 'sometimes', 'no'];
    const invalidAnswers = answers.filter((a) => !validAnswers.includes(a.toLowerCase()));
    if (invalidAnswers.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid answer values. Use: yes, sometimes, or no.',
      });
    }

    // Create or find user
    let user = await User.findOne({ phone, type: 'test' });
    if (!user) {
      user = await User.create({
        name: name.trim(),
        phone: phone.trim(),
        class: studentClass,
        type: 'test',
      });
    }

    // Calculate scores
    const normalizedAnswers = answers.map((a) => a.toLowerCase());
    const scores = calculateScores(normalizedAnswers);
    const result = determineResult(scores);
    const resultDescription = RESULT_DESCRIPTIONS[result];

    // Save test result
    const testResult = await TestResult.create({
      userId: user._id,
      answers: normalizedAnswers,
      scores,
      result,
      resultDescription,
    });

    return res.status(201).json({
      success: true,
      message: 'Test submitted successfully!',
      data: {
        resultId: testResult._id,
        name: user.name,
        scores,
        result,
        resultDescription,
      },
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }

    console.error('Test submit error:', error);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

// GET /api/test/results (admin use)
router.get('/results', async (req, res) => {
  try {
    const results = await TestResult.find()
      .populate('userId', 'name phone class')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error) {
    console.error('Fetch test results error:', error);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;

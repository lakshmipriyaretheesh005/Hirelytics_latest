import MockTest from '../models/MockTest.js';

// @desc    Get all mock tests
// @route   GET /api/mock-tests
// @access  Private
export const getMockTests = async (req, res, next) => {
  try {
    const { category, difficulty, company } = req.query;

    const filter = { isActive: true };
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    if (company) filter.company = company;

    const tests = await MockTest.find(filter)
      .select('-questions.correctAnswer -questions.explanation')
      .sort('-createdAt');

    res.json({
      success: true,
      count: tests.length,
      tests
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single mock test
// @route   GET /api/mock-tests/:id
// @access  Private
export const getMockTest = async (req, res, next) => {
  try {
    const test = await MockTest.findById(req.params.id)
      .select('-questions.correctAnswer -questions.explanation');

    if (!test) {
      return res.status(404).json({ error: 'Mock test not found' });
    }

    res.json({
      success: true,
      test
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit mock test attempt
// @route   POST /api/mock-tests/:id/submit
// @access  Private
export const submitTest = async (req, res, next) => {
  try {
    const { answers, timeTaken } = req.body;

    const test = await MockTest.findById(req.params.id);

    if (!test) {
      return res.status(404).json({ error: 'Mock test not found' });
    }

    // Calculate score
    let score = 0;
    test.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        score++;
      }
    });

    // Save attempt
    test.attempts.push({
      user: req.userId,
      score,
      timeTaken,
      answers
    });

    await test.save();

    res.json({
      success: true,
      message: 'Test submitted successfully',
      result: {
        score,
        totalQuestions: test.questions.length,
        timeTaken,
        percentage: ((score / test.questions.length) * 100).toFixed(2)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's test attempts
// @route   GET /api/mock-tests/my-attempts
// @access  Private
export const getMyAttempts = async (req, res, next) => {
  try {
    const tests = await MockTest.find({
      'attempts.user': req.userId
    }).select('title category duration attempts');

    const attempts = [];
    tests.forEach(test => {
      const userAttempts = test.attempts.filter(
        att => att.user.toString() === req.userId
      );

      userAttempts.forEach(attempt => {
        attempts.push({
          test: {
            _id: test._id,
            title: test.title,
            category: test.category,
            duration: test.duration
          },
          score: attempt.score,
          timeTaken: attempt.timeTaken,
          attemptedAt: attempt.attemptedAt
        });
      });
    });

    res.json({
      success: true,
      count: attempts.length,
      attempts: attempts.sort((a, b) => b.attemptedAt - a.attemptedAt)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create mock test (Admin only)
// @route   POST /api/mock-tests
// @access  Private/Admin
export const createMockTest = async (req, res, next) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ error: 'Only admins can create mock tests' });
    }

    const payload = { ...req.body };

    if (!Array.isArray(payload.questions) || payload.questions.length === 0) {
      return res.status(400).json({ error: 'At least one question is required' });
    }

    if (!payload.totalMarks) {
      payload.totalMarks = payload.questions.length;
    }

    if (!payload.duration) {
      payload.duration = 30;
    }

    const test = new MockTest(payload);
    await test.save();

    res.status(201).json({
      success: true,
      message: 'Mock test created successfully',
      test
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all mock test results for admin
// @route   GET /api/mock-tests/admin/results
// @access  Private/Admin
export const getAdminMockTestResults = async (req, res, next) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ error: 'Only admins can view mock test results' });
    }

    const tests = await MockTest.find({ isActive: true })
      .populate('attempts.user', 'fullName email')
      .sort('-createdAt');

    const formatted = tests.map((test) => {
      const attempts = (test.attempts || []).map((attempt) => ({
        user: attempt.user,
        score: attempt.score,
        percentage: test.questions.length
          ? Number(((attempt.score / test.questions.length) * 100).toFixed(2))
          : 0,
        timeTaken: attempt.timeTaken,
        attemptedAt: attempt.attemptedAt
      }));

      const attemptsCount = attempts.length;
      const averageScore = attemptsCount
        ? Number((attempts.reduce((sum, a) => sum + a.score, 0) / attemptsCount).toFixed(2))
        : 0;
      const bestScore = attemptsCount
        ? Math.max(...attempts.map((a) => a.score))
        : 0;

      return {
        _id: test._id,
        title: test.title,
        company: test.company || 'General',
        category: test.category,
        difficulty: test.difficulty,
        duration: test.duration,
        totalQuestions: test.questions.length,
        attemptsCount,
        averageScore,
        bestScore,
        attempts: attempts.sort((a, b) => new Date(b.attemptedAt) - new Date(a.attemptedAt))
      };
    });

    res.json({
      success: true,
      count: formatted.length,
      tests: formatted
    });
  } catch (error) {
    next(error);
  }
};

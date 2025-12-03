import codeService from '../services/codeService.js';
import progressService from '../services/progressService.js';

// Submit code
export const submitCode = async (req, res, next) => {
  try {
    const { userId, levelId, code } = req.body;

    if (!userId || !levelId || !code) {
      return res.status(400).json({ error: 'userId, levelId, and code are required' });
    }

    // Validate code
    let isCorrect = false;
    let feedback = '';

    // Example validation logic for different levels
    if (levelId === 1) {
      // Level 1: Print spell
      isCorrect = code.toLowerCase().includes('print');
      feedback = isCorrect
        ? '✨ Great! You\'ve mastered the print spell!'
        : '❌ The print spell needs work. Try again!';
    } else if (levelId === 2) {
      // Level 2: Loops
      isCorrect = code.toLowerCase().includes('for') || code.toLowerCase().includes('while');
      feedback = isCorrect
        ? '🎉 Loop spell working!'
        : '❌ Try using a loop!';
    } else {
      // Generic validation
      feedback = 'Code submitted for review';
      isCorrect = code.length > 10;
    }

    // Save submission
    const submission = await codeService.submitCode(userId, levelId, code);

    // Update progress if correct
    if (isCorrect) {
      await progressService.updateProgress(userId, levelId, 100, true);
    }

    res.json({
      isCorrect,
      feedback,
      submissionId: submission.id,
      message: isCorrect ? 'Code is correct!' : 'Code needs adjustment',
    });
  } catch (error) {
    next(error);
  }
};

// Get submission history
export const getSubmissionHistory = async (req, res, next) => {
  try {
    const { userId, levelId } = req.params;

    const history = await codeService.getSubmissionHistory(userId, levelId);
    res.json(history);
  } catch (error) {
    next(error);
  }
};

// Get all user submissions
export const getUserSubmissions = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const submissions = await codeService.getUserSubmissions(userId);
    res.json(submissions);
  } catch (error) {
    next(error);
  }
};

export default { submitCode, getSubmissionHistory, getUserSubmissions };

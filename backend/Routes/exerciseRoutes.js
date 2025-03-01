const express = require('express');
const router = express.Router();
const { saveExercise, getExerciseHistory, getLeaderboard } = require('../Controllers/exerciseController');
const authMiddleware = require('../Middleware/authenticateUser');

router.use(authMiddleware);

router.post('/save-exercise', saveExercise);
router.get('/exercise-history', getExerciseHistory);
router.get('/leaderboard', getLeaderboard);

module.exports = router;
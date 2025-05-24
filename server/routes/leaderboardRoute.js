const express = require('express');
const router = express.Router();
const {cgpaLeaderboard, codingLeaderboard, attendanceLeaderboard} = require('../controllers/leaderboardController');

router.get('/cgpa', cgpaLeaderboard);
router.get('/coding', codingLeaderboard);
router.get('/attendance', attendanceLeaderboard);

module.exports = router;
const express = require('express');
const router = express.Router();
const {getPerformanceData,getAttendanceData,getUserName,getTotalProblems} = require('../controllers/dashboardController');

router.post('/getPerformanceData', getPerformanceData);
router.post('/getAttendanceData', getAttendanceData);
router.post('/getUserName',getUserName);
router.get('/getTotalProblems/:userID',getTotalProblems);

module.exports = router;
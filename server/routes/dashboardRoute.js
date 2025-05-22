const express = require('express');
const router = express.Router();
const {getPerformanceData,getAttendanceData,getUserName} = require('../controllers/dashboardController');
// import { getPerformanceData } from '../controllers/dashboardController';
// import { getAttendanceData } from '../controllers/dashboardController';

router.post('/getPerformanceData', getPerformanceData);
router.post('/getAttendanceData', getAttendanceData);
router.post('/getUserName',getUserName);

module.exports = router;
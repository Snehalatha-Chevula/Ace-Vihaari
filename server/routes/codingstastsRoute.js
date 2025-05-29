const express = require('express');
const router = express.Router();
const {getLeetcodeStats,getgfgStats,getCodechefStats} = require('../controllers/codingstatsController');

router.get('/getLeetcodeStats/:userID', getLeetcodeStats);
router.get('/getgfgStats/:userID',getgfgStats);
router.get('/getCodechefStats/:userID',getCodechefStats);

module.exports = router;
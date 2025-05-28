const express = require('express');
const router = express.Router();
const {getLeetcodeStats,getgfgStats} = require('../controllers/codingstatsController');

router.get('/getLeetcodeStats/:userID', getLeetcodeStats);
router.get('/getgfgStats/:userID',getgfgStats);
module.exports = router;
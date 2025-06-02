const express = require('express');
const { setData } = require('../controllers/studentDataController');
const router = express.Router();

router.post('/setData',setData);
module.exports = router;
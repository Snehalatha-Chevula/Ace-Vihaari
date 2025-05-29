const express = require('express');
const router = express.Router();
const {getCodingStats} = require('../controllers/codingstatsController');

router.get('/getCodingStats/:userID', getCodingStats);


module.exports = router;
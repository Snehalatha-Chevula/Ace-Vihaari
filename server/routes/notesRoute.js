const express = require('express');
const router = express.Router();
const {getNotes} = require('../controllers/notesController');

router.get('/getNotes/:userID',getNotes);

module.exports = router;
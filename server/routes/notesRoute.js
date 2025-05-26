const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const {getNotes,uploadToDatabase,uploadToDrive, incrementView} = require('../controllers/notesController');

router.get('/getNotes/:userID',getNotes);
router.post('/uploadToDrive', upload.single('file'),uploadToDrive);
router.post('/uploadToDatabase',uploadToDatabase);
router.post('/incrementView',incrementView);
module.exports = router;
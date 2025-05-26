const express = require('express');
const multer = require('multer');
const uploadToDrive = require('../utils/driveUploader');

const router = express.Router();

// Temporary local upload storage
const upload = multer({ dest: 'uploads/' });

const DRIVE_FOLDER_ID = '1Yj1JrGg5Yf6plcKMbpcjsVr6OisYHG2m'; // your shared folder

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const result = await uploadToDrive(req.file, DRIVE_FOLDER_ID);
    res.status(200).json({ message: 'Uploaded successfully', file: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
});

module.exports = router;
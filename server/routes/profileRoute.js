const express = require('express');
const router = express.Router();
const {getAcademicInfo,getCodingProfiles,getCGPA,getPersonalInfo} = require('../controllers/profileController');

router.get('/getAcademicInfo/:userID',getAcademicInfo);
router.get('/getPersonalInfo/:userID',getPersonalInfo);
router.get('/getCGPA/:userID',getCGPA);
router.get('/getCodingProfile/:userID',getCodingProfiles);

module.exports = router;
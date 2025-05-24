const express = require('express');
const router = express.Router();
const {getAcademicInfo,getCodingProfiles,getCGPA,getPersonalInfo,updateDetails,updatePassword} = require('../controllers/profileController');

router.get('/getAcademicInfo/:userID',getAcademicInfo);
router.get('/getPersonalInfo/:userID',getPersonalInfo);
router.get('/getCGPA/:userID',getCGPA);
router.get('/getCodingProfiles/:userID',getCodingProfiles);
router.put('/updateDetails',updateDetails);
router.put('/updatePassword',updatePassword);

module.exports = router;
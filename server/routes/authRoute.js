const express = require('express');
const router = express.Router();
const {loginUser, me, logout} = require("../controllers/authController");
const authenticate = require('../middleware/authenticate');

router.post('/login', loginUser);
router.get('/me',authenticate,me);
router.post('/logout',logout);
module.exports = router;
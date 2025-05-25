const express = require('express');
const router = express.Router();
const {getNotifications,markNotificationAsRead,markAllNotificationsAsRead} = require('../controllers/notificationsController');

router.get('/getNotifications/:userID',getNotifications);
router.put('/markNotificationAsRead',markNotificationAsRead);
router.put('/markAllNotificationsAsRead',markAllNotificationsAsRead);


module.exports = router;
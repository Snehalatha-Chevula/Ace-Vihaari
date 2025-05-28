const express = require('express');
const router = express.Router();
const {getNotifications,markNotificationAsRead,markAllNotificationsAsRead,createNotifications} = require('../controllers/notificationsController');

router.get('/getNotifications/:userID',getNotifications);
router.put('/markNotificationAsRead',markNotificationAsRead);
router.put('/markAllNotificationsAsRead',markAllNotificationsAsRead);
router.post('/createNotifications',createNotifications);

module.exports = router;
const db = require("../models/db");


exports.getNotifications = async(request, response) => {
    const userID = request.params.userID;
    try {
        const [notifications] = await db.query(
            `SELECT n.id, n.title, n.message, n.type, n.sender, n.timestamp, un.isRead
            FROM user_notifications un
            JOIN notifications n ON un.notificationID = n.id
            WHERE un.userID = ?
            ORDER BY n.timestamp DESC;`,
            [userID],
            (err, result) => {
                if (err) return res.status(500).json(err);  
            }
        );

        return response.status(200).json({message : notifications});
    }
    catch (e) {
        console.log(`Error while fetching ${userID}'s notifications`,e);
        return response.status(500).json({message : 'Server Error'});
    }
};

exports.markNotificationAsRead = async (req,res) => {
    const {userID,notificationId} = req.body;
    
    try {
        await db.query(
            'UPDATE user_notifications SET isRead = TRUE WHERE userID = ? AND notificationID = ?',
            [userID,notificationId],
            (err, result) => {
                if (err) return res.status(500).json(err);
                if (result.affectedRows === 0) return res.status(404).json({message : 'User not found'});
            }
        );
        res.status(200).json({message : 'Marked as read'});
    }
    catch (e) {
        console.log('Error while marking notification as read',e);
        res.status(500).json({message : 'Server error'});
    }
};

exports.markAllNotificationsAsRead = async (req,res) => {
    const {userID} = req.body;
    try {
        await db.query(
            'UPDATE user_notifications SET isRead = TRUE WHERE userID = ?',
            [userID],
            (err, result) => {
                if (err) return res.status(500).json(err);
                if (result.affectedRows === 0) return res.status(404).json({message : 'User not found'});
            }
        );
        res.status(200).json({message : 'Marked as read'});
    }
    catch (e) {
        console.log('Error while marking notifications as read',e);
        res.status(500).json({message : 'Server error'});
    }
};
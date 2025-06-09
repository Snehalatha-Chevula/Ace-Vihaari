const db = require("../models/db");

exports.createNotifications = async(req,res) => {
    const {title,message,type,action,actionLink} = req.body.formData;
    const {userID} = req.body;
    const {userName}= req.body;
    console.log(req.body);
    const {branch,semester,section} = req.body.formData.targetAudience;
    try{
        await db.query(`
            INSERT INTO notifications (title,message,type,facultyID,action,actionLink,semester,branch,section,sender)
            VALUES (?,?,?,?,?,?,?,?,?,?)`,
            [title,message,type,userID,action,actionLink,semester,branch,JSON.stringify(section),userName],
            (err,res)=>{
                if(err){
                    return res.status(500).json(err);
                }
            }
        )
        const [notificationID] = await db.query(`
            SELECT MAX(id) FROM notifications;
        `);
        let branches = '(';
        for(let b of branch) {
            branches += "'";
            branches += b;
            branches += "'";
            branches += ',';
        }
        branches = branches.slice(0,branches.length-1) + ')';

        let semesters = '(';
        for(let b of semester) {
            semesters += b;
            semesters += ',';
        }
        semesters = semesters.slice(0,semesters.length-1) + ')';

        let sections = '(';
        for(let b of section) {
            sections += "'";
            sections += b;
            sections += "'";
            sections += ',';
        }
        sections = sections.slice(0,sections.length-1) + ')';

        console.log(semesters,branches,sections);

        const [rows] = await db.query(`
            SELECT userID FROM academicInfo WHERE ${branch[0] == 'ALL' ? 'TRUE' : `branch IN ${branches}`} AND 
            ${semester[0] == 'ALL' ? 'TRUE' : `currentSem IN ${semesters}`} AND 
            ${section[0] == 'ALL' ? 'TRUE' : `section IN ${sections}`}
        `);
        const nid = notificationID[0]['MAX(id)'];
        for(let i=0;i<rows.length;i++){
            const uid = rows[i][`userID`];
            await db.query(`
                INSERT INTO user_notifications (userID,notificationID) 
                VALUES (?,?)`,[uid,nid],
                (err,res)=>{
                    if(err){
                        return res.status(500).json(err);
                    }
                 }
            );
        }
        res.status(200).json({ message: "Notification created" });
    }
    catch(e){
        console.log(`Error while sending notifications`,e);
        return res.status(500).json({message : 'Server Error'});
    }
}

exports.getNotifications = async(request, response) => {
    const userID = request.params.userID;
    const role = userID.charAt(0).toLowerCase() == 'f' ? 'faculty' : 'student';
    try {
        if(role == 'student'){
            const [notifications] = await db.query(
                `SELECT n.id, n.title, n.message, n.type, n.sender, n.timestamp, n.action, n.actionLink, un.isRead
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
        else{
            const [notifications] = await db.query(
                `SELECT id, title, message, type, timestamp action, actionLink FROM notifications WHERE facultyID = ?
                ORDER BY timestamp DESC;`,
                [userID],
                (err, result) => {
                    if (err) return res.status(500).json(err);  
                }
            );
            return response.status(200).json({message : notifications});
        }
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
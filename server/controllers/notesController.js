const db = require("../models/db");

exports.getNotes = async (req,res) => {
    const userID = req.params.userID;
    try {
        let role = userID.toLowerCase().charAt(0) == 'f' ? "faculty" : "student";
        let notes;
        if(role == 'student')
            [notes] =await db.query(`SELECT * FROM notes`);
        else
            [notes] =await db.query(`SELECT * FROM notes WHERE facultyID = ?`,[userID]);
        return res.status(200).json(notes);
    }
    catch(e){
        console.log('Unable to fetch notes',e);
        res.status(500);
    }
}
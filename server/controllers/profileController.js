const db = require("../models/db");

exports.getAcademicInfo = async (req,res) => {
    const userID = req.params.userID;
    try {
        const [rows] = await db.query(`SELECT * FROM academicInfo WHERE userID = ? `,[userID]);
        const {branch,currentSem} = rows[0];
        return res.status(200).json({
            message : {
                branch,
                currentSem
            }
        });
    }
    catch (e) {
        console('Error while loading academic info',e);
        return res.status(500).json({message : 'Server Error'});
    }
};

exports.getPersonalInfo = async (req,res) => {
    const userID = req.params.userID;
    try {
        const [rows] = await db.query(`SELECT * FROM personalInfo WHERE userID = ? `,[userID]);
        const details = rows[0];
        return res.status(200).json({
            message : {
                details
            }
        });
    }
    catch (e) {
        console('Error while loading personal info',e);
        res.status(500).json({message : 'Server Error'});
    }
};

exports.getCGPA = async (req,res) => {
    const userID = req.params.userID;
    try {
        const [rows] = await db.query(`SELECT * FROM cgpa WHERE userID = ? `,[userID]);
        let i = 0;
        let currentCGPA = '';
        while(i < 8 && rows[0][i]) {
            currentCGPA = rows[0][i];
            i++;
        }
        return res.status(200).json({
            message : {
                currentCGPA
            }
        });
    }
    catch (e) {
        console('Error while loading currentCGPA info',e);
        res.status(500).json({message : 'Server Error'});
    }
};

exports.getCodingProfiles = async (req,res) => {
    const userID = req.params.userID;
    try {
        const [rows] = await db.query(`SELECT * FROM codingprofiles WHERE userID = ? `,[userID]);
        const details = rows[0];
        return res.status(200).json({
            message : {
                details
            }
        });
    }
    catch (e) {
        console('Error while loading coding info',e);
        res.status(500).json({message : 'Server Error'});
    }
};
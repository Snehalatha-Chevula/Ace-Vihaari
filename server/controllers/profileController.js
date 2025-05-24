const db = require("../models/db");
const bcrypt = require('bcrypt');

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
        while(i < 8 && rows[0][`sem${i+1}`]) {
            currentCGPA = rows[0][`sem${i+1}`];
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

exports.updateDetails = async (req,res) => {
    const details = req.body;
    try {
        await db.query(
            'UPDATE personalInfo SET fullName = ?, email = ?, phone = ?, address = ?, bio = ? WHERE userID = ?',
            [details.name, details.email, details.phone, details.address, details.bio, details.registrationNumber],
            (err, result) => {
                if (err) return res.status(500).json(err);
                if (result.affectedRows === 0) return res.status(404).json({message : 'User not found'});
            }
        );

        await db.query(
            'UPDATE codingprofiles SET leetcode = ?, codechef = ?, hackerrank = ?, gfg = ?, github = ? WHERE userID = ?',
            [details.leetcodeUsername, details.codechefUsername, details.hackerrankUsername, details.gfgUsername, details.githubUsername, details.registrationNumber],
            (err, result) => {
                if (err) return res.status(500).json(err);
                if (result.affectedRows === 0) return res.status(404).json({message : 'User not found'});
            }
        );

        res.status(200).json({message : 'Profile updated successfully'});
    }
    catch (e) {
        console.log('Error while updating profile details',e);
        res.status(500).json({message : 'Server error'});
    }
};

exports.updatePassword = async(req,res) => {
    const {currentPassword,newPassword,userID} = req.body;
    try {
        const [rows] = await db.query(`SELECT * FROM users WHERE userID = ?`, [userID]);
        const user = rows[0];
        const isMatch = await bcrypt.compare(currentPassword,user.userPassword);
        if(!isMatch) {
            return res.status(404).json({
                message : 'Incorrect current password'
            });
        }
        const hashedPass = await bcrypt.hash(newPassword,10);
        await db.query(
            `UPDATE users SET userPassword = ? WHERE userID = ?`,
            [hashedPass,userID],
            (err, result) => {
                if (err) return res.status(500).json(err);
                if (result.affectedRows === 0) return res.status(404).json({message : 'User not found'});
            }
        )
        return res.status(200).json({
            message : 'Password updated successfully'
        })
    }
    catch(e) {
        console.log('Error while updating password',e);
        res.status(500).json({
            message : 'Server Error'
        });
    }
}
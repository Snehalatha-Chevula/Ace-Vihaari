const db = require("../models/db");

exports.cgpaLeaderboard = async(request, response)=>{
    try{
       const [rows] =await db.query(
        `SELECT 
            a.userID,
            p.fullName as name,
            a.branch,
            a.currentSem as semester,
            c.currentCGPA as cgpa
        FROM 
            academicInfo a
        JOIN 
            personalInfo p ON a.userID = p.userID
        JOIN 
            cgpa c ON a.userID = c.userID
        ORDER BY 
            c.currentCGPA DESC`
       );
        return response.status(200).json({
            message : {
                rows
            }
        });
    }
    catch(error){
        console.log("Error while fetching details.")
        response.status(500).json({message : 'Server Error'});
    }
}

exports.codingLeaderboard = async(request, response)=>{
    try{
       const [rows] =await db.query(
        `SELECT 
            a.userID,
            p.fullName as name,
            a.branch,
            a.currentSem as semester,
            cs.leetcodeScore as lcs,
            cs.codechefScore as ccs,
            cs.gfgScore as gfgs,
            cs.totalScore as ts
        FROM 
            academicInfo a
        JOIN 
            personalInfo p ON a.userID = p.userID
        JOIN 
            codingSummary cs ON a.userID = cs.userID
        ORDER BY 
            ts DESC`
       );
        return response.status(200).json({
            message : {
                rows
            }
        });
    }
    catch(error){
        console.log("Error while fetching details.",error)
        response.status(500).json({message : 'Server Error'});
    }
}

exports.attendanceLeaderboard = async(request, response)=>{
    try{
       const [rows] =await db.query(
                        `SELECT 
                            a.userID,
                            p.fullName as name,
                            a.branch,
                            a.currentSem as semester,
                            a.attendance
                        FROM 
                            academicInfo a
                        JOIN 
                            personalInfo p ON a.userID = p.userID
                        ORDER BY 
                            a.attendance DESC`
                    );
        return response.status(200).json({
            message : {
                rows
            }
        });
    }
    catch(error){
        console.log("Error while fetching details.")
        response.status(500).json({message : 'Server Error'});
    }
}
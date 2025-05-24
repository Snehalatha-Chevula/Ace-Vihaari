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
       console.log(rows);
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
            tp.totalProblems as problemsSolved
        FROM 
            academicInfo a
        JOIN 
            personalInfo p ON a.userID = p.userID
        JOIN 
            totalProblemsSolved tp ON a.userID = tp.userID
        ORDER BY 
            problemsSolved DESC`
       );
       console.log(rows);
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
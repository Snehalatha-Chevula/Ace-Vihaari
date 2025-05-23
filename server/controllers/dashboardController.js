const db = require("../models/db");

exports.getPerformanceData = async(request, response)=>{
    const {userID} = request.body;
    try{
        const [rows] = await db.query(`SELECT * from academicInfo WHERE userID = ?`,[userID]);
        const {currentSem } = rows[0];
        let semester =[];
        let cgpaHistory = [];
        const [cgpas] = await db.query(`SELECT * FROM cgpa WHERE userID = ?`, [userID]);
        let currentCGPA;
        for(let i=0;i<currentSem-1;i++){
            semester.push(`Sem ${i+1}`);
            cgpaHistory.push(cgpas[0][`sem${i+1}`]);
            currentCGPA = cgpas[0][`sem${i+1}`];
        }
        return response.status(200).json({
            message : {
                currentCGPA,
                currentSem,
                semester,
                cgpaHistory,
            }
        });
    }
    catch(error){
        console.log("Error while fetching details.")
        response.status(500).json({message : 'Server Error'});
    }
}

exports.getAttendanceData = async(request, response)=>{
    const {userID} = request.body;
    try{
        const [rows] = await db.query(`SELECT * from academicInfo WHERE userID = ?`,[userID]);
        const {attendance} = rows[0];
        return response.status(200).json({
           message :{
            attendance,
            subjects: [
                { name: 'Data Structures', percentage: 95 },
                { name: 'Computer Networks', percentage: 87 },
                { name: 'Database Systems', percentage: 94 },
                { name: 'Operating Systems', percentage: 90 },
            ]
           }
        });
    }
    catch(error){
        console.log("Error while fetching details.")
        response.status(500).json({message : 'Server Error'});
    }
}

exports.getUserName = async(request, response)=>{
    const {userID} = request.body;
    try{
        const [rows] = await db.query(`SELECT * from personalInfo WHERE userID = ?`,[userID]);
        const {fullName} = rows[0];
        return response.status(200).json({
           message :{
            fullName
           }
        });
    }
    catch(error){
        console.log("Error while fetching details.")
        response.status(500).json({message : 'Server Error'});
    }
}
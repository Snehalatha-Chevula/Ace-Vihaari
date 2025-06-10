const db = require("../models/db");
const bcrypt = require("bcrypt");

exports.setData = async (req,res) => {
    const mappedData = req.body;
    console.log(mappedData);
    try{
        for(let student of mappedData) {
            console.log(student);
            const {rollNumber, branch, semester, attendance, section, sem1, sem2, sem3, sem4, sem5, sem6, sem7, sem8} = student;
            console.log(rollNumber, branch, semester, attendance, section, sem1, sem2, sem3, sem4, sem5, sem6, sem7, sem8);
            let sRollNum = "S_" + rollNumber;
            let currentCGPA = student[`sem${Number(semester)-1}`];
            console.log(currentCGPA);
            console.log(sRollNum);
            const [user] = await db.query(`
                    SELECT * FROM users WHERE userID = ?`,[sRollNum]
                );
            console.log(user);
            if(user.length == 0) {
                const hashedPassword = await bcrypt.hash(rollNumber, 10);
                await db.query(`
                    INSERT INTO users (userID,userPassword)
                    VALUES(?,?)
                    `,[sRollNum,hashedPassword]);
                console.log("inserted in user");
                await db.query(`
                    INSERT INTO academicInfo (userID,branch,currentSem,attendance,section)
                    VALUES(?,?,?,?,?)`,[sRollNum,branch,semester,attendance,section]);
                console.log("inserted in academicInfo");
                console.log(currentCGPA);
                await db.query(`
                    INSERT INTO cgpa (userID,sem1,sem2,sem3,sem4,sem5,sem6,sem7,sem8,currentCGPA)
                    VALUES(?,?,?,?,?,?,?,?,?,?)`,[sRollNum,sem1, sem2, sem3, sem4, sem5, sem6, sem7, sem8,currentCGPA]);
                console.log("inserted in cpa");
                await db.query(`
                    INSERT INTO codingProfiles (userID) VALUES(?)`,[sRollNum]);
                console.log("inserted into codingProfiles");
            }
            else{
                console.log("updating...")
                await db.query(`
                    UPDATE academicInfo SET branch = ?, currentSem = ?, attendance = ?, section = ? WHERE userID = ?`,[branch,semester,attendance,section,sRollNum]);
                console.log("updated academicInfo");
                await db.query(`
                    UPDATE cgpa SET sem1 = ?,sem2 = ?, sem3 = ?, sem4 = ?,sem5 = ?, sem6 = ?, sem7 = ?,sem8 = ?, currentCGPA = ?  WHERE userID = ?`,
                [sem1, sem2, sem3, sem4, sem5, sem6, sem7, sem8,currentCGPA,sRollNum]);
                console.log("updated cgpa");
            }
        }
        res.status(200).json({message:"updated successfully"});
    }
    catch(e){
        console.log("error in inserting/updating the data");
        res.status(500).json({message:"server error"});
    }
}
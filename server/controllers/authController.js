const db = require("../models/db");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");

exports.loginUser = async(request, response) => {

    const {username, password} = request.body;
    try{

        const [rows] = await db.query(`SELECT * FROM users WHERE userID = ?`, [username]);
        console.log(rows);
        if(rows.length == 0){
            return response.status(404).json({message: 'User not found....' });
        }

        const user = rows[0];
        const isMatch = await bcrypt.compare(password,user.userPassword);

        if(!isMatch){
            return response.status(404).json({message: 'Invalid Password' });
        }

        const isfaculty = username.toLowerCase().startsWith('f_') ? true : false;
         
        const token = generateToken(username, isfaculty ? 'faculty' : 'student');

        response.cookie("accessToken", token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None', 
            maxAge: 60 * 24 * 7 * 60 * 1000, 
        });

        return response.status(200).json({
            message : 'Login Successful....',
            user : {
                userID : username,
                role : isfaculty ? 'faculty' : 'student',
                userName : isfaculty ? 'Faculty' : 'Student'
            },
            token
        });
    }

    catch(error){
        console.error('Login Error: ', error);
        response.status(500).json({message : 'Server Error'});
    }
};

exports.me = async (req, res) => {
  try {
    console.log("in me");
    console.log(req.user);
    const userID = req.user.userID;
    const [rows] = await db.query("SELECT userID FROM users WHERE userID = ?", [userID]);
    const user = rows[0];
    const role = userID.toLowerCase().startsWith('f_') ? "faculty" : "student";
    let fullName;
    const [row] = await db.query(`SELECT * from personalInfo WHERE userID = ?`,[userID]);
    if(row.length == 0){
        fullName = (role == 'student') ? 'Student' : 'Faculty';
    }
    else
        fullName = row[0].fullName;
    res.json({
      userID,
      role,
      fullName
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user" });
  }
};

exports.logout = (req,res)=>{
  res.clearCookie("accessToken");
  res.json({ message: "Logged out" });
};

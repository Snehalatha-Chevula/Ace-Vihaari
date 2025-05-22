const db = require("../models/db");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");

exports.loginUser = async(request, response) => {

    const {username, password} = request.body;
    try{

        const [rows] = await db.query(`SELECT * FROM users WHERE userID = ?`, [username]);
        if(rows.length == 0){
            return response.status(404).json({message: 'User not found....' });
        }

        const user = rows[0];
        const isMatch = await bcrypt.compare(password,user.userPassword);

        if(!isMatch){
            return response.status(404).json({message: 'Invalid Password' });
        }

        const isfaculty = username.startsWith('F_') ? true : false;
         
        const token = generateToken(username, isfaculty ? 'faculty' : 'student');

        return response.status(200).json({
            message : 'Login Successful....',
            user : {
                userID : username,
                role : isfaculty ? 'faculty' : 'student'
            },
            token
        });
    }

    catch(error){
        console.error('Login Error: ', error);
        response.status(500).json({message : 'Server Error'});
    }
};
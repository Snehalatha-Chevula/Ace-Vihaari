const db = require("../models/db");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");

exports.loginUser = async(request, response) => {

    const {username, password} = request.body;
    try{
        const isfaculty = username.startsWith('F_');
        const table = isfaculty ? 'faculty' : 'students';

        const filteredUserName = username.substring(2);
        const [rows] = await db.query(`SELECT * FROM ${table} WHERE username = ?`, [filteredUserName]);
        if(rows.length == 0){
            return response.status(404).json({message: 'User not found....' });
        }

        const user = rows[0];
        const isMatch = await bcrypt.compare(password,user.password);

        if(!isMatch){
            return response.status(404).json({message: 'Invalid Credentials' });
        }
        
        const token = generateToken(user.username, isfaculty ? 'faculty' : 'student');

        return response.status(200).json({
            message : 'Login Successful....',
            user : {
                username : user.username,
                email : user.email,
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
const db = require("../models/db");
const axios = require('axios');
const cheerio = require('cheerio');

exports.getLeetcodeStats = async(req,res) =>{
    const userID = req.params.userID;
    try{
        let [userName] = await db.query(`
            SELECT leetcode from codingprofiles Where userID = ?`,[userID]);
        userName = userName[0]['leetcode'];
        const url = `https://leetcode-stats-api.herokuapp.com/${userName}`;

        axios.get(url)
        .then(response => {
            let data = response.data;
            const {totalSolved,easySolved,mediumSolved,hardSolved,ranking} = response.data;
            let details = {
                userName,
                totalSolved,
                easySolved,
                mediumSolved,
                hardSolved,
                ranking
            }
            return res.status(200).json(details);
        })
        .catch(error => {
            console.error(error);
        });
    }
    catch(e){
        console.log("error while fetching leetcode data",e);
        res.status(500).json({message:"server error"});
    }
}

exports.getgfgStats = async(req,res) =>{
    const userID = req.params.userID;
    try{
        let [userName] = await db.query(`
            SELECT gfg from codingprofiles Where userID = ?`,[userID]);
        userName = userName[0]['gfg'];
        const url = `https://auth.geeksforgeeks.org/user/${userName}/practice`;
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        const problemsSolved = $('.scoreCard_head__nxXR8 .scoreCard_head_left--score__oSi_x').eq(1).text().trim();
        const divisions = $('.problemNavbar_head__cKSRi .problemNavbar_head_nav__a4K6P');

        let pd = [];
        for(let i=0;i<divisions.length;i++) {
            const d = divisions.eq(i).text();
            let j = d.length-2;
            while(j >=0 && d[j] != '(')
                j--;
            let num = Number(d.slice(j+1,d.length-1));
            pd.push(num);
        }

        res.status(200).json({
            userName,
            problemsSolved,
            pd
        });
    }
    catch(e){
        console.log("error while fetching geeksforgeeks data",e);
        res.status(500).json({message:"server error"});
    }
}

exports.getCodechefStats = async(req,res) =>{
    const userID = req.params.userID;
    try{
        let [userName] = await db.query(`
            SELECT codechef from codingprofiles Where userID = ?`,[userID]);
        userName = userName[0]['codechef'];
        
        const response = await axios.get(`https://www.codechef.com/users/${userName}`);
        const $ = cheerio.load(response.data);
        const tp = $('.rating-data-section.problems-solved h3').eq(3).text();
        let j = tp.length-1;
        while(j >= 0 && tp[j] != ' '){
            j--;
        }
        let totalProblems = Number(tp.slice(j+1,tp.length));
        const rating = $('.rating-number').text();

        res.status(200).json({
            totalProblems,
            rating,
            userName
        });
    }
    catch(e){
        console.log("error while fetching codechef data",e);
        res.status(500).json({message:"server error"});
    }
}
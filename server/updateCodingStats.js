require('dotenv').config();
const axios = require('axios');
const cheerio = require('cheerio');

const mysql = require('mysql2/promise');

console.log(process.env.DB_USER, process.env.DB_PASSWORD, process.env.DB_NAME);

(async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
    });

    try {
        const [rows] = await connection.execute(`
            SELECT * FROM codingprofiles
        `);
    
        for(let row of rows){
            const {userID, leetcode, codechef, gfg} = row;
            console.log(userID,leetcode,codechef,gfg);

            let tps = 0;
            let ts = 0;
            let gfgScore = 0;
            let leetcodeScore = 0;
            let codechefScore = 0;

            try{
                const url = `https://auth.geeksforgeeks.org/user/${gfg}/practice`;
                const response = await axios.get(url);
                const $ = cheerio.load(response.data);
                const divisions = $('.problemNavbar_head__cKSRi .problemNavbar_head_nav__a4K6P');

                let pd = [];
                let sum = 0;
                for(let i=0;i<divisions.length;i++) {
                    const d = divisions.eq(i).text();
                    let j = d.length-2;
                    while(j >=0 && d[j] != '(')
                        j--;
                    let num = Number(d.slice(j+1,d.length-1));
                    sum += num;
                    pd.push(num);
                }

                gfgScore = Number((pd[0] * 0.33 + pd[1] * 0.5 + pd[2] * 1 + pd[3] * 2.5 + pd[4] * 4).toFixed(0));
                tps += (pd[0] + pd[1] + pd[2] + pd[3] + pd[4]);

                const [isExists] = await connection.execute(`
                        SELECT * from gfg WHERE userName = ?`,
                        [gfg]
                )

                if(isExists.length == 0) {
                    await connection.execute(`
                        INSERT INTO gfg (userName, totalProblems, school, basic, easy, med, hard) VALUES 
                        (?, ?, ?, ?, ?, ?, ?)`, [gfg, sum, pd[0], pd[1], pd[2], pd[3], pd[4]],
                        (err,res) => {
                            console.log('Erroe while inserting into gfg',err);
                        }
                    )
                }
                else {
                    await connection.execute(`
                        UPDATE gfg SET totalProblems = ?, school = ?, basic = ?, easy = ?, med = ?, hard = ? WHERE userName = ?`,
                        [sum, pd[0], pd[1], pd[2], pd[3], pd[4], gfg],
                        (err,res) => {
                            console.log('Erroe while updating into gfg',err);
                        }
                    )
                }
                
            }
            catch(e){
                console.log("error while updating geeksforgeeks data",e);
            }

            try{
                const response = await axios.get(`https://www.codechef.com/users/${codechef}`);
                const $ = cheerio.load(response.data);
                const tp = $('.rating-data-section.problems-solved h3').eq(3).text();
                let j = tp.length-1;
                while(j >= 0 && tp[j] != ' '){
                    j--;
                }
                let totalProblems = Number(tp.slice(j+1,tp.length));
                const rating = $('.rating-number').text();

                codechefScore =  Number((totalProblems * 1 + (Number(rating) - 1000)/25).toFixed(0));
                tps += totalProblems; 

                const [isExists] = await connection.execute(`
                        SELECT * from codechef WHERE userName = ?`,
                        [codechef]
                )

                if(isExists.length == 0) {
                    await connection.execute(`
                        INSERT INTO codechef (userName, totalProblems, rating) VALUES 
                        (?, ?, ?)`, [codechef, totalProblems, rating],
                        (err,res) => {
                            console.log('Erroe while inserting into codechef',err);
                        }
                    )
                }
                else {
                    await connection.execute(`
                        UPDATE codechef SET totalProblems = ?, rating = ? WHERE userName = ?`,
                        [totalProblems, rating, codechef],
                        (err,res) => {
                            console.log('Erroe while updating into codechef',err);
                        }
                    )
                }            
            }
            catch(e){
                console.log("error while fetching codechef data",e);
            }

            try{
                
                const response = await axios.get(`https://leetcode-stats-api.herokuapp.com/${leetcode}`)
    
                const {totalSolved,easySolved,mediumSolved,hardSolved,ranking} = response.data;

                tps += totalSolved;
                leetcodeScore = Number((easySolved * 1 + mediumSolved * 2.5 + hardSolved * 4).toFixed(0));
                
                const [isExists] = await connection.execute(`
                    SELECT * from leetcode WHERE userName = ?`,
                    [leetcode]
                )

                if(isExists.length == 0) {
                    await connection.execute(`
                        INSERT INTO leetcode (userName, easy, med, hard, totalProblems) VALUES 
                        (?, ?, ?, ?, ?)`, [leetcode, easySolved, mediumSolved, hardSolved, totalSolved],
                        (err,res) => {
                            console.log('Erroe while inserting into leetcode',err);
                        }
                    )
                }
                else {
                    await connection.execute(`
                        UPDATE leetcode SET easy = ?, med = ?, hard = ?, totalProblems = ? WHERE userName = ?`,
                        [easySolved, mediumSolved, hardSolved, totalSolved, leetcode],
                        (err,res) => {
                            console.log('Erroe while updating into leetcode',err);
                        }
                    )
                }    
            }
            catch(e){
                console.log("error while fetching leetcode data",e);
            }

            ts = gfgScore + leetcodeScore + codechefScore;

            try {
                const [isExists] = await connection.execute(`
                    SELECT * from codingSummary WHERE userID = ?`,
                    [userID]
                )

                if(isExists.length == 0) {
                    await connection.execute(`
                        INSERT INTO codingSummary (userID, totalProblemsSolved, leetcodeScore, codechefScore, gfgScore, totalScore) VALUES 
                        (?, ?, ?, ?, ?, ?)`, [userID, tps, leetcodeScore, codechefScore, gfgScore, ts],
                        (err,res) => {
                            console.log('Erroe while inserting into codingSummary table',err);
                        }
                    )
                }
                else {
                    await connection.execute(`
                        UPDATE codingSummary SET totalProblemsSolved = ?, leetcodeScore = ?, codechefScore = ?, gfgScore = ?, totalScore = ? WHERE userID = ?`,
                        [tps, leetcodeScore, codechefScore, gfgScore, ts,userID],
                        (err,res) => {
                            console.log('Erroe while updating codingSummary tanle',err);
                        }
                    )
                }    
            }
            catch(e) {
                console.log('Error while updating codingSummary table : ',e);
            }
        }
    }
    catch(e) {
        console.log('Unknown error , ',e);
    }

    await connection.end();
    console.log('✅ All updations completed!');
  } catch (err) {
    console.error('❌ Error updating coding stats:', err.message);
  }
})();
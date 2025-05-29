const db = require("../models/db");

exports.getCodingStats = async(req,res) =>{
    const userID = req.params.userID;
    try {
        let platforms = [];
        const [rows] = await db.query(`
                SELECT * FROM codingprofiles WHERE userID = ?`,[userID]
            );
        
        const {leetcode, codechef, gfg} = rows[0];

        try{
            const [response] = await db.query(`
                    SELECT * FROM leetcode WHERE userName = ?`,[leetcode]
                );
            
            const {easy,med,hard,totalProblems} = response[0];
            
            platforms.push({
                leetcode,
                easySolved : easy,
                mediumSolved : med,
                hardSolved : hard,
                totalSolved : totalProblems
            });
        }
        catch(e){
            console.log("error while fetching leetcode data",e);
            res.status(500).json({message:"server error"});
        }

        try{
            const [response] = await db.query(`
                    SELECT * FROM gfg WHERE userName = ?`,[gfg]
                );
            
            const {school, basic, easy, med, hard, totalProblems} = response[0];

            platforms.push({
                gfg,
                problemsSolved : totalProblems,
                pd : [
                    school,basic,easy,med,hard
                ]
            });
        }
        catch(e){
            console.log("error while fetching geeksforgeeks data",e);
            res.status(500).json({message:"server error"});
        }
        
        try{
            const [response] = await db.query(`
                    SELECT * FROM codechef WHERE userName = ?`,[codechef]
                );

            const {totalProblems, rating} = response[0];

            platforms.push({
                totalProblems,
                rating,
                codechef
            });
        }
        catch(e){
            console.log("error while fetching codechef data",e);
            res.status(500).json({message:"server error"});
        }

        res.status(200).json({platforms});
    } 
    catch(e) {
        console.log('Error while fetching coding stats info : ', e);
        res.status(500).json({message : 'Server Error'});
    }
}
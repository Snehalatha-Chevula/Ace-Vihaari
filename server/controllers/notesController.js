const db = require("../models/db");
const uploadTodrive = require('../utils/driveUploader');



const DRIVE_FOLDER_ID = '1Yj1JrGg5Yf6plcKMbpcjsVr6OisYHG2m'; 
exports.getNotes = async (req,res) => {
    const userID = req.params.userID;
    try {
        let role = userID.toLowerCase().charAt(0) == 'f' ? "faculty" : "student";
        let notes;
        if(role == 'student')
            [notes] =await db.query(`SELECT * FROM notes`);
        else
            [notes] =await db.query(`SELECT * FROM notes WHERE facultyID = ?`,[userID]);
        return res.status(200).json(notes);
    }
    catch(e){
        console.log('Unable to fetch notes',e);
        res.status(500);
    }
}

exports.uploadToDrive = async(req,res) =>{
    try {
       const result = await uploadTodrive(req.file, DRIVE_FOLDER_ID);

        res.status(200).json({ 
        message: 'Uploaded successfully', 
        file: result,
        metadata: {
            originalName: req.file.originalname,
            mimeType: req.file.mimetype,
            sizeInBytes: req.file.size,
            sizeInMB: (req.file.size / (1024 * 1024)).toFixed(2),
            format: req.file.originalname.split('.').pop(),
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
}

exports.uploadToDatabase = async (req,res) => {
  const {title, description, subject, fileType, size, uploadedBy, url, facultyID} = req.body;
  try {
    await db.query(`
          INSERT INTO notes (title, Notesdescription, Notessubject, fileType, size, uploadedBy, url, facultyID) VALUES
          (?, ?, ?, ?, ?, ?, ?, ?);` ,
          [title, description, subject, fileType, size, uploadedBy, url, facultyID],
          (err, result) => {
                if (err) return res.status(500).json(err);
          }
    );

    res.status(200).json({message : 'Notes uploaded successfully'});
  }
  catch(e) {
    console.log('Error while uploading notes',e);
    res.status(500).json({message : 'Server error'});
  }

};

exports.incrementView = async(req,res)=>{
    try{
        const {noteID} = req.body;
        await db.query(`UPDATE notes SET viewcnt = (viewcnt + 1) WHERE id = ?`,[noteID],
            (err, result) => {
                if (err) return res.status(500).json(err);
            }
        );
         res.status(200).json({message : 'Views incremented successfully'});
    }
    catch(e) {
    console.log('Error while incrementing views',e);
    res.status(500).json({message : 'Server error'});
  }
  
}
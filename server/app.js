// app.js
const db = require('./models/db');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const authRoutes = require('./routes/authRoute');
const dashboardRoutes = require('./routes/dashboardRoute');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.get('/api/notes', async (req,res) => {
    try {
        let [notes] =await db.query(`SELECT * FROM notes`);
        return res.status(200).json(notes);
    }
    catch(e){
        console.log('Unable to fetch notes',e);
        res.status(500);
    }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
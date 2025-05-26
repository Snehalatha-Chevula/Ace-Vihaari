// app.js
const db = require('./models/db');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const authRoutes = require('./routes/authRoute');
const dashboardRoutes = require('./routes/dashboardRoute');
const profileRoutes = require('./routes/profileRoute');
const leaderboardRoutes = require('./routes/leaderboardRoute');
const notificationRoutes = require('./routes/notificationsRoute');
const notesRoutes = require('./routes/notesRoute');
const uploadRoutes = require('./routes/uploadRoute');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/profile',profileRoutes);
app.use('/api/leaderboard',leaderboardRoutes);
app.use('/api/notifications',notificationRoutes);
app.use('/api/notes',notesRoutes);
app.use('/api',uploadRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
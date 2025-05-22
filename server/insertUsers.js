require('dotenv').config();

const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

console.log(process.env.DB_USER, process.env.DB_PASSWORD, process.env.DB_NAME);

const users = [
  {
    username: 'S_22AG1A6677',
    password: 'Sneha@{1521}',
  },
  {
    username: 'S_22AG1A6692',
    password: 'Rajesh@{2003}',
  },
  {
    username: 'S_22AG1A66B5',
    password: 'Pandhi@{gunna1}',
  },
  {
    username: 'F_1',
    password: '123',
  },
  {
    username: 'F_2',
    password: '456',
  }
];

(async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
    });

    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);

      const table = 'users';

      const [rows] = await connection.execute(
        `INSERT INTO ${table} (userID, userPassword) VALUES (?, ?)`,
        [user.username, hashedPassword]
      );

      console.log(`✅ Inserted into ${table}: ${user.username}`);
    }

    await connection.end();
    console.log('✅ All insertions complete!');
  } catch (err) {
    console.error('❌ Error inserting users:', err.message);
  }
})();
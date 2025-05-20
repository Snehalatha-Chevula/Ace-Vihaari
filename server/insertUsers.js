require('dotenv').config();

const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

console.log(process.env.DB_USER, process.env.DB_PASSWORD, process.env.DB_NAME);

const users = [
  {
    role: 'student',
    username: 'sneha',
    password: '123456',
    email: 'student1@example.com',
  },
  {
    role: 'faculty',
    username: 'rajesh',
    password: 'rajesh123',
    email: 'faculty1@example.com',
  },
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

      const table = user.role === 'student' ? 'students' : 'faculty';

      const [rows] = await connection.execute(
        `INSERT INTO ${table} (username, password, email) VALUES (?, ?, ?)`,
        [user.username, hashedPassword, user.email]
      );

      console.log(`✅ Inserted into ${table}: ${user.username}`);
    }

    await connection.end();
    console.log('✅ All insertions complete!');
  } catch (err) {
    console.error('❌ Error inserting users:', err.message);
  }
})();
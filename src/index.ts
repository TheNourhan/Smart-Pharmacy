import express from 'express';
import dotenv from 'dotenv';
import mysql from 'mysql2';

dotenv.config();
const app = express();

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'db',
    user: process.env.DB_USER || 'root',
    password: process.env.MYSQL_ROOT_PASSWORD || 'example',
    database: process.env.MYSQL_DATABASE || 'smart-pharmacy-db'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database.');
});

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.listen(3000, () => {
    console.log(`Server running on port: ${3000}`);
});

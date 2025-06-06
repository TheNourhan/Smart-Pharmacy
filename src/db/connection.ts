const mysql = require('mysql2');

export const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.MYSQL_ROOT_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

db.connect((err: any) => {
  if (err) {
    console.error('Error connecting:', err.stack);
    return;
  }
  console.log('Connected as id ' + db.threadId);
});

import mysql from 'mysql2/promise';

// 创建数据库连接池
const pool = mysql.createPool({
  host: 'localhost',
  port: 3306,
  user: 'tracker_user',
  password: 'sql19980.',
  database: 'airhelp_tracker',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// 测试连接
pool.getConnection()
  .then(connection => {
    console.log('✅ Database connected successfully');
    connection.release();
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err.message);
  });

export default pool;

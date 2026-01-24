import pool from './models/db';

async function testConnection() {
  try {
    console.log('Testing database connection...');
    
    // 测试查询
    const [rows] = await pool.query('SELECT * FROM short_links LIMIT 5');
    
    console.log('✅ Database connection successful!');
    console.log(`Found ${(rows as any[]).length} short links`);
    
    // 测试点击事件
    const [clickRows] = await pool.query('SELECT COUNT(*) as count FROM click_events');
    console.log(`Total click events: ${(clickRows as any[])[0].count}`);
    
    // 测试按钮点击
    const [buttonRows] = await pool.query('SELECT COUNT(*) as count FROM button_clicks');
    console.log(`Total button clicks: ${(buttonRows as any[])[0].count}`);
    
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error(error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

testConnection();

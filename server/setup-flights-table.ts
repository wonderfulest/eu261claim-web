import pool from './models/db';

async function setupFlightsTable() {
  try {
    console.log('Dropping existing table if exists...');
    await pool.query('DROP TABLE IF EXISTS compensable_flights');
    
    console.log('Creating compensable_flights table...');
    
    // Create table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS compensable_flights (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        flight_number VARCHAR(20) NOT NULL COMMENT '航班号',
        airline_name VARCHAR(100) NOT NULL COMMENT '航司名称',
        scheduled_departure DATETIME NOT NULL COMMENT '计划起飞时间',
        scheduled_arrival DATETIME NOT NULL COMMENT '计划落地时间',
        actual_departure DATETIME COMMENT '实际起飞时间',
        actual_arrival DATETIME COMMENT '实际落地时间',
        cabin_class VARCHAR(50) COMMENT '舱位等级',
        cabin_code VARCHAR(10) COMMENT '舱位代码',
        compensation_min INT NOT NULL COMMENT '最低赔偿金额(欧元)',
        compensation_max INT NOT NULL COMMENT '最高赔偿金额(欧元)',
        is_active BOOLEAN NOT NULL DEFAULT TRUE COMMENT '是否激活',
        created_at DATETIME NOT NULL COMMENT '创建时间',
        updated_at DATETIME NOT NULL COMMENT '更新时间',
        INDEX idx_flight_number (flight_number),
        INDEX idx_scheduled_departure (scheduled_departure)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='可理赔航班表'
    `);
    
    console.log('✅ Table created successfully');
    
    // Insert sample data
    console.log('Inserting sample data...');
    await pool.query(`
      INSERT INTO compensable_flights (
        flight_number, airline_name, 
        scheduled_departure, scheduled_arrival,
        actual_departure, actual_arrival,
        cabin_class, cabin_code,
        compensation_min, compensation_max,
        is_active, created_at, updated_at
      ) VALUES
      ('LH123', '汉莎航空', 
       '2026-01-15 10:00:00', '2026-01-15 14:30:00',
       '2026-01-15 13:45:00', '2026-01-15 18:15:00',
       '经济舱', 'Y', 400, 600, TRUE, NOW(), NOW()),
      ('AF456', '法国航空',
       '2026-01-16 08:30:00', '2026-01-16 12:00:00',
       '2026-01-16 12:15:00', '2026-01-16 15:45:00',
       '商务舱', 'C', 400, 600, TRUE, NOW(), NOW()),
      ('BA789', '英国航空',
       '2026-01-17 15:20:00', '2026-01-17 18:50:00',
       NULL, NULL, '经济舱', 'Y', 250, 400, TRUE, NOW(), NOW()),
      ('KL234', '荷兰皇家航空',
       '2026-01-18 06:45:00', '2026-01-18 11:30:00',
       '2026-01-18 10:30:00', '2026-01-18 15:15:00',
       '经济舱', 'Y', 400, 600, TRUE, NOW(), NOW()),
      ('IB567', '西班牙国家航空',
       '2026-01-19 14:00:00', '2026-01-19 17:20:00',
       '2026-01-19 17:50:00', '2026-01-19 21:10:00',
       '经济舱', 'Y', 250, 400, TRUE, NOW(), NOW())
    `);
    
    console.log('✅ Sample data inserted successfully');
    
    // Verify
    const [rows] = await pool.query('SELECT COUNT(*) as count FROM compensable_flights');
    console.log(`✅ Total flights in database: ${(rows as any)[0].count}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

setupFlightsTable();

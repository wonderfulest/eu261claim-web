# Node.js 后端迁移到 Java 后端指南

## 背景
当前 `eu261claim-web` 项目的 `server/` 目录包含 Node.js 后端代码，需要将其功能迁移到独立的 Java 项目 `eu261claim-api` 中。

## 需要迁移的功能

### 1. Flights API（航班查询接口）
**前端调用：** `GET /api/flights/search`

**Node.js 实现位置：**
- Controller: `server/routes/flights.ts`
- Service: `server/services/FlightService.ts`
- 数据库表: `flights` 表

**接口规格：**
```typescript
// 请求参数
GET /api/flights/search?page=0&size=10&flightNumber=&airlineName=&scheduledDepartureDate=

// 响应格式
{
  "flights": [
    {
      "id": 1,
      "flightNumber": "BA123",
      "airlineName": "British Airways",
      "scheduledDeparture": "2024-01-20T10:00:00",
      "actualDeparture": "2024-01-20T12:30:00"
    }
  ],
  "currentPage": 0,
  "totalPages": 5,
  "totalElements": 50
}
```

**业务逻辑：**
- 支持分页查询（page, size）
- 支持按航班号模糊搜索（flightNumber）
- 支持按航空公司名称模糊搜索（airlineName）
- 支持按计划起飞日期精确搜索（scheduledDepartureDate）

### 2. Tracker API（短链接追踪接口）
**前端调用：** `POST /api/tracker/button-click`

**Node.js 实现位置：**
- Controller: `server/routes/tracker.ts`
- Controller: `server/controllers/TrackerController.ts`
- Service: `server/services/TrackerService.ts`
- Utils: `server/utils/utm.ts`, `server/utils/anonymize.ts`
- 数据库表: `tracker_links`, `tracker_clicks` 表

**接口规格：**
```typescript
// 请求
POST /api/tracker/button-click
{
  "shortId": "abc123"
}

// 响应
{
  "success": true
}
```

**业务逻辑：**
1. 接收 shortId
2. 查询 tracker_links 表获取链接信息
3. 解析 UTM 参数（utm_source, utm_medium, utm_campaign 等）
4. 匿名化用户 IP 地址（隐私保护）
5. 记录点击事件到 tracker_clicks 表
6. 返回成功响应

**关键功能：**
- UTM 参数解析：`server/utils/utm.ts`
- IP 匿名化：`server/utils/anonymize.ts`（将 IP 最后一段替换为 0）

## 数据库表结构

### flights 表
```sql
CREATE TABLE flights (
  id INT PRIMARY KEY AUTO_INCREMENT,
  flight_number VARCHAR(20) NOT NULL,
  airline_name VARCHAR(100) NOT NULL,
  scheduled_departure DATETIME NOT NULL,
  actual_departure DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_flight_number (flight_number),
  INDEX idx_airline_name (airline_name),
  INDEX idx_scheduled_departure (scheduled_departure)
);
```

### tracker_links 表
```sql
CREATE TABLE tracker_links (
  id INT PRIMARY KEY AUTO_INCREMENT,
  short_id VARCHAR(50) UNIQUE NOT NULL,
  original_url TEXT NOT NULL,
  utm_source VARCHAR(100),
  utm_medium VARCHAR(100),
  utm_campaign VARCHAR(100),
  utm_term VARCHAR(100),
  utm_content VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_short_id (short_id)
);
```

### tracker_clicks 表
```sql
CREATE TABLE tracker_clicks (
  id INT PRIMARY KEY AUTO_INCREMENT,
  link_id INT NOT NULL,
  short_id VARCHAR(50) NOT NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
  referer TEXT,
  utm_source VARCHAR(100),
  utm_medium VARCHAR(100),
  utm_campaign VARCHAR(100),
  utm_term VARCHAR(100),
  utm_content VARCHAR(100),
  clicked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (link_id) REFERENCES tracker_links(id),
  INDEX idx_link_id (link_id),
  INDEX idx_short_id (short_id),
  INDEX idx_clicked_at (clicked_at)
);
```

## Java 实现清单

### 需要创建的文件

#### 1. Flights 功能
```
src/main/java/com/wukong/eu261claim/modules/flight/
├── controller/
│   └── FlightController.java
├── service/
│   ├── FlightService.java
│   └── impl/
│       └── FlightServiceImpl.java
├── mapper/
│   └── FlightMapper.java
├── entity/
│   └── Flight.java
└── dto/
    ├── FlightSearchRequest.java
    └── FlightSearchResponse.java

src/main/resources/mapper/
└── FlightMapper.xml
```

#### 2. Tracker 功能
```
src/main/java/com/wukong/eu261claim/modules/tracker/
├── controller/
│   └── TrackerController.java
├── service/
│   ├── TrackerService.java
│   └── impl/
│       └── TrackerServiceImpl.java
├── mapper/
│   ├── TrackerLinkMapper.java
│   └── TrackerClickMapper.java
├── entity/
│   ├── TrackerLink.java
│   └── TrackerClick.java
├── dto/
│   └── ButtonClickRequest.java
└── util/
    ├── UtmParser.java
    └── IpAnonymizer.java

src/main/resources/mapper/
├── TrackerLinkMapper.xml
└── TrackerClickMapper.xml
```

## 关键实现要点

### 1. IP 匿名化
```java
// 参考 server/utils/anonymize.ts
// 将 IP 地址最后一段替换为 0
// 例如: 192.168.1.100 -> 192.168.1.0
public static String anonymizeIp(String ip) {
    if (ip == null || ip.isEmpty()) return null;
    
    // IPv4
    if (ip.contains(".")) {
        String[] parts = ip.split("\\.");
        if (parts.length == 4) {
            parts[3] = "0";
            return String.join(".", parts);
        }
    }
    
    // IPv6 - 保留前 64 位
    if (ip.contains(":")) {
        String[] parts = ip.split(":");
        if (parts.length >= 4) {
            return String.join(":", Arrays.copyOfRange(parts, 0, 4)) + "::";
        }
    }
    
    return ip;
}
```

### 2. UTM 参数解析
```java
// 参考 server/utils/utm.ts
// 从 URL 中提取 UTM 参数
public static Map<String, String> parseUtmParams(String url) {
    Map<String, String> utmParams = new HashMap<>();
    String[] utmKeys = {"utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"};
    
    try {
        URL urlObj = new URL(url);
        String query = urlObj.getQuery();
        if (query != null) {
            for (String param : query.split("&")) {
                String[] pair = param.split("=");
                if (pair.length == 2 && Arrays.asList(utmKeys).contains(pair[0])) {
                    utmParams.put(pair[0], URLDecoder.decode(pair[1], "UTF-8"));
                }
            }
        }
    } catch (Exception e) {
        // Handle exception
    }
    
    return utmParams;
}
```

### 3. CORS 配置
确保 Java 后端允许来自 `www.eu261claim.com` 的跨域请求：

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("https://www.eu261claim.com", "http://localhost:5173")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

## 测试验证

### 1. Flights API 测试
```bash
curl "http://localhost:9000/api/flights/search?page=0&size=10"
```

### 2. Tracker API 测试
```bash
curl -X POST http://localhost:9000/api/tracker/button-click \
  -H "Content-Type: application/json" \
  -d '{"shortId":"abc123"}'
```

## 部署后验证

1. 确保 Java 后端运行在 `api.eu261claim.com`
2. 测试前端调用是否正常
3. 检查数据库记录是否正确写入
4. 验证 CORS 配置是否生效

## 完整的 Node.js 代码参考

### FlightService.ts 完整实现
```typescript
// 关键逻辑：
// 1. 动态构建 WHERE 条件（支持模糊搜索和日期过滤）
// 2. 先查询总数，再分页查询数据
// 3. 使用 LIMIT 和 OFFSET 实现分页
// 4. 字段映射：snake_case (DB) -> camelCase (API)

async searchFlights(params: FlightSearchParams): Promise<FlightSearchResponse> {
  const { flightNumber, airlineName, scheduledDepartureDate, page = 0, size = 10 } = params;
  
  // 构建 WHERE 条件
  const conditions: string[] = ['is_active = TRUE'];
  const values: any[] = [];
  
  if (flightNumber) {
    conditions.push('flight_number LIKE ?');
    values.push(`%${flightNumber}%`);
  }
  
  if (airlineName) {
    conditions.push('airline_name LIKE ?');
    values.push(`%${airlineName}%`);
  }
  
  if (scheduledDepartureDate) {
    conditions.push('DATE(scheduled_departure) = ?');
    values.push(scheduledDepartureDate);
  }
  
  const whereClause = conditions.join(' AND ');
  
  // 查询总数
  const countQuery = `SELECT COUNT(*) as total FROM compensable_flights WHERE ${whereClause}`;
  const totalElements = /* 执行查询 */;
  const totalPages = Math.ceil(totalElements / size);
  
  // 分页查询
  const offset = page * size;
  const dataQuery = `
    SELECT * FROM compensable_flights 
    WHERE ${whereClause}
    ORDER BY scheduled_departure DESC
    LIMIT ? OFFSET ?
  `;
  
  return { flights, currentPage: page, pageSize: size, totalElements, totalPages };
}
```

### TrackerController.ts 关键逻辑
```typescript
// 按钮点击处理流程：
// 1. 验证请求参数（shortId）
// 2. 提取并匿名化 IP 地址
// 3. 提取 UTM 参数
// 4. 记录点击事件到数据库
// 5. 返回成功响应

async handleButtonClick(req: Request, res: Response) {
  const { shortId } = req.body;
  
  // 验证短链接存在
  const shortLink = await trackerService.resolveShortLink(shortId);
  if (!shortLink) {
    return res.status(404).json({ error: 'Short link not found' });
  }
  
  // 提取并匿名化 IP
  const ipAddress = extractAndAnonymizeIP(req.headers, req.ip);
  
  // 提取 UTM 参数
  const utmParams = extractUTMFromQuery(req.query);
  
  // 记录点击
  await trackerService.recordClickEvent({
    shortId,
    ipAddress,
    userAgent: req.get('user-agent'),
    referrer: req.get('referer'),
    utmParams
  });
  
  res.json({ success: true });
}
```

### anonymize.ts 核心算法
```typescript
// IPv4 匿名化：192.168.1.100 -> 192.168.1.0
export function anonymizeIPv4(ip: string): string {
  const parts = ip.split('.');
  if (parts.length !== 4) throw new Error('Invalid IPv4');
  parts[3] = '0';  // 替换最后一段
  return parts.join('.');
}

// IPv6 匿名化：保留前 64 位
export function anonymizeIPv6(ip: string): string {
  const parts = ip.split(':');
  return parts.slice(0, 4).concat(['', '']).join(':');
}

// 自动检测并匿名化
export function anonymizeIP(ip: string): string | null {
  if (ip.includes(':')) return anonymizeIPv6(ip);
  if (ip.includes('.')) return anonymizeIPv4(ip);
  return null;
}
```

### utm.ts 核心算法
```typescript
// 从查询参数中提取 UTM
export function extractUTMFromQuery(query: Record<string, any>): UTMParams {
  const params: UTMParams = {};
  
  if (query.utm_source) params.utm_source = query.utm_source;
  if (query.utm_medium) params.utm_medium = query.utm_medium;
  if (query.utm_campaign) params.utm_campaign = query.utm_campaign;
  if (query.utm_content) params.utm_content = query.utm_content;
  if (query.utm_term) params.utm_term = query.utm_term;
  
  return params;
}

// 验证并截断过长的参数
export function validateUTMParams(params: UTMParams, maxLength = 100): UTMParams {
  const validated: UTMParams = {};
  
  if (params.utm_source) {
    validated.utm_source = params.utm_source.substring(0, maxLength);
  }
  // ... 其他参数同理
  
  return validated;
}
```

## 参考文件
- Node.js Flights 实现: `server/routes/flights.ts`, `server/services/FlightService.ts`
- Node.js Tracker 实现: `server/routes/tracker.ts`, `server/controllers/TrackerController.ts`, `server/services/TrackerService.ts`
- 工具函数: `server/utils/utm.ts`, `server/utils/anonymize.ts`
- 数据库设置: `server/setup-flights-table.ts`

## 总结

这份指南包含了所有必要的信息来在 Java 项目中重新实现 Node.js 后端的功能：
- ✅ 完整的接口规格和响应格式
- ✅ 详细的数据库表结构
- ✅ 核心业务逻辑和算法
- ✅ 关键代码示例
- ✅ 测试和部署指南

只需将这份文档放到 `eu261claim-api` 项目中，即可开始实现。

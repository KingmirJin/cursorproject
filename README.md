# 🚀 全栈待办事项应用

一个现代化的全栈待办事项管理应用，使用 Node.js + Express + SQLite 后端和原生 JavaScript 前端。

## ✨ 功能特性

### 🔐 用户认证
- 用户注册和登录
- JWT令牌认证
- 安全的密码加密
- 会话管理

### 📝 待办事项管理
- 添加、编辑、删除待办事项
- 标记完成/未完成状态
- 过滤显示（全部/进行中/已完成）
- 批量删除已完成任务
- 实时数据同步

### 🎨 用户体验
- 现代化响应式设计
- 流畅的动画效果
- 实时通知反馈
- 键盘快捷键支持
- 移动端适配

### 🔧 技术特性
- RESTful API设计
- SQLite数据库
- JWT身份验证
- 速率限制保护
- 安全中间件
- 错误处理机制

## 🛠️ 技术栈

### 后端
- **Node.js** - JavaScript运行时
- **Express.js** - Web框架
- **SQLite3** - 轻量级数据库
- **JWT** - 身份验证
- **bcryptjs** - 密码加密
- **CORS** - 跨域支持
- **Helmet** - 安全中间件

### 前端
- **原生JavaScript** - 无框架依赖
- **HTML5** - 语义化标记
- **CSS3** - 现代样式
- **Font Awesome** - 图标库

## 📦 安装和运行

### 1. 安装依赖
```bash
npm install
```

### 2. 初始化数据库
```bash
npm run init-db
```

### 3. 启动服务器
```bash
# 开发模式（自动重启）
npm run dev

# 生产模式
npm start
```

### 4. 访问应用
打开浏览器访问: http://localhost:3000

## 🔑 默认账户

应用会自动创建一个演示账户：
- **用户名**: demo
- **密码**: password

## 📚 API文档

### 认证接口

#### 用户注册
```
POST /api/auth/register
Content-Type: application/json

{
  "username": "用户名",
  "email": "邮箱",
  "password": "密码"
}
```

#### 用户登录
```
POST /api/auth/login
Content-Type: application/json

{
  "username": "用户名",
  "password": "密码"
}
```

#### 验证令牌
```
GET /api/auth/verify
Authorization: Bearer <token>
```

### 待办事项接口

#### 获取待办事项
```
GET /api/todos?filter=all|active|completed
Authorization: Bearer <token>
```

#### 创建待办事项
```
POST /api/todos
Authorization: Bearer <token>
Content-Type: application/json

{
  "text": "待办事项内容"
}
```

#### 更新待办事项
```
PUT /api/todos/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "text": "新内容",
  "completed": true
}
```

#### 删除待办事项
```
DELETE /api/todos/:id
Authorization: Bearer <token>
```

#### 批量删除已完成
```
DELETE /api/todos/completed/batch
Authorization: Bearer <token>
```

## 🗄️ 数据库结构

### users 表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键 |
| username | VARCHAR(50) | 用户名（唯一） |
| email | VARCHAR(100) | 邮箱（唯一） |
| password_hash | VARCHAR(255) | 密码哈希 |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |

### todos 表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键 |
| user_id | INTEGER | 用户ID（外键） |
| text | TEXT | 待办事项内容 |
| completed | BOOLEAN | 是否完成 |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |

## 🔒 安全特性

- **密码加密**: 使用bcryptjs进行密码哈希
- **JWT认证**: 安全的令牌认证机制
- **速率限制**: 防止API滥用
- **CORS保护**: 跨域请求控制
- **输入验证**: 严格的数据验证
- **SQL注入防护**: 参数化查询

## 🚀 部署指南

### 生产环境配置

1. **环境变量**
```bash
NODE_ENV=production
JWT_SECRET=your-super-secure-secret-key
PORT=3000
```

2. **数据库备份**
```bash
# 备份SQLite数据库
cp database/todos.db backup/todos-$(date +%Y%m%d).db
```

3. **进程管理**
```bash
# 使用PM2管理进程
npm install -g pm2
pm2 start server.js --name "todo-app"
pm2 save
pm2 startup
```

## 🐛 故障排除

### 常见问题

1. **数据库连接失败**
   - 检查数据库文件权限
   - 确保SQLite3已正确安装

2. **认证失败**
   - 检查JWT_SECRET配置
   - 验证令牌是否过期

3. **CORS错误**
   - 检查FRONTEND_URL配置
   - 确保域名匹配

## 📈 性能优化

- 数据库索引优化
- API响应缓存
- 静态资源压缩
- 连接池管理

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建Pull Request

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 📞 支持

如有问题，请提交Issue或联系开发者。

---

**享受你的待办事项管理体验！** 🎉

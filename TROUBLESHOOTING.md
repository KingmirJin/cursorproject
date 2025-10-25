# 🔧 故障排除指南

## 常见问题及解决方案

### 1. "model not found" 错误

**问题描述**: 运行 `npm run init-db` 后仍然出现 "model not found" 错误。

**原因**: 数据库初始化过程中的异步操作没有正确等待完成。

**解决方案**:
```bash
# 1. 删除现有数据库文件
rm database/todos.db

# 2. 重新初始化数据库
npm run init-db

# 3. 验证数据库
node scripts/verify-db.js
```

### 2. 服务器启动失败

**问题描述**: 运行 `npm start` 时出现路由错误。

**原因**: 路由导入方式不正确。

**解决方案**:
```bash
# 检查路由文件是否正确导出
# 确保 server.js 中的导入方式正确
```

### 3. 依赖安装失败

**问题描述**: `npm install` 失败。

**解决方案**:
```bash
# 清理缓存并重新安装
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### 4. 端口占用

**问题描述**: 端口3000被占用。

**解决方案**:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <进程ID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### 5. 数据库连接失败

**问题描述**: 无法连接到SQLite数据库。

**解决方案**:
```bash
# 检查数据库文件权限
ls -la database/todos.db

# 重新创建数据库
rm database/todos.db
npm run init-db
```

### 6. 认证失败

**问题描述**: 登录时提示认证失败。

**解决方案**:
```bash
# 检查默认用户是否存在
node -e "
const { getDatabase } = require('./database/init');
const db = getDatabase();
db.get('SELECT * FROM users WHERE username = ?', ['demo'], (err, user) => {
  if (err) console.error(err);
  else console.log('用户:', user);
  db.close();
});
"
```

## 🔍 调试步骤

### 1. 检查服务器状态
```bash
# 检查端口是否监听
netstat -an | findstr :3000

# 测试健康检查
curl http://localhost:3000/api/health
```

### 2. 检查数据库状态
```bash
# 验证数据库结构
node scripts/verify-db.js

# 检查数据库文件
ls -la database/
```

### 3. 检查日志
```bash
# 查看服务器日志
npm start

# 查看详细错误
DEBUG=* npm start
```

## 🚀 快速修复

如果遇到问题，按以下顺序执行：

```bash
# 1. 停止所有进程
# 按 Ctrl+C 停止服务器

# 2. 清理并重新安装
rm -rf node_modules package-lock.json
npm install

# 3. 重新初始化数据库
rm database/todos.db
npm run init-db

# 4. 验证数据库
node scripts/verify-db.js

# 5. 启动服务器
npm start
```

## 📞 获取帮助

如果问题仍然存在：

1. 检查Node.js版本: `node --version` (推荐 v16+)
2. 检查npm版本: `npm --version`
3. 查看完整错误日志
4. 提交Issue到项目仓库

## 🔧 开发模式

使用开发模式启动（自动重启）：
```bash
npm run dev
```

使用测试模式验证API：
```bash
npm run test-db
```

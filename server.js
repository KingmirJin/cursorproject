const express = require('express');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
require('dotenv').config();

const todoRoutes = require('./routes/todos');
const { router: authRoutes } = require('./routes/auth');
const { initDatabase } = require('./database/init');

const app = express();
const PORT = process.env.PORT || 3000;

// 安全中间件
app.use(helmet({
    contentSecurityPolicy: false, // 允许内联脚本用于开发
}));

// 速率限制
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15分钟
    max: 100, // 限制每个IP 15分钟内最多100个请求
    message: {
        error: '请求过于频繁，请稍后再试'
    }
});
app.use('/api/', limiter);

// CORS配置
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));

// 解析JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 静态文件服务
app.use(express.static(path.join(__dirname, 'public')));

// API路由
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

// 健康检查端点
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// 404处理
app.use('/api/*', (req, res) => {
    res.status(404).json({
        error: 'API端点不存在',
        path: req.path
    });
});

// 错误处理中间件
app.use((err, req, res, next) => {
    console.error('服务器错误:', err);
    
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            error: '数据验证失败',
            details: err.message
        });
    }
    
    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({
            error: '未授权访问'
        });
    }
    
    res.status(500).json({
        error: '服务器内部错误',
        message: process.env.NODE_ENV === 'development' ? err.message : '请稍后重试'
    });
});

// 启动服务器
async function startServer() {
    try {
        // 初始化数据库
        await initDatabase();
        console.log('✅ 数据库初始化完成');
        
        app.listen(PORT, () => {
            console.log(`🚀 服务器运行在 http://localhost:${PORT}`);
            console.log(`📊 健康检查: http://localhost:${PORT}/api/health`);
            console.log(`🌐 前端页面: http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ 服务器启动失败:', error);
        process.exit(1);
    }
}

startServer();

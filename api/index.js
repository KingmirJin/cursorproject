// Vercel API路由 - 主入口
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// 中间件
app.use(cors({
    origin: '*', // 允许所有来源
    credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 静态文件服务
app.use(express.static(path.join(__dirname, '../public')));

// 健康检查
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        message: 'Todo App API is running on Vercel!'
    });
});

// 模拟数据存储（内存中）
let todos = [];
let users = [
    {
        id: 1,
        username: 'demo',
        email: 'demo@example.com',
        password_hash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' // password
    }
];

// 认证中间件
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: '访问令牌缺失' });
    }

    // 简单的token验证（生产环境应该使用JWT）
    if (token === 'demo-token') {
        req.user = { userId: 1 };
        next();
    } else {
        return res.status(403).json({ error: '访问令牌无效' });
    }
}

// 用户认证路由
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            error: '用户名和密码都是必填项'
        });
    }

    const user = users.find(u => u.username === username);
    if (!user) {
        return res.status(401).json({
            error: '用户名或密码错误'
        });
    }

    // 简单密码验证（生产环境应该使用bcrypt）
    if (password === 'password') {
        res.json({
            message: '登录成功',
            token: 'demo-token',
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });
    } else {
        res.status(401).json({
            error: '用户名或密码错误'
        });
    }
});

app.post('/api/auth/register', (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({
            error: '用户名、邮箱和密码都是必填项'
        });
    }

    const existingUser = users.find(u => u.username === username || u.email === email);
    if (existingUser) {
        return res.status(400).json({
            error: '用户名或邮箱已存在'
        });
    }

    const newUser = {
        id: users.length + 1,
        username,
        email,
        password_hash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
    };

    users.push(newUser);

    res.status(201).json({
        message: '用户注册成功',
        token: 'demo-token',
        user: {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email
        }
    });
});

app.get('/api/auth/verify', authenticateToken, (req, res) => {
    res.json({ 
        valid: true, 
        userId: req.user.userId 
    });
});

// 待办事项路由
app.get('/api/todos', authenticateToken, (req, res) => {
    const { filter = 'all' } = req.query;
    let filteredTodos = todos.filter(t => t.user_id === req.user.userId);
    
    if (filter === 'active') {
        filteredTodos = filteredTodos.filter(t => !t.completed);
    } else if (filter === 'completed') {
        filteredTodos = filteredTodos.filter(t => t.completed);
    }
    
    res.json({
        todos: filteredTodos,
        count: filteredTodos.length,
        filter
    });
});

app.post('/api/todos', authenticateToken, (req, res) => {
    const { text } = req.body;
    
    if (!text || text.trim() === '') {
        return res.status(400).json({
            error: '待办事项内容不能为空'
        });
    }
    
    const newTodo = {
        id: Date.now(),
        user_id: req.user.userId,
        text: text.trim(),
        completed: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };
    
    todos.push(newTodo);
    
    res.status(201).json({
        message: '待办事项创建成功',
        todo: newTodo
    });
});

app.put('/api/todos/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const { text, completed } = req.body;
    
    const todoIndex = todos.findIndex(t => t.id === parseInt(id) && t.user_id === req.user.userId);
    
    if (todoIndex === -1) {
        return res.status(404).json({ error: '待办事项不存在' });
    }
    
    if (text !== undefined) {
        todos[todoIndex].text = text.trim();
    }
    
    if (completed !== undefined) {
        todos[todoIndex].completed = completed;
    }
    
    todos[todoIndex].updated_at = new Date().toISOString();
    
    res.json({
        message: '待办事项更新成功',
        todo: todos[todoIndex]
    });
});

app.delete('/api/todos/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    
    const todoIndex = todos.findIndex(t => t.id === parseInt(id) && t.user_id === req.user.userId);
    
    if (todoIndex === -1) {
        return res.status(404).json({ error: '待办事项不存在' });
    }
    
    todos.splice(todoIndex, 1);
    
    res.json({
        message: '待办事项删除成功',
        deletedId: parseInt(id)
    });
});

app.delete('/api/todos/completed/batch', authenticateToken, (req, res) => {
    const completedTodos = todos.filter(t => t.user_id === req.user.userId && t.completed);
    todos = todos.filter(t => !(t.user_id === req.user.userId && t.completed));
    
    res.json({
        message: '已完成的待办事项删除成功',
        deletedCount: completedTodos.length
    });
});

// 404处理
app.use('/api/*', (req, res) => {
    res.status(404).json({
        error: 'API端点不存在',
        path: req.path
    });
});

// 错误处理
app.use((err, req, res, next) => {
    console.error('服务器错误:', err);
    res.status(500).json({
        error: '服务器内部错误',
        message: err.message
    });
});

module.exports = app;

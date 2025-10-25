const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDatabase } = require('../database/init');

const router = express.Router();

// JWT密钥
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// 生成JWT令牌
function generateToken(userId) {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '24h' });
}

// 验证JWT中间件
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: '访问令牌缺失' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: '访问令牌无效' });
        }
        req.user = user;
        next();
    });
}

// 用户注册
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // 验证输入
        if (!username || !email || !password) {
            return res.status(400).json({
                error: '用户名、邮箱和密码都是必填项'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                error: '密码长度至少6位'
            });
        }

        const db = getDatabase();
        
        // 检查用户是否已存在
        db.get('SELECT id FROM users WHERE username = ? OR email = ?', 
            [username, email], (err, row) => {
            if (err) {
                console.error('数据库查询错误:', err);
                return res.status(500).json({ error: '服务器内部错误' });
            }

            if (row) {
                return res.status(400).json({
                    error: '用户名或邮箱已存在'
                });
            }

            // 加密密码
            const saltRounds = 10;
            bcrypt.hash(password, saltRounds, (err, hash) => {
                if (err) {
                    console.error('密码加密错误:', err);
                    return res.status(500).json({ error: '服务器内部错误' });
                }

                // 创建用户
                db.run(
                    'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
                    [username, email, hash],
                    function(err) {
                        if (err) {
                            console.error('用户创建错误:', err);
                            return res.status(500).json({ error: '服务器内部错误' });
                        }

                        const token = generateToken(this.lastID);
                        res.status(201).json({
                            message: '用户注册成功',
                            token,
                            user: {
                                id: this.lastID,
                                username,
                                email
                            }
                        });
                    }
                );
            });
        });
    } catch (error) {
        console.error('注册错误:', error);
        res.status(500).json({ error: '服务器内部错误' });
    }
});

// 用户登录
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                error: '用户名和密码都是必填项'
            });
        }

        const db = getDatabase();
        
        db.get('SELECT * FROM users WHERE username = ? OR email = ?', 
            [username, username], (err, user) => {
            if (err) {
                console.error('数据库查询错误:', err);
                return res.status(500).json({ error: '服务器内部错误' });
            }

            if (!user) {
                return res.status(401).json({
                    error: '用户名或密码错误'
                });
            }

            // 验证密码
            bcrypt.compare(password, user.password_hash, (err, isMatch) => {
                if (err) {
                    console.error('密码验证错误:', err);
                    return res.status(500).json({ error: '服务器内部错误' });
                }

                if (!isMatch) {
                    return res.status(401).json({
                        error: '用户名或密码错误'
                    });
                }

                const token = generateToken(user.id);
                res.json({
                    message: '登录成功',
                    token,
                    user: {
                        id: user.id,
                        username: user.username,
                        email: user.email
                    }
                });
            });
        });
    } catch (error) {
        console.error('登录错误:', error);
        res.status(500).json({ error: '服务器内部错误' });
    }
});

// 获取当前用户信息
router.get('/me', authenticateToken, (req, res) => {
    try {
        const db = getDatabase();
        
        db.get('SELECT id, username, email, created_at FROM users WHERE id = ?', 
            [req.user.userId], (err, user) => {
            if (err) {
                console.error('数据库查询错误:', err);
                return res.status(500).json({ error: '服务器内部错误' });
            }

            if (!user) {
                return res.status(404).json({ error: '用户不存在' });
            }

            res.json({ user });
        });
    } catch (error) {
        console.error('获取用户信息错误:', error);
        res.status(500).json({ error: '服务器内部错误' });
    }
});

// 验证令牌
router.get('/verify', authenticateToken, (req, res) => {
    res.json({ 
        valid: true, 
        userId: req.user.userId 
    });
});

module.exports = { router, authenticateToken };

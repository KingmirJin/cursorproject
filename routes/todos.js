const express = require('express');
const { getDatabase } = require('../database/init');
const { authenticateToken } = require('./auth');

const router = express.Router();

// 获取所有待办事项
router.get('/', authenticateToken, (req, res) => {
    try {
        const { filter = 'all' } = req.query;
        const db = getDatabase();
        
        let query = 'SELECT * FROM todos WHERE user_id = ?';
        let params = [req.user.userId];
        
        // 根据过滤条件构建查询
        if (filter === 'active') {
            query += ' AND completed = 0';
        } else if (filter === 'completed') {
            query += ' AND completed = 1';
        }
        
        query += ' ORDER BY created_at DESC';
        
        db.all(query, params, (err, todos) => {
            if (err) {
                console.error('数据库查询错误:', err);
                return res.status(500).json({ error: '服务器内部错误' });
            }
            
            res.json({
                todos,
                count: todos.length,
                filter
            });
        });
    } catch (error) {
        console.error('获取待办事项错误:', error);
        res.status(500).json({ error: '服务器内部错误' });
    }
});

// 获取单个待办事项
router.get('/:id', authenticateToken, (req, res) => {
    try {
        const { id } = req.params;
        const db = getDatabase();
        
        db.get('SELECT * FROM todos WHERE id = ? AND user_id = ?', 
            [id, req.user.userId], (err, todo) => {
            if (err) {
                console.error('数据库查询错误:', err);
                return res.status(500).json({ error: '服务器内部错误' });
            }
            
            if (!todo) {
                return res.status(404).json({ error: '待办事项不存在' });
            }
            
            res.json({ todo });
        });
    } catch (error) {
        console.error('获取待办事项错误:', error);
        res.status(500).json({ error: '服务器内部错误' });
    }
});

// 创建待办事项
router.post('/', authenticateToken, (req, res) => {
    try {
        const { text } = req.body;
        
        if (!text || text.trim() === '') {
            return res.status(400).json({
                error: '待办事项内容不能为空'
            });
        }
        
        if (text.length > 500) {
            return res.status(400).json({
                error: '待办事项内容不能超过500个字符'
            });
        }
        
        const db = getDatabase();
        
        db.run(
            'INSERT INTO todos (user_id, text, completed) VALUES (?, ?, ?)',
            [req.user.userId, text.trim(), 0],
            function(err) {
                if (err) {
                    console.error('数据库插入错误:', err);
                    return res.status(500).json({ error: '服务器内部错误' });
                }
                
                // 获取新创建的待办事项
                db.get('SELECT * FROM todos WHERE id = ?', [this.lastID], (err, todo) => {
                    if (err) {
                        console.error('数据库查询错误:', err);
                        return res.status(500).json({ error: '服务器内部错误' });
                    }
                    
                    res.status(201).json({
                        message: '待办事项创建成功',
                        todo
                    });
                });
            }
        );
    } catch (error) {
        console.error('创建待办事项错误:', error);
        res.status(500).json({ error: '服务器内部错误' });
    }
});

// 更新待办事项
router.put('/:id', authenticateToken, (req, res) => {
    try {
        const { id } = req.params;
        const { text, completed } = req.body;
        
        if (text !== undefined && text.trim() === '') {
            return res.status(400).json({
                error: '待办事项内容不能为空'
            });
        }
        
        if (text && text.length > 500) {
            return res.status(400).json({
                error: '待办事项内容不能超过500个字符'
            });
        }
        
        const db = getDatabase();
        
        // 构建更新查询
        let updateFields = [];
        let params = [];
        
        if (text !== undefined) {
            updateFields.push('text = ?');
            params.push(text.trim());
        }
        
        if (completed !== undefined) {
            updateFields.push('completed = ?');
            params.push(completed ? 1 : 0);
        }
        
        if (updateFields.length === 0) {
            return res.status(400).json({
                error: '没有提供要更新的字段'
            });
        }
        
        updateFields.push('updated_at = CURRENT_TIMESTAMP');
        params.push(id, req.user.userId);
        
        const query = `UPDATE todos SET ${updateFields.join(', ')} WHERE id = ? AND user_id = ?`;
        
        db.run(query, params, function(err) {
            if (err) {
                console.error('数据库更新错误:', err);
                return res.status(500).json({ error: '服务器内部错误' });
            }
            
            if (this.changes === 0) {
                return res.status(404).json({ error: '待办事项不存在' });
            }
            
            // 获取更新后的待办事项
            db.get('SELECT * FROM todos WHERE id = ?', [id], (err, todo) => {
                if (err) {
                    console.error('数据库查询错误:', err);
                    return res.status(500).json({ error: '服务器内部错误' });
                }
                
                res.json({
                    message: '待办事项更新成功',
                    todo
                });
            });
        });
    } catch (error) {
        console.error('更新待办事项错误:', error);
        res.status(500).json({ error: '服务器内部错误' });
    }
});

// 删除待办事项
router.delete('/:id', authenticateToken, (req, res) => {
    try {
        const { id } = req.params;
        const db = getDatabase();
        
        db.run('DELETE FROM todos WHERE id = ? AND user_id = ?', 
            [id, req.user.userId], function(err) {
            if (err) {
                console.error('数据库删除错误:', err);
                return res.status(500).json({ error: '服务器内部错误' });
            }
            
            if (this.changes === 0) {
                return res.status(404).json({ error: '待办事项不存在' });
            }
            
            res.json({
                message: '待办事项删除成功',
                deletedId: id
            });
        });
    } catch (error) {
        console.error('删除待办事项错误:', error);
        res.status(500).json({ error: '服务器内部错误' });
    }
});

// 批量删除已完成的待办事项
router.delete('/completed/batch', authenticateToken, (req, res) => {
    try {
        const db = getDatabase();
        
        db.run('DELETE FROM todos WHERE user_id = ? AND completed = 1', 
            [req.user.userId], function(err) {
            if (err) {
                console.error('数据库删除错误:', err);
                return res.status(500).json({ error: '服务器内部错误' });
            }
            
            res.json({
                message: '已完成的待办事项删除成功',
                deletedCount: this.changes
            });
        });
    } catch (error) {
        console.error('批量删除错误:', error);
        res.status(500).json({ error: '服务器内部错误' });
    }
});

// 获取统计信息
router.get('/stats/summary', authenticateToken, (req, res) => {
    try {
        const db = getDatabase();
        
        const queries = [
            'SELECT COUNT(*) as total FROM todos WHERE user_id = ?',
            'SELECT COUNT(*) as active FROM todos WHERE user_id = ? AND completed = 0',
            'SELECT COUNT(*) as completed FROM todos WHERE user_id = ? AND completed = 1'
        ];
        
        const results = {};
        let completedQueries = 0;
        
        queries.forEach((query, index) => {
            const key = index === 0 ? 'total' : index === 1 ? 'active' : 'completed';
            db.get(query, [req.user.userId], (err, row) => {
                if (err) {
                    console.error('统计查询错误:', err);
                    return res.status(500).json({ error: '服务器内部错误' });
                }
                
                results[key] = row[key];
                completedQueries++;
                
                if (completedQueries === queries.length) {
                    res.json({
                        stats: results,
                        userId: req.user.userId
                    });
                }
            });
        });
    } catch (error) {
        console.error('获取统计信息错误:', error);
        res.status(500).json({ error: '服务器内部错误' });
    }
});

module.exports = router;

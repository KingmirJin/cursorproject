const { getDatabase } = require('../database/init');

function verifyDatabase() {
    return new Promise((resolve, reject) => {
        const db = getDatabase();
        
        console.log('🔍 验证数据库结构...');
        
        // 检查用户表
        db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='users'", (err, row) => {
            if (err) {
                console.error('❌ 检查用户表失败:', err.message);
                reject(err);
                return;
            }
            
            if (!row) {
                console.error('❌ 用户表不存在');
                reject(new Error('用户表不存在'));
                return;
            }
            console.log('✅ 用户表存在');
        });
        
        // 检查待办事项表
        db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='todos'", (err, row) => {
            if (err) {
                console.error('❌ 检查待办事项表失败:', err.message);
                reject(err);
                return;
            }
            
            if (!row) {
                console.error('❌ 待办事项表不存在');
                reject(new Error('待办事项表不存在'));
                return;
            }
            console.log('✅ 待办事项表存在');
        });
        
        // 检查默认用户
        db.get('SELECT id, username, email FROM users WHERE username = ?', ['demo'], (err, user) => {
            if (err) {
                console.error('❌ 检查默认用户失败:', err.message);
                reject(err);
                return;
            }
            
            if (!user) {
                console.error('❌ 默认用户不存在');
                reject(new Error('默认用户不存在'));
                return;
            }
            console.log('✅ 默认用户存在:', user);
        });
        
        // 检查表结构
        db.all("PRAGMA table_info(users)", (err, columns) => {
            if (err) {
                console.error('❌ 检查用户表结构失败:', err.message);
                reject(err);
                return;
            }
            console.log('✅ 用户表结构:', columns.map(c => `${c.name}(${c.type})`).join(', '));
        });
        
        db.all("PRAGMA table_info(todos)", (err, columns) => {
            if (err) {
                console.error('❌ 检查待办事项表结构失败:', err.message);
                reject(err);
                return;
            }
            console.log('✅ 待办事项表结构:', columns.map(c => `${c.name}(${c.type})`).join(', '));
        });
        
        // 关闭数据库连接
        db.close((err) => {
            if (err) {
                console.error('❌ 关闭数据库连接失败:', err.message);
                reject(err);
            } else {
                console.log('🎉 数据库验证完成！');
                resolve();
            }
        });
    });
}

// 如果直接运行此脚本
if (require.main === module) {
    verifyDatabase()
        .then(() => {
            console.log('✅ 数据库验证成功');
            process.exit(0);
        })
        .catch((error) => {
            console.error('❌ 数据库验证失败:', error.message);
            process.exit(1);
        });
}

module.exports = { verifyDatabase };

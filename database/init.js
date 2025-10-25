const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, 'todos.db');

// 创建数据库连接
function createConnection() {
    return new sqlite3.Database(DB_PATH, (err) => {
        if (err) {
            console.error('数据库连接失败:', err.message);
            throw err;
        }
        console.log('📦 已连接到SQLite数据库');
    });
}

// 初始化数据库表
async function initDatabase() {
    return new Promise((resolve, reject) => {
        const db = createConnection();
        let completedSteps = 0;
        const totalSteps = 4; // 用户表 + 待办事项表 + 索引 + 默认用户
        
        // 创建用户表
        const createUsersTable = `
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `;
        
        // 创建待办事项表
        const createTodosTable = `
            CREATE TABLE IF NOT EXISTS todos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                text TEXT NOT NULL,
                completed BOOLEAN DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
            )
        `;
        
        // 创建索引
        const createIndexes = [
            'CREATE INDEX IF NOT EXISTS idx_todos_user_id ON todos(user_id)',
            'CREATE INDEX IF NOT EXISTS idx_todos_completed ON todos(completed)',
            'CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)',
            'CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)'
        ];
        
        function checkCompletion() {
            completedSteps++;
            if (completedSteps >= totalSteps) {
                console.log('✅ 数据库初始化完成');
                db.close((err) => {
                    if (err) {
                        console.error('关闭数据库连接失败:', err.message);
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            }
        }
        
        db.serialize(() => {
            // 创建用户表
            db.run(createUsersTable, (err) => {
                if (err) {
                    console.error('创建用户表失败:', err.message);
                    reject(err);
                    return;
                }
                console.log('✅ 用户表创建成功');
                checkCompletion();
            });
            
            // 创建待办事项表
            db.run(createTodosTable, (err) => {
                if (err) {
                    console.error('创建待办事项表失败:', err.message);
                    reject(err);
                    return;
                }
                console.log('✅ 待办事项表创建成功');
                checkCompletion();
            });
            
            // 创建索引
            let indexCompleted = 0;
            createIndexes.forEach((indexSQL, i) => {
                db.run(indexSQL, (err) => {
                    if (err) {
                        console.error(`创建索引失败 (${i + 1}):`, err.message);
                    } else {
                        console.log(`✅ 索引 ${i + 1} 创建成功`);
                    }
                    indexCompleted++;
                    if (indexCompleted === createIndexes.length) {
                        checkCompletion();
                    }
                });
            });
            
            // 插入默认用户（如果不存在）
            const defaultUser = {
                username: 'demo',
                email: 'demo@example.com',
                password_hash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' // password
            };
            
            db.get('SELECT id FROM users WHERE username = ?', [defaultUser.username], (err, row) => {
                if (err) {
                    console.error('检查默认用户失败:', err.message);
                    reject(err);
                    return;
                }
                
                if (!row) {
                    db.run(
                        'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
                        [defaultUser.username, defaultUser.email, defaultUser.password_hash],
                        function(err) {
                            if (err) {
                                console.error('插入默认用户失败:', err.message);
                                reject(err);
                                return;
                            }
                            console.log('✅ 默认用户创建成功 (用户名: demo, 密码: password)');
                            checkCompletion();
                        }
                    );
                } else {
                    console.log('✅ 默认用户已存在');
                    checkCompletion();
                }
            });
        });
    });
}

// 获取数据库连接
function getDatabase() {
    return createConnection();
}

module.exports = {
    initDatabase,
    getDatabase
};

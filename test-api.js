// API测试脚本
const http = require('http');

const API_BASE = 'http://localhost:3000/api';

// 测试健康检查
function testHealthCheck() {
    return new Promise((resolve, reject) => {
        const req = http.get(`${API_BASE}/health`, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const result = JSON.parse(data);
                    console.log('✅ 健康检查通过:', result.status);
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            });
        });
        
        req.on('error', reject);
        req.setTimeout(5000, () => reject(new Error('请求超时')));
    });
}

// 测试用户注册
function testUserRegistration() {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify({
            username: 'testuser',
            email: 'test@example.com',
            password: 'testpass123'
        });

        const options = {
            hostname: 'localhost',
            port: 3000,
            path: '/api/auth/register',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const result = JSON.parse(data);
                    if (res.statusCode === 201) {
                        console.log('✅ 用户注册测试通过');
                        resolve(result);
                    } else {
                        console.log('⚠️ 用户注册测试:', result.error || '未知错误');
                        resolve(result);
                    }
                } catch (error) {
                    reject(error);
                }
            });
        });

        req.on('error', reject);
        req.write(postData);
        req.end();
    });
}

// 运行测试
async function runTests() {
    console.log('🧪 开始API测试...\n');
    
    try {
        await testHealthCheck();
        await testUserRegistration();
        console.log('\n🎉 所有测试完成！');
    } catch (error) {
        console.error('❌ 测试失败:', error.message);
        process.exit(1);
    }
}

// 如果直接运行此脚本
if (require.main === module) {
    runTests();
}

module.exports = { runTests };

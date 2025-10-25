const { initDatabase } = require('../database/init');

async function main() {
    try {
        console.log('🚀 开始初始化数据库...');
        await initDatabase();
        console.log('🎉 数据库初始化成功！');
        process.exit(0);
    } catch (error) {
        console.error('❌ 数据库初始化失败:', error.message);
        console.error('详细错误:', error);
        process.exit(1);
    }
}

main();

#!/bin/bash

echo "🚀 启动全栈待办事项应用..."
echo ""

echo "📦 安装依赖包..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ 依赖安装失败！"
    exit 1
fi

echo ""
echo "🗄️ 初始化数据库..."
npm run init-db
if [ $? -ne 0 ]; then
    echo "❌ 数据库初始化失败！"
    exit 1
fi

echo ""
echo "🌐 启动服务器..."
echo "📱 应用将在 http://localhost:3000 打开"
echo "🔑 默认账户: demo / password"
echo ""
echo "按 Ctrl+C 停止服务器"
echo ""

npm start

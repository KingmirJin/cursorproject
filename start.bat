@echo off
echo 🚀 启动全栈待办事项应用...
echo.

echo 📦 检查并安装依赖包...
if not exist node_modules (
    echo 正在安装依赖包...
    call npm install
    if %errorlevel% neq 0 (
        echo ❌ 依赖安装失败！
        pause
        exit /b 1
    )
) else (
    echo ✅ 依赖包已存在
)

echo.
echo 🗄️ 初始化数据库...
call npm run init-db
if %errorlevel% neq 0 (
    echo ❌ 数据库初始化失败！
    pause
    exit /b 1
)

echo.
echo 🧪 验证数据库...
call node scripts/verify-db.js
if %errorlevel% neq 0 (
    echo ❌ 数据库验证失败！
    pause
    exit /b 1
)

echo.
echo 🌐 启动服务器...
echo 📱 应用将在 http://localhost:3000 打开
echo 🔑 默认账户: demo / password
echo.
echo 按 Ctrl+C 停止服务器
echo.

call npm start

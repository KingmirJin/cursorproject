@echo off
echo 🚀 待办事项应用部署脚本
echo ================================

echo 📋 检查Git状态...
git status --porcelain >nul 2>&1
if %errorlevel% equ 0 (
    echo ⚠️  有未提交的更改，正在提交...
    git add .
    git commit -m "Deploy: 准备部署到生产环境"
)

echo 📤 推送代码到GitHub...
git push origin main

echo.
echo 🎉 代码已推送到GitHub！
echo.
echo 📋 接下来请选择部署平台：
echo.
echo 1. 🌟 Vercel (推荐)
echo    - 访问: https://vercel.com
echo    - 导入仓库: KingmirJin/cursorproject
echo    - 一键部署
echo.
echo 2. 🚂 Railway
echo    - 访问: https://railway.app
echo    - 连接GitHub仓库
echo    - 自动部署
echo.
echo 3. 🌐 Netlify
echo    - 访问: https://netlify.com
echo    - 导入GitHub仓库
echo    - 配置构建设置
echo.
echo 📖 详细步骤请查看: DEPLOY_GUIDE.md
echo.
echo 🔗 部署完成后，你的应用将在以下地址可用：
echo    - Vercel: https://your-app-name.vercel.app
echo    - Railway: https://your-app-name.railway.app
echo    - Netlify: https://your-app-name.netlify.app
echo.
echo 🔑 默认账户: demo / password
echo.
echo 🎊 让全世界的人都能使用你的待办事项应用！
pause

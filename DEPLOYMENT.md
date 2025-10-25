# 🚀 部署指南

## GitHub 推送步骤

由于网络连接问题，请按照以下步骤手动推送代码到GitHub：

### 方法1：使用GitHub Desktop（推荐）

1. **下载GitHub Desktop**
   - 访问：https://desktop.github.com/
   - 下载并安装GitHub Desktop

2. **添加仓库**
   - 打开GitHub Desktop
   - 点击 "Add an Existing Repository from your Hard Drive"
   - 选择项目文件夹：`C:\Users\Jin\Desktop\Curtrial2`

3. **发布到GitHub**
   - 点击 "Publish repository"
   - 仓库名称：`cursorproject`
   - 选择 "Keep this code private" 或 "Make public"
   - 点击 "Publish Repository"

### 方法2：使用Git命令行

如果网络问题解决后，可以使用以下命令：

```bash
# 1. 检查远程仓库
git remote -v

# 2. 推送代码
git push -u origin main

# 如果遇到认证问题，使用个人访问令牌
git push https://YOUR_TOKEN@github.com/KingmirJin/cursorproject.git main
```

### 方法3：使用GitHub网页界面

1. **创建新仓库**
   - 访问：https://github.com/KingmirJin/cursorproject
   - 如果仓库不存在，点击 "Create a new repository"

2. **上传文件**
   - 点击 "uploading an existing file"
   - 拖拽项目文件夹中的所有文件（除了node_modules）
   - 添加提交信息："Initial commit: Full-stack Todo App"
   - 点击 "Commit changes"

### 方法4：使用GitHub CLI

```bash
# 安装GitHub CLI
# 然后运行：
gh repo create cursorproject --public
git push -u origin main
```

## 📁 需要上传的文件

确保以下文件被上传到GitHub：

```
cursorproject/
├── .gitignore
├── README.md
├── TROUBLESHOOTING.md
├── DEPLOYMENT.md
├── package.json
├── package-lock.json
├── server.js
├── config.env
├── start.bat
├── start.sh
├── test-api.js
├── database/
│   └── init.js
├── routes/
│   ├── auth.js
│   └── todos.js
├── scripts/
│   ├── init-db.js
│   └── verify-db.js
└── public/
    ├── index.html
    ├── styles.css
    └── script.js
```

## 🔧 网络问题解决方案

如果遇到网络连接问题：

1. **检查防火墙设置**
2. **尝试使用VPN**
3. **使用SSH而不是HTTPS**
4. **配置代理设置**

## 📝 项目描述

这是一个全栈待办事项应用，包含：

- **后端**: Node.js + Express + SQLite
- **前端**: 原生JavaScript + HTML5 + CSS3
- **功能**: 用户认证、CRUD操作、实时同步
- **特性**: 响应式设计、现代化UI、安全认证

## 🌐 在线演示

部署后，用户可以通过以下方式使用：

1. **克隆仓库**
   ```bash
   git clone https://github.com/KingmirJin/cursorproject.git
   cd cursorproject
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **初始化数据库**
   ```bash
   npm run init-db
   ```

4. **启动应用**
   ```bash
   npm start
   ```

5. **访问应用**
   - 打开浏览器访问：http://localhost:3000
   - 使用默认账户：demo / password

## 📞 支持

如果遇到问题，请参考：
- `README.md` - 详细文档
- `TROUBLESHOOTING.md` - 故障排除指南
- GitHub Issues - 报告问题

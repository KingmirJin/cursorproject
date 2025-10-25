// 用户注册API
export default function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { username, email, password } = req.body;

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

    // 简单的注册逻辑
    res.status(201).json({
        message: '用户注册成功',
        token: 'demo-token',
        user: {
            id: Date.now(),
            username,
            email
        }
    });
}

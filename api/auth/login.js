// 用户登录API
export default function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            error: '用户名和密码都是必填项'
        });
    }

    // 简单的用户验证
    if (username === 'demo' && password === 'password') {
        res.status(200).json({
            message: '登录成功',
            token: 'demo-token',
            user: {
                id: 1,
                username: 'demo',
                email: 'demo@example.com'
            }
        });
    } else {
        res.status(401).json({
            error: '用户名或密码错误'
        });
    }
}

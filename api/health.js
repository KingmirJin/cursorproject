// 健康检查API
export default function handler(req, res) {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        message: 'Todo App API is running on Vercel!'
    });
}

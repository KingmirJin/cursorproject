// 单个待办事项API
let todos = []; // 内存存储

export default function handler(req, res) {
    // 设置CORS头
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { method } = req;
    const { id } = req.query;

    switch (method) {
        case 'GET':
            // 获取单个待办事项
            const todo = todos.find(t => t.id === parseInt(id));
            if (!todo) {
                return res.status(404).json({ error: '待办事项不存在' });
            }
            res.status(200).json({ todo });
            break;

        case 'PUT':
            // 更新待办事项
            const { text, completed } = req.body;
            const todoIndex = todos.findIndex(t => t.id === parseInt(id));
            
            if (todoIndex === -1) {
                return res.status(404).json({ error: '待办事项不存在' });
            }
            
            if (text !== undefined) {
                todos[todoIndex].text = text.trim();
            }
            
            if (completed !== undefined) {
                todos[todoIndex].completed = completed;
            }
            
            todos[todoIndex].updated_at = new Date().toISOString();
            
            res.status(200).json({
                message: '待办事项更新成功',
                todo: todos[todoIndex]
            });
            break;

        case 'DELETE':
            // 删除待办事项
            const deleteIndex = todos.findIndex(t => t.id === parseInt(id));
            
            if (deleteIndex === -1) {
                return res.status(404).json({ error: '待办事项不存在' });
            }
            
            todos.splice(deleteIndex, 1);
            
            res.status(200).json({
                message: '待办事项删除成功',
                deletedId: parseInt(id)
            });
            break;

        default:
            res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
            res.status(405).json({ error: `Method ${method} not allowed` });
    }
}

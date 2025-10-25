// 待办事项API
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
    const { filter = 'all' } = req.query;

    switch (method) {
        case 'GET':
            // 获取待办事项
            let filteredTodos = todos;
            
            if (filter === 'active') {
                filteredTodos = todos.filter(t => !t.completed);
            } else if (filter === 'completed') {
                filteredTodos = todos.filter(t => t.completed);
            }
            
            res.status(200).json({
                todos: filteredTodos,
                count: filteredTodos.length,
                filter
            });
            break;

        case 'POST':
            // 创建待办事项
            const { text } = req.body;
            
            if (!text || text.trim() === '') {
                return res.status(400).json({
                    error: '待办事项内容不能为空'
                });
            }
            
            const newTodo = {
                id: Date.now(),
                user_id: 1, // 简化用户ID
                text: text.trim(),
                completed: false,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };
            
            todos.push(newTodo);
            
            res.status(201).json({
                message: '待办事项创建成功',
                todo: newTodo
            });
            break;

        default:
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).json({ error: `Method ${method} not allowed` });
    }
}

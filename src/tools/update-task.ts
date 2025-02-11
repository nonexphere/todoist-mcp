import type { TodoistApi } from '@doist/todoist-api-typescript'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'

export function registerUpdateTask(server: McpServer, api: TodoistApi) {
    server.tool(
        'update-task',
        'Update a task in Todoist',
        {
            taskId: z.string(),
            content: z.string().optional(),
            labels: z.array(z.string()).optional(),
            priority: z.number().min(1).max(4).optional(),
        },
        async ({ taskId, content, labels, priority }) => {
            const task = await api.updateTask(taskId, {
                content,
                labels,
                priority,
            })
            return {
                content: [{ type: 'text', text: JSON.stringify(task, null, 2) }],
            }
        },
    )
}

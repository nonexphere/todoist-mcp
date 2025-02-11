import type { TodoistApi } from '@doist/todoist-api-typescript'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'

export function registerAddCommentToTask(server: McpServer, api: TodoistApi) {
    server.tool(
        'add-comment-to-task',
        'Add a comment to a task in Todoist',
        {
            taskId: z.string(),
            content: z.string(),
        },
        async ({ taskId, content }) => {
            const comment = await api.addComment({ taskId, content })
            return {
                content: [{ type: 'text', text: JSON.stringify(comment, null, 2) }],
            }
        },
    )
}

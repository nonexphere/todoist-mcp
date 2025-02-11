import type { TodoistApi } from '@doist/todoist-api-typescript'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'

export function registerUpdateComment(server: McpServer, api: TodoistApi) {
    server.tool(
        'update-comment',
        'Update a comment in Todoist',
        { commentId: z.string(), content: z.string() },
        async ({ commentId, content }) => {
            const comment = await api.updateComment(commentId, { content })
            return {
                content: [{ type: 'text', text: JSON.stringify(comment, null, 2) }],
            }
        },
    )
}

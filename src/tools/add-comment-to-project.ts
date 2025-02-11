import type { TodoistApi } from '@doist/todoist-api-typescript'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'

export function registerAddCommentToProject(server: McpServer, api: TodoistApi) {
    server.tool(
        'add-comment-to-project',
        'Add a comment to a project in Todoist',
        {
            projectId: z.string(),
            content: z.string(),
        },
        async ({ projectId, content }) => {
            const comment = await api.addComment({ projectId, content })
            return {
                content: [{ type: 'text', text: JSON.stringify(comment, null, 2) }],
            }
        },
    )
}

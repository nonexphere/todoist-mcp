import type { TodoistApi } from '@doist/todoist-api-typescript'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'

export function registerMoveTaskToParent(server: McpServer, api: TodoistApi) {
    server.tool(
        'move-task-to-parent',
        'Move a task to a parent in Todoist',
        {
            taskId: z.string(),
            parentId: z.string(),
        },
        async ({ taskId, parentId }) => {
            const success = await api.moveTasks([taskId], { parentId })
            return {
                content: [
                    {
                        type: 'text',
                        text: success
                            ? `Task ${taskId} moved to parent ${parentId}`
                            : `Failed to move task ${taskId} to parent ${parentId}`,
                    },
                ],
            }
        },
    )
}

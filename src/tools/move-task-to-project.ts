import type { TodoistApi } from '@doist/todoist-api-typescript'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'

export function registerMoveTaskToProject(server: McpServer, api: TodoistApi) {
    server.tool(
        'move-task-to-project',
        'Move a task to a different project',
        {
            taskId: z.string(),
            projectId: z.string(),
        },
        async ({ taskId, projectId }) => {
            const success = await api.moveTasks([taskId], { projectId })
            return {
                content: [
                    {
                        type: 'text',
                        text: success
                            ? `Task ${taskId} moved to project ${projectId}`
                            : `Failed to move task ${taskId} to project ${projectId}`,
                    },
                ],
            }
        },
    )
}

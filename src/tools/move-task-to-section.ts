import type { TodoistApi } from '@doist/todoist-api-typescript'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'

export function registerMoveTaskToSection(server: McpServer, api: TodoistApi) {
    server.tool(
        'move-task-to-section',
        'Move a task to a different section',
        {
            taskId: z.string(),
            sectionId: z.string(),
        },
        async ({ taskId, sectionId }) => {
            const success = await api.moveTasks([taskId], { sectionId })
            return {
                content: [
                    {
                        type: 'text',
                        text: success
                            ? `Task ${taskId} moved to section ${sectionId}`
                            : `Failed to move task ${taskId} to section ${sectionId}`,
                    },
                ],
            }
        },
    )
}

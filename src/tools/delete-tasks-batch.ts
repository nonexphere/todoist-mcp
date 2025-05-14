import type { TodoistApi } from '@doist/todoist-api-typescript'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'

export function registerDeleteTasksBatch(server: McpServer, api: TodoistApi) {
    server.tool(
        'delete-tasks-batch',
        'Delete multiple tasks from Todoist in a single operation',
        {
            taskIds: z.array(z.string()).describe('An array of task IDs to delete'),
        },
        async ({ taskIds }) => {
            const results: { taskId: string; success?: boolean; error?: string }[] = [];

            for (const taskId of taskIds) {
                try {
                    const success = await api.deleteTask(taskId);
                    results.push({ taskId, success });
                } catch (error: any) {
                    results.push({ taskId, success: false, error: error.message });
                }
            }

            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(results, null, 2),
                    },
                ],
            };
        },
    );
}

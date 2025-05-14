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
            description: z.string().optional(),
            assigneeId: z
                .string()
                .optional()
                .describe('The ID of a project collaborator to assign the task to'),
            priority: z
                .number()
                .min(1)
                .max(4)
                .optional()
                .describe('Task priority from 1 (normal) to 4 (urgent)'),
            labels: z.array(z.string()).optional(),
            dueString: z
                .string()
                .optional()
                .describe('Human-friendly string representation of the due date (e.g. "tomorrow at 10am").'),
            dueLang: z
                .string()
                .optional()
                .describe('2-letter code specifying language of dueString.'),
        },
        async ({
            taskId,
            content,
            description,
            assigneeId,
            priority,
            labels,
            dueString,
            dueLang,
        }) => {
            const task = await api.updateTask(taskId, {
                content,
                description,
                assigneeId,
                priority,
                labels,
                dueString,
                dueLang,
            })
            return {
                content: [{ type: 'text', text: JSON.stringify(task, null, 2) }],
            }
        },
    )
}

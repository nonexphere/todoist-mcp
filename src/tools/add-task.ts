import type { TodoistApi } from '@doist/todoist-api-typescript'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'

export function registerAddTask(server: McpServer, api: TodoistApi) {
    server.tool(
        'add-task',
        'Add a task to Todoist',
        {
            content: z.string(),
            description: z.string().optional(),
            projectId: z.string().optional().describe('The ID of a project to add the task to'),
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
            parentId: z.string().optional().describe('The ID of a parent task'),
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
            content,
            projectId,
            parentId,
            assigneeId,
            priority,
            labels,
            dueString,
            dueLang,
        }) => {
            const task = await api.addTask({
                content,
                projectId,
                parentId,
                assigneeId,
                priority,
                labels,
                dueString,
                dueLang,
            })
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(task, null, 2),
                    },
                ],
            }
        },
    )
}

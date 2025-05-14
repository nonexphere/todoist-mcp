import type { AddTaskArgs, TodoistApi } from '@doist/todoist-api-typescript'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'

// Define the schema for a single task within the batch
const AddTaskBatchItemSchema = z.object({
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
        .describe('Natural language description of due date like "tomorrow at 3pm"'),
    dueLang: z
        .string()
        .optional()
        .describe('2-letter code specifying language of due date'),
    dueDate: z
        .string()
        .optional()
        .describe("Specific date in YYYY-MM-DD format relative to user's timezone"),
    dueDatetime: z
        .string()
        .optional()
        .describe('Full ISO datetime format like "2023-12-31T15:00:00Z"'),
    deadlineDate: z
        .string()
        .optional()
        .describe("Specific date in YYYY-MM-DD format relative to user's timezone."),
    deadlineLang: z
        .string()
        .optional()
        .describe('2-letter code specifying language of deadline.'),
    duration: z
        .number()
        .optional()
        .describe('Duration of the task (must be provided with durationUnit)'),
    durationUnit: z
        .enum(['minute', 'day'])
        .optional()
        .describe('Unit for task duration (must be provided with duration)'),
}).refine(data => !(data.dueDate && data.dueDatetime), "Cannot provide both dueDate and dueDatetime")
  .refine(data => (data.duration === undefined) === (data.durationUnit === undefined), "Must provide both duration and durationUnit, or neither");


export function registerAddTasksBatch(server: McpServer, api: TodoistApi) {
    server.tool(
        'add-tasks-batch',
        'Add multiple tasks to Todoist in a single operation',
        {
            tasks: z.array(AddTaskBatchItemSchema).describe('An array of task objects to add'),
        },
        async ({ tasks }) => {
            const results: { task?: any; error?: string }[] = [];

            for (const taskArgs of tasks) {
                try {
                    const task = await api.addTask(taskArgs as AddTaskArgs);
                    results.push({ task });
                } catch (error: any) {
                    results.push({ error: error.message });
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

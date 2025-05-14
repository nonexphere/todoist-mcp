import type { UpdateTaskArgs, TodoistApi } from '@doist/todoist-api-typescript'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'

// Define the schema for a single task update within the batch
const UpdateTaskBatchItemSchema = z.object({
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


export function registerUpdateTasksBatch(server: McpServer, api: TodoistApi) {
    server.tool(
        'update-tasks-batch',
        'Update multiple tasks in Todoist in a single operation',
        {
            updates: z.array(UpdateTaskBatchItemSchema).describe('An array of task update objects'),
        },
        async ({ updates }) => {
            const results: { taskId: string; success?: boolean; error?: string }[] = [];

            for (const updateArgs of updates) {
                try {
                    await api.updateTask(updateArgs.taskId, updateArgs as UpdateTaskArgs);
                    results.push({ taskId: updateArgs.taskId, success: true });
                } catch (error: any) {
                    results.push({ taskId: updateArgs.taskId, success: false, error: error.message });
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

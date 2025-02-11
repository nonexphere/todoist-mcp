import type { TodoistApi } from '@doist/todoist-api-typescript'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'

export function registerAddProject(server: McpServer, api: TodoistApi) {
    server.tool(
        'add-project',
        'Add a project to Todoist',
        {
            name: z.string(),
            color: z.enum([
                'berry_red',
                'light_blue',
                'red',
                'blue',
                'orange',
                'grape',
                'yellow',
                'violet',
                'olive_green',
                'lavender',
                'lime_green',
                'magenta',
                'green',
                'salmon',
                'mint_green',
                'charcoal',
                'teal',
                'grey',
                'sky_blue',
            ]),
            isFavorite: z.boolean().optional(),
            viewStyle: z.enum(['list', 'board', 'calendar']).optional(),
        },
        async ({ name, color, isFavorite, viewStyle }) => {
            const project = await api.addProject({ name, color, isFavorite, viewStyle })
            return {
                content: [{ type: 'text', text: JSON.stringify(project, null, 2) }],
            }
        },
    )
}

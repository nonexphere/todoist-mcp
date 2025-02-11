import { TodoistApi } from '@doist/todoist-api-typescript'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { registerAddCommentToProject } from './tools/add-comment-to-project.js'
import { registerAddCommentToTask } from './tools/add-comment-to-task.js'
import { registerAddProject } from './tools/add-project.js'
import { registerAddSection } from './tools/add-section.js'
import { registerAddTask } from './tools/add-task.js'
import { registerCloseTask } from './tools/close-task.js'
import { registerDeleteComment } from './tools/delete-comment.js'
import { registerDeleteProject } from './tools/delete-project.js'
import { registerDeleteSection } from './tools/delete-section.js'
import { registerDeleteTask } from './tools/delete-task.js'
import { registerGetProjectCollaborators } from './tools/get-project-collaborators.js'
import { registerGetProjects } from './tools/get-projects.js'
import { registerGetSection } from './tools/get-section.js'
import { registerGetSections } from './tools/get-sections.js'
import { registerGetTasks } from './tools/get-tasks.js'
import { registerMoveTaskToProject } from './tools/move-task-to-project.js'
import { registerMoveTaskToSection } from './tools/move-task-to-section.js'
import { registerReopenTask } from './tools/reopen-task.js'
import { registerUpdateComment } from './tools/update-comment.js'
import { registerUpdateProject } from './tools/update-project.js'
import { registerUpdateSection } from './tools/update-section.js'
import { registerUpdateTask } from './tools/update-task.js'

if (!process.env.TODOIST_API_KEY) {
    throw new Error('TODOIST_API_KEY environment variable is required')
}

const api = new TodoistApi(process.env.TODOIST_API_KEY)

// Create server instance
const server = new McpServer({ name: 'todoist-mcp', version: '1.0.0' })

// Register Todoist tools
registerGetProjects(server, api)
registerGetProjectCollaborators(server, api)
registerGetTasks(server, api)
registerAddTask(server, api)
registerCloseTask(server, api)
registerUpdateTask(server, api)
registerGetSection(server, api)
registerGetSections(server, api)
registerAddCommentToTask(server, api)
registerAddCommentToProject(server, api)
registerMoveTaskToProject(server, api)
registerMoveTaskToSection(server, api)
registerDeleteComment(server, api)
registerAddProject(server, api)
registerUpdateProject(server, api)
registerUpdateSection(server, api)
registerAddSection(server, api)
registerDeleteSection(server, api)
registerDeleteTask(server, api)
registerReopenTask(server, api)
registerUpdateComment(server, api)
registerDeleteProject(server, api)

async function main() {
    const transport = new StdioServerTransport()
    await server.connect(transport)
    console.error('Todoist Agent Server running on stdio')
}

main().catch((error) => {
    console.error('Fatal error in main():', error)
    process.exit(1)
})

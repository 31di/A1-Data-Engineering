import { useMemo, useState } from 'react'
import {
  useCreateProjectMutation,
  useCreateTaskMutation,
  useDeleteProjectMutation,
  useDeleteTaskMutation,
  useGetProjectsQuery,
  useGetTasksQuery,
  useUpdateProjectMutation,
  useUpdateTaskMutation,
} from '../store/api'
import type { Project, Task, TaskStatus } from '../types/api'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Label } from '../components/ui/Label'
import { Select } from '../components/ui/Select'
import { Textarea } from '../components/ui/Textarea'
import { Table, TBody, TD, TH, THead, TR } from '../components/ui/Table'
import { Modal } from '../components/ui/Modal'
import { formatApiError } from '../lib/formatApiError'

function toInt(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return null
  const asNumber = Number(trimmed)
  if (!Number.isFinite(asNumber)) return null
  return Math.trunc(asNumber)
}

function taskAssignedTo(task: Task) {
  const assignedTo = task.assigned_to ?? task.assignee_id
  return assignedTo == null ? 'Unassigned' : String(assignedTo)
}

export function ProjectsPage() {
  const projectsQuery = useGetProjectsQuery()
  const tasksQuery = useGetTasksQuery()

  const [createProject, createProjectState] = useCreateProjectMutation()
  const [updateProject, updateProjectState] = useUpdateProjectMutation()
  const [deleteProject, deleteProjectState] = useDeleteProjectMutation()

  const [createTask, createTaskState] = useCreateTaskMutation()
  const [updateTask, updateTaskState] = useUpdateTaskMutation()
  const [deleteTask, deleteTaskState] = useDeleteTaskMutation()

  const projects = projectsQuery.data ?? []
  const tasks = tasksQuery.data ?? []

  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null)
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null)

  const selectedProject = useMemo<Project | null>(() => {
    if (selectedProjectId == null) return null
    return projects.find((p) => p.id === selectedProjectId) ?? null
  }, [selectedProjectId, projects])

  const projectTasks = useMemo(() => {
    if (!selectedProject) return []
    return tasks.filter((t) => t.project_id === selectedProject.id)
  }, [selectedProject, tasks])

  const selectedTask = useMemo<Task | null>(() => {
    if (selectedTaskId == null) return null
    return tasks.find((t) => t.id === selectedTaskId) ?? null
  }, [selectedTaskId, tasks])

  const [projectFormOpen, setProjectFormOpen] = useState(false)
  const [projectFormMode, setProjectFormMode] = useState<'create' | 'edit'>('create')
  const [projectFormId, setProjectFormId] = useState<number | null>(null)
  const [projectTitle, setProjectTitle] = useState('')
  const [projectDescription, setProjectDescription] = useState('')
  const [projectOwnerId, setProjectOwnerId] = useState('')

  const [taskFormOpen, setTaskFormOpen] = useState(false)
  const [taskFormMode, setTaskFormMode] = useState<'create' | 'edit'>('create')
  const [taskFormId, setTaskFormId] = useState<number | null>(null)
  const [taskTitle, setTaskTitle] = useState('')
  const [taskDescription, setTaskDescription] = useState('')
  const [taskStatus, setTaskStatus] = useState<TaskStatus>('pending')
  const [taskAssignedToId, setTaskAssignedToId] = useState('')
  const [taskProjectId, setTaskProjectId] = useState<number | null>(null)

  const busy =
    projectsQuery.isFetching ||
    tasksQuery.isFetching ||
    createProjectState.isLoading ||
    updateProjectState.isLoading ||
    deleteProjectState.isLoading ||
    createTaskState.isLoading ||
    updateTaskState.isLoading ||
    deleteTaskState.isLoading

  const projectsErrorText = projectsQuery.isError ? formatApiError(projectsQuery.error) : null
  const tasksErrorText = tasksQuery.isError ? formatApiError(tasksQuery.error) : null

  const projectFormErrorText =
    createProjectState.isError
      ? formatApiError(createProjectState.error)
      : updateProjectState.isError
        ? formatApiError(updateProjectState.error)
        : null

  const taskFormErrorText =
    createTaskState.isError
      ? formatApiError(createTaskState.error)
      : updateTaskState.isError
        ? formatApiError(updateTaskState.error)
        : null

  function resetProjectForm() {
    setProjectFormMode('create')
    setProjectFormId(null)
    setProjectTitle('')
    setProjectDescription('')
    setProjectOwnerId('')
  }

  function openCreateProject() {
    resetProjectForm()
    setProjectFormMode('create')
    setProjectFormOpen(true)
  }

  function openEditProject(project: Project) {
    setProjectFormMode('edit')
    setProjectFormId(project.id)
    setProjectTitle(project.title ?? '')
    setProjectDescription(project.description ?? '')
    setProjectOwnerId(String(project.owner_id ?? ''))
    setProjectFormOpen(true)
  }

  async function submitProjectForm() {
    const owner_id = toInt(projectOwnerId)
    if (owner_id == null) return

    const payload = {
      title: projectTitle.trim(),
      description: projectDescription.trim(),
      owner_id,
    }

    if (!payload.title || !payload.description) return

    if (projectFormMode === 'edit' && projectFormId != null) {
      await updateProject({ id: projectFormId, patch: payload }).unwrap()
      setProjectFormOpen(false)
      return
    }

    await createProject(payload).unwrap()
    setProjectFormOpen(false)
  }

  function resetTaskForm() {
    setTaskFormMode('create')
    setTaskFormId(null)
    setTaskTitle('')
    setTaskDescription('')
    setTaskStatus('pending')
    setTaskAssignedToId('')
    setTaskProjectId(null)
  }

  function openCreateTask(projectId: number) {
    resetTaskForm()
    setTaskFormMode('create')
    setTaskProjectId(projectId)
    setTaskFormOpen(true)
  }

  function openEditTask(task: Task) {
    setTaskFormMode('edit')
    setTaskFormId(task.id)
    setTaskTitle(task.title ?? '')
    setTaskDescription(task.description ?? '')
    setTaskStatus((task.status ?? 'pending') as TaskStatus)
    const assignedTo = task.assigned_to ?? task.assignee_id
    setTaskAssignedToId(assignedTo == null ? '' : String(assignedTo))
    setTaskProjectId(task.project_id)
    setTaskFormOpen(true)
  }

  async function submitTaskForm() {
    const assigned_to = toInt(taskAssignedToId)

    const base = {
      title: taskTitle.trim(),
      description: taskDescription.trim(),
      status: taskStatus,
      assigned_to: assigned_to,
    }

    if (!base.title || !base.description) return

    if (taskFormMode === 'edit' && taskFormId != null) {
      await updateTask({ id: taskFormId, patch: base }).unwrap()
      setTaskFormOpen(false)
      return
    }

    if (taskProjectId == null) return
    await createTask({ ...base, project_id: taskProjectId }).unwrap()
    setTaskFormOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">Projects</h1>
          <p className="mt-1 text-sm text-slate-300">Click a project to view details and tasks.</p>
        </div>
        <Button variant="secondary" onClick={openCreateProject} disabled={busy}>
          Add project
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <CardTitle>All projects</CardTitle>
            {projectsQuery.isFetching ? <div className="text-xs text-slate-400">Loading…</div> : null}
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <THead>
              <TR>
                <TH className="w-16">ID</TH>
                <TH>Title</TH>
                <TH className="w-28">Owner</TH>
                <TH>Description</TH>
                <TH className="w-56">Actions</TH>
              </TR>
            </THead>
            <TBody>
              {projects.map((p) => (
                <TR
                  key={p.id}
                  className="cursor-pointer"
                  onClick={() => {
                    setSelectedTaskId(null)
                    setSelectedProjectId(p.id)
                  }}
                >
                  <TD>{p.id}</TD>
                  <TD>{p.title}</TD>
                  <TD>{p.owner_id}</TD>
                  <TD className="max-w-[32rem] truncate">{p.description ?? ''}</TD>
                  <TD>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="secondary"
                        disabled={busy}
                        onClick={(e) => {
                          e.stopPropagation()
                          openEditProject(p)
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        disabled={busy}
                        onClick={async (e) => {
                          e.stopPropagation()
                          await deleteProject(p.id).unwrap()
                          if (selectedProjectId === p.id) setSelectedProjectId(null)
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </TD>
                </TR>
              ))}

              {projectsQuery.isError ? (
                <TR>
                  <TD colSpan={5} className="py-8 text-center text-red-300">
                    {projectsErrorText}
                  </TD>
                </TR>
              ) : !projectsQuery.isFetching && projects.length === 0 ? (
                <TR>
                  <TD colSpan={5} className="py-8 text-center text-slate-400">
                    No projects yet.
                  </TD>
                </TR>
              ) : null}
            </TBody>
          </Table>
        </CardContent>
      </Card>

      <Modal
        open={selectedProject != null}
        title={selectedProject ? `Project #${selectedProject.id}` : 'Project'}
        onClose={() => {
          setSelectedTaskId(null)
          setSelectedProjectId(null)
        }}
      >
        {selectedProject ? (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="text-slate-400">ID</div>
              <div className="col-span-2 text-slate-50">{selectedProject.id}</div>

              <div className="text-slate-400">Title</div>
              <div className="col-span-2 text-slate-50">{selectedProject.title}</div>

              <div className="text-slate-400">Owner ID</div>
              <div className="col-span-2 text-slate-50">{selectedProject.owner_id}</div>

              <div className="text-slate-400">Description</div>
              <div className="col-span-2 whitespace-pre-wrap text-slate-50">
                {selectedProject.description ?? ''}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="secondary" onClick={() => openEditProject(selectedProject)} disabled={busy}>
                Edit project
              </Button>
              <Button
                variant="destructive"
                onClick={async () => {
                  await deleteProject(selectedProject.id).unwrap()
                  setSelectedProjectId(null)
                }}
                disabled={busy}
              >
                Delete project
              </Button>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <div className="text-sm font-semibold text-slate-50">Tasks</div>
                <Button
                  variant="secondary"
                  disabled={busy}
                  onClick={() => openCreateTask(selectedProject.id)}
                >
                  Add task
                </Button>
              </div>

              {tasksQuery.isError ? (
                <div className="text-sm text-red-300">{tasksErrorText}</div>
              ) : tasksQuery.isFetching ? (
                <div className="text-sm text-slate-300">Loading tasks…</div>
              ) : (
                <Table>
                  <THead>
                    <TR>
                      <TH className="w-16">ID</TH>
                      <TH>Title</TH>
                      <TH className="w-32">Status</TH>
                      <TH className="w-28">Assignee ID</TH>
                      <TH className="w-56">Actions</TH>
                    </TR>
                  </THead>
                  <TBody>
                    {projectTasks.map((t) => (
                      <TR
                        key={t.id}
                        className="cursor-pointer"
                        onClick={() => setSelectedTaskId(t.id)}
                      >
                        <TD>{t.id}</TD>
                        <TD>{t.title}</TD>
                        <TD>{t.status ?? 'pending'}</TD>
                        <TD>{taskAssignedTo(t)}</TD>
                        <TD>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="secondary"
                              disabled={busy}
                              onClick={(e) => {
                                e.stopPropagation()
                                openEditTask(t)
                              }}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              disabled={busy}
                              onClick={async (e) => {
                                e.stopPropagation()
                                await deleteTask(t.id).unwrap()
                                if (selectedTaskId === t.id) setSelectedTaskId(null)
                              }}
                            >
                              Delete
                            </Button>
                          </div>
                        </TD>
                      </TR>
                    ))}

                    {projectTasks.length === 0 ? (
                      <TR>
                        <TD colSpan={5} className="py-6 text-center text-slate-400">
                          No tasks for this project.
                        </TD>
                      </TR>
                    ) : null}
                  </TBody>
                </Table>
              )}
            </div>
          </div>
        ) : (
          <div className="text-sm text-slate-300">Loading...</div>
        )}
      </Modal>

      <Modal
        open={selectedTask != null}
        title={selectedTask ? `Task #${selectedTask.id}` : 'Task'}
        onClose={() => setSelectedTaskId(null)}
      >
        {selectedTask ? (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="text-slate-400">ID</div>
              <div className="col-span-2 text-slate-50">{selectedTask.id}</div>

              <div className="text-slate-400">Title</div>
              <div className="col-span-2 text-slate-50">{selectedTask.title}</div>

              <div className="text-slate-400">Status</div>
              <div className="col-span-2 text-slate-50">{selectedTask.status ?? 'pending'}</div>

              <div className="text-slate-400">Project ID</div>
              <div className="col-span-2 text-slate-50">{selectedTask.project_id}</div>

              <div className="text-slate-400">Assignee ID</div>
              <div className="col-span-2 text-slate-50">{taskAssignedTo(selectedTask)}</div>

              <div className="text-slate-400">Description</div>
              <div className="col-span-2 whitespace-pre-wrap text-slate-50">
                {selectedTask.description ?? ''}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="secondary" onClick={() => openEditTask(selectedTask)} disabled={busy}>
                Edit
              </Button>
              <Button
                variant="destructive"
                onClick={async () => {
                  await deleteTask(selectedTask.id).unwrap()
                  setSelectedTaskId(null)
                }}
                disabled={busy}
              >
                Delete
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-sm text-slate-300">Loading...</div>
        )}
      </Modal>

      <Modal
        open={projectFormOpen}
        title={projectFormMode === 'edit' ? `Edit project #${projectFormId ?? ''}` : 'Add project'}
        onClose={() => {
          setProjectFormOpen(false)
          resetProjectForm()
        }}
      >
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="project-form-title">Title</Label>
              <Input
                id="project-form-title"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                placeholder="Website redesign"
                disabled={busy}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="project-form-owner">Owner ID</Label>
              <Input
                id="project-form-owner"
                value={projectOwnerId}
                onChange={(e) => setProjectOwnerId(e.target.value)}
                placeholder="1"
                inputMode="numeric"
                disabled={busy}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="project-form-description">Description</Label>
              <Textarea
                id="project-form-description"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                placeholder="Short description"
                disabled={busy}
              />
            </div>
          </div>

          {projectFormErrorText ? (
            <div className="text-sm text-red-300">{projectFormErrorText}</div>
          ) : null}

          <div className="flex items-center gap-2">
            <Button
              onClick={submitProjectForm}
              disabled={
                busy ||
                !projectTitle.trim() ||
                !projectDescription.trim() ||
                toInt(projectOwnerId) == null
              }
            >
              Save
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setProjectFormOpen(false)
                resetProjectForm()
              }}
              disabled={busy}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={taskFormOpen}
        title={taskFormMode === 'edit' ? `Edit task #${taskFormId ?? ''}` : 'Add task'}
        onClose={() => {
          setTaskFormOpen(false)
          resetTaskForm()
        }}
      >
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="task-form-title">Title</Label>
              <Input
                id="task-form-title"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="Implement API client"
                disabled={busy}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="task-form-status">Status</Label>
              <Select
                id="task-form-status"
                value={taskStatus}
                onChange={(e) => setTaskStatus(e.target.value as TaskStatus)}
                disabled={busy}
              >
                <option value="pending">pending</option>
                <option value="in_progress">in_progress</option>
                <option value="done">done</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="task-form-assigned">Assignee ID (optional)</Label>
              <Input
                id="task-form-assigned"
                value={taskAssignedToId}
                onChange={(e) => setTaskAssignedToId(e.target.value)}
                placeholder="2"
                inputMode="numeric"
                disabled={busy}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="task-form-project">Project ID</Label>
              <Input
                id="task-form-project"
                value={taskProjectId == null ? '' : String(taskProjectId)}
                disabled
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="task-form-description">Description</Label>
              <Textarea
                id="task-form-description"
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                placeholder="Short description"
                disabled={busy}
              />
            </div>
          </div>

          {taskFormErrorText ? <div className="text-sm text-red-300">{taskFormErrorText}</div> : null}

          <div className="flex items-center gap-2">
            <Button
              onClick={submitTaskForm}
              disabled={busy || !taskTitle.trim() || !taskDescription.trim() || taskProjectId == null}
            >
              Save
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setTaskFormOpen(false)
                resetTaskForm()
              }}
              disabled={busy}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

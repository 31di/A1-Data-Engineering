import { useMemo, useState } from 'react'
import {
  useCreateTaskMutation,
  useDeleteTaskMutation,
  useGetTasksQuery,
  useUpdateTaskMutation,
} from '../store/api'
import type { Task, TaskStatus } from '../types/api'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Label } from '../components/ui/Label'
import { Select } from '../components/ui/Select'
import { Textarea } from '../components/ui/Textarea'
import { Table, TBody, TD, TH, THead, TR } from '../components/ui/Table'

function toInt(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return null
  const asNumber = Number(trimmed)
  if (!Number.isFinite(asNumber)) return null
  return Math.trunc(asNumber)
}

export function TasksPage() {
  const tasksQuery = useGetTasksQuery()
  const [createTask, createState] = useCreateTaskMutation()
  const [updateTask, updateState] = useUpdateTaskMutation()
  const [deleteTask, deleteState] = useDeleteTaskMutation()

  const tasks = tasksQuery.data ?? []

  const [editingId, setEditingId] = useState<number | null>(null)
  const editingTask = useMemo<Task | null>(() => {
    if (editingId == null) return null
    return tasks.find((t) => t.id === editingId) ?? null
  }, [editingId, tasks])

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<TaskStatus>('pending')
  const [projectId, setProjectId] = useState('')
  const [assignedToId, setAssignedToId] = useState('')

  function resetForm() {
    setTitle('')
    setDescription('')
    setStatus('pending')
    setProjectId('')
    setAssignedToId('')
    setEditingId(null)
  }

  async function onSubmit() {
    const project_id = toInt(projectId)
    const assigned_to = toInt(assignedToId)
    if (project_id == null) return

    if (editingTask) {
      await updateTask({
        id: editingTask.id,
        patch: {
          title,
          description,
          status,
          assigned_to,
          assignee_id: assigned_to,
        },
      }).unwrap()
      resetForm()
      return
    }

    await createTask({
      title,
      description,
      status,
      project_id,
      assigned_to,
      assignee_id: assigned_to,
    }).unwrap()
    resetForm()
  }

  function startEdit(task: Task) {
    setEditingId(task.id)
    setTitle(task.title ?? '')
    setDescription(task.description ?? '')
    setStatus((task.status ?? 'pending') as TaskStatus)
    setProjectId(String(task.project_id ?? ''))
    const assignedTo = task.assigned_to ?? task.assignee_id
    setAssignedToId(assignedTo == null ? '' : String(assignedTo))
  }

  const busy =
    tasksQuery.isFetching ||
    createState.isLoading ||
    updateState.isLoading ||
    deleteState.isLoading

  const projectParsed = toInt(projectId)
  const assignedToParsed = toInt(assignedToId)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Tasks</h1>
        <p className="mt-1 text-sm text-slate-300">Create, edit, and delete tasks.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{editingTask ? `Edit task #${editingTask.id}` : 'Create task'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="task-title">Title</Label>
              <Input
                id="task-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Implement API client"
                disabled={busy}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="task-project">Project ID</Label>
              <Input
                id="task-project"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                placeholder="1"
                inputMode="numeric"
                disabled={busy}
              />
              {projectId.trim() && projectParsed == null ? (
                <div className="text-xs text-red-300">Project ID must be a number.</div>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="task-assignee">Assignee ID (optional)</Label>
              <Input
                id="task-assignee"
                value={assignedToId}
                onChange={(e) => setAssignedToId(e.target.value)}
                placeholder="2"
                inputMode="numeric"
                disabled={busy}
              />
              {assignedToId.trim() && assignedToParsed == null ? (
                <div className="text-xs text-red-300">Assignee ID must be a number.</div>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="task-status">Status</Label>
              <Select
                id="task-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                disabled={busy}
              >
                <option value="pending">pending</option>
                <option value="in_progress">in_progress</option>
                <option value="done">done</option>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-3">
              <Label htmlFor="task-description">Description</Label>
              <Textarea
                id="task-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short description"
                disabled={busy}
              />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <Button
              onClick={onSubmit}
              disabled={busy || !title.trim() || !description.trim() || projectParsed == null}
            >
              {editingTask ? 'Save changes' : 'Create'}
            </Button>
            {editingTask ? (
              <Button variant="ghost" onClick={resetForm} disabled={busy}>
                Cancel
              </Button>
            ) : null}

            {tasksQuery.isError ? (
              <div className="ml-auto text-sm text-red-300">Failed to load tasks.</div>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <THead>
              <TR>
                <TH className="w-16">ID</TH>
                <TH>Title</TH>
                <TH className="w-28">Project</TH>
                <TH className="w-32">Status</TH>
                <TH className="w-28">Assignee</TH>
                <TH>Description</TH>
                <TH className="w-56">Actions</TH>
              </TR>
            </THead>
            <TBody>
              {tasks.map((t) => (
                <TR key={t.id}>
                  <TD>{t.id}</TD>
                  <TD>{t.title}</TD>
                  <TD>{t.project_id}</TD>
                  <TD>{t.status ?? 'pending'}</TD>
                  <TD>{(t.assigned_to ?? t.assignee_id) == null ? '' : t.assigned_to ?? t.assignee_id}</TD>
                  <TD className="max-w-[32rem] truncate">{t.description ?? ''}</TD>
                  <TD>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="secondary"
                        onClick={() => startEdit(t)}
                        disabled={busy}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={async () => {
                          await deleteTask(t.id).unwrap()
                          if (editingId === t.id) resetForm()
                        }}
                        disabled={busy}
                      >
                        Delete
                      </Button>
                    </div>
                  </TD>
                </TR>
              ))}

              {!tasksQuery.isFetching && tasks.length === 0 ? (
                <TR>
                  <TD colSpan={7} className="py-8 text-center text-slate-400">
                    No tasks yet.
                  </TD>
                </TR>
              ) : null}
            </TBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

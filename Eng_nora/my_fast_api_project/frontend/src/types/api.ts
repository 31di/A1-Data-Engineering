export type ApiDetailResponse = {
  detail: string
}

export type User = {
  id: number
  name: string
  email: string
  isactive?: boolean | null
  is_active?: boolean | null
}

export type UserCreate = {
  name: string
  email: string
  isactive?: boolean | null
  is_active?: boolean | null
}

export type UserUpdate = Partial<UserCreate>

export type Project = {
  id: number
  title: string
  description?: string | null
  owner_id: number
}

export type ProjectCreate = {
  title: string
  description: string
  owner_id: number
}

export type ProjectUpdate = Partial<ProjectCreate>

export type TaskStatus = 'pending' | 'in_progress' | 'done' | (string & {})

export type Task = {
  id: number
  title: string
  description?: string | null
  status?: TaskStatus
  project_id: number
  assigned_to?: number | null
  assignee_id?: number | null
}

export type TaskCreate = {
  title: string
  description: string
  status?: TaskStatus
  project_id: number
  assigned_to?: number | null
  assignee_id?: number | null
}

export type TaskUpdate = Partial<Omit<TaskCreate, 'project_id'>>

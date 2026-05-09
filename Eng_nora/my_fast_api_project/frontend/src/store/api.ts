import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type {
  ApiDetailResponse,
  Project,
  ProjectCreate,
  ProjectUpdate,
  Task,
  TaskCreate,
  TaskUpdate,
  User,
  UserCreate,
  UserUpdate,
} from '../types/api'

const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
  'http://localhost:8000'

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
  }),
  tagTypes: ['Users', 'Projects', 'Tasks'],
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => '/users/',
      providesTags: [{ type: 'Users', id: 'LIST' }],
    }),
    createUser: builder.mutation<User, UserCreate>({
      query: (body) => ({ url: '/users/', method: 'POST', body }),
      invalidatesTags: [{ type: 'Users', id: 'LIST' }],
    }),
    updateUser: builder.mutation<User, { id: number; patch: UserUpdate }>({
      query: ({ id, patch }) => ({ url: `/users/${id}`, method: 'PUT', body: patch }),
      invalidatesTags: [{ type: 'Users', id: 'LIST' }],
    }),
    deleteUser: builder.mutation<ApiDetailResponse, number>({
      query: (id) => ({ url: `/users/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'Users', id: 'LIST' }],
    }),

    getProjects: builder.query<Project[], void>({
      query: () => '/projects/',
      providesTags: [{ type: 'Projects', id: 'LIST' }],
    }),
    createProject: builder.mutation<Project, ProjectCreate>({
      query: (body) => ({ url: '/projects/', method: 'POST', body }),
      invalidatesTags: [{ type: 'Projects', id: 'LIST' }],
    }),
    updateProject: builder.mutation<Project, { id: number; patch: ProjectUpdate }>({
      query: ({ id, patch }) => ({
        url: `/projects/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: [{ type: 'Projects', id: 'LIST' }],
    }),
    deleteProject: builder.mutation<ApiDetailResponse, number>({
      query: (id) => ({ url: `/projects/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'Projects', id: 'LIST' }],
    }),

    getTasks: builder.query<Task[], void>({
      query: () => '/tasks/',
      providesTags: [{ type: 'Tasks', id: 'LIST' }],
    }),
    createTask: builder.mutation<Task, TaskCreate>({
      query: (body) => ({ url: '/tasks/', method: 'POST', body }),
      invalidatesTags: [{ type: 'Tasks', id: 'LIST' }],
    }),
    updateTask: builder.mutation<Task, { id: number; patch: TaskUpdate }>({
      query: ({ id, patch }) => ({ url: `/tasks/${id}`, method: 'PUT', body: patch }),
      invalidatesTags: [{ type: 'Tasks', id: 'LIST' }],
    }),
    deleteTask: builder.mutation<ApiDetailResponse, number>({
      query: (id) => ({ url: `/tasks/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'Tasks', id: 'LIST' }],
    }),
  }),
})

export const {
  useCreateProjectMutation,
  useCreateTaskMutation,
  useCreateUserMutation,
  useDeleteProjectMutation,
  useDeleteTaskMutation,
  useDeleteUserMutation,
  useGetProjectsQuery,
  useGetTasksQuery,
  useGetUsersQuery,
  useUpdateProjectMutation,
  useUpdateTaskMutation,
  useUpdateUserMutation,
} = api

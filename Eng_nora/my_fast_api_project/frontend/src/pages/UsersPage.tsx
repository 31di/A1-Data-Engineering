import { useMemo, useState } from 'react'
import {
  useCreateUserMutation,
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} from '../store/api'
import type { User } from '../types/api'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Label } from '../components/ui/Label'
import { Select } from '../components/ui/Select'
import { Table, TBody, TD, TH, THead, TR } from '../components/ui/Table'
import { Modal } from '../components/ui/Modal'
import { formatApiError } from '../lib/formatApiError'

function userIsActive(user: User) {
  const active = user.isactive ?? user.is_active
  return active !== false
}

function userActiveText(user: User) {
  return userIsActive(user) ? 'true' : 'false'
}

export function UsersPage() {
  const usersQuery = useGetUsersQuery()
  const [createUser, createState] = useCreateUserMutation()
  const [updateUser, updateState] = useUpdateUserMutation()
  const [deleteUser, deleteState] = useDeleteUserMutation()

  const users = usersQuery.data ?? []

  const [selectedId, setSelectedId] = useState<number | null>(null)
  const selectedUser = useMemo<User | null>(() => {
    if (selectedId == null) return null
    return users.find((u) => u.id === selectedId) ?? null
  }, [selectedId, users])

  const [formOpen, setFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
  const [formUserId, setFormUserId] = useState<number | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [isActive, setIsActive] = useState<'true' | 'false'>('true')

  const busy =
    usersQuery.isFetching ||
    createState.isLoading ||
    updateState.isLoading ||
    deleteState.isLoading

  const usersErrorText = usersQuery.isError ? formatApiError(usersQuery.error) : null
  const formErrorText =
    createState.isError
      ? formatApiError(createState.error)
      : updateState.isError
        ? formatApiError(updateState.error)
        : null

  function resetForm() {
    setFormMode('create')
    setFormUserId(null)
    setName('')
    setEmail('')
    setIsActive('true')
  }

  function openCreate() {
    resetForm()
    setFormMode('create')
    setFormOpen(true)
  }

  function openEdit(user: User) {
    setFormMode('edit')
    setFormUserId(user.id)
    setName(user.name ?? '')
    setEmail(user.email ?? '')
    setIsActive(userIsActive(user) ? 'true' : 'false')
    setFormOpen(true)
  }

  async function onSubmit() {
    const payload = {
      name: name.trim(),
      email: email.trim(),
      isactive: isActive === 'true',
    }

    if (!payload.name || !payload.email) return

    if (formMode === 'edit' && formUserId != null) {
      await updateUser({ id: formUserId, patch: payload }).unwrap()
      setFormOpen(false)
      return
    }

    await createUser(payload).unwrap()
    setFormOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">Users</h1>
          <p className="mt-1 text-sm text-slate-300">Click a user to view details.</p>
        </div>
        <Button variant="secondary" onClick={openCreate} disabled={busy}>
          Add user
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <CardTitle>All users</CardTitle>
            {usersQuery.isFetching ? (
              <div className="text-xs text-slate-400">Loading…</div>
            ) : null}
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <THead>
              <TR>
                <TH className="w-16">ID</TH>
                <TH>Name</TH>
                <TH>Email</TH>
                <TH className="w-24">Active</TH>
                <TH className="w-56">Actions</TH>
              </TR>
            </THead>
            <TBody>
              {users.map((u) => (
                <TR
                  key={u.id}
                  className="cursor-pointer"
                  onClick={() => setSelectedId(u.id)}
                >
                  <TD>{u.id}</TD>
                  <TD>{u.name}</TD>
                  <TD>{u.email}</TD>
                  <TD>{userActiveText(u)}</TD>
                  <TD>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="secondary"
                        disabled={busy}
                        onClick={(e) => {
                          e.stopPropagation()
                          openEdit(u)
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        disabled={busy}
                        onClick={async (e) => {
                          e.stopPropagation()
                          await deleteUser(u.id).unwrap()
                          if (selectedId === u.id) setSelectedId(null)
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </TD>
                </TR>
              ))}

              {usersQuery.isError ? (
                <TR>
                  <TD colSpan={5} className="py-8 text-center text-red-300">
                    {usersErrorText}
                  </TD>
                </TR>
              ) : !usersQuery.isFetching && users.length === 0 ? (
                <TR>
                  <TD colSpan={5} className="py-8 text-center text-slate-400">
                    No users yet.
                  </TD>
                </TR>
              ) : null}
            </TBody>
          </Table>
        </CardContent>
      </Card>

      <Modal
        open={selectedUser != null}
        title={selectedUser ? `User #${selectedUser.id}` : 'User'}
        onClose={() => setSelectedId(null)}
      >
        {selectedUser ? (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="text-slate-400">ID</div>
              <div className="col-span-2 text-slate-50">{selectedUser.id}</div>

              <div className="text-slate-400">Name</div>
              <div className="col-span-2 text-slate-50">{selectedUser.name}</div>

              <div className="text-slate-400">Email</div>
              <div className="col-span-2 text-slate-50">{selectedUser.email}</div>

              <div className="text-slate-400">Active</div>
              <div className="col-span-2 text-slate-50">{userActiveText(selectedUser)}</div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="secondary" onClick={() => openEdit(selectedUser)} disabled={busy}>
                Edit
              </Button>
              <Button
                variant="destructive"
                onClick={async () => {
                  await deleteUser(selectedUser.id).unwrap()
                  setSelectedId(null)
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
        open={formOpen}
        title={formMode === 'edit' ? `Edit user #${formUserId ?? ''}` : 'Add user'}
        onClose={() => {
          setFormOpen(false)
          resetForm()
        }}
      >
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="user-form-name">Name</Label>
              <Input
                id="user-form-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                disabled={busy}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-form-email">Email</Label>
              <Input
                id="user-form-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@example.com"
                disabled={busy}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-form-active">Active</Label>
              <Select
                id="user-form-active"
                value={isActive}
                onChange={(e) => setIsActive(e.target.value as 'true' | 'false')}
                disabled={busy}
              >
                <option value="true">true</option>
                <option value="false">false</option>
              </Select>
            </div>
          </div>

          {formErrorText ? <div className="text-sm text-red-300">{formErrorText}</div> : null}

          <div className="flex items-center gap-2">
            <Button
              onClick={onSubmit}
              disabled={busy || !name.trim() || !email.trim()}
            >
              Save
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setFormOpen(false)
                resetForm()
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

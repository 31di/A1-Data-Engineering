import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { cn } from '../../lib/cn'

const linkBase =
  'rounded-md px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400'

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-full bg-slate-950 text-slate-50">
      <div className="mx-auto flex min-h-full w-full max-w-6xl">
        <aside className="w-60 shrink-0 border-r border-slate-800 px-4 py-6">
          <div className="text-base font-semibold">My FastAPI</div>
          <nav className="mt-4 flex flex-col gap-1">
            <NavLink
              to="/users"
              className={({ isActive }) =>
                cn(
                  linkBase,
                  'w-full text-left',
                  isActive
                    ? 'bg-slate-800 text-slate-50'
                    : 'text-slate-200 hover:bg-slate-900 hover:text-slate-50',
                )
              }
            >
              Users
            </NavLink>
            <NavLink
              to="/projects"
              className={({ isActive }) =>
                cn(
                  linkBase,
                  'w-full text-left',
                  isActive
                    ? 'bg-slate-800 text-slate-50'
                    : 'text-slate-200 hover:bg-slate-900 hover:text-slate-50',
                )
              }
            >
              Projects
            </NavLink>
          </nav>
        </aside>

        <main className="min-w-0 flex-1 px-6 py-6">{children}</main>
      </div>
    </div>
  )
}

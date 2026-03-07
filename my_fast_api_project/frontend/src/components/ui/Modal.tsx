import type { ReactNode } from 'react'
import { Button } from './Button'

export function Modal({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative mx-auto mt-16 w-[min(92vw,42rem)] overflow-hidden rounded-lg border border-slate-800 bg-slate-950">
        <div className="flex items-center justify-between gap-3 border-b border-slate-800 px-4 py-3">
          <div className="text-sm font-semibold text-slate-50">{title}</div>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
        <div className="px-4 py-4">{children}</div>
      </div>
    </div>
  )
}

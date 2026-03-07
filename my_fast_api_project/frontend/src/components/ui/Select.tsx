import type { SelectHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement>

export function Select({ className, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        'h-10 w-full rounded-md border border-slate-800 bg-slate-950 px-3 text-sm text-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400',
        className,
      )}
      {...props}
    />
  )
}

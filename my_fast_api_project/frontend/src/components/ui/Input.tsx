import type { InputHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

export type InputProps = InputHTMLAttributes<HTMLInputElement>

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        'h-10 w-full rounded-md border border-slate-800 bg-slate-950 px-3 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400',
        className,
      )}
      {...props}
    />
  )
}

import type { TextareaHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>

export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        'min-h-24 w-full resize-y rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400',
        className,
      )}
      {...props}
    />
  )
}

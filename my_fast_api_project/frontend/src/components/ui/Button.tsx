import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

type Variant = 'primary' | 'secondary' | 'destructive' | 'ghost'

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400'

const variants: Record<Variant, string> = {
  primary: 'bg-slate-50 text-slate-950 hover:bg-slate-200',
  secondary: 'bg-slate-800 text-slate-50 hover:bg-slate-700',
  destructive: 'bg-red-600 text-white hover:bg-red-700',
  ghost: 'bg-transparent text-slate-200 hover:bg-slate-900 hover:text-slate-50',
}

export function Button({
  className,
  variant = 'primary',
  type,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type ?? 'button'}
      className={cn(base, variants[variant], className)}
      {...props}
    />
  )
}

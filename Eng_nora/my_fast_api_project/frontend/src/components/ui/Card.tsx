import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/cn'

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('rounded-lg border border-slate-800 bg-slate-950', className)}
      {...props}
    />
  )
}

export function CardHeader({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('border-b border-slate-800 p-4', className)} {...props} />
}

export function CardTitle({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={cn('text-sm font-semibold text-slate-50', className)}>{children}</div>
}

export function CardContent({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-4', className)} {...props} />
}

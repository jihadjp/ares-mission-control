import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type HudPanelProps = {
  title?: string
  code?: string
  action?: ReactNode
  children: ReactNode
  className?: string
  bodyClassName?: string
  as?: 'section' | 'aside' | 'div'
}

export function HudPanel({ title, code, action, children, className, bodyClassName, as: Tag = 'section' }: HudPanelProps) {
  return (
    <Tag
      aria-label={title}
      className={cn(
        'relative flex flex-col rounded-lg border border-cyan-400/20 bg-slate-950/70 shadow-[0_0_30px_-12px_rgba(34,211,238,0.35),inset_0_1px_0_0_rgba(255,255,255,0.04)] backdrop-blur-xl',
        className,
      )}
    >
      <span aria-hidden className="pointer-events-none absolute -left-px -top-px size-3 rounded-tl-lg border-l-2 border-t-2 border-cyan-300" />
      <span aria-hidden className="pointer-events-none absolute -right-px -top-px size-3 rounded-tr-lg border-r-2 border-t-2 border-cyan-300" />
      <span aria-hidden className="pointer-events-none absolute -bottom-px -left-px size-3 rounded-bl-lg border-b-2 border-l-2 border-cyan-300" />
      <span aria-hidden className="pointer-events-none absolute -bottom-px -right-px size-3 rounded-br-lg border-b-2 border-r-2 border-cyan-300" />

      {title && (
        <header className="flex items-center justify-between gap-3 border-b border-cyan-400/15 px-4 py-3">
          <h2 className="font-display text-xs font-semibold uppercase tracking-[0.25em] text-cyan-200">{title}</h2>
          {action ?? (code && <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-400/50">{code}</span>)}
        </header>
      )}
      <div className={cn('flex-1 p-4', bodyClassName)}>{children}</div>
    </Tag>
  )
}

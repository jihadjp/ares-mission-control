'use client'

import { useEffect, useRef } from 'react'
import { Terminal } from 'lucide-react'
import type { LogEntry, LogLevel } from '@/lib/game/types'
import { cn } from '@/lib/utils'

const levelStyles: Record<LogLevel, string> = {
  info: 'text-cyan-300',
  ok: 'text-emerald-400',
  warn: 'text-amber-300',
  error: 'text-red-400',
}

const levelTags: Record<LogLevel, string> = {
  info: 'INFO',
  ok: ' OK ',
  warn: 'WARN',
  error: 'ERR!',
}

export function TerminalLog({ entries, title }: { entries: LogEntry[]; title: string }) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [entries.length])

  return (
    <section
      aria-label={title}
      className="relative flex h-full flex-col overflow-hidden rounded-lg border border-emerald-400/25 bg-black/80 shadow-[0_0_30px_-12px_rgba(52,211,153,0.5)] backdrop-blur-xl"
    >
      <header className="flex items-center justify-between border-b border-emerald-400/15 bg-emerald-400/5 px-4 py-2">
        <div className="flex items-center gap-2">
          <Terminal className="size-4 text-emerald-400" aria-hidden />
          <h2 className="font-display text-xs font-semibold uppercase tracking-[0.25em] text-emerald-300">{title}</h2>
        </div>
        <div className="flex gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-red-500/70" />
          <span className="size-2.5 rounded-full bg-amber-400/70" />
          <span className="size-2.5 rounded-full bg-emerald-400/70" />
        </div>
      </header>

      <div ref={scrollRef} role="log" aria-live="polite" className="relative h-48 flex-1 overflow-y-auto px-4 py-3 font-mono text-xs leading-relaxed">
        <ul className="flex flex-col gap-1">
          {entries.map((entry) => (
            <li key={entry.id} className="flex flex-wrap gap-x-3">
              <span className="tabular-nums text-slate-600">[{entry.time}]</span>
              <span className={cn('whitespace-pre font-bold', levelStyles[entry.level])}>{levelTags[entry.level]}</span>
              <span className={cn('min-w-0 flex-1', entry.level === 'info' ? 'text-emerald-200/90' : levelStyles[entry.level])}>
                {'> '}
                {entry.message}
              </span>
            </li>
          ))}
          <li className="flex items-center gap-1 text-emerald-400" aria-hidden>
            <span>{'>'}</span>
            <span className="inline-block h-4 w-2 animate-pulse bg-emerald-400" />
          </li>
        </ul>
      </div>
    </section>
  )
}

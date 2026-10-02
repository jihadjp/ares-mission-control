import { ChevronsRight, Headset } from 'lucide-react'
import type { Advice } from '@/lib/game/engine'
import { t, type Lang } from '@/lib/game/i18n'
import { cn } from '@/lib/utils'

const toneStyles: Record<Advice['tone'], string> = {
  danger: 'border-red-500/50 bg-red-500/10 text-red-200',
  warn: 'border-amber-300/40 bg-amber-300/10 text-amber-100',
  info: 'border-cyan-300/30 bg-cyan-300/10 text-cyan-100',
  ok: 'border-emerald-300/30 bg-emerald-300/10 text-emerald-100',
}

const iconTone: Record<Advice['tone'], string> = {
  danger: 'text-red-400',
  warn: 'text-amber-300',
  info: 'text-cyan-300',
  ok: 'text-emerald-300',
}

type CommandBarProps = {
  advice: Advice
  dayLabel: string
  sol: number
  onEndSol: () => void
  disabled?: boolean
  language: Lang
}

export function CommandBar({ advice, dayLabel, sol, onEndSol, disabled, language }: CommandBarProps) {
  const endLabel = language === 'bn' ? `${dayLabel} ${sol} শেষ করুন` : `End ${dayLabel} ${sol}`

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <div role="status" aria-live="polite" className={cn('flex flex-1 items-start gap-3 rounded-lg border p-3', toneStyles[advice.tone])}>
        <div className={cn('flex size-9 shrink-0 items-center justify-center rounded-full border border-current/30 bg-slate-950/60', iconTone[advice.tone])}>
          <Headset className="size-4" aria-hidden />
        </div>
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-widest opacity-70">
            {`${t('capcom', language)} // `}
            <span className="font-bold">{advice.title}</span>
          </p>
          <p className="text-pretty text-sm font-medium leading-snug">{advice.text}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onEndSol}
        disabled={disabled}
        className="group flex min-h-14 shrink-0 items-center justify-center gap-2 rounded-lg bg-cyan-300 px-6 font-display text-sm font-bold uppercase tracking-[0.25em] text-slate-950 shadow-[0_0_30px_-6px_rgba(34,211,238,0.8)] transition-colors hover:bg-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {endLabel}
        <ChevronsRight className="size-5 transition-transform group-hover:translate-x-1" aria-hidden />
      </button>
    </div>
  )
}

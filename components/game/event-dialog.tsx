'use client'

import { useEffect, useRef } from 'react'
import { AlertTriangle, BookOpen, Sparkles, Users, type LucideIcon } from 'lucide-react'
import { t, type Lang } from '@/lib/game/i18n'
import type { Choice, EventKind, GameEvent } from '@/lib/game/types'
import { cn } from '@/lib/utils'

const kindStyles: Record<EventKind, { icon: LucideIcon; ring: string; text: string; bar: string }> = {
  hazard: { icon: AlertTriangle, ring: 'border-red-500/60 shadow-[0_0_60px_-10px_rgba(239,68,68,0.6)]', text: 'text-red-300', bar: 'bg-[repeating-linear-gradient(45deg,#ef4444_0,#ef4444_8px,transparent_8px,transparent_16px)]' },
  opportunity: { icon: Sparkles, ring: 'border-emerald-400/60 shadow-[0_0_60px_-10px_rgba(52,211,153,0.6)]', text: 'text-emerald-300', bar: 'bg-emerald-400' },
  crew: { icon: Users, ring: 'border-sky-400/60 shadow-[0_0_60px_-10px_rgba(56,189,248,0.6)]', text: 'text-sky-300', bar: 'bg-sky-400' },
}

const kindLabelKey: Record<EventKind, 'hazard' | 'opportunity' | 'crewLabel'> = {
  hazard: 'hazard',
  opportunity: 'opportunity',
  crew: 'crewLabel',
}

export function EventDialog({ event, dayLabel, sol, onChoose, language }: { event: GameEvent; dayLabel: string; sol: number; onChoose: (choice: Choice) => void; language: Lang }) {
  const firstChoice = useRef<HTMLButtonElement>(null)
  const style = kindStyles[event.kind]
  const Icon = style.icon
  const bn = language === 'bn'

  const title = (bn && event.titleBn) || event.title
  const description = (bn && event.descriptionBn) || event.description
  const fact = (bn && event.factBn) || event.fact

  useEffect(() => {
    firstChoice.current?.focus()
  }, [event.id])

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-slate-950/80 p-3 backdrop-blur-sm sm:items-center sm:p-6">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="event-title"
        aria-describedby="event-desc"
        className={cn('relative w-full max-w-2xl overflow-hidden rounded-xl border bg-slate-950 animate-in fade-in zoom-in-95 duration-300', style.ring)}
      >
        <div aria-hidden className={cn('h-1.5 w-full', style.bar)} />
        <div className="flex flex-col gap-5 p-5 sm:p-7">
          <div className="flex items-center justify-between gap-3">
            <p className={cn('flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.3em]', style.text)}>
              <Icon className="size-4" aria-hidden />
              {t(kindLabelKey[event.kind], language)} {t('alert', language)}
            </p>
            <p className="font-mono text-[11px] uppercase tracking-widest text-slate-500">
              {dayLabel} {sol}
            </p>
          </div>

          <div>
            <h2 id="event-title" className="text-balance font-display text-xl font-bold uppercase tracking-[0.12em] text-white sm:text-2xl">
              {title}
            </h2>
            <p id="event-desc" className="mt-2 text-pretty text-base leading-relaxed text-slate-300">
              {description}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">{t('commanderDecision', language)}</p>
            <div className={cn('grid gap-3', event.choices.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2')}>
              {event.choices.map((choice, i) => {
                const choiceLabel = (bn && choice.labelBn) || choice.label
                const choiceSummary = (bn && choice.summaryBn) || choice.summary
                return (
                  <button
                    key={choice.label}
                    ref={i === 0 ? firstChoice : undefined}
                    type="button"
                    onClick={() => onChoose(choice)}
                    className="group flex flex-col gap-1.5 rounded-lg border border-white/15 bg-white/5 p-4 text-left transition-all hover:-translate-y-0.5 hover:border-cyan-300 hover:bg-cyan-300/10 focus-visible:border-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/50"
                  >
                    <span className="font-display text-sm font-bold uppercase tracking-[0.15em] text-cyan-100 group-hover:text-cyan-50">{choiceLabel}</span>
                    <span className="text-sm leading-snug text-slate-400">{choiceSummary}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <aside className="flex gap-3 rounded-lg border border-amber-300/30 bg-amber-300/5 p-4">
            <BookOpen className="mt-0.5 size-5 shrink-0 text-amber-300" aria-hidden />
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-amber-300">{t('realSpaceScience', language)}</p>
              <p className="text-pretty text-sm leading-relaxed text-amber-50/90">{fact}</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

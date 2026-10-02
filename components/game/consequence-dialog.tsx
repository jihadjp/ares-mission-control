'use client'

import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { t, type Lang } from '@/lib/game/i18n'
import type { Consequence } from '@/lib/game/types'

export function ConsequenceDialog({ consequence, onContinue, language }: { consequence: Consequence; onContinue: () => void; language: Lang }) {
  const effects = Object.entries(consequence.effects).filter(([, value]) => value)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="consequence-title">
      <section className="w-full max-w-lg rounded-xl border border-cyan-300/40 bg-slate-950 p-6 shadow-[0_0_60px_-12px_rgba(34,211,238,0.6)]">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 size-6 shrink-0 text-emerald-300" aria-hidden />
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-cyan-300">{t('decisionLogged', language)}</p>
            <h2 id="consequence-title" className="mt-1 font-display text-xl font-bold uppercase tracking-widest text-cyan-50">{consequence.choiceLabel}</h2>
            <p className="mt-2 text-sm text-slate-400">{consequence.eventTitle}</p>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {effects.map(([key, value]) => <div key={key} className="rounded-md border border-white/10 bg-white/5 p-3 text-center"><p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">{key}</p><p className={value > 0 ? 'text-emerald-300' : 'text-red-300'}>{value > 0 ? '+' : ''}{value}</p></div>)}
        </div>
        <button type="button" onClick={onContinue} className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-md bg-cyan-300 font-display text-xs font-bold uppercase tracking-[0.25em] text-slate-950 hover:bg-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">{t('continueBtn', language)} <ArrowRight className="size-4" aria-hidden /></button>
      </section>
    </div>
  )
}

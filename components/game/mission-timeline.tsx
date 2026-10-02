import { isNight } from '@/lib/game/engine'
import { t } from '@/lib/game/i18n'
import type { GameState } from '@/lib/game/types'
import { cn } from '@/lib/utils'

export function MissionTimeline({ state, dayLabel }: { state: GameState; dayLabel: string }) {
  const lang = state.language
  const flareSols = new Set<number>()
  for (const m of state.modifiers) if (m.kind === 'flare') flareSols.add(state.sol + m.eta - 1)
  const pastFlares = new Set(state.history.filter((h) => h.flareHit).map((h) => h.sol))
  const stormSols = new Set<number>()
  for (const m of state.modifiers) if (m.kind === 'storm') for (let i = 0; i < m.sols; i++) stormSols.add(state.sol + i)

  const sols = Array.from({ length: state.totalSols }, (_, i) => i + 1)

  return (
    <section aria-label={t('missionTimeline', lang)} className="rounded-lg border border-cyan-400/20 bg-slate-950/70 p-3 backdrop-blur-xl">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-display text-xs font-semibold uppercase tracking-[0.25em] text-cyan-200">{t('missionTimeline', lang)}</h2>
        <ul className="flex flex-wrap gap-3 font-mono text-[10px] uppercase tracking-widest text-slate-400">
          <li className="flex items-center gap-1.5"><span aria-hidden className="size-2 rounded-full bg-red-500" />{t('solarFlareLabel', lang)}</li>
          <li className="flex items-center gap-1.5"><span aria-hidden className="size-2 rounded-full bg-orange-400" />{t('dustStormLabel', lang)}</li>
          {state.destination === 'moon' && <li className="flex items-center gap-1.5"><span aria-hidden className="size-2 rounded-full bg-indigo-400" />{t('nightLabel', lang)}</li>}
        </ul>
      </div>
      <ol className="grid grid-cols-10 gap-1 sm:grid-cols-20">
        {sols.map((sol) => {
          const past = sol < state.sol
          const current = sol === state.sol
          const marker = flareSols.has(sol) || pastFlares.has(sol) ? 'bg-red-500' : stormSols.has(sol) ? 'bg-orange-400' : isNight(state.destination, sol) ? 'bg-indigo-400' : null
          return (
            <li
              key={sol}
              aria-current={current ? 'step' : undefined}
              aria-label={`${dayLabel} ${sol}`}
              className={cn(
                'relative flex h-9 flex-col items-center justify-center rounded border font-mono text-[11px] tabular-nums',
                current && 'border-cyan-300 bg-cyan-300/20 font-bold text-cyan-50 shadow-[0_0_14px_-2px_rgba(34,211,238,0.8)]',
                past && 'border-cyan-400/20 bg-cyan-400/5 text-cyan-400/60',
                !past && !current && 'border-white/10 text-slate-500',
              )}
            >
              {sol}
              {marker && <span aria-hidden className={cn('absolute bottom-1 size-1.5 rounded-full', marker)} />}
            </li>
          )
        })}
      </ol>
    </section>
  )
}

'use client'

import { LogOut, Radio } from 'lucide-react'
import { DESTINATIONS, DIFFICULTY } from '@/lib/game/config'
import { flareEta, forecast, generationFor, getAdvice, isNight, shieldStrength } from '@/lib/game/engine'
import { t } from '@/lib/game/i18n'
import type { Choice, GameState, SystemKey } from '@/lib/game/types'
import { cn } from '@/lib/utils'
import { CommandBar } from './command-bar'
import { EventDialog } from './event-dialog'
import { MissionTimeline } from './mission-timeline'
import { OutpostView } from './outpost-view'
import { PowerPanel } from './power-panel'
import { TerminalLog } from './terminal-log'
import { VitalsPanel } from './vitals-panel'

type GameScreenProps = {
  state: GameState
  onAllocate: (key: SystemKey, value: number) => void
  onEndSol: () => void
  onChoose: (choice: Choice) => void
  onAbort: () => void
}

type Status = 'NOMINAL' | 'CAUTION' | 'CRITICAL'
const statusStyles: Record<Status, string> = {
  NOMINAL: 'text-emerald-400 border-emerald-400/40 bg-emerald-400/10',
  CAUTION: 'text-amber-300 border-amber-300/40 bg-amber-300/10',
  CRITICAL: 'text-red-400 border-red-500/50 bg-red-500/10',
}

export function GameScreen({ state, onAllocate, onEndSol, onChoose, onAbort }: GameScreenProps) {
  const dest = DESTINATIONS[state.destination]
  const lang = state.language
  const { delta } = forecast(state)
  const generation = generationFor(state)
  const advice = getAdvice(state)
  const r = state.resources
  const lowest = Math.min(r.oxygen, r.water, r.food, r.health, 100 - r.radiation)
  const status: Status = lowest < 25 || advice.tone === 'danger' ? 'CRITICAL' : lowest < 45 || advice.tone === 'warn' ? 'CAUTION' : 'NOMINAL'
  const statusLabel = status === 'NOMINAL' ? t('nominal', lang) : status === 'CAUTION' ? t('caution', lang) : t('critical', lang)
  const progress = ((state.sol - 1) / state.totalSols) * 100

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-4 p-3 sm:p-5">
      <header className="relative flex flex-col gap-3 rounded-lg border border-cyan-400/20 bg-slate-950/70 px-4 py-3 backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-md border border-cyan-400/40 bg-cyan-400/10 text-cyan-300">
            <Radio className="size-5" aria-hidden />
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-cyan-400/60">
              {lang === 'bn' ? DIFFICULTY[state.difficulty].labelBn : DIFFICULTY[state.difficulty].label} {state.commander} · {lang === 'bn' ? dest.bodyBn : dest.body}
            </p>
            <h1 className="font-display text-sm font-bold uppercase tracking-[0.2em] text-cyan-100 sm:text-lg">{lang === 'bn' ? dest.baseNameBn : dest.baseName}</h1>
          </div>
        </div>

        <div className="flex flex-1 items-center gap-3 lg:max-w-md">
          <span className="font-display text-[10px] uppercase tracking-[0.25em] text-cyan-400/70">{lang === 'bn' ? (dest.dayLabel === 'Sol' ? 'সল' : 'দিন') : dest.dayLabel}</span>
          <span className="font-mono text-xl font-bold tabular-nums text-cyan-50">
            {state.sol}
            <span className="text-sm text-slate-500">/{state.totalSols}</span>
          </span>
          <div
            className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-800"
            role="progressbar"
            aria-label={t('missionProgress', lang)}
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-cyan-200 transition-[width] duration-700" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className={cn('flex items-center gap-2 rounded-md border px-3 py-1.5', statusStyles[status])}>
            <span aria-hidden className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-current opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-current" />
            </span>
            <span className="font-mono text-sm font-bold tracking-[0.2em]">{statusLabel}</span>
          </div>
          <button
            type="button"
            onClick={onAbort}
            className="flex h-9 items-center gap-2 rounded-md border border-white/10 px-3 font-mono text-[10px] uppercase tracking-widest text-slate-400 hover:border-red-400/50 hover:text-red-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
          >
            <LogOut className="size-3.5" aria-hidden />
            {t('abortMission', lang)}
          </button>
        </div>
      </header>

      <main className="grid grid-cols-1 gap-4 lg:grid-cols-[280px_1fr_320px] xl:grid-cols-[300px_1fr_340px]">
        <VitalsPanel resources={r} delta={delta} dayLabel={dest.dayLabel} language={lang} />
        <div className="flex min-w-0 flex-col gap-4">
          <OutpostView
            dest={dest}
            night={isNight(state.destination, state.sol)}
            storm={state.modifiers.some((m) => m.kind === 'storm')}
            shield={shieldStrength(state.allocation.shield)}
            flareEta={flareEta(state.modifiers)}
            generation={generation.total}
            language={lang}
          />
          <CommandBar advice={advice} dayLabel={dest.dayLabel} sol={state.sol} onEndSol={onEndSol} disabled={!!state.pendingEvent} language={lang} />
          <MissionTimeline state={state} dayLabel={dest.dayLabel} />
        </div>
        <PowerPanel allocation={state.allocation} generation={generation} onChange={onAllocate} disabled={!!state.pendingEvent} language={lang} />
        <div className="lg:col-span-3">
          <TerminalLog entries={state.log} title={`${t('missionLog', lang)} // ${lang === 'bn' ? dest.baseNameBn : dest.baseName}`} />
        </div>
      </main>

      {state.pendingEvent && <EventDialog event={state.pendingEvent} dayLabel={dest.dayLabel} sol={state.sol} onChoose={onChoose} language={lang} />}
    </div>
  )
}

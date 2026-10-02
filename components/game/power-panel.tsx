'use client'

import { FlaskConical, HeartPulse, ShieldHalf, Sprout, type LucideIcon } from 'lucide-react'
import { SYSTEMS } from '@/lib/game/config'
import { shieldStrength, totalDemand } from '@/lib/game/engine'
import { t, type Lang } from '@/lib/game/i18n'
import type { Allocation, SystemKey } from '@/lib/game/types'
import { cn } from '@/lib/utils'
import { HudPanel } from './hud-panel'

const icons: Record<SystemKey, { icon: LucideIcon; tone: string; fill: string }> = {
  lifeSupport: { icon: HeartPulse, tone: 'text-cyan-300', fill: 'from-cyan-600 to-cyan-300' },
  greenhouse: { icon: Sprout, tone: 'text-emerald-300', fill: 'from-emerald-600 to-emerald-300' },
  shield: { icon: ShieldHalf, tone: 'text-fuchsia-300', fill: 'from-fuchsia-600 to-fuchsia-300' },
  research: { icon: FlaskConical, tone: 'text-amber-300', fill: 'from-amber-600 to-amber-300' },
}

type PowerPanelProps = {
  allocation: Allocation
  generation: { solar: number; reactor: number; total: number }
  onChange: (key: SystemKey, value: number) => void
  disabled?: boolean
  language: Lang
}

export function PowerPanel({ allocation, generation, onChange, disabled, language }: PowerPanelProps) {
  const demand = totalDemand(allocation)
  const net = generation.total - demand
  const genPct = Math.min(100, (generation.total / 120) * 100)
  const demandPct = Math.min(100, (demand / 120) * 100)

  return (
    <HudPanel title={t('powerRouting', language)} code="PWR-03" as="aside" bodyClassName="flex flex-col gap-5">
      <div className="flex flex-col gap-3 rounded-md border border-yellow-300/20 bg-yellow-300/5 p-3">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-widest text-slate-500">{t('generation', language)}</p>
            <p className="font-mono text-xl font-bold tabular-nums text-yellow-200">
              {generation.total}
              <span className="text-[10px] text-slate-500"> kW</span>
            </p>
          </div>
          <div>
            <p className="font-mono text-[9px] uppercase tracking-widest text-slate-500">{t('demandLabel', language)}</p>
            <p className="font-mono text-xl font-bold tabular-nums text-cyan-100">
              {demand}
              <span className="text-[10px] text-slate-500"> kW</span>
            </p>
          </div>
          <div>
            <p className="font-mono text-[9px] uppercase tracking-widest text-slate-500">{t('battery', language)}</p>
            <p className={cn('font-mono text-xl font-bold tabular-nums', net >= 0 ? 'text-emerald-400' : 'text-red-400')}>
              {net >= 0 ? `+${net}` : net}
            </p>
          </div>
        </div>
        <div className="relative h-2 overflow-hidden rounded-full bg-slate-900" aria-hidden>
          <div className="absolute inset-y-0 left-0 rounded-full bg-yellow-300/30" style={{ width: `${genPct}%` }} />
          <div
            className={cn('absolute inset-y-0 left-0 rounded-full transition-[width]', demand > generation.total ? 'bg-red-400' : 'bg-cyan-300')}
            style={{ width: `${demandPct}%` }}
          />
        </div>
        <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
          {t('solar', language)} {generation.solar} kW{generation.reactor ? ` · ${t('reactor', language)} ${generation.reactor} kW` : ''}
          {net < 0 ? ` · ${t('batteryDraining', language)}` : ''}
        </p>
      </div>

      {SYSTEMS.map(({ key, label, labelBn, hint, hintBn, max }) => {
        const value = allocation[key]
        const { icon: Icon, tone, fill } = icons[key]
        const id = `power-${key}`
        const displayLabel = language === 'bn' ? labelBn : label
        const displayHint = language === 'bn' ? hintBn : hint
        return (
          <div key={key} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-2">
              <label htmlFor={id} className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-200">
                <Icon className={cn('size-4', tone)} aria-hidden />
                {displayLabel}
              </label>
              <output htmlFor={id} className={cn('font-mono text-base font-bold tabular-nums', tone)}>
                {value}
                <span className="text-[10px] text-slate-500"> kW</span>
                {key === 'shield' && <span className="ml-1.5 text-[10px] text-fuchsia-300/70">{`(${Math.round(shieldStrength(value))}%)`}</span>}
              </output>
            </div>
            <div className="relative flex h-6 items-center">
              <div className="absolute inset-x-0 h-2 overflow-hidden rounded-full border border-white/5 bg-slate-900">
                <div className={cn('h-full rounded-full bg-gradient-to-r', fill)} style={{ width: `${(value / max) * 100}%` }} />
              </div>
              <input
                id={id}
                type="range"
                min={0}
                max={max}
                step={1}
                value={value}
                disabled={disabled}
                aria-describedby={`${id}-hint`}
                onChange={(e) => onChange(key, Number(e.target.value))}
                className="relative z-10 h-6 w-full cursor-pointer appearance-none bg-transparent focus-visible:outline-none disabled:cursor-not-allowed [&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:rounded-sm [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-cyan-200 [&::-moz-range-thumb]:bg-slate-950 [&::-moz-range-track]:bg-transparent [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:rotate-45 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-sm [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-cyan-200 [&::-webkit-slider-thumb]:bg-slate-950 [&::-webkit-slider-thumb]:shadow-[0_0_12px_rgba(34,211,238,0.9)] focus-visible:[&::-webkit-slider-thumb]:ring-2 focus-visible:[&::-webkit-slider-thumb]:ring-cyan-300"
              />
            </div>
            <p id={`${id}-hint`} className="text-xs leading-snug text-slate-500">
              {displayHint}
            </p>
          </div>
        )
      })}
    </HudPanel>
  )
}

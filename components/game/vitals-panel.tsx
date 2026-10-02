import { Apple, BatteryCharging, Droplets, FlaskConical, HeartPulse, Radiation, Smile, Wind, type LucideIcon } from 'lucide-react'
import { t, type Lang } from '@/lib/game/i18n'
import type { Resources } from '@/lib/game/types'
import { cn } from '@/lib/utils'
import { HudPanel } from './hud-panel'
import type { UIKey } from '@/lib/game/i18n'

type VitalConfig = {
  key: Exclude<keyof Resources, 'science'>
  labelKey: UIKey
  icon: LucideIcon
  text: string
  bar: string
  inverse?: boolean
}

const vitals: VitalConfig[] = [
  { key: 'oxygen', labelKey: 'oxygen', icon: Wind, text: 'text-cyan-300', bar: 'from-cyan-600 to-cyan-300' },
  { key: 'water', labelKey: 'water', icon: Droplets, text: 'text-blue-300', bar: 'from-blue-600 to-blue-300' },
  { key: 'food', labelKey: 'food', icon: Apple, text: 'text-emerald-300', bar: 'from-emerald-600 to-emerald-300' },
  { key: 'battery', labelKey: 'battery', icon: BatteryCharging, text: 'text-yellow-300', bar: 'from-yellow-600 to-yellow-300' },
  { key: 'health', labelKey: 'crewHealth', icon: HeartPulse, text: 'text-rose-300', bar: 'from-rose-600 to-rose-300' },
  { key: 'morale', labelKey: 'morale', icon: Smile, text: 'text-sky-300', bar: 'from-sky-600 to-sky-300' },
  { key: 'radiation', labelKey: 'radiationDose', icon: Radiation, text: 'text-fuchsia-300', bar: 'from-fuchsia-600 to-fuchsia-300', inverse: true },
]

function danger(value: number, inverse?: boolean) {
  const v = inverse ? 100 - value : value
  if (v < 25) return 'critical'
  if (v < 45) return 'low'
  return 'ok'
}

function Delta({ value, inverse }: { value: number; inverse?: boolean }) {
  const rounded = Math.round(value)
  if (rounded === 0) return <span className="font-mono text-[11px] text-slate-500">{'±0'}</span>
  const good = inverse ? rounded < 0 : rounded > 0
  return (
    <span className={cn('font-mono text-[11px] font-bold tabular-nums', good ? 'text-emerald-400' : 'text-red-400')}>
      {rounded > 0 ? `+${rounded}` : rounded}
    </span>
  )
}

export function VitalsPanel({ resources, delta, dayLabel, language }: { resources: Resources; delta: Record<keyof Resources, number>; dayLabel: string; language: Lang }) {
  const hintText = language === 'bn'
    ? `ছোট সংখ্যাগুলো দেখায় বর্তমান বিদ্যুৎ পরিকল্পনায় ${dayLabel.toLowerCase()} শেষ করলে প্রতিটি মান কীভাবে বদলাবে।`
    : `Small numbers show how each value will change if you end the ${dayLabel.toLowerCase()} with your current power plan.`

  return (
    <HudPanel title={t('outpostVitals', language)} code={`${language === 'bn' ? 'পরবর্তী' : 'Next'} ${dayLabel}`} as="aside" bodyClassName="flex flex-col gap-4">
      <div className="flex items-center justify-between rounded-md border border-amber-300/30 bg-amber-300/10 px-3 py-2.5">
        <div className="flex items-center gap-2 text-amber-200">
          <FlaskConical className="size-5" aria-hidden />
          <span className="text-sm font-semibold uppercase tracking-wider">{t('science', language)}</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-2xl font-bold tabular-nums text-amber-200">{Math.round(resources.science)}</span>
          <Delta value={delta.science} />
        </div>
      </div>

      {vitals.map(({ key, labelKey, icon: Icon, text, bar, inverse }) => {
        const value = Math.round(resources[key])
        const state = danger(value, inverse)
        return (
          <div key={key} className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <Icon className={cn('size-4 shrink-0', text)} aria-hidden />
              <span className="flex-1 text-sm font-semibold uppercase tracking-wider text-slate-200">{t(labelKey, language)}</span>
              <Delta value={delta[key]} inverse={inverse} />
              <span className={cn('w-12 text-right font-mono text-base font-bold tabular-nums', state === 'critical' ? 'text-red-400' : text)}>
                {value}
                <span className="text-[10px] text-slate-500">%</span>
              </span>
            </div>
            <div
              role="meter"
              aria-label={t(labelKey, language)}
              aria-valuenow={value}
              aria-valuemin={0}
              aria-valuemax={100}
              className={cn('relative h-2 overflow-hidden rounded-sm border bg-slate-900', state === 'critical' ? 'border-red-500/60' : 'border-white/5')}
            >
              <div
                className={cn('h-full rounded-sm bg-gradient-to-r transition-[width] duration-700 ease-out', state === 'critical' ? 'from-red-600 to-red-400' : bar)}
                style={{ width: `${value}%` }}
              />
              <div aria-hidden className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent_0,transparent_9px,rgba(2,6,23,0.9)_9px,rgba(2,6,23,0.9)_10px)]" />
            </div>
          </div>
        )
      })}

      <p className="mt-auto border-t border-cyan-400/10 pt-3 text-xs leading-relaxed text-slate-500">
        {hintText}
      </p>
    </HudPanel>
  )
}

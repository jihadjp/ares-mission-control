import Image from 'next/image'
import { AlertTriangle, CloudFog, Moon, Sun } from 'lucide-react'
import type { DestinationConfig } from '@/lib/game/config'
import { t, type Lang } from '@/lib/game/i18n'
import { cn } from '@/lib/utils'

type OutpostViewProps = {
  dest: DestinationConfig
  night: boolean
  storm: boolean
  shield: number
  flareEta: number | null
  generation: number
  language: Lang
}

export function OutpostView({ dest, night, storm, shield, flareEta, generation, language }: OutpostViewProps) {
  const label = dest.dayLabel.toLowerCase()
  const baseName = language === 'bn' ? dest.baseNameBn : dest.baseName

  return (
    <section
      aria-label={`${baseName} ${language === 'bn' ? 'ক্যামেরা দৃশ্য' : 'camera view'}`}
      className="relative min-h-[300px] flex-1 overflow-hidden rounded-lg border border-cyan-400/30 bg-slate-950 shadow-[0_0_40px_-10px_rgba(34,211,238,0.45)] sm:min-h-[380px]"
    >
      <Image src={dest.image} alt={dest.imageAlt} fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-1000"
        style={{
          opacity: shield / 100,
          background: 'radial-gradient(ellipse at 55% 55%, rgba(217,70,239,0.35), transparent 55%)',
        }}
      />
      <div aria-hidden className={cn('pointer-events-none absolute inset-0 bg-slate-950/75 transition-opacity duration-1000', night ? 'opacity-100' : 'opacity-0')} />
      <div aria-hidden className={cn('pointer-events-none absolute inset-0 bg-orange-700/40 mix-blend-multiply transition-opacity duration-1000', storm ? 'opacity-100' : 'opacity-0')} />
      <div aria-hidden className={cn('pointer-events-none absolute inset-0 bg-orange-300/20 backdrop-blur-[2px] transition-opacity duration-1000', storm ? 'opacity-100' : 'opacity-0')} />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(2,6,23,0.85)_100%)]" />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent_0,transparent_3px,rgba(34,211,238,0.04)_3px,rgba(34,211,238,0.04)_4px)]" />

      <div className="absolute left-4 top-4 flex flex-col gap-1 font-mono text-[10px] uppercase tracking-widest text-cyan-300/80">
        <span>{t('cam04', language)} // {baseName}</span>
        <span className="text-cyan-400/50">{dest.coordinates}</span>
      </div>
      <div className="absolute right-4 top-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-red-400">
        <span aria-hidden className="size-1.5 animate-pulse rounded-full bg-red-500" />
        {t('live', language)}
      </div>

      <div className="absolute inset-x-4 bottom-4 flex flex-wrap items-end justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          <span className={cn('flex items-center gap-1.5 rounded border px-2 py-1 font-mono text-[10px] uppercase tracking-widest backdrop-blur', night ? 'border-indigo-300/40 bg-indigo-950/70 text-indigo-200' : 'border-yellow-300/40 bg-slate-950/70 text-yellow-200')}>
            {night ? <Moon className="size-3" aria-hidden /> : <Sun className="size-3" aria-hidden />}
            {night ? t('lunarNight', language) : t('daylightLabel', language)} · {generation} kW
          </span>
          {storm && (
            <span className="flex items-center gap-1.5 rounded border border-orange-300/40 bg-orange-950/70 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-orange-200 backdrop-blur">
              <CloudFog className="size-3" aria-hidden /> {t('dustStorm', language)}
            </span>
          )}
        </div>
        <span className="rounded border border-fuchsia-300/40 bg-slate-950/70 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-fuchsia-200 backdrop-blur">
          {t('shieldLabel', language)} {Math.round(shield)}%
        </span>
      </div>

      {flareEta !== null && (
        <div className="absolute inset-x-0 top-14 flex justify-center px-4">
          <div
            role="alert"
            className={cn(
              'relative w-full max-w-md overflow-hidden rounded-lg border bg-red-950/70 px-5 py-3 text-center backdrop-blur-md',
              flareEta === 1 ? 'animate-pulse border-red-400 shadow-[0_0_40px_-4px_rgba(239,68,68,0.8)]' : 'border-red-500/50',
            )}
          >
            <div aria-hidden className="absolute inset-x-0 top-0 h-1 bg-[repeating-linear-gradient(45deg,#ef4444_0,#ef4444_8px,transparent_8px,transparent_16px)]" />
            <p className="flex items-center justify-center gap-2 font-display text-xs font-bold uppercase tracking-[0.25em] text-red-300">
              <AlertTriangle className="size-4" aria-hidden />
              {language === 'bn'
                ? `${t('solarFlare', language)} ${flareEta === 1 ? `এই ${label}-এ আঘাত করবে!` : `${flareEta} ${label} পরে`}`
                : `${t('solarFlare', language)} ${flareEta === 1 ? `hits this ${label}!` : `${flareEta} ${label}s away`}`
              }
            </p>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-red-200/80">{t('routePowerToShield', language)}</p>
          </div>
        </div>
      )}
    </section>
  )
}

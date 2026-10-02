import { Award, BookOpen, Lock, RotateCcw, Rocket, TriangleAlert } from 'lucide-react'
import { DESTINATIONS } from '@/lib/game/config'
import { scoreGame } from '@/lib/game/engine'
import { t, type UIKey } from '@/lib/game/i18n'
import type { GameState, SolRecord } from '@/lib/game/types'
import { cn } from '@/lib/utils'
import { HudPanel } from './hud-panel'

const series: { key: keyof SolRecord; label: string; color: string }[] = [
  { key: 'oxygen', label: 'Oxygen', color: '#67e8f9' },
  { key: 'water', label: 'Water', color: '#60a5fa' },
  { key: 'food', label: 'Food', color: '#6ee7b7' },
  { key: 'battery', label: 'Battery', color: '#fde047' },
  { key: 'health', label: 'Health', color: '#fda4af' },
  { key: 'radiation', label: 'Radiation', color: '#f0abfc' },
]

const gradeStyles: Record<string, string> = {
  S: 'text-amber-200 [text-shadow:0_0_40px_rgba(252,211,77,0.9)]',
  A: 'text-emerald-300 [text-shadow:0_0_40px_rgba(110,231,183,0.8)]',
  B: 'text-cyan-300 [text-shadow:0_0_40px_rgba(103,232,249,0.8)]',
  C: 'text-sky-300',
  D: 'text-slate-300',
  F: 'text-red-400 [text-shadow:0_0_40px_rgba(248,113,113,0.8)]',
}

function MissionChart({ history, totalSols }: { history: SolRecord[]; totalSols: number }) {
  const w = 600
  const h = 200
  const x = (sol: number) => ((sol - 1) / Math.max(1, totalSols - 1)) * w
  const y = (v: number) => h - (v / 100) * h
  return (
    <figure className="flex flex-col gap-3">
      <svg viewBox={`0 0 ${w} ${h}`} className="h-48 w-full overflow-visible" role="img" aria-label="Chart of outpost resources over the mission">
        {[0, 25, 50, 75, 100].map((v) => (
          <line key={v} x1={0} x2={w} y1={y(v)} y2={y(v)} stroke="rgba(148,163,184,0.12)" strokeDasharray="4 6" />
        ))}
        {history
          .filter((r) => r.flareHit)
          .map((r) => (
            <line key={`f${r.sol}`} x1={x(r.sol)} x2={x(r.sol)} y1={0} y2={h} stroke="rgba(239,68,68,0.5)" strokeWidth={2} />
          ))}
        {series.map((s) => (
          <polyline
            key={s.key}
            fill="none"
            stroke={s.color}
            strokeWidth={2.5}
            strokeLinejoin="round"
            strokeLinecap="round"
            points={history.map((r) => `${x(r.sol)},${y(Number(r[s.key]))}`).join(' ')}
          />
        ))}
      </svg>
      <figcaption className="flex flex-wrap gap-4 font-mono text-[10px] uppercase tracking-widest text-slate-400">
        {series.map((s) => (
          <span key={s.key} className="flex items-center gap-1.5">
            <span aria-hidden className="h-0.5 w-4 rounded" style={{ background: s.color }} />
            {s.label}
          </span>
        ))}
        <span className="flex items-center gap-1.5">
          <span aria-hidden className="h-3 w-0.5 bg-red-500/70" />
          Flare impact
        </span>
      </figcaption>
    </figure>
  )
}

export function Debrief({ state, onReplay, onNewMission }: { state: GameState; onReplay: () => void; onNewMission: () => void }) {
  const dest = DESTINATIONS[state.destination]
  const lang = state.language
  const { breakdown, total, grade, badges } = scoreGame(state)
  const won = state.status === 'won'
  const earned = badges.filter((b) => b.earned).length
  const body = lang === 'bn' ? dest.bodyBn : dest.body
  const baseName = lang === 'bn' ? dest.baseNameBn : dest.baseName

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-8 sm:py-12">
      <header
        className={cn(
          'relative overflow-hidden rounded-xl border p-6 sm:p-8',
          won ? 'border-emerald-400/40 bg-emerald-400/5' : 'border-red-500/40 bg-red-500/5',
        )}
      >
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2">
            <p className={cn('flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.3em]', won ? 'text-emerald-300' : 'text-red-300')}>
              {won ? <Rocket className="size-4" aria-hidden /> : <TriangleAlert className="size-4" aria-hidden />}
              {won ? t('missionAccomplished', lang) : t('missionAborted', lang)}
            </p>
            <h1 className="text-balance font-display text-2xl font-black uppercase tracking-[0.1em] text-white sm:text-4xl">
              {won ? `${t('welcomeHome', lang)} ${state.commander}` : `${t('evacuation', lang)} ${dest.dayLabel} ${state.sol}`}
            </h1>
            <p className="max-w-xl text-pretty leading-relaxed text-slate-300">
              {won
                ? lang === 'bn'
                  ? `আপনি ${baseName} কে ${body}-তে ${state.totalSols} ${dest.dayLabel.toLowerCase()} ধরে চালু রেখেছেন। মিশন কন্ট্রোল আপনার কমান্ডের মূল্যায়ন করেছে।`
                  : `You kept ${baseName} running for all ${state.totalSols} ${dest.dayLabel.toLowerCase()}s on ${body}. Here is how Mission Control rated your command.`
                : state.lossReason}
            </p>
          </div>
          <div className="flex items-center gap-5">
            <div className="text-center">
              <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">{t('gradeLabel', lang)}</p>
              <p className={cn('font-display text-7xl font-black leading-none', gradeStyles[grade])}>{grade}</p>
            </div>
            <div className="text-center">
              <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">{t('scoreLabel', lang)}</p>
              <p className="font-mono text-4xl font-bold tabular-nums text-white">{total}</p>
              <p className="font-mono text-[10px] text-slate-500">/ 750</p>
            </div>
          </div>
        </div>
      </header>

      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <HudPanel title={t('missionTelemetry', lang)} code={`${state.history.length} ${dest.dayLabel}s ${t('logged', lang)}`}>
          <MissionChart history={state.history} totalSols={state.totalSols} />
        </HudPanel>

        <HudPanel title={t('scoreBreakdown', lang)} bodyClassName="flex flex-col gap-4">
          {breakdown.map((b) => (
            <div key={b.label} className="flex flex-col gap-1.5">
              <div className="flex justify-between text-sm">
                <span className="font-semibold uppercase tracking-wider text-slate-200">{t(b.label as UIKey, lang)}</span>
                <span className="font-mono tabular-nums text-cyan-200">
                  {b.value}
                  <span className="text-slate-500">/{b.max}</span>
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-900">
                <div className="h-full rounded-full bg-gradient-to-r from-cyan-600 to-cyan-300" style={{ width: `${(b.value / b.max) * 100}%` }} />
              </div>
            </div>
          ))}
          {!won && <p className="text-xs leading-relaxed text-red-300/80">{t('abortedPenalty', lang)}</p>}
        </HudPanel>
      </div>

      <HudPanel title={t('missionPatches', lang)} code={`${earned}/${badges.length} ${t('earned', lang)}`}>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
          {badges.map((b) => (
            <li
              key={b.id}
              className={cn(
                'flex flex-col items-center gap-2 rounded-lg border p-3 text-center',
                b.earned ? 'border-amber-300/40 bg-amber-300/10' : 'border-white/10 bg-white/[0.02] opacity-60',
              )}
            >
              <div
                className={cn(
                  'flex size-12 items-center justify-center rounded-full border-2',
                  b.earned ? 'border-amber-300 bg-amber-300/20 text-amber-200 shadow-[0_0_20px_-4px_rgba(252,211,77,0.8)]' : 'border-slate-700 text-slate-600',
                )}
              >
                {b.earned ? <Award className="size-6" aria-hidden /> : <Lock className="size-5" aria-hidden />}
              </div>
              <p className={cn('text-sm font-bold uppercase leading-tight tracking-wide', b.earned ? 'text-amber-100' : 'text-slate-400')}>{t(b.labelKey as UIKey, lang)}</p>
              <p className="text-xs leading-snug text-slate-500">{t(b.descKey as UIKey, lang)}</p>
              <span className="sr-only">{b.earned ? 'Earned' : 'Not earned'}</span>
            </li>
          ))}
        </ul>
      </HudPanel>

      {state.facts.length > 0 && (
        <HudPanel title={t('scienceJournal', lang)} code={`${state.facts.length} ${t('entries', lang)}`}>
          <ul className="grid gap-3 md:grid-cols-2">
            {state.facts.map((f) => (
              <li key={f.title} className="flex gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-4">
                <BookOpen className="mt-0.5 size-4 shrink-0 text-amber-300" aria-hidden />
                <div>
                  <p className="text-sm font-bold uppercase tracking-wide text-slate-100">{f.title}</p>
                  <p className="text-pretty text-sm leading-relaxed text-slate-400">{f.fact}</p>
                </div>
              </li>
            ))}
          </ul>
        </HudPanel>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <button
          type="button"
          onClick={onReplay}
          className="flex h-12 items-center justify-center gap-2 rounded-lg bg-cyan-300 px-6 font-display text-xs font-bold uppercase tracking-[0.25em] text-slate-950 shadow-[0_0_30px_-6px_rgba(34,211,238,0.8)] hover:bg-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <RotateCcw className="size-4" aria-hidden />
          {lang === 'bn' ? `${body} আবার উড়ুন` : `Fly ${body} again`}
        </button>
        <button
          type="button"
          onClick={onNewMission}
          className="flex h-12 items-center justify-center gap-2 rounded-lg border border-cyan-300/40 px-6 font-display text-xs font-bold uppercase tracking-[0.25em] text-cyan-100 hover:bg-cyan-300/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
        >
          <Rocket className="size-4" aria-hidden />
          {t('newMission', lang)}
        </button>
      </div>
    </main>
  )
}

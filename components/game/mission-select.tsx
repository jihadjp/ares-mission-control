'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Check, CircleHelp, Languages, Rocket, SlidersHorizontal, Sparkles, Trophy } from 'lucide-react'
import { DESTINATIONS, DIFFICULTY } from '@/lib/game/config'
import type { Destination, Difficulty, MissionDuration } from '@/lib/game/types'
import { cn } from '@/lib/utils'

const steps = [
  { icon: SlidersHorizontal, en: ['Route the power', 'Split limited kilowatts between air, food, shielding and science.'], bn: ['বিদ্যুৎ ভাগ করুন', 'বাতাস, খাবার, সুরক্ষা ও গবেষণার মধ্যে সীমিত বিদ্যুৎ ভাগ করুন।'] },
  { icon: Sparkles, en: ['Face real hazards', 'Solar flares, dust storms and the lunar night, all based on NASA science.'], bn: ['বিপদ মোকাবিলা করুন', 'NASA-র বিজ্ঞানভিত্তিক সৌরঝড়, ধূলিঝড় ও চাঁদের রাত সামলান।'] },
  { icon: Trophy, en: ['Earn your wings', 'Survive your chosen mission length, collect science and get graded on your command.'], bn: ['সফল কমান্ডার হন', 'মিশন শেষ করুন, তথ্য সংগ্রহ করুন এবং আপনার কমান্ডের মূল্যায়ন দেখুন।'] },
]

const copy = {
  en: { badge: 'Built for NASA Space Apps Challenge 2026', title: 'Junior Astronaut', subtitle: 'Mission Trainer', intro: 'You are in command of a real outpost beyond Earth. There is never enough power for everything. Keep your crew alive, protect them from radiation and make discoveries. Every choice has a cost.', step: 'Step', how: 'How to play', howText: 'Each turn is one sol, or Martian day. Keep the four vital meters healthy, then end the sol to see what happens.', balance: 'Balance power', balanceText: 'Move power between life support, food, shields and science.', choices: 'Make choices', choicesText: 'Read each event and choose the safest response for your crew.', survive: 'Survive', surviveText: 'Reach the final sol with your crew alive and earn your mission grade.', destination: 'Choose your destination', rank: 'Choose your rank', length: 'Mission length', commander: 'Commander name', placeholder: 'Enter your call sign', launch: 'Launch to', selected: 'Selected', signature: 'Signature challenge', makeChoices: 'Make choices', makeChoicesText: 'Read each event and choose the safest response for your crew.', surviveText2: 'Reach the final sol with your crew alive and earn your mission grade.', destinationStep: 'Choose your destination', rankStep: 'Choose your rank', lengthStep: 'Mission length', commanderStep: 'Commander name', sols: 'sols', launchTo: 'Launch to' },
  bn: { badge: 'NASA Space Apps Challenge ২০২৬-এর জন্য তৈরি', title: 'জুনিয়র অ্যাস্ট্রোনট', subtitle: 'মিশন ট্রেইনার', intro: 'পৃথিবীর বাইরে একটি মহাকাশ ঘাঁটির কমান্ড এখন আপনার হাতে। সবকিছুর জন্য পর্যাপ্ত বিদ্যুৎ নেই। ক্রুদের বাঁচিয়ে রাখুন, বিকিরণ থেকে রক্ষা করুন এবং নতুন আবিষ্কার করুন। প্রতিটি সিদ্ধান্তের মূল্য আছে।', step: 'ধাপ', how: 'কীভাবে খেলবেন', howText: 'প্রতিটি টার্ন একটি সল, অর্থাৎ মঙ্গলগ্রহের একটি দিন। চারটি গুরুত্বপূর্ণ মিটার ঠিক রাখুন, তারপর সল শেষ করে ফলাফল দেখুন।', balance: 'বিদ্যুৎ ভাগ করুন', balanceText: 'লাইফ সাপোর্ট, খাবার, শিল্ড ও গবেষণার মধ্যে বিদ্যুৎ ভাগ করুন।', choices: 'সিদ্ধান্ত নিন', choicesText: 'প্রতিটি ঘটনা পড়ে ক্রুদের জন্য সবচেয়ে নিরাপদ উত্তর বেছে নিন।', survive: 'টিকে থাকুন', surviveText: 'ক্রুদের বাঁচিয়ে শেষ সলে পৌঁছান এবং মিশনের গ্রেড পান।', destination: 'গন্তব্য বেছে নিন', rank: 'র‍্যাঙ্ক বেছে নিন', length: 'মিশনের দৈর্ঘ্য', commander: 'কমান্ডারের নাম', placeholder: 'আপনার কল সাইন লিখুন', launch: 'যাত্রা শুরু করুন', selected: 'নির্বাচিত', signature: 'বিশেষ চ্যালেঞ্জ', makeChoices: 'সিদ্ধান্ত নিন', makeChoicesText: 'প্রতিটি ঘটনা পড়ে ক্রুদের জন্য সবচেয়ে নিরাপদ উত্তর বেছে নিন।', surviveText2: 'ক্রুদের বাঁচিয়ে শেষ সলে পৌঁছান এবং মিশনের গ্রেড পান।', destinationStep: 'গন্তব্য বেছে নিন', rankStep: 'র‍্যাঙ্ক বেছে নিন', lengthStep: 'মিশনের দৈর্ঘ্য', commanderStep: 'কমান্ডারের নাম', sols: 'সল', launchTo: 'যাত্রা শুরু করুন' },
} as const

type MissionSelectProps = {
  onLaunch: (config: { destination: Destination; difficulty: Difficulty; commander: string; totalSols: MissionDuration; language: 'en' | 'bn' }) => void
}

export function MissionSelect({ onLaunch }: MissionSelectProps) {
  const [destination, setDestination] = useState<Destination>('mars')
  const [difficulty, setDifficulty] = useState<Difficulty>('cadet')
  const [totalSols, setTotalSols] = useState<MissionDuration>(50)
  const [commander, setCommander] = useState('')
  const [language, setLanguage] = useState<'en' | 'bn'>('en')
  const [nameError, setNameError] = useState(false)
  const text = copy[language]

  return (
    <main className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-10 sm:py-14">
      <header className="flex flex-col items-center gap-4 text-center">
        <div className="flex items-center gap-2">
          <p className="flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/5 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.3em] text-cyan-300">
            <span aria-hidden className="size-1.5 animate-pulse rounded-full bg-cyan-300" />
            {text.badge}
          </p>
          <div className="flex rounded-full border border-white/10 bg-slate-950/70 p-1" aria-label="Language">
            <button type="button" onClick={() => setLanguage('en')} aria-pressed={language === 'en'} className={cn('rounded-full px-2.5 py-1 font-mono text-[10px] uppercase', language === 'en' ? 'bg-cyan-300 text-slate-950' : 'text-slate-400')}>EN</button>
            <button type="button" onClick={() => setLanguage('bn')} aria-pressed={language === 'bn'} className={cn('flex items-center gap-1 rounded-full px-2.5 py-1 font-mono text-[10px] uppercase', language === 'bn' ? 'bg-cyan-300 text-slate-950' : 'text-slate-400')}><Languages className="size-3" aria-hidden /> বাংলা</button>
          </div>
        </div>
        <h1 className="text-balance font-display text-3xl font-black uppercase leading-tight tracking-[0.12em] text-cyan-50 [text-shadow:0_0_24px_rgba(34,211,238,0.5)] sm:text-5xl">
          {text.title}
          <span className="block text-cyan-300">{text.subtitle}</span>
        </h1>
        <p className="max-w-2xl text-pretty text-lg leading-relaxed text-slate-300">
          {text.intro}
        </p>
      </header>

      <ol className="grid gap-3 sm:grid-cols-3">
        {steps.map(({ icon: Icon, en, bn }, i) => {
          const [title, description] = language === 'bn' ? bn : en
          return (
          <li key={title} className="flex gap-3 rounded-lg border border-white/10 bg-slate-950/60 p-4 backdrop-blur">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-md border border-cyan-400/30 bg-cyan-400/10 text-cyan-300">
              <Icon className="size-5" aria-hidden />
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-cyan-400/60">{text.step} {i + 1}</p>
              <h2 className="font-semibold uppercase tracking-wide text-slate-100">{title}</h2>
              <p className="text-sm leading-relaxed text-slate-400">{description}</p>
            </div>
          </li>
          )
        })}
      </ol>

      <section aria-labelledby="how-to-play-heading" className="rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-5 backdrop-blur">
        <div className="flex items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-md border border-cyan-400/30 bg-cyan-400/10 text-cyan-300">
            <CircleHelp className="size-5" aria-hidden />
          </div>
          <div className="min-w-0">
            <h2 id="how-to-play-heading" className="font-display text-sm font-semibold uppercase tracking-[0.3em] text-cyan-200">
              {text.how}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              {text.howText}
            </p>
            <ol className="mt-4 grid gap-3 text-sm text-slate-300 sm:grid-cols-3">
              <li className="rounded-lg border border-white/10 bg-slate-950/40 p-3">
                <strong className="block font-mono text-xs uppercase tracking-widest text-cyan-300">1. {text.balance}</strong>
                <span className="mt-1 block leading-relaxed text-slate-400">{text.balanceText}</span>
              </li>
              <li className="rounded-lg border border-white/10 bg-slate-950/40 p-3">
                <strong className="block font-mono text-xs uppercase tracking-widest text-cyan-300">2. {text.makeChoices}</strong>
                <span className="mt-1 block leading-relaxed text-slate-400">{text.makeChoicesText}</span>
              </li>
              <li className="rounded-lg border border-white/10 bg-slate-950/40 p-3">
                <strong className="block font-mono text-xs uppercase tracking-widest text-cyan-300">3. {text.survive}</strong>
                <span className="mt-1 block leading-relaxed text-slate-400">{text.surviveText2}</span>
              </li>
            </ol>
          </div>
        </div>
      </section>

      <section aria-labelledby="dest-heading" className="flex flex-col gap-4">
        <h2 id="dest-heading" className="font-display text-sm font-semibold uppercase tracking-[0.3em] text-cyan-200">
          1. {text.destinationStep}
        </h2>
        <div role="radiogroup" aria-labelledby="dest-heading" className="grid gap-4 md:grid-cols-2">
          {(Object.keys(DESTINATIONS) as Destination[]).map((id) => {
            const d = DESTINATIONS[id]
            const selected = destination === id
            return (
              <button
                key={id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setDestination(id)}
                className={cn(
                  'group relative flex flex-col overflow-hidden rounded-xl border text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300',
                  selected
                    ? 'border-cyan-300 shadow-[0_0_40px_-8px_rgba(34,211,238,0.6)]'
                    : 'border-white/10 opacity-80 hover:border-cyan-400/40 hover:opacity-100',
                )}
              >
                <div className="relative aspect-[16/9] w-full">
                  <Image src={d.image} alt={d.imageAlt} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" priority />
                  <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                  {selected && (
                    <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-cyan-300 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-slate-950">
                      <Check className="size-3" aria-hidden /> {text.selected}
                    </span>
                  )}
                  <div className="absolute inset-x-4 bottom-3">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-cyan-300/80">{language === 'bn' ? d.baseNameBn : d.baseName}</p>
                    <p className="font-display text-2xl font-bold uppercase tracking-[0.15em] text-white">{language === 'bn' ? d.bodyBn : d.body}</p>
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-3 bg-slate-950/80 p-4">
                  <p className="text-sm leading-relaxed text-slate-300">{language === 'bn' ? d.taglineBn : d.tagline}</p>
                  <dl className="grid grid-cols-3 gap-2">
                    {d.stats.map((s) => (
                      <div key={s.label} className="rounded-md border border-white/10 bg-white/5 px-2 py-1.5">
                        <dt className="font-mono text-[9px] uppercase tracking-widest text-slate-500">{language === 'bn' ? s.labelBn : s.label}</dt>
                        <dd className="text-sm font-semibold text-slate-100">{language === 'bn' ? s.valueBn : s.value}</dd>
                      </div>
                    ))}
                  </dl>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-amber-300">{text.signature}: {language === 'bn' ? d.challengeBn : d.challenge}</p>
                </div>
              </button>
            )
          })}
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-3">
          <h2 id="diff-heading" className="font-display text-sm font-semibold uppercase tracking-[0.3em] text-cyan-200">
            2. {text.rankStep}
          </h2>
          <div role="radiogroup" aria-labelledby="diff-heading" className="grid grid-cols-2 gap-3">
            {(Object.keys(DIFFICULTY) as Difficulty[]).map((id) => {
              const selected = difficulty === id
              return (
                <button
                  key={id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setDifficulty(id)}
                  className={cn(
                    'rounded-lg border p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300',
                    selected ? 'border-cyan-300 bg-cyan-400/10' : 'border-white/10 bg-slate-950/60 hover:border-cyan-400/40',
                  )}
                >
                  <p className={cn('font-display text-sm font-bold uppercase tracking-[0.2em]', selected ? 'text-cyan-200' : 'text-slate-200')}>
                    {language === 'bn' ? DIFFICULTY[id].labelBn : DIFFICULTY[id].label}
                  </p>
                  <p className="mt-1 text-sm leading-snug text-slate-400">{language === 'bn' ? DIFFICULTY[id].descriptionBn : DIFFICULTY[id].description}</p>
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h2 id="duration-heading" className="font-display text-sm font-semibold uppercase tracking-[0.3em] text-cyan-200">3. {text.lengthStep}</h2>
          <div role="radiogroup" aria-labelledby="duration-heading" className="grid grid-cols-3 gap-2">
            {([30, 50, 100] as MissionDuration[]).map((sols) => (
              <button key={sols} type="button" role="radio" aria-checked={totalSols === sols} onClick={() => setTotalSols(sols)} className={cn('rounded-lg border px-3 py-3 font-mono text-sm transition-colors', totalSols === sols ? 'border-cyan-300 bg-cyan-400/10 text-cyan-100' : 'border-white/10 bg-slate-950/60 text-slate-400 hover:border-cyan-400/40')}>
                {sols} {text.sols}
              </button>
            ))}
          </div>
        </div>

        <form
          className="flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault()
            if (!commander.trim()) {
              setNameError(true)
              return
            }
            setNameError(false)
            onLaunch({ destination, difficulty, commander, totalSols, language })
          }}
        >
          <label htmlFor="commander" className="font-display text-sm font-semibold uppercase tracking-[0.3em] text-cyan-200">
            4. {language === 'bn' ? DIFFICULTY[difficulty].labelBn : DIFFICULTY[difficulty].label} {language === 'bn' ? 'নাম' : 'name'}
          </label>
          <div className="flex flex-col gap-1.5">
            <input
              id="commander"
              value={commander}
              onChange={(e) => {
                setCommander(e.target.value.slice(0, 24))
                if (e.target.value.trim()) setNameError(false)
              }}
              placeholder={text.placeholder}
              autoComplete="off"
              aria-invalid={nameError}
              aria-describedby={nameError ? 'name-error' : undefined}
              className={cn(
                'h-12 rounded-lg border bg-slate-950/70 px-4 font-mono text-base text-cyan-50 placeholder:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/40',
                nameError ? 'border-red-500 focus-visible:border-red-400' : 'border-white/15 focus-visible:border-cyan-300',
              )}
            />
            {nameError && (
              <p id="name-error" role="alert" className="flex items-center gap-1.5 font-mono text-xs text-red-400">
                <span aria-hidden className="inline-block size-1.5 rounded-full bg-red-500" />
                {language === 'bn' ? 'একটি নাম লিখুন' : 'Enter a name to launch'}
              </p>
            )}
          </div>
          <button
            type="submit"
            className={cn(
              'group mt-auto flex h-14 items-center justify-center gap-3 rounded-lg font-display text-sm font-bold uppercase tracking-[0.3em] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white',
              commander.trim()
                ? 'bg-cyan-300 text-slate-950 shadow-[0_0_40px_-6px_rgba(34,211,238,0.8)] hover:bg-cyan-200'
                : 'cursor-not-allowed bg-cyan-300/40 text-slate-950/60',
            )}
          >
            <Rocket className="size-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
            {text.launchTo} {language === 'bn' ? DESTINATIONS[destination].bodyBn : DESTINATIONS[destination].body}
          </button>
        </form>
      </section>
    </main>
  )
}

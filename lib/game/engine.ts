import {
  BATTERY_RATE,
  DESTINATIONS,
  DIFFICULTY,
  FLARE_DOSE,
  FOOD_PER_KW,
  FOOD_USE,
  OXYGEN_PER_KW,
  OXYGEN_USE,
  SHIELD_PER_KW,
  STARTING_ALLOCATION,
  TOTAL_SOLS,
  WATER_PER_KW,
  WATER_USE,
} from './config'
import { EVENTS, RANDOM_EVENT_IDS, SCHEDULED_EVENTS } from './events'
import { formatLunarLog, formatWeatherLog, getLunarCondition, getWeatherForSol } from './nasa-data'
import type {
  Allocation,
  Choice,
  Destination,
  Difficulty,
  GameState,
  LogEntry,
  LogLevel,
  Modifier,
  Resources,
  MissionDuration,
  SolRecord,
} from './types'

const clamp = (v: number, min = 0, max = 100) => Math.max(min, Math.min(max, v))

function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function buildSchedule(destination: Destination, seed: number, totalSols: MissionDuration = TOTAL_SOLS as MissionDuration) {
  const rng = mulberry32(seed)
  const schedule: Record<number, string> = { ...SCHEDULED_EVENTS[destination] }
  const pool = [...RANDOM_EVENT_IDS].sort(() => rng() - 0.5)
  for (let sol = 2; sol < totalSols; sol++) {
    if (schedule[sol] || schedule[sol - 1]) continue
    if (rng() < 0.6 && pool.length) schedule[sol] = pool.pop() as string
  }
  return schedule
}

export function isNight(destination: Destination, sol: number) {
  const night = DESTINATIONS[destination].nightSols
  return !!night && sol >= night[0] && sol <= night[1]
}

export function solarFactor(destination: Destination, sol: number, modifiers: Modifier[]) {
  let factor = isNight(destination, sol) ? 0.05 : 1
  for (const m of modifiers) {
    if (m.kind === 'storm' || m.kind === 'solarBoost') factor *= m.factor
  }
  return factor
}

export function generationFor(state: Pick<GameState, 'destination' | 'sol' | 'modifiers'>) {
  const solar = DESTINATIONS[state.destination].solarBase * solarFactor(state.destination, state.sol, state.modifiers)
  const reactor = state.modifiers.reduce((sum, m) => (m.kind === 'reactor' ? sum + m.kW : sum), 0)
  return { solar: Math.round(solar), reactor, total: Math.round(solar + reactor) }
}

export const totalDemand = (a: Allocation) => a.lifeSupport + a.greenhouse + a.shield + a.research
export const shieldStrength = (kW: number) => clamp(kW * SHIELD_PER_KW)

export function flareEta(modifiers: Modifier[]) {
  const flares = modifiers.filter((m): m is Extract<Modifier, { kind: 'flare' }> => m.kind === 'flare')
  return flares.length ? Math.min(...flares.map((f) => f.eta)) : null
}

type SimResult = {
  resources: Resources
  modifiers: Modifier[]
  record: SolRecord
  notes: { level: LogLevel; message: string }[]
  batteryEmpty: boolean
  flareHit: boolean
}

export function simulateSol(state: GameState): SimResult {
  const dest = DESTINATIONS[state.destination]
  const diff = DIFFICULTY[state.difficulty]
  const r = state.resources
  const a = state.allocation
  const notes: SimResult['notes'] = []

  // --- Power ---
  const gen = generationFor(state).total
  const demand = totalDemand(a)
  let battery = r.battery + (gen - demand) * BATTERY_RATE
  let efficiency = 1
  if (battery < 0) {
    const deficitKw = -battery / BATTERY_RATE
    efficiency = demand > 0 ? clamp((demand - deficitKw) / demand, 0, 1) : 1
    battery = 0
    notes.push({ level: 'error', message: `Brownout! Systems ran at ${Math.round(efficiency * 100)}% power` })
  }
  battery = clamp(battery)

  // --- Flat decay + power-based production ---
  const eff = (k: keyof Allocation) => a[k] * efficiency
  const greenhouseMult = state.modifiers.reduce((m, mod) => (mod.kind === 'greenhouseBoost' ? m * mod.mult : m), 1)

  // Base decay: -10 O₂, -8 Water, -5 Food per sol (scaled by difficulty)
  // Production from power allocation offsets the decay
  const oxygen = clamp(r.oxygen + eff('lifeSupport') * OXYGEN_PER_KW - OXYGEN_USE * diff.drain)
  const water = clamp(r.water + eff('lifeSupport') * WATER_PER_KW - WATER_USE * diff.drain)
  const food = clamp(r.food + eff('greenhouse') * FOOD_PER_KW * greenhouseMult - FOOD_USE * diff.drain)
  const shield = shieldStrength(eff('shield')) / 100

  // --- Radiation ---
  const flareHit = state.modifiers.some((m) => m.kind === 'flare' && m.eta === 1)
  const sheltered = flareHit && state.modifiers.some((m) => m.kind === 'shelter')
  let dose = dest.radiation * diff.rad * (1 - shield * 0.85)
  if (flareHit) {
    const flareDose = FLARE_DOSE * diff.rad * (1 - shield * 0.9) * (sheltered ? 0.5 : 1)
    dose += flareDose
    notes.push({
      level: flareDose > 10 ? 'error' : 'ok',
      message:
        flareDose > 10
          ? `Solar flare impact! Crew absorbed a heavy dose (+${Math.round(flareDose)})`
          : `Solar flare impact deflected. Shield held at ${Math.round(shield * 100)}%`,
    })
  }
  const radiation = clamp(r.radiation + dose)

  // --- Science ---
  const moraleFactor = 0.5 + r.morale / 200
  const science = Math.max(0, r.science + eff('research') * 0.6 * moraleFactor)

  // --- Health ---
  let healthDelta = 0
  if (oxygen <= 0) healthDelta -= 20
  else if (oxygen < 25) healthDelta -= 6
  if (water <= 0) healthDelta -= 15
  else if (water < 25) healthDelta -= 5
  if (food <= 0) healthDelta -= 12
  else if (food < 20) healthDelta -= 4
  if (radiation >= 60) healthDelta -= 3
  if (radiation >= 85) healthDelta -= 6
  if (healthDelta === 0) healthDelta = 3
  const health = clamp(r.health + healthDelta)

  // --- Morale ---
  let moraleDelta = 0
  if (food < 30) moraleDelta -= 3
  if (water < 30) moraleDelta -= 2
  if (health < 50) moraleDelta -= 4
  if (battery === 0) moraleDelta -= 3
  moraleDelta += eff('research') >= 10 ? 2 : -1
  const morale = clamp(r.morale + moraleDelta)

  // --- Warnings ---
  if (oxygen < 25) notes.push({ level: 'warn', message: `Oxygen low: ${Math.round(oxygen)}%` })
  if (water < 25) notes.push({ level: 'warn', message: `Water low: ${Math.round(water)}%` })
  if (food < 20) notes.push({ level: 'warn', message: `Food stores low: ${Math.round(food)}%` })
  if (healthDelta < 0) notes.push({ level: 'warn', message: `Crew health dropped ${healthDelta}` })

  // --- Modifier expiration ---
  const modifiers = state.modifiers
    .map((m): Modifier | null => {
      if (m.kind === 'flare') return m.eta <= 1 ? null : { ...m, eta: m.eta - 1 }
      if (m.kind === 'shelter') return flareHit ? null : m
      if (m.kind === 'storm' || m.kind === 'solarBoost' || m.kind === 'greenhouseBoost')
        return m.sols <= 1 ? null : { ...m, sols: m.sols - 1 }
      return m
    })
    .filter((m): m is Modifier => m !== null)

  const resources: Resources = { battery, oxygen, water, food, health, morale, radiation, science }
  return {
    resources,
    modifiers,
    notes,
    batteryEmpty: efficiency < 1,
    flareHit,
    record: { ...resources, sol: state.sol, generation: gen, demand, flareHit },
  }
}

export function forecast(state: GameState) {
  const { resources } = simulateSol(state)
  const delta = {} as Record<keyof Resources, number>
  for (const key of Object.keys(resources) as (keyof Resources)[]) {
    delta[key] = resources[key] - state.resources[key]
  }
  return { next: resources, delta }
}

let fallbackId = 0
function entry(state: Pick<GameState, 'sol' | 'destination'>, id: number, level: LogLevel, message: string): LogEntry {
  const label = DESTINATIONS[state.destination].dayLabel.toUpperCase()
  return { id: id || ++fallbackId, time: `${label} ${String(state.sol).padStart(2, '0')}`, level, message }
}

function appendLog(state: GameState, items: { level: LogLevel; message: string }[]): GameState {
  let logId = state.logId
  const added = items.map((i) => entry(state, ++logId, i.level, i.message))
  return { ...state, logId, log: [...state.log, ...added].slice(-60) }
}

function eventFor(state: GameState, sol: number) {
  const id = state.schedule[sol]
  return id ? EVENTS[id](state.destination) : null
}

export function createGame(destination: Destination, difficulty: Difficulty, commander: string, seed: number, totalSols: MissionDuration = TOTAL_SOLS as MissionDuration, language: 'en' | 'bn' = 'en'): GameState {
  const dest = DESTINATIONS[destination]
  const base: GameState = {
    language,
    destination,
    difficulty,
    commander: commander.trim() || 'Commander',
    seed,
    sol: 1,
    totalSols,
    resources: {
      battery: DIFFICULTY[difficulty].startBattery,
      oxygen: 80,
      water: 75,
      food: 75,
      health: 100,
      morale: 80,
      radiation: 0,
      science: 0,
    },
    allocation: { ...STARTING_ALLOCATION },
    modifiers: [],
    schedule: buildSchedule(destination, seed, totalSols),
    pendingEvent: null,
    consequence: null,
    log: [],
    logId: 0,
    history: [],
    facts: [],
    status: 'playing',
    batteryEmptySols: 0,
    flaresSurvived: 0,
  }
  const withLog = appendLog(base, [
    { level: 'ok', message: `Touchdown confirmed at ${dest.baseName}. Crew of 4 healthy.` },
    { level: 'info', message: 'Set your power routing, then end the ' + dest.dayLabel.toLowerCase() + '.' },
  ])
  return { ...withLog, pendingEvent: eventFor(withLog, 1) }
}

export function setAllocation(state: GameState, key: keyof Allocation, value: number): GameState {
  return { ...state, allocation: { ...state.allocation, [key]: clamp(Math.round(value), 0, 40) } }
}

export function endSol(state: GameState): GameState {
  if (state.status !== 'playing' || state.pendingEvent) return state
  const sim = simulateSol(state)
  let next: GameState = {
    ...state,
    resources: sim.resources,
    modifiers: sim.modifiers,
    history: [...state.history, sim.record],
    batteryEmptySols: state.batteryEmptySols + (sim.batteryEmpty ? 1 : 0),
    flaresSurvived: state.flaresSurvived + (sim.flareHit ? 1 : 0),
  }
  // NASA weather report for this sol
  const weatherNotes: { level: LogLevel; message: string }[] = []
  if (state.destination === 'mars') {
    const weather = getWeatherForSol(state.sol, state.seed)
    weatherNotes.push({ level: 'info', message: formatWeatherLog(weather) })
  } else {
    const lunar = getLunarCondition(isNight(state.destination, state.sol))
    weatherNotes.push({ level: 'info', message: formatLunarLog(lunar, isNight(state.destination, state.sol)) })
  }

  next = appendLog(next, [
    ...weatherNotes,
    ...sim.notes,
    { level: 'info', message: `${DESTINATIONS[state.destination].dayLabel} ${state.sol} complete. +${Math.round(sim.resources.science - state.resources.science)} science` },
  ])

  if (sim.resources.health <= 0) {
    return { ...next, status: 'lost', lossReason: 'Crew health collapsed. Mission Control ordered an emergency evacuation.' }
  }
  if (sim.resources.radiation >= 100) {
    return { ...next, status: 'lost', lossReason: 'The crew passed the safe radiation limit. The mission had to be aborted.' }
  }
  if (state.sol >= state.totalSols) {
    return { ...next, status: 'won' }
  }

  const sol = state.sol + 1
  next = { ...next, sol }
  if (DESTINATIONS[state.destination].nightSols?.[0] === sol) {
    next = appendLog(next, [{ level: 'warn', message: 'The Sun has set. Lunar night begins. Solar output near zero.' }])
  }
  const nightEnd = DESTINATIONS[state.destination].nightSols?.[1]
  if (nightEnd && sol === nightEnd + 1) {
    next = appendLog(next, [{ level: 'ok', message: 'Sunrise! Solar arrays back online.' }])
  }
  return { ...next, pendingEvent: eventFor(next, sol) }
}

export function resolveEvent(state: GameState, choice: Choice): GameState {
  const event = state.pendingEvent
  if (!event) return state
  const r = { ...state.resources }
  for (const [key, value] of Object.entries(choice.effects ?? {}) as [keyof Resources, number][]) {
    r[key] = key === 'science' ? Math.max(0, r[key] + value) : clamp(r[key] + value)
  }
  let modifiers = [...state.modifiers, ...(choice.modifiers ?? [])]
  if (event.id === 'flare') modifiers = [...modifiers, { kind: 'flare', eta: 2 }]

  const next: GameState = {
    ...state,
    resources: r,
    modifiers,
    pendingEvent: null,
    consequence: { eventTitle: event.title, choiceLabel: choice.label, effects: choice.effects ?? {} },
    facts: state.facts.some((f) => f.title === event.title) ? state.facts : [...state.facts, { title: event.title, fact: event.fact }],
  }
  return appendLog(next, [
    { level: event.kind === 'hazard' ? 'warn' : 'ok', message: `${event.title}: ${choice.label}` },
  ])
}

export function dismissConsequence(state: GameState): GameState {
  return { ...state, consequence: null }
}

export type Advice = { tone: 'danger' | 'warn' | 'info' | 'ok'; title: string; text: string }

export function getAdvice(state: GameState): Advice {
  const { next } = forecast(state)
  const gen = generationFor(state).total
  const demand = totalDemand(state.allocation)
  const eta = flareEta(state.modifiers)
  const shield = shieldStrength(state.allocation.shield)
  const night = DESTINATIONS[state.destination].nightSols
  const label = DESTINATIONS[state.destination].dayLabel.toLowerCase()

  if (eta === 1 && shield < 60)
    return { tone: 'danger', title: 'Flare hits this ' + label + '!', text: `Your shield is only ${Math.round(shield)}%. Route at least 20 kW to the Radiation Shield before you end the ${label}.` }
  if (next.oxygen < 20)
    return { tone: 'danger', title: 'Oxygen running out', text: `Oxygen will fall to ${Math.round(next.oxygen)}%. Life Support needs about 20 kW to keep 4 crew breathing.` }
  if (next.water < 20)
    return { tone: 'danger', title: 'Water running low', text: `Water will fall to ${Math.round(next.water)}%. Life Support needs power to keep the recycler running.` }
  if (next.food < 20)
    return { tone: 'danger', title: 'Food running low', text: `Food will fall to ${Math.round(next.food)}%. The Greenhouse needs about 16 kW to keep up.` }
  if (demand > gen && next.battery <= 0)
    return { tone: 'danger', title: 'Battery will run flat', text: `You are using ${demand} kW but only making ${gen} kW. Cut something, or systems will brown out.` }
  if (eta === 2)
    return { tone: 'warn', title: 'Flare in 2 ' + label + 's', text: 'Charge the battery now so you can afford a strong shield on impact day.' }
  if (night && state.sol >= night[0] - 3 && state.sol < night[0])
    return { tone: 'warn', title: 'Night is coming', text: `Darkness starts on Day ${night[0]}. Fill the battery and stock up oxygen, water and food while the Sun is up.` }
  if (isNight(state.destination, state.sol))
    return { tone: 'warn', title: 'Surviving the night', text: 'No sunlight. Keep only what the crew needs to survive. Science can wait until sunrise.' }
  if (state.modifiers.some((m) => m.kind === 'storm'))
    return { tone: 'warn', title: 'Dust storm overhead', text: 'Solar power is way down. Trim research and shield to save your battery.' }
  if (state.resources.radiation >= 50)
    return { tone: 'warn', title: 'Radiation dose climbing', text: `Crew dose is at ${Math.round(state.resources.radiation)}% of the safe limit. Keep the shield up.` }
  if (state.allocation.research === 0)
    return { tone: 'info', title: 'Lab is idle', text: 'Your crew is stable. Send spare power to the Science Lab to earn points and boost morale.' }
  if (gen - demand > 12 && state.resources.battery >= 95)
    return { tone: 'info', title: 'Power to spare', text: `Your battery is full and ${gen - demand} kW is going to waste. Put it into science!` }
  return { tone: 'ok', title: 'Great balance', text: 'Every kilowatt is a trade-off: survival now versus science for the mission. You are handling it well.' }
}

export function scoreGame(state: GameState) {
  const r = state.resources
  const lost = state.status === 'lost'
  const breakdown = [
    { label: 'crewHealthScore', value: Math.round(r.health * 2), max: 200 },
    { label: 'scienceScore', value: Math.round(Math.min(250, r.science)), max: 250 },
    { label: 'radiationSafety', value: Math.round(100 - r.radiation), max: 100 },
    { label: 'crewMorale', value: Math.round(r.morale), max: 100 },
    { label: 'waterManagement', value: Math.round(r.water), max: 100 },
  ]
  const total = lost ? Math.round(breakdown.reduce((s, b) => s + b.value, 0) * 0.4) : breakdown.reduce((s, b) => s + b.value, 0)
  const grade = lost ? 'F' : total >= 580 ? 'S' : total >= 490 ? 'A' : total >= 400 ? 'B' : total >= 310 ? 'C' : 'D'

  const h = state.history
  const badges = [
    { id: 'guardian', labelKey: 'radiationGuardian', descKey: 'radiationGuardianDesc', earned: r.radiation < 30 },
    { id: 'green', labelKey: 'greenThumb', descKey: 'greenThumbDesc', earned: h.length > 0 && h.every((s) => s.food >= 40) },
    { id: 'power', labelKey: 'powerPro', descKey: 'powerProDesc', earned: state.batteryEmptySols === 0 && h.length > 0 },
    { id: 'science', labelKey: 'scienceStar', descKey: 'scienceStarDesc', earned: r.science >= 150 },
    { id: 'flare', labelKey: 'stormChaser', descKey: 'stormChaserDesc', earned: state.flaresSurvived >= 2 && !lost },
    { id: 'crew', labelKey: 'crewChampion', descKey: 'crewChampionDesc', earned: !lost && r.health >= 90 },
    { id: 'water', labelKey: 'waterWarden', descKey: 'waterWardenDesc', earned: h.length > 0 && h.every((s) => s.water >= 30) },
  ]
  return { breakdown, total, grade, badges }
}

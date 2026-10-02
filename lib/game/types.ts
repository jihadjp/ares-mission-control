export type Destination = 'moon' | 'mars'
export type Difficulty = 'cadet' | 'commander'

export type SystemKey = 'lifeSupport' | 'greenhouse' | 'shield' | 'research'
export type Allocation = Record<SystemKey, number>

export type Resources = {
  battery: number
  oxygen: number
  water: number
  food: number
  health: number
  morale: number
  radiation: number
  science: number
}
export type ResourceKey = keyof Resources

export type Modifier =
  | { kind: 'flare'; eta: number }
  | { kind: 'storm'; sols: number; factor: number }
  | { kind: 'solarBoost'; sols: number; factor: number }
  | { kind: 'reactor'; kW: number }
  | { kind: 'shelter' }
  | { kind: 'greenhouseBoost'; sols: number; mult: number }

export type Choice = {
  label: string
  labelBn?: string
  summary: string
  summaryBn?: string
  effects?: Partial<Resources>
  modifiers?: Modifier[]
}

export type EventKind = 'hazard' | 'opportunity' | 'crew'

export type GameEvent = {
  id: string
  kind: EventKind
  title: string
  titleBn?: string
  description: string
  descriptionBn?: string
  fact: string
  factBn?: string
  choices: Choice[]
}

export type LogLevel = 'info' | 'ok' | 'warn' | 'error'
export type LogEntry = { id: number; time: string; level: LogLevel; message: string }

export type SolRecord = Resources & { sol: number; generation: number; demand: number; flareHit: boolean }

export type GameStatus = 'playing' | 'won' | 'lost'

export type MissionDuration = 30 | 50 | 100

export type Consequence = {
  eventTitle: string
  choiceLabel: string
  effects: Partial<Resources>
}

export type GameState = {
  language: 'en' | 'bn'
  destination: Destination
  difficulty: Difficulty
  commander: string
  seed: number
  sol: number
  totalSols: MissionDuration
  resources: Resources
  allocation: Allocation
  modifiers: Modifier[]
  schedule: Record<number, string>
  pendingEvent: GameEvent | null
  consequence: Consequence | null
  log: LogEntry[]
  logId: number
  history: SolRecord[]
  facts: { title: string; fact: string }[]
  status: GameStatus
  lossReason?: string
  batteryEmptySols: number
  flaresSurvived: number
}

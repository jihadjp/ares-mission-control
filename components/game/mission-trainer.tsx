'use client'

import { useEffect, useReducer, useRef } from 'react'
import { createGame, dismissConsequence, endSol, resolveEvent, setAllocation } from '@/lib/game/engine'
import { fetchDONKIFlares, formatDONKILog } from '@/lib/game/nasa-data'
import type { Choice, Destination, Difficulty, GameState, LogEntry, MissionDuration, SystemKey } from '@/lib/game/types'
import { Debrief } from './debrief'
import { GameScreen } from './game-screen'
import { MissionSelect } from './mission-select'
import { ConsequenceDialog } from './consequence-dialog'

type Action =
  | { type: 'launch'; destination: Destination; difficulty: Difficulty; commander: string; totalSols: MissionDuration; language: 'en' | 'bn'; seed: number }
  | { type: 'dismissConsequence' }
  | { type: 'allocate'; key: SystemKey; value: number }
  | { type: 'endSol' }
  | { type: 'choose'; choice: Choice }
  | { type: 'replay'; seed: number }
  | { type: 'menu' }
  | { type: 'nasaData'; entries: LogEntry[] }

function reducer(state: GameState | null, action: Action): GameState | null {
  switch (action.type) {
    case 'launch':
      return createGame(action.destination, action.difficulty, action.commander, action.seed, action.totalSols, action.language)
    case 'menu':
      return null
    case 'replay':
      return state ? createGame(state.destination, state.difficulty, state.commander, action.seed, state.totalSols, state.language) : null
    case 'allocate':
      return state ? setAllocation(state, action.key, action.value) : state
    case 'endSol':
      return state ? endSol(state) : state
    case 'choose':
      return state ? resolveEvent(state, action.choice) : state
    case 'dismissConsequence':
      return state ? dismissConsequence(state) : state
    case 'nasaData':
      return state ? { ...state, log: [...state.log, ...action.entries], logId: state.logId + action.entries.length } : state
  }
}

export function MissionTrainer() {
  const [state, dispatch] = useReducer(reducer, null)
  const donkiFetched = useRef(false)

  // Fetch live NASA DONKI solar weather data on game start
  useEffect(() => {
    if (!state || state.status !== 'playing' || donkiFetched.current) return
    donkiFetched.current = true
    fetchDONKIFlares().then((flares) => {
      const lines = formatDONKILog(flares)
      const baseId = Date.now()
      const entries: LogEntry[] = [
        { id: baseId, time: 'NASA', level: 'info', message: '📡 Connecting to NASA DONKI Space Weather Database...' },
        ...lines.map((msg, i) => ({ id: baseId + i + 1, time: 'DONKI', level: 'ok' as const, message: msg })),
      ]
      dispatch({ type: 'nasaData', entries })
    })
  }, [state?.status])

  // Reset fetch flag when returning to menu
  useEffect(() => {
    if (!state) donkiFetched.current = false
  }, [state])

  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-[#05070d] text-slate-100">
      <div aria-hidden className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(34,211,238,0.12),transparent_60%),radial-gradient(ellipse_at_bottom_right,rgba(217,70,239,0.08),transparent_55%)]" />
      <div aria-hidden className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(34,211,238,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.05)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_80%)]" />

      <div className="relative">
        {!state && <MissionSelect onLaunch={(config) => dispatch({ type: 'launch', ...config, seed: Date.now() })} />}
        {state?.status === 'playing' && (
          <GameScreen
            state={state}
            onAllocate={(key, value) => dispatch({ type: 'allocate', key, value })}
            onEndSol={() => {
              dispatch({ type: 'endSol' })
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            onChoose={(choice) => dispatch({ type: 'choose', choice })}
            onAbort={() => dispatch({ type: 'menu' })}
          />
        )}
        {state?.consequence && <ConsequenceDialog consequence={state.consequence} language={state.language} onContinue={() => dispatch({ type: 'dismissConsequence' })} />}
        {state && state.status !== 'playing' && (
          <Debrief state={state} onReplay={() => dispatch({ type: 'replay', seed: Date.now() })} onNewMission={() => dispatch({ type: 'menu' })} />
        )}
      </div>
    </div>
  )
}

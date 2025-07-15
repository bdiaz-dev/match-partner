import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type MatchPlayer = {
  name: string
  dorsal: number
  isPlaying: boolean
  lastStartTime?: string
  playedTime?: number
  isGoalKeeper?: boolean
  card: '' | 'yellow' | 'red'
  startPlayingTime?: string
  isInjured?: boolean
}

type PlayerForSubstitution = {
  name: string
  dorsal: number
  isEntering: boolean
}

export type GoalItem = {
  playerName?: string
  playerDorsal?: number
  time: string
  side: 'team' | 'opponent'
  id: string
}

export type MatchEvent = {
  title: string
  type: 'goal' | 'foul' | 'substitution' | 'other' | 'changeStatus' | 'offside' | 'corner' | 'keeperSave' | 'card' | 'redCard' | 'shot' | 'injury' | 'pause' | 'endFirstTime' | 'startSecondTime' | 'changeStatus'
  playerName?: string
  playerDorsal?: number
  playersOnSubstitution?: Array<PlayerForSubstitution>
  time: string
  id: string
  unremovable?: boolean
  dorsalOnKeeperSave?: number
}

interface MatchState {
  startTime: string | null
  setStartTime: (time: string) => void
  isStarted: boolean
  setIsStarted: (isStarted: boolean) => void
  isPaused: boolean
  setIsPaused: (isPaused: boolean) => void
  isHalfTime: boolean
  setIsHalfTime: (isHalfTime: boolean) => void
  isSecondTime: boolean
  setIsSecondTime: (isSecondTime: boolean) => void
  matchTeam: Array<MatchPlayer>
  setMatchTeam: (matchTeam: Array<MatchPlayer>) => void
  events: Array<MatchEvent>
  setEvents: (events: Array<MatchEvent>) => void
  goals: Array<GoalItem>
  setGoals: (goals: Array<GoalItem>) => void

  archiveMatch: () => void

  pausePeriods: Array<{ start: string; id: string, end?: string }>
  setPausePeriods: (pausePeriods: Array<{ start: string; id: string, end?: string }>) => void
  startPause: (now: string) => void
  endPause: () => void
}

const useMatchStore = create<MatchState>()(
  persist(
    (set, get) => ({
      startTime: null,
      setStartTime: (time) => set({ startTime: time }),

      isStarted: false,
      setIsStarted: (isStarted) => set({ isStarted }),

      isPaused: false,
      setIsPaused: (isPaused) => set({ isPaused }),

      isHalfTime: false,
      setIsHalfTime: (isHalfTime) => set({ isHalfTime }),
      
      isSecondTime: false,
      setIsSecondTime: (isSecondTime) => set({ isSecondTime }),

      matchTeam: [],
      setMatchTeam: (matchTeam) => set({ matchTeam }),

      events: [],
      setEvents: (events) => set({ events }),

      pausePeriods: [],
      setPausePeriods: (pausePeriods) => set({ pausePeriods }),
      startPause: (now) =>
        // const now = new Date().toISOString()
        set(state => ({
          pausePeriods: [...state.pausePeriods, { start: now, id: now }],
          isPaused: true
        })),
      endPause: () => set(state => ({
        pausePeriods: state.pausePeriods.map((p, i, arr) =>
          i === arr.length - 1 && !p.end
            ? { ...p, end: new Date().toISOString() }
            : p
        ),
        isPaused: false
      })),
      goals: [],
      setGoals: (goals) => set({ goals }),

      archiveMatch: () => {
        const currentState = get()
        const matchDate = new Date().toISOString()
        localStorage.setItem(`archived-match-${matchDate}`, JSON.stringify(currentState));
        localStorage.removeItem('match-storage');

        set({
          startTime: null,
          isStarted: false,
          isPaused: false,
          isHalfTime: false,
          isSecondTime: false,
          pausePeriods: [],
          matchTeam: [],
          events: [],
          goals: []
        });
      },
    }),
    {
      name: 'match-storage',
    }
  )
)

export default useMatchStore

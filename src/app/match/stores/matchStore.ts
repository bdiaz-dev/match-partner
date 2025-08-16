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
  isOwnGoal?: boolean
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
  side?: 'team' | 'opponent'
  isOwnGoal?: boolean
}

interface MatchState {
  isHome: boolean
  setIsHome: (isHome: boolean) => void
  startTime: string | null
  setStartTime: (time: string) => void
  secondHalfStartTime: string | null
  setSecondHalfStartTime: (time: string) => void
  isStarted: boolean
  setIsStarted: (isStarted: boolean) => void
  isPaused: boolean
  setIsPaused: (isPaused: boolean) => void
  isHalfTime: boolean
  setIsHalfTime: (isHalfTime: boolean) => void
  isSecondHalf: boolean
  setisSecondHalf: (isSecondHalf: boolean) => void
  matchLongTime: number
  setMatchLongTime: (matchTime: number) => void
  isExtraTime: boolean
  setIsExtraTime: (isExtraTime: boolean) => void
  extraTimeFirstHalf?: number
  extraTimeSecondHalf?: number
  setExtraTimeFirstHalf: (extraTime: number) => void
  setExtraTimeSecondHalf: (extraTime: number) => void
  stopwatchMinutes?: number
  stopwatchSeconds?: number
  setStopwatchMinutes?: (minutes: number) => void
  setStopwatchSeconds?: (seconds: number) => void
  matchTeam: Array<MatchPlayer>
  setMatchTeam: (matchTeam: Array<MatchPlayer>) => void
  events: Array<MatchEvent>
  setEvents: (events: Array<MatchEvent>) => void
  goals: Array<GoalItem>
  setGoals: (goals: Array<GoalItem>) => void

  archiveMatch: () => void

  pausePeriods: Array<{ start: string; id: string, end?: string, moment?: 'secondHalf' | 'firstHalf' | 'halfTime' }>
  setPausePeriods: (pausePeriods: Array<{ start: string; id: string, end?: string, moment?: 'secondHalf' | 'firstHalf' | 'halfTime' }>) => void
  startPause: (now: string) => void
  endPause: () => void
}

const useMatchStore = create<MatchState>()(
  persist(
    (set, get) => ({
      isHome: true,
      setIsHome: (isHome) => set({ isHome }),

      startTime: null,
      setStartTime: (time) => set({ startTime: time }),

      secondHalfStartTime: null,
      setSecondHalfStartTime: (time) => set({ secondHalfStartTime: time }),

      isStarted: false,
      setIsStarted: (isStarted) => set({ isStarted }),

      isPaused: false,
      setIsPaused: (isPaused) => set({ isPaused }),

      stopwatchMinutes: 0,
      setStopwatchMinutes: (minutes) => set({ stopwatchMinutes: minutes }),
      stopwatchSeconds: 0,
      setStopwatchSeconds: (seconds) => set({ stopwatchSeconds: seconds }),

      isHalfTime: false,
      setIsHalfTime: (isHalfTime) => set({ isHalfTime }),
      
      isSecondHalf: false,
      setisSecondHalf: (isSecondHalf) => set({ isSecondHalf }),

      matchLongTime: 90,
      setMatchLongTime: (matchLongTime) => set({ matchLongTime }),

      isExtraTime: false,
      setIsExtraTime: (isExtraTime) => set({ isExtraTime }),

      extraTimeFirstHalf: undefined,
      setExtraTimeFirstHalf: (extraTime) => set({ extraTimeFirstHalf: extraTime }),
      extraTimeSecondHalf: undefined,
      setExtraTimeSecondHalf: (extraTime) => set({ extraTimeSecondHalf: extraTime }),

      matchTeam: [],
      setMatchTeam: (matchTeam) => set({ matchTeam }),

      events: [],
      setEvents: (events) => set({ events }),

      pausePeriods: [],
      setPausePeriods: (pausePeriods) => set({ pausePeriods }),
      startPause: (now) =>
        // const now = new Date().toISOString()
        
        set(state => ({
          pausePeriods: [...state.pausePeriods, { start: now, id: now, moment: state.isSecondHalf ? 'secondHalf' : state.isHalfTime ? 'halfTime' : 'firstHalf' }],
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
          isHome: true,
          startTime: null,
          secondHalfStartTime: null,
          isStarted: false,
          isPaused: false,
          isHalfTime: false,
          isSecondHalf: false,
          matchLongTime: 90,
          extraTimeFirstHalf: undefined,
          extraTimeSecondHalf: undefined,
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

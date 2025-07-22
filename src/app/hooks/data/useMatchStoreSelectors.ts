import useMatchStore from '../../match/stores/matchStore'

export default function useMatchStoreSelectors() {
  return {
    matchTeam: useMatchStore(state => state.matchTeam),
    setMatchTeam: useMatchStore(state => state.setMatchTeam),
    events: useMatchStore(state => state.events),
    setEvents: useMatchStore(state => state.setEvents),
    goals: useMatchStore(state => state.goals),
    setGoals: useMatchStore(state => state.setGoals),
    pausePeriods: useMatchStore(state => state.pausePeriods),
    setPausePeriods: useMatchStore(state => state.setPausePeriods),
    startTime: useMatchStore(state => state.startTime),
    setStartTime: useMatchStore(state => state.setStartTime),
    isStarted: useMatchStore(state => state.isStarted),
    setIsStarted: useMatchStore(state => state.setIsStarted),
    isPaused: useMatchStore(state => state.isPaused),
    setIsPaused: useMatchStore(state => state.setIsPaused),
    isHalfTime: useMatchStore(state => state.isHalfTime),
    setIsHalfTime: useMatchStore(state => state.setIsHalfTime),
    isSecondTime: useMatchStore(state => state.isSecondTime),
    setIsSecondTime: useMatchStore(state => state.setIsSecondTime),
    startPause: useMatchStore(state => state.startPause),
    endPause: useMatchStore(state => state.endPause),
    archiveMatch: useMatchStore(state => state.archiveMatch),
  }
}

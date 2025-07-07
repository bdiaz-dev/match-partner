import { MatchEvent } from '../match/stores/matchStore'
import { getElapsedWithPauses } from '../utils/getElapsedWithPauses'
import useMatchStoreSelectors from './useMatchStoreSelectors'
import usePlayerMenu from './usePlayerMenu'

export default function useGeneralEvents() {

  const { handleGoal } = usePlayerMenu(undefined).handlersPlayer
  const {
    startTime,
    pausePeriods,
    events,
    setEvents
  } = useMatchStoreSelectors()

  const handleGeneralEvents = (title: string, type: MatchEvent['type']) => {
    if (!startTime) return
    const { minutes, seconds } = getElapsedWithPauses(startTime, pausePeriods)
    const id = `${type}-${minutes}-${seconds}`
    const newEvent: MatchEvent = {
      title,
      type,
      time: `${minutes} : ${seconds}`,
      id
    }
    setEvents([...events, newEvent])
  }
  
  const handlers = {
    handleGoal,
    handleOffside: () => { handleGeneralEvents('🚩 Fuera de Juego', 'offside') },
    handleCorner: () => { handleGeneralEvents('🏳️ Córner', 'corner') },
    handleFoul: () => { handleGeneralEvents('🚫 Falta Rival', 'foul') },
    handleOpponentKeeperSave: () => { handleGeneralEvents('🧤 Parada Rival', 'keeperSave') }
  }

  return {
    handlers
  }
    
}

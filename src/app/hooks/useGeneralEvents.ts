import { MatchEvent, MatchPlayer } from '../match/stores/matchStore'
import { getElapsedWithPauses } from '../utils/getElapsedWithPauses'
import useMatchStoreSelectors from './useMatchStoreSelectors'
import usePlayerMenu from './usePlayerMenu'

export default function useGeneralEvents() {

  const { handleGoal } = usePlayerMenu(undefined).handlersPlayer
  const {
    startTime,
    pausePeriods,
    events,
    setEvents,
    startPause,
    // isHalfTime,
    setIsHalfTime,
    setIsSecondTime,
    endPause
  } = useMatchStoreSelectors()

  const handleGeneralEvents = (title: string, type: MatchEvent['type'], dorsalOnKeeperSave?: number, now?: 'string') => {
    // const now = new Date().toISOString()
    if (!startTime) return
    const { minutes, seconds } = getElapsedWithPauses(startTime, pausePeriods)
    const id = (type !== 'pause') ? `${type}-${minutes}-${seconds}` : (now ?? new Date().toISOString())
    const newEvent: MatchEvent = {
      title,
      type,
      time: `${minutes} : ${seconds}`,
      id
    }
    if (type === 'keeperSave') {
      if (!dorsalOnKeeperSave) return
      newEvent.dorsalOnKeeperSave = dorsalOnKeeperSave}
    setEvents([newEvent, ...events])
  }
  
  const handlers = {
    handleGoal,
    handleOffside: () => { handleGeneralEvents('🚩 Fuera de Juego', 'offside') },
    handleShot: () => { handleGeneralEvents('🏹 Disparo Rival', 'shot') },
    handleOffsideOpponent: () => { handleGeneralEvents('🚩 Fuera de Juego Rival', 'offside') },
    handleCorner: () => { handleGeneralEvents('🏳️ Córner', 'corner') },
    handleCornerOpponent: () => { handleGeneralEvents('🏳️ Córner Rival', 'corner') },
    handleFoul: () => { handleGeneralEvents('🚫 Falta Rival', 'foul') },
    handleOpponentKeeperSave: (p : MatchPlayer) => { handleGeneralEvents(`🧤 Parada Rival, disparo de ${p.name}(#${p.dorsal})`, 'keeperSave', p.dorsal) },
    handleOpponentYellowCard: () => { handleGeneralEvents('🟨 Tj. Amarilla para el rival', 'card') },
    handleOpponentRedCard: () => { handleGeneralEvents('🟥 Tj. Roja para el rival', 'redCard') },
    handlePauseMatch: () => {
      const now = new Date().toISOString()
      startPause(now)
      handleGeneralEvents('✋ Pausa del partido excepcional', 'pause')
    },
    handleHalfTimeStart: () => {
      const now = new Date().toISOString()
      setIsHalfTime(true)
      startPause(now)
      handleGeneralEvents('⌚ Fin primera parte', 'endFirstTime')
    },
    handleHalfTimeEnd: () => {
      // const now = new Date().toISOString()
      setIsHalfTime(false)
      setIsSecondTime(true)
      endPause()
      handleGeneralEvents('🏃‍♂️ Inicio segunda parte', 'startSecondTime')
    }
  }

  return {
    handlers
  }
    
}

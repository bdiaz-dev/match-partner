import { MatchEvent, MatchPlayer } from '../../match/stores/matchStore'
import useMatchStoreSelectors from '../data/useMatchStoreSelectors'
import usePlayerMenu from '../playerMenu/usePlayerMenu'
import { toast } from 'sonner'
import useTimeStringForEvents from './useTimeStringForEvents'
import { useMatchElapsedTime } from '../stopwatch/useMatchElapsedTime'

export default function useGeneralEvents() {

  const { handleGoal } = usePlayerMenu(undefined).handlersPlayer
  const { time } = useTimeStringForEvents()
  const {
    events,
    setSecondHalfStartTime,
    setEvents,
    startPause,
    setIsExtraTime,
    setIsHalfTime,
    setisSecondHalf,
    endPause
  } = useMatchStoreSelectors()

  const {
    minutes,
    seconds,
  } = useMatchElapsedTime()

  const handleGeneralEvents = (title: string, type: MatchEvent['type'], dorsalOnKeeperSave?: number, now?: 'string') => {
    const id = (type !== 'pause') ? `${type}-${minutes}-${seconds}` : (now ?? new Date().toISOString())

    const newEvent: MatchEvent = {
      title,
      type,
      time: time({minutes, seconds}),
      id
    }

    if (type === 'keeperSave') {
      if (!dorsalOnKeeperSave) return
      newEvent.dorsalOnKeeperSave = dorsalOnKeeperSave}
    if (title.match('rival') || title.match('Rival')) {
      newEvent.side = 'opponent'
    }
    toast(`${newEvent.title}: ${newEvent.time}`)
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
      setSecondHalfStartTime(new Date().toISOString())
      setIsHalfTime(false)
      setisSecondHalf(true)
      setIsExtraTime(false)
      endPause()
      handleGeneralEvents('🏃‍♂️ Inicio segunda parte', 'startSecondTime')
    }
  }

  return {
    handlers
  }
    
}

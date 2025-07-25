import { GoalItem, MatchPlayer } from '@/app/match/stores/matchStore'
import { getElapsedWithPauses } from '@/app/utils/getElapsedWithPauses'
import useMatchStoreSelectors from '../data/useMatchStoreSelectors'
import { usePlayerActions } from './usePlayerActions'
import { usePlayerEvents } from './usePlayerEvents'
import { useGoalKeeper } from './useGoalKeeper'

export default function usePlayerMenu(dorsal: number | undefined) {
  const {
    matchTeam,
    setMatchTeam,
    events,
    setEvents,
    goals,
    setGoals,
    pausePeriods,
    startTime
  } = useMatchStoreSelectors()

  const { addEvent } = usePlayerEvents(startTime, pausePeriods, events, setEvents)
  const { findPlayer, togglePlayerStatus, handleCard, handleSimpleEvent } = usePlayerActions(
    matchTeam, setMatchTeam, startTime, pausePeriods, events, setEvents
  )
  const { setAsGoalKeeper } = useGoalKeeper(
    matchTeam, setMatchTeam, startTime, pausePeriods, events, setEvents
  )

  // Funciones específicas usando los hooks base
  const handleGoal = ({ dorsal, side }: { dorsal: number | undefined, side: 'team' | 'opponent' }) => {
    if (!matchTeam || !startTime) return
    
    const { minutes, seconds } = getElapsedWithPauses(startTime, pausePeriods)
    const idForGoal = `goal-${side}-${minutes}-${seconds}`

    if (!dorsal && side === 'team') {
      console.error('Dorsal is required to handle goal')
      return
    }

    if (!dorsal && side === 'opponent') {
      setGoals([...goals, { time: `${minutes} : ${seconds}`, side, id: idForGoal }])
      addEvent({ title: '⚽ Gol rival', type: 'goal', id: idForGoal })
      return
    }

    if (dorsal && side === 'team') {
      const goalPlayer = findPlayer(dorsal)
      if (!goalPlayer) {
        console.error(`Player with dorsal ${dorsal} not found`)
        return
      }

      const newGoal: GoalItem = {
        playerName: goalPlayer.name,
        playerDorsal: dorsal,
        time: `${minutes} : ${seconds}`,
        side,
        id: idForGoal
      }
      
      setGoals([...goals, newGoal])
      addEvent({
        title: '⚽ Gol equipo',
        type: 'goal',
        playerName: goalPlayer.name,
        playerDorsal: dorsal,
        id: idForGoal
      })
    }
  }

  const toggleSubstitution = (dorsal1: number, dorsal2: number) => {
    if (!matchTeam || !startTime) return

    const isSomeOneGoalKeeper = matchTeam.some((player : MatchPlayer) =>
      (player.dorsal === dorsal1 || player.dorsal === dorsal2) && player.isGoalKeeper
    )

    const updatedTeam = matchTeam.map((player : MatchPlayer) => {
      if (player.dorsal === dorsal1 || player.dorsal === dorsal2) {
        const isEntering = !player.isPlaying
        return {
          ...player,
          isPlaying: isEntering,
          startPlayingTime: isEntering ? new Date().toISOString() : undefined,
          isGoalKeeper: isSomeOneGoalKeeper && !player.isGoalKeeper
        }
      }
      return player
    })

    const player1 = findPlayer(dorsal1)
    const player2 = findPlayer(dorsal2)

    addEvent({
      title: '🔄 Cambio de jugador',
      type: 'substitution',
      playersOnSubstitution: [
        { name: player1?.name || 'Desconocido', dorsal: dorsal1, isEntering: !player1?.isPlaying },
        { name: player2?.name || 'Desconocido', dorsal: dorsal2, isEntering: !player2?.isPlaying }
      ]
    })

    setMatchTeam(updatedTeam)
  }

  const handleInjury = (dorsal: number) => {
    if (!matchTeam || !startTime) return
    
    handleSimpleEvent(dorsal, { title: '🤕 Lesión', type: 'injury' })
    
    const updatedTeam = matchTeam.map((player: MatchPlayer) => {
      if (player.dorsal === dorsal) {
        return { ...player, isInjured: true }
      }
      return player
    })
    setMatchTeam(updatedTeam)
  }

  // Funciones auxiliares
  const filterPlayersForSubstitution = () => {
    if (!matchTeam || dorsal === undefined) return []
    const bool = findPlayer(dorsal)?.isPlaying ? false : true
    return matchTeam?.filter((p : MatchPlayer) => p.dorsal !== dorsal && p.isPlaying === bool && p.card !== 'red') || []
  }

  const filterPlayersForRedToGoalKeeper = () => {
    if (!matchTeam || dorsal === undefined) return []
    return matchTeam?.filter((p : MatchPlayer) => p.dorsal !== dorsal && p.card !== 'red') || []
  }

  // Funciones simples usando handleSimpleEvent
  const handleKeeperSave = (dorsal: number) => handleSimpleEvent(dorsal, { title: '🧤 Parada del portero', type: 'keeperSave' })
  const handleFoul = (dorsal: number) => handleSimpleEvent(dorsal, { title: '🚫 Falta', type: 'foul' })
  const handleShot = (dorsal: number) => handleSimpleEvent(dorsal, { title: '🏹 Disparo', type: 'shot' })

  const handlersPlayer = {
    togglePlayerStatus,
    toggleSubstitution,
    filterPlayersForSubstitution,
    handleGoal,
    handleKeeperSave,
    handleFoul,
    handleCard,
    handleShot,
    handleInjury,
    filterPlayersForRedToGoalKeeper,
    setAsGoalKeeper
  }

  return {
    handlersPlayer,
    player: findPlayer,
  }
}

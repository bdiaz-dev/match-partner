import { GoalItem, MatchPlayer } from '@/app/match/stores/matchStore'
import useMatchStoreSelectors from '../data/useMatchStoreSelectors'
import { usePlayerActions } from './usePlayerActions'
import { usePlayerEvents } from './usePlayerEvents'
import { useGoalKeeper } from './useGoalKeeper'
import { useMatchElapsedTime } from '../stopwatch/useMatchElapsedTime'

export default function usePlayerMenu(dorsal: number | undefined) {
  const {
    matchTeam,
    setMatchTeam,
    goals,
    setGoals,
    startTime
  } = useMatchStoreSelectors()

  const {
    minutes,
    seconds,
  } = useMatchElapsedTime()

  const { addEvent } = usePlayerEvents()
  const { findPlayer, togglePlayerStatus, handleCard, handleSimpleEvent } = usePlayerActions()
  const { setAsGoalKeeper } = useGoalKeeper()

  // Funciones específicas usando los hooks base
  const handleGoal = ({ dorsal, side, isOwnGoal = false }: { dorsal: number | undefined, side: 'team' | 'opponent', isOwnGoal?: boolean }) => {
    if (!matchTeam || !startTime) return

    const idForGoal = `goal-${side}-${minutes}-${seconds}`

    // Caso 1: Gol de nuestro equipo (requiere dorsal)
    if (side === 'team') {
      if (!dorsal) {
        console.error('Dorsal is required to handle team goal')
        return
      }

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
        id: idForGoal,
        isOwnGoal
      }

      setGoals([...goals, newGoal])

      // Determinar el título del evento basado en si es gol en propia
      const eventTitle = isOwnGoal ? '⛔ Gol en propia' : '⚽ Gol equipo'

      addEvent({
        title: eventTitle,
        type: 'goal',
        playerName: goalPlayer.name,
        playerDorsal: dorsal,
        id: idForGoal,
        isOwnGoal
      })
    }

    // Caso 2: Gol del rival (nunca tiene dorsal)
    if (side === 'opponent') {
      const eventTitle = isOwnGoal ? '⛔ Gol en propia rival' : '⚽ Gol rival'

      setGoals([...goals, {
        time: `${minutes} : ${seconds}`,
        side,
        id: idForGoal,
        isOwnGoal
      }])

      addEvent({
        title: eventTitle,
        type: 'goal',
        id: idForGoal,
        isOwnGoal
      })
    }
  }

  const toggleSubstitution = (dorsal1: number, dorsal2: number) => {
    if (!matchTeam || !startTime) return

    const isSomeOneGoalKeeper = matchTeam.some((player: MatchPlayer) =>
      (player.dorsal === dorsal1 || player.dorsal === dorsal2) && player.isGoalKeeper
    )

    const updatedTeam = matchTeam.map((player: MatchPlayer) => {
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
    return matchTeam?.filter((p: MatchPlayer) => p.dorsal !== dorsal && p.isPlaying === bool && p.card !== 'red') || []
  }

  const filterPlayersForRedToGoalKeeper = () => {
    if (!matchTeam || dorsal === undefined) return []
    return matchTeam?.filter((p: MatchPlayer) => p.dorsal !== dorsal && p.card !== 'red') || []
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

// import Match from '../match/page'
import useMatchStore, { GoalItem, MatchEvent } from '../match/stores/matchStore'
import { getElapsedWithPauses } from '../utils/getElapsedWithPauses'
// import { useMatchElapsedTime } from './useMatchElapsedTime'

export default function usePlayerMenu(dorsal: number | undefined) {
  const matchTeam = useMatchStore(state => state.matchTeam)
  const setMatchTeam = useMatchStore(state => state.setMatchTeam)
  const events = useMatchStore(state => state.events)
  const setEvents = useMatchStore(state => state.setEvents)
  const goals = useMatchStore(state => state.goals)
  const setGoals = useMatchStore(state => state.setGoals)
  const pausePeriods = useMatchStore(state => state.pausePeriods)
  const startTime = useMatchStore(state => state.startTime)
  // const { minutes, seconds } = useMatchElapsedTime()
  const player = (dorsalToFind: number) => matchTeam?.find(player => player.dorsal === dorsalToFind)

  // console.log(minutes, seconds)
  
  const handleGoal = ({dorsal, side} : {dorsal: number | undefined, side: 'team' | 'opponent'}) => {
    if (!matchTeam || !startTime) return
    const { minutes, seconds } = getElapsedWithPauses(startTime, pausePeriods)
    const idForGoal = `goal-${side}-${minutes}-${seconds}`

    // error por no poner dorsal en gol del equipo
    if (!dorsal && side === 'team') {
      console.error('Dorsal is required to handle goal')
      return
      

    // gol rival
    } else if (!dorsal && side === 'opponent') {
      setGoals([
        ...goals,
        {
          time: `${minutes} : ${seconds}`,
          side,
          id: idForGoal
        }
      ])
      const newEvent: MatchEvent = {
        title: '⚽ Gol del rival',
        type: 'goal',
        time: `${minutes} : ${seconds}`,
        id: idForGoal
      }
      setEvents([...events, newEvent])
      return

    // gol del equipo
    } else if (dorsal && side === 'team') {
    const goalPlayer = player(dorsal)
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
      const newEvent: MatchEvent = {
        title: '⚽ Gol del equipo',
        type: 'goal',
        playerName: goalPlayer.name,
        playerDorsal: dorsal,
        time: `${minutes} : ${seconds}`,
        id: idForGoal
      }
      setEvents([...events, newEvent])
    }
  }

  const togglePlayerStatus = (dorsal: number) => {
    if (!matchTeam || !startTime) return

    const updatedTeam = matchTeam.map((player) => {
      if (player.dorsal === dorsal) {
        const isEntering = !player.isPlaying
        return {
          ...player,
          isPlaying: isEntering,
          startPlayingTime: isEntering ? new Date().toISOString() : undefined
        }
      }
      return player
    })

    const player = updatedTeam.find(player => player.dorsal === dorsal)
    const { minutes, seconds } = getElapsedWithPauses(startTime, pausePeriods)
    const idForEvent = `changeStatus-${dorsal}-${minutes}-${seconds}`
    const newEvent: MatchEvent = {
      title: player?.isPlaying ? 'Entra al campo' : 'Sale del campo',
      type: 'changeStatus',
      playerName: player?.name || 'Desconocido',
      playerDorsal: dorsal,
      time: `${minutes} : ${seconds}`,
      id: idForEvent
    }
    const newEventsList = [...events, newEvent]
    setEvents(newEventsList)
    setMatchTeam(updatedTeam)
  }

  const toggleSubstitution = (dorsal1: number, dorsal2: number) => {
    if (!matchTeam || !startTime) return

    // Verifica si alguno de los dos dorsales es portero
    const isSomeOneGoalKeeper =
      matchTeam.some(player =>
        (player.dorsal === dorsal1 || player.dorsal === dorsal2) && player.isGoalKeeper
      )

    const updatedTeam = matchTeam.map((player) => {
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

    const { minutes, seconds } = getElapsedWithPauses(startTime, pausePeriods)

    const player1 = player(dorsal1)
    const player2 = player(dorsal2)
    const idForEvent = `substitution-${minutes}-${seconds}`

    const substitutionEvent: MatchEvent = {
      title: '🔄 Cambio de jugador',
      type: 'substitution',
      playersOnSubstitution: [
        {
          name: player1?.name || 'Desconocido',
          dorsal: dorsal1,
          isEntering: !player1?.isPlaying
        },
        {
          name: player2?.name || 'Desconocido',
          dorsal: dorsal2,
          isEntering: !player2?.isPlaying
        }
      ],
      time: `${minutes} : ${seconds}`,
      id: idForEvent
    }

    const newEventsList = [
      ...events,
      substitutionEvent,
    ]
    setEvents(newEventsList)
    setMatchTeam(updatedTeam)
  }



  const filterPlayersForSubstitution = () => {
    if (!matchTeam || dorsal === undefined) return []
    const bool = player(dorsal)?.isPlaying ? false : true
    return matchTeam?.filter(p => p.dorsal !== dorsal && p.isPlaying === bool) || []
  }
  
  const handleKeeperSave = (dorsal: number) => {
    if (!matchTeam || !startTime) return
    const { minutes, seconds } = getElapsedWithPauses(startTime, pausePeriods)
    const idForEvent = `keeperSave-${minutes}-${seconds}`
    const keeperSave = player(dorsal)
    const newEvent: MatchEvent = {
      title: '🧤 Parada del portero',
      playerName: keeperSave?.name || 'Desconocido',
      playerDorsal: dorsal,
      type: 'keeperSave',
      time: `${minutes} : ${seconds}`,
      id: idForEvent
    }
    
    const newEventsList = [...events, newEvent]
    
    setEvents(newEventsList)
  }
  

  return {
    player,
    togglePlayerStatus,
    toggleSubstitution,
    filterPlayersForSubstitution,
    handleGoal,
    handleKeeperSave
  }
}

// - [X] Registrar evento de **GOL**
// - [ ] Registrar evento de **TARJETA AMARILLA**
// - [ ] Registrar evento de **TARJETA ROJA**
// - [ ] Registrar evento de **FALTA**
// - [ ] Registrar evento de **PARADA DEL PORTERO**
// - [ ] Registrar evento de **DISPARO**
// - [ ] Registrar evento de **LESIÓN**

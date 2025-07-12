import { MatchEvent, MatchPlayer } from '../../match/stores/matchStore'
import { usePlayerEvents } from './usePlayerEvents'

export function useGoalKeeper(
  matchTeam: MatchPlayer[] | null,
  setMatchTeam: (team: MatchPlayer[]) => void,
  startTime: string | null,
  pausePeriods: { start: string; id: string, end?: string }[],
  events: MatchEvent[],
  setEvents: (events: MatchEvent[]) => void
) {
  const { addMultipleEvents } = usePlayerEvents(startTime, pausePeriods, events, setEvents)
  
  const setAsGoalKeeper = ({ dorsal, playerToRemove, playerToRedCard }: {
    dorsal: number,
    playerToRemove: MatchPlayer | null,
    playerToRedCard: MatchPlayer | null
  }) => {
    if (!matchTeam || !startTime) return

    const newGoalkeeper = matchTeam.find(player => player.dorsal === dorsal)
    
    const updatedTeam = matchTeam.map((player) => {
      if (player.dorsal === dorsal) {
        return {
          ...player,
          isGoalKeeper: true,
          isPlaying: player.isPlaying || true,
          startPlayingTime: !player.isPlaying ? new Date().toISOString() : player.startPlayingTime,
        }
      }

      if (playerToRedCard && player.dorsal === playerToRedCard.dorsal) {
        return {
          ...player,
          card: 'red' as const,
          isGoalKeeper: false,
          isPlaying: false,
        }
      }

      if (playerToRemove && player.dorsal === playerToRemove.dorsal) {
        return { ...player, isPlaying: false }
      }

      return { ...player, isGoalKeeper: false }
    })

    // Generar eventos
    const eventsToAdd : (Omit<MatchEvent, 'id' | 'time'> & { id?: string, time?: string })[] = []
    
    if (playerToRedCard) {
      eventsToAdd.push({
        title: '🟥 Tj. Roja',
        type: 'redCard',
        playerName: playerToRedCard.name,
        playerDorsal: playerToRedCard.dorsal,
        unremovable: true
      })
    }

    if (newGoalkeeper) {
      eventsToAdd.push({
        title: newGoalkeeper.isPlaying ? '🥅 Nuevo portero' : '🥅 Nuevo portero (entra)',
        type: 'changeStatus',
        playerName: newGoalkeeper.name,
        playerDorsal: dorsal,
        unremovable: true
      })
    }

    if (playerToRemove) {
      eventsToAdd.push({
        title: '🔚 Sale del campo',
        type: 'changeStatus',
        playerName: playerToRemove.name,
        playerDorsal: playerToRemove.dorsal,
        unremovable: true
      })
    }

    addMultipleEvents(eventsToAdd)
    setMatchTeam(updatedTeam)
  }

  return { setAsGoalKeeper }
}

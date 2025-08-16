import { MatchEvent } from '@/app/match/stores/matchStore'
import { usePlayerEvents } from './usePlayerEvents'
import useMatchStoreSelectors from '../data/useMatchStoreSelectors'

export function usePlayerActions() {

  const {
    startTime,
    setMatchTeam,
    matchTeam
  } = useMatchStoreSelectors()
  

  const { addEvent } = usePlayerEvents()
  
  const findPlayer = (dorsal: number) => matchTeam?.find(player => player.dorsal === dorsal)

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

    const playerObj = updatedTeam.find(player => player.dorsal === dorsal)
    addEvent({
      title: playerObj?.isPlaying ? 'Entra al campo' : 'Sale del campo',
      type: 'changeStatus',
      playerName: playerObj?.name || 'Desconocido',
      playerDorsal: dorsal
    })
    setMatchTeam(updatedTeam)
  }

  const handleCard = (dorsal: number, cardType: 'yellow' | 'red') => {
    if (!matchTeam || !startTime) return
    
    const cardedPlayer = findPlayer(dorsal)
    const updatedTeam = matchTeam.map((player) => {
      if (player.dorsal === dorsal) {
        return {
          ...player,
          card: cardType,
          isPlaying: cardType === 'red' ? false : player.isPlaying,
        }
      }
      return player
    })
    
    setMatchTeam(updatedTeam)
    addEvent({
      title: cardType === 'yellow' ? '🟨 Tj. Amarilla' : '🟥 Tj. Roja',
      type: cardType === 'yellow' ? 'card' : 'redCard',
      playerName: cardedPlayer?.name || 'Desconocido',
      playerDorsal: dorsal
    })
  }

  const handleSimpleEvent = (dorsal: number, eventConfig: { title: string, type: MatchEvent['type'] }) => {
    if (!matchTeam || !startTime) return
    
    const player = findPlayer(dorsal)
    addEvent({
      title: eventConfig.title,
      type: eventConfig.type,
      playerName: player?.name || 'Desconocido',
      playerDorsal: dorsal
    })
  }

  return {
    findPlayer,
    togglePlayerStatus,
    handleCard,
    handleSimpleEvent
  }
}

// import useMatchStore from '../match/stores/matchStore'
import { MatchPlayer } from '../match/stores/matchStore';
import useMatchStoreSelectors from './useMatchStoreSelectors'

export default function useDeleteEvents(setisEditing: (value: boolean) => void) {

  const { events, setEvents, goals, setGoals, matchTeam, setMatchTeam, pausePeriods, setPausePeriods } = useMatchStoreSelectors()

  const handleDeleteEvent = ({ id, type }: { id: string, type: string }) => {
    const deleteEvent = () => {
      // Filtrar el evento a eliminar
      const eventToDelete = events.find((event) => event.id === id)
      const updatedEvents = events.filter((event) => event.id !== id)
      if (type === 'goal') {
        // Si es un gol, también eliminarlo de la lista de goles
        const updatedGoals = goals.filter((goal) => goal.id !== id)
        setGoals(updatedGoals)
      }
      if (type === 'card') {
        const updatedTeam = matchTeam?.map((player) => {
          if (player.dorsal === eventToDelete?.playerDorsal) {
            // Si el evento es una tarjeta, eliminar la tarjeta del jugador
            return {
              ...player,
              card: '' as MatchPlayer['card'],
            }
          }
          return player;
        })
        setMatchTeam(updatedTeam)
      }
      if (type === 'redCard') {
        const updatedTeam = matchTeam?.map((player) => {
          if (player.dorsal === eventToDelete?.playerDorsal) {
            // Si el evento es una tarjeta, eliminar la tarjeta del jugador
            return {
              ...player,
              card: '' as MatchPlayer['card'],
              isPlaying: true
            }
          }
          return player;
        })
        setMatchTeam(updatedTeam)
      }
      if (type === 'injury') {
        const updatedTeam = matchTeam?.map((player) => {
          if (player.dorsal === eventToDelete?.playerDorsal) {
            // Si el evento es una lesión, eliminar la lesión del jugador
            return {
              ...player,
              isInjured: false
            }
          }
          return player;
        })
        setMatchTeam(updatedTeam)
      }
      if (type === 'pause') {
        const filteredPausePeriods = pausePeriods?.filter((period) => period.id !== id)
        setPausePeriods(filteredPausePeriods)
      }
      // Actualizar el estado con los eventos filtrados
      setEvents(updatedEvents)
    }
    if (confirm("¿Estás seguro de que quieres eliminar este evento?")) {
      deleteEvent()
      setisEditing(false)
    }
  };

  return {
    handleDeleteEvent
  }
}

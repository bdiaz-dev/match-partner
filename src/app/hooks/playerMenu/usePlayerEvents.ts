import { MatchEvent } from '../../match/stores/matchStore'
import { getElapsedWithPauses } from '../../utils/getElapsedWithPauses'
import { toast } from 'sonner'

export function usePlayerEvents(startTime: string | null, pausePeriods: { start: string; id: string, end?: string }[], events: MatchEvent[], setEvents: (events: MatchEvent[]) => void) {
  const addEvent = (event: Omit<MatchEvent, 'id' | 'time'> & { id?: string, time?: string }) => {
    if (!startTime) return
    const { minutes, seconds } = getElapsedWithPauses(startTime, pausePeriods)
    const id = event.id ?? `${event.type}-${minutes}-${seconds}`
    const time = event.time ?? `${minutes} : ${seconds}`
    const newEvent: MatchEvent = { ...event, id, time }
    if (newEvent.type === 'substitution' && newEvent.playersOnSubstitution) {
      const playersText = newEvent.playersOnSubstitution
        .map((player) =>
          player.isEntering
            ? `Entra (#${player.dorsal})`
            : `Sale (#${player.dorsal})`
        )
        .join(' / ')

      toast(`🔄 Cambio: ${playersText} - ${newEvent.time}`)
    } else {
      toast(`${newEvent.title}${!!newEvent.playerName ? ': ' + newEvent.playerName : ''} - ${newEvent.time}`)
    }
    setEvents([newEvent, ...events])
  }

  const addMultipleEvents = (eventsToAdd: (Omit<MatchEvent, 'id' | 'time'> & { id?: string, time?: string })[]) => {
    if (!startTime || eventsToAdd.length === 0) return

    const { minutes, seconds } = getElapsedWithPauses(startTime, pausePeriods)
    const processedEvents = eventsToAdd.map((event, index) => {
      const id = event.id ?? `${event.type}-${minutes}-${seconds}-${index}`
      const time = event.time ?? `${minutes} : ${seconds}`
      return { ...event, id, time }
    })
    processedEvents.map(e => {
      toast(`${e.title}: ${e.playerName} -${e.time}`)
    })
    setEvents([...processedEvents, ...events])
  }

  return { addEvent, addMultipleEvents }
}

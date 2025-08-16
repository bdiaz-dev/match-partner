import { MatchEvent } from '../../match/stores/matchStore'
import { toast } from 'sonner'
import useMatchStoreSelectors from '../data/useMatchStoreSelectors';
import useTimeStringForEvents from '../events/useTimeStringForEvents';
import { useMatchElapsedTime } from '../stopwatch/useMatchElapsedTime';

export function usePlayerEvents() {
  
  const {
    events,
    setEvents,
  } = useMatchStoreSelectors()

  const {
minutes,
seconds,
  } = useMatchElapsedTime()

  const { time : timeString } = useTimeStringForEvents()

  const addEvent = (event: Omit<MatchEvent, 'id' | 'time'> & { id?: string, time?: string }) => {
    const id = event.id ?? `${event.type}-${minutes}-${seconds}`
    const time = event.time ?? timeString({ minutes, seconds })
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
    const processedEvents = eventsToAdd.map((event, index) => {
      const id = event.id ?? `${event.type}-${minutes}-${seconds}-${index}`
      const time = event.time ?? timeString({ minutes, seconds })
      return { ...event, id, time }
    })
    processedEvents.map(e => {
      toast(`${e.title}: ${e.playerName} -${e.time}`)
    })
    setEvents([...processedEvents, ...events])
  }

  return { addEvent, addMultipleEvents }
}

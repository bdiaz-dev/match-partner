import { Button } from '@/components/ui/button'
import { MatchEvent } from '../stores/matchStore'
import { useState } from 'react'
import useDeleteEvents from '@/app/hooks/useDeleteEvent'
import useMatchStoreSelectors from '@/app/hooks/useMatchStoreSelectors'
import ConfirmDialog from './ConfirmDialog'

export default function EventsList() {

  const { isPaused, events } = useMatchStoreSelectors()
  const [isEditing, setIsEditing] = useState(false)
  const { handleDeleteEvent } = useDeleteEvents(setIsEditing)
  const [showDialog, setShowDialog] = useState(false)
  const [eventToDelete, setEventToDelete] = useState<MatchEvent | null>(null)
  
  const showDeleteButton = (event: MatchEvent) => isEditing && !(isPaused && event.type === 'pause') && !(event.type === 'endFirstTime') && !(event.type === 'startSecondTime')

  const handleCancelDelete = () => {
    setShowDialog(false)
    setEventToDelete(null)
  }

  const handleOpenDialog = (event: MatchEvent) => {
    setEventToDelete(event)
    setShowDialog(true)
  }

  const handleConfirmDelete = () => {
    if (eventToDelete) {
      handleDeleteEvent({ id: eventToDelete.id, type: eventToDelete.type })
      setShowDialog(false)
      setEventToDelete(null)
      setIsEditing(false)
    }
  }

  const SubstitutionEvent = ({ e }: { e: MatchEvent }) => {
    if (!e.playersOnSubstitution || e.playersOnSubstitution.length === 0) return null
    return (
      <div className='p-2 border-b border-gray-200 w-full'>
        <span className='text-gray-800 font-semibold'>🔄 Cambio: </span>
        {e.playersOnSubstitution.map((player, index) => (
          <span key={index} className='text-gray-600'>
            {player.isEntering
              ? `Entra ${player.name} (#${player.dorsal})`
              : `Sale ${player.name} (#${player.dorsal})`
            }
            {index === 0 && (e.playersOnSubstitution?.length ?? 0) > 1 && ' - '}
          </span>
        ))}
        <span className='text-gray-500 text-sm'>{' - ' + e.time}</span>
      </div>
    )
  }

  const hasEvents = events.length > 0

  const goalTextStyle = (type: string, side: string) => {
    if (type === 'goal') return side === 'team' ? 'text-green-700' : 'text-orange-600'
    if (type === 'redCard') return 'text-red-600'
    if (type === 'card') return 'text-yellow-600'
    if (type === 'pause') return 'text-purple-600'
    return 'text-gray-800'
  }

  return (
      <div className='flex flex-col items-center justify-center bg-slate-300 rounded-lg p-2 relative'>
        <h2 className='text-2xl font-bold text-gray-800'>Eventos</h2>
        {isEditing &&
          <p className='text-sm text-red-600'>Modo edición activo</p>}
        <Button
          disabled={!hasEvents}
          onClick={() => hasEvents && setIsEditing(!isEditing)}
          className={`${isEditing ? 'bg-red-600' : 'bg-slate-400'} absolute top-2 right-2 text-xs`}
        >✍</Button>
        <div className='flex flex-col items-start justify-start w-full min-w-90 min-h-80 mt-2 max-h-100 overflow-y-scroll custom-scrollbar' >
          {events.length > 0 ? (
            events.map((event, index) => event.type === 'substitution' ? (
              <SubstitutionEvent e={event} key={index} />
            ) : (
              <div key={index} className='p-2 border-b border-gray-200 w-full'>
                {showDeleteButton(event) &&
                  <button className='rounded-full mr-2 hover:scale-110 transition-scale duration-100 cursor-pointer'
                    onClick={() => handleOpenDialog(event)}
                  >
                    ❌
                  </button>}
                <span className={`${goalTextStyle(event.type, (!!event.playerName ? 'team' : 'opponent'))} font-semibold`}>{event.title + ': '}</span>
                <span className='text-gray-600'>{event.playerName} {event.playerName ? `(#${event.playerDorsal})` : ''}</span>
                <span className='text-gray-500 text-sm text-nowrap'>{' - ' + event.time}</span>
              </div>
            ))
          ) : (
            <p className='text-gray-600'>Sin eventos de momento</p>
          )}
        </div>
        
        {/* Diálogo único fuera del bucle */}
        <ConfirmDialog
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          open={showDialog}
          onOpenChange={handleCancelDelete}
          type='delete'
        />
      </div>
  )
}

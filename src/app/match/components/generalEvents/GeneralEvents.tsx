import useGeneralEvents from '@/app/hooks/events/useGeneralEvents'
import useMatchStoreSelectors from '@/app/hooks/data/useMatchStoreSelectors'
import { Button } from '@/components/ui/button'
import ConfirmDialog from '../dialogs/ConfirmDialog'
import { useState } from 'react'
import SelectPlayerOnOpponentKeeperSave from './SelectPlayerOnOpponentKeeperSave'
import EventsDialog from '../dialogs/EventsDialog'
import useGeneralEventButtons from '@/app/hooks/events/useGeneralEventsButtons'

export default function GeneralEvents() {
  const { handlers } = useGeneralEvents()
  const {
    endPause,
    isPaused,
    archiveMatch,
    isHalfTime,
    isSecondHalf
  } = useMatchStoreSelectors()

  const [showHalfTimeDialog, setShowHalfTimeDialog] = useState(false)
  const [showEndMatchDialog, setShowEndMatchDialog] = useState(false)
  const [showPlayerSelectorForKeeperSave, setShowPlayerSelectorForKeeperSave] = useState(false)

  const {
    opponentEventsButtons,
    teamEventsButtons,
    matchEventButtons,
  } = useGeneralEventButtons({
    handlers,
    setShowHalfTimeDialog,
    setShowEndMatchDialog,
    setShowPlayerSelectorForKeeperSave,
    isSecondHalf,
  })

  // Estados de pausa
  if (isPaused && !isHalfTime) {
    return (
      <Button onClick={() => endPause()}>
        Continuar partido
      </Button>
    )
  }

  if (isPaused && isHalfTime && !isSecondHalf) {
    return (
      <Button className='bg-green-600' onClick={() => handlers.handleHalfTimeEnd()}>
        Empezar segunda parte
      </Button>
    )
  }

  return (
    <>
      <div className='flex flex-row gap-2 flex-wrap items-center justify-center'>
        <EventsDialog
          title='Eventos Equipo'
          triggerLabel='Eventos Equipo'
          buttons={teamEventsButtons}
        />
        <EventsDialog
          title='Eventos Rival'
          triggerLabel='Eventos Rival'
          buttons={opponentEventsButtons}
        />
        <EventsDialog
          title='Control de Partido'
          triggerLabel='Control Partido'
          buttons={matchEventButtons}
        />
      </div>

      <ConfirmDialog
        onConfirm={() => handlers.handleHalfTimeStart()}
        onCancel={() => setShowHalfTimeDialog(false)}
        open={showHalfTimeDialog}
        onOpenChange={() => setShowHalfTimeDialog(false)}
        type='halfTime'
      />
      <ConfirmDialog
        onConfirm={() => archiveMatch()}
        onCancel={() => setShowEndMatchDialog(false)}
        open={showEndMatchDialog}
        onOpenChange={() => setShowEndMatchDialog(false)}
        type='endMatch'
      />
      <SelectPlayerOnOpponentKeeperSave
        open={showPlayerSelectorForKeeperSave}
        onCancel={() => setShowPlayerSelectorForKeeperSave(false)}
        onOpenChange={() => setShowPlayerSelectorForKeeperSave(false)}
      />
    </>
  )
}

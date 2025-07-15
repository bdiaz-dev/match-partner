'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { MatchPlayer } from '@/app/match/stores/matchStore'
import PlayerStopwatch from "../team/player/PlayerStopwatch"
import DorsalForMenu from "../team/player/DorsalForMenu"
import useMatchStoreSelectors from "@/app/hooks/useMatchStoreSelectors"
import useGeneralEvents from "@/app/hooks/useGeneralEvents"

interface SelectPlayerOnOpponentKeeperSaveDialogProps {
  open: boolean
  onCancel: () => void
  onOpenChange: () => void
}

export default function SelectPlayerOnOpponentKeeperSave({
  open,
  onCancel,
  onOpenChange,
}: SelectPlayerOnOpponentKeeperSaveDialogProps) {

  // const { handlersPlayer, player } = usePlayerMenu(dorsal)
  const { handlers } = useGeneralEvents()
  const { matchTeam } = useMatchStoreSelectors()

  const handleEventAndClose = (p: MatchPlayer) => {
    onCancel()
    handlers.handleOpponentKeeperSave(p)
  }

  const filterPlayersCanShot = () => matchTeam?.filter((p: MatchPlayer) => p.isPlaying)


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='text-center'>
            ¿Que jugador a disparado a puerta?
          </DialogTitle>

          <DialogDescription></DialogDescription>
        </DialogHeader>

        <div className='flex flex-col gap-1'>

          {filterPlayersCanShot().map(p => (
            <Button
              key={p.dorsal}
              onClick={() => handleEventAndClose(p)}
              size='lg'
            >
              {DorsalForMenu(p)}{p.name} {p.isInjured && '🤕'} {p.card === 'yellow' && '🟨'}
              -
              {<PlayerStopwatch dorsal={p.dorsal} style='forChange' />}
            </Button>
          ))}
        </div>

        <DialogFooter>
          <Button variant='destructive' onClick={onCancel}>Cancelar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

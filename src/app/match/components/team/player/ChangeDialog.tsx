'use client'


import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import DorsalForMenu from './DorsalForMenu'
import usePlayerMenu from '@/app/hooks/usePlayerMenu'
import { Button } from '@/components/ui/button'
import PlayerStopwatch from './PlayerStopwatch'
import { MatchPlayer } from '@/app/match/stores/matchStore'

interface ConfirmDeleteDialogProps {
  open: boolean
  onCancel: () => void
  onOpenChange: () => void
  dorsal: number
}

export default function ChangeDialog({
  open,
  onCancel,
  onOpenChange,
  dorsal
}: ConfirmDeleteDialogProps) {

  const { handlersPlayer } = usePlayerMenu(dorsal)

  const handleSubstitutionAndClose = (p: MatchPlayer) => {
    onCancel()
    setTimeout(() => {
      handlersPlayer.toggleSubstitution(p.dorsal, dorsal)
    }, 1)
    // handlersPlayer.toggleSubstitution(p.dorsal, dorsal)
  }


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Elige el jugador para el cambio
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className='flex flex-col gap-1'>

          {handlersPlayer.filterPlayersForSubstitution().map(p => (
            <Button
              key={p.dorsal}
              onClick={() => handleSubstitutionAndClose(p)}
              size='lg'
            >
              {DorsalForMenu(p)}{p.name} {p.isInjured && '🤕'} {p.card === 'yellow' && '🟨'}
              -
              {<PlayerStopwatch dorsal={p.dorsal} style='forChange' />}
              {/* (#{p.dorsal}) */}
            </Button>
          ))}
        </div>
        <DialogFooter>
          <Button variant='destructive' onClick={onCancel}>Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

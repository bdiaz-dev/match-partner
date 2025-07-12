import useGeneralEvents from '@/app/hooks/useGeneralEvents';
import useMatchStoreSelectors from '@/app/hooks/useMatchStoreSelectors';
import { Button } from '@/components/ui/button';
import { DropdownMenuLabel } from '@/components/ui/dropdown-menu';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

import ConfirmDialog from './ConfirmDialog';
import { useState } from 'react';

export default function GeneralEvents() {

  const { handlers } = useGeneralEvents()
  const {
    // startPause,
    endPause,
    isPaused,
    archiveMatch,
    isHalfTime,
    isSecondTime
  } = useMatchStoreSelectors()
  const [showHalfTimeDialog, setShowHalfTimeDialog] = useState(false)
  const [showEndMatchDialog, setShowEndMatchDialog] = useState(false)
  
  


  if (isPaused && !isHalfTime) return (
    <Button onClick={() => endPause()}>
      Continuar partido
    </Button>
  )

  if (isPaused && isHalfTime && !isSecondTime) return (
    <Button className='bg-green-600' onClick={() => handlers.handleHalfTimeEnd()}>
      Empezar segunda parte
    </Button>
  )

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button className='bg-blue-800'>Eventos Generales</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eventos Generales</DialogTitle>
            <DialogDescription></DialogDescription>
            </DialogHeader>

          <div className='flex flex-col gap-1'>
            <DropdownMenuLabel className='text-gray-500 font-bold'>
              Rival
            </DropdownMenuLabel>
            <DialogClose asChild>
              <Button onClick={() => handlers.handleGoal({ dorsal: undefined, side: 'opponent' })}>
                ⚽ Gol Rival
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button onClick={() => handlers.handleShot()}>
                🏹 Disparo Rival
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button onClick={() => handlers.handleCornerOpponent()}>
                🏳️ Córner Rival
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button onClick={() => handlers.handleOffsideOpponent()}>
                🚩 Fuera de Juego Rival
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button onClick={() => handlers.handleFoul()}>
                🚫 Falta Rival
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button onClick={() => handlers.handleOpponentYellowCard()}>
                🟨 Tarjeta Amarilla Rival
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button onClick={() => handlers.handleOpponentRedCard()}>
                🟥 Tarjeta Roja Rival
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button onClick={() => handlers.handleOpponentKeeperSave()}>
                🧤 Parada Rival
              </Button>
            </DialogClose>
          </div>

          <div className='flex flex-col gap-1'>
            <DropdownMenuLabel className='text-gray-500 font-bold'>
              Equipo
            </DropdownMenuLabel>
            <DialogClose asChild>
              <Button onClick={() => handlers.handleCorner()}>
                🏳️ Córner
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button onClick={() => handlers.handleOffside()}>
                🚩 Fuera de Juego
              </Button>
            </DialogClose>
          </div>

          <div className='flex flex-col gap-1'>
            <DropdownMenuLabel className='text-gray-500 font-bold'>
              Partido
            </DropdownMenuLabel>
            {!isSecondTime &&
              <DialogClose asChild>
                <Button onClick={() => setShowHalfTimeDialog(true)}>
                  ⌚ Media parte
                </Button>
              </DialogClose>
            }
            <DialogClose asChild>
              <Button onClick={() => handlers.handlePauseMatch()}>
                ✋ Pausa excepcional
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button onClick={() => setShowEndMatchDialog(true)}>
                📣 Fin del Partido
              </Button>
            </DialogClose>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant={'destructive'}>Cancelar</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <ConfirmDialog
        onConfirm={() => { handlers.handleHalfTimeStart() }}
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
    </>
  )
}

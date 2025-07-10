import useGeneralEvents from '@/app/hooks/useGeneralEvents';
import useMatchStoreSelectors from '@/app/hooks/useMatchStoreSelectors';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuLabel } from '@/components/ui/dropdown-menu';
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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className='bg-blue-800'>Eventos Generales</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start">
          <DropdownMenuLabel className='text-gray-500 font-bold'>
            Rival
          </DropdownMenuLabel>
          <DropdownMenuItem onClick={() => handlers.handleGoal({ dorsal: undefined, side: 'opponent' })}>
            ⚽ Gol Rival
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handlers.handleCornerOpponent()}>
            🏳️ Córner Rival
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handlers.handleOffsideOpponent()}>
            🚩 Fuera de Juego Rival
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handlers.handleFoul()}>
            🚫 Falta Rival
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handlers.handleOpponentKeeperSave()}>
            🧤 Parada Rival
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuSeparator />
          <DropdownMenuLabel className='text-gray-500 font-bold'>
            Equipo
          </DropdownMenuLabel>
          <DropdownMenuItem onClick={() => handlers.handleCorner()}>
            🏳️ Córner
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handlers.handleOffside()}>
            🚩 Fuera de Juego
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuSeparator />
          <DropdownMenuLabel className='text-gray-500 font-bold'>
            Partido
          </DropdownMenuLabel>
          {!isSecondTime &&
            <DropdownMenuItem onClick={() => setShowHalfTimeDialog(true)}>
              ⌚ Media parte
            </DropdownMenuItem>
          }
          <DropdownMenuItem onClick={() => handlers.handlePauseMatch()}>
            ✋ Pausa excepcional
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowEndMatchDialog(true)}>
            📣 Fin del Partido
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
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

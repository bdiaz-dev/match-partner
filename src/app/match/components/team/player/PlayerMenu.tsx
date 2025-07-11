import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import usePlayerMenu from '@/app/hooks/usePlayerMenu'
import { useEffect, useState } from 'react'
// import useMatchStore from '@/app/match/stores/matchStore'
import useMatchStoreSelectors from '@/app/hooks/useMatchStoreSelectors'
// import DorsalForMenu from './DorsalForMenu'
import ChangeDialog from './ChangeDialog'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

export default function PlayerMenu({ dorsal }: { dorsal: number }) {

  const { handlersPlayer, player, } = usePlayerMenu(dorsal)
  const { matchTeam } = useMatchStoreSelectors()
  const [playerColor, setPlayerColor] = useState('bg-blue-800')
  const [showChangeDialog, setShowChangeDialog] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleChangeFromPlaying = () => {
    setShowChangeDialog(true)
    setIsDialogOpen(false)
  }

  const handleActionAndClose = (action: () => void) => {
    action()
    setIsDialogOpen(false)
  }

  useEffect(() => {

    const p = player(dorsal)
    const handlePlayerColor = () => {

      if (!p?.card) return 'bg-blue-800'
      if (p.card === 'yellow') return 'bg-yellow-500 text-black'
      if (p.card === 'red') return 'bg-red-600'
      return 'bg-blue-800'
    }

    const isInjured = ' border-red-400 border-2'
    const newColor = handlePlayerColor() + (p?.isInjured ? isInjured : '')
    setPlayerColor(newColor)

  }, [dorsal, player, matchTeam])

  if (player(dorsal)?.card === 'red') return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className={playerColor}>{dorsal}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuGroup>
          <DropdownMenuLabel className='font-bold  italic'>
            {player(dorsal)?.name + `(#${dorsal})` || 'Player ' + dorsal}
          </DropdownMenuLabel>
          {player(dorsal)?.isInjured &&
            <DropdownMenuLabel className='text-red-400'>
              Lesionado
            </DropdownMenuLabel>
          }
          <DropdownMenuLabel className='text-white font-bold bg-red-600'>
            Jugador expulsado
          </DropdownMenuLabel>

        </DropdownMenuGroup>

      </DropdownMenuContent>
    </DropdownMenu >
  )

  if (!player(dorsal)?.isPlaying) return (
    <>
      <Button
        onClick={() => setShowChangeDialog(true)}
        className={playerColor}
      >{dorsal}
      </Button>
      <ChangeDialog
        open={showChangeDialog}
        onCancel={() => setShowChangeDialog(false)}
        onOpenChange={() => setShowChangeDialog(false)}
        dorsal={dorsal}
      />
    </>
  )

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className={playerColor}>{dorsal}</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {player(dorsal)?.name + `(#${dorsal})` || 'Player ' + dorsal}
            </DialogTitle>
            {player(dorsal)?.isInjured &&
              <DialogTitle className='text-red-400'>
                Lesionado
              </DialogTitle>
            }
            <DialogDescription />
          </DialogHeader>
          <div className='flex flex-col gap-1'>

            <>
              <Button
                className='bg-green-800'
                onClick={() => handleActionAndClose(() => handlersPlayer.handleGoal({ dorsal, side: 'team' }))}
              >
                ⚽ GOL !!
              </Button>
              <DropdownMenuSeparator />

            </>

            <Button
              onClick={handleChangeFromPlaying}
              className='bg-blue-900'
            >
              🔄 Salir al banquillo
            </Button>



            {player(dorsal)?.isGoalKeeper &&
              <>
                <Button
                  onClick={() => handleActionAndClose(() => handlersPlayer.handleKeeperSave(dorsal))}
                >
                  🧤 Parada
                </Button>
              </>
            }

            <>
              <Button
                onClick={() => handleActionAndClose(() => handlersPlayer.handleShot(dorsal))}
              >
                🏹 Disparo
              </Button>
              <DropdownMenuSeparator />

              <DropdownMenuSeparator />
              <Button
                onClick={() => handleActionAndClose(() => handlersPlayer.handleInjury(dorsal))}
                className='bg-slate-700'
              >
                🤕 Lesión
              </Button>

              <Button
                onClick={() => handleActionAndClose(() => handlersPlayer.handleFoul(dorsal))}
                className='bg-slate-700'
              >
                🚫 Falta
              </Button>

              {player(dorsal)?.card !== 'yellow' ?
                <Button
                  onClick={() => handleActionAndClose(() => handlersPlayer.handleCard(dorsal, 'yellow'))}
                  className='bg-slate-700'
                >
                  🟨 Tarjeta Amarilla
                </Button>
                :
                <span className='text-black font-bold bg-yellow-500'>
                  Jugador amonestado
                </span>
              }
              <Button
                onClick={() => handleActionAndClose(() => handlersPlayer.handleCard(dorsal, 'red'))}
                className='bg-slate-700'
              >
                🟥 Tarjeta Roja
              </Button>
              <DropdownMenuSeparator />
            </>



          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant={'destructive'}>
                Cancelar
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ChangeDialog
        open={showChangeDialog}
        onCancel={() => setShowChangeDialog(false)}
        onOpenChange={() => setShowChangeDialog(false)}
        dorsal={dorsal}
      />
    </>
  )
}

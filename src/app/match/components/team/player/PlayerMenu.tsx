import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'

import usePlayerMenu from '@/app/hooks/playerMenu/usePlayerMenu'
import useMatchStoreSelectors from '@/app/hooks/data/useMatchStoreSelectors'
import SubstitutionDialog from '../../dialogs/SubstitutionDialog'
import RedToGoalKeeperDialog from '../../dialogs/RedToGoalKeeperDialog'
import DorsalForMenu from './DorsalForMenu'
import PlayerStopwatch from './PlayerStopwatch'

type DialogState = 'none' | 'change' | 'playerMenu' | 'redToGK'

export default function PlayerMenu({ dorsal }: { dorsal: number }) {
  const { handlersPlayer, player } = usePlayerMenu(dorsal)
  const { matchTeam } = useMatchStoreSelectors()
  const p = player(dorsal)  // evita repetir llamadas

  const [playerColor, setPlayerColor] = useState('bg-blue-800 rounded-full w-[36px] h-[36px]')
  const [dialogState, setDialogState] = useState<DialogState>('none')

  // Actualiza color según tarjeta / lesión
  useEffect(() => {
    const base = 'rounded-full w-[36px] h-[36px]'
    let color = 'bg-blue-800'
    if (p?.card === 'yellow') color = 'bg-yellow-500 text-black'
    if (p?.card === 'red') color = 'bg-red-600'
    const injured = p?.isInjured ? ' border-red-400 border-2' : ''
    setPlayerColor(`${color} ${base}${injured}`)
  }, [p, matchTeam])

  // Cierra cualquier diálogo y ejecuta acción
  const handleActionAndClose = (action: () => void) => {
    action()
    setDialogState('none')
  }

  // Render expulsado
  if (p?.card === 'red') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className={playerColor}>{dorsal}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start">
          <DropdownMenuGroup>
            <DropdownMenuLabel className="font-bold italic">
              {p.name ? `${p.name} (#${dorsal})` : `Player ${dorsal}`}
            </DropdownMenuLabel>
            {p.isInjured && (
              <DropdownMenuLabel className="text-red-400">Lesionado</DropdownMenuLabel>
            )}
            <DropdownMenuLabel className="text-white font-bold bg-red-600">
              Jugador expulsado
            </DropdownMenuLabel>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  // Render suplente
  if (!p?.isPlaying) {
    return (
      <>
        <Button className={playerColor} onClick={() => setDialogState('change')}>
          {dorsal}
        </Button>
        <SubstitutionDialog
          open={dialogState === 'change'}
          onCancel={() => setDialogState('none')}
          onOpenChange={() => setDialogState('none')}
          dorsal={dorsal}
        />
      </>
    )
  }

  // Items del menú
  const menuItems: Array<
    | { type: 'button'; label: string; callback: () => void; className?: string }
    | { type: 'separator' }
  > = [
      { type: 'button', label: '⚽ GOL !!', callback: () => handlersPlayer.handleGoal({ dorsal, side: 'team' }), className: 'bg-green-800' },
      { type: 'separator' },
      ...(p?.isGoalKeeper
        ? [{ type: 'button' as const, label: '🧤 Parada', callback: () => handlersPlayer.handleKeeperSave(dorsal) }]
        : []),
      { type: 'button', label: '🏹 Disparo', callback: () => handlersPlayer.handleShot(dorsal) },
      { type: 'button', label: '🔄 Salir al banquillo', callback: () => setDialogState('change'), className: 'bg-blue-900' },
      { type: 'separator' },
      { type: 'button', label: '🤕 Lesión', callback: () => handleActionAndClose(() => handlersPlayer.handleInjury(dorsal)), className: 'bg-slate-700' },
      { type: 'button', label: '🚫 Falta', callback: () => handleActionAndClose(() => handlersPlayer.handleFoul(dorsal)), className: 'bg-slate-700' },
      ...(!p?.card
        ? [{ type: 'button' as const, label: '🟨 Tarjeta Amarilla', callback: () => handleActionAndClose(() => handlersPlayer.handleCard(dorsal, 'yellow')), className: 'bg-slate-700' }]
        : []),
      {
        type: 'button',
        label: '🟥 Tarjeta Roja',
        callback: () => {
          if (p?.isGoalKeeper) {
            setDialogState('none')
            setTimeout(() => setDialogState('redToGK'), 100)
          } else {
            handleActionAndClose(() => handlersPlayer.handleCard(dorsal, 'red'))
          }
        },
        className: 'bg-slate-700',
      },
      {
        type: 'button',
        label: '⛔ Gol en propia',
        callback: () => handlersPlayer.handleGoal({ dorsal, side: 'team', isOwnGoal: true }),
        className: 'bg-slate-700',
      }
    ]

  // Render jugador en cancha
  return (
    <>
      <Dialog
        open={dialogState === 'playerMenu'}
        onOpenChange={(open) => !open && setDialogState('none')}
      >
        <DialogTrigger asChild>
          <Button className={playerColor} onClick={() => setDialogState('playerMenu')}>
            {dorsal}
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex justify-center items-center gap-2">
              <span>{DorsalForMenu(p)}</span>
              <span>{p.name || `Player ${dorsal}`}</span>
            </DialogTitle>
            {p.card === 'yellow' && (
              <span className="text-black font-bold bg-yellow-500">Amonestado</span>
            )}
            {p.isInjured && (
              <DialogTitle className="text-red-400">Lesionado</DialogTitle>
            )}
            <DialogDescription />
            <div className="flex justify-center gap-1">
              Tiempo Jugado <PlayerStopwatch dorsal={dorsal} />
            </div>
          </DialogHeader>

          <div className="flex flex-col gap-1">
            {menuItems.map((item, idx) =>
              item.type === 'separator' ? (
                <DropdownMenuSeparator key={`sep-${idx}`} />
              ) : (
                <Button
                  key={`btn-${idx}`}
                  className={item.className}
                  onClick={() => handleActionAndClose(item.callback)}
                >
                  {item.label}
                </Button>
              )
            )}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="destructive">Cancelar</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <SubstitutionDialog
        open={dialogState === 'change'}
        onCancel={() => setDialogState('none')}
        onOpenChange={() => setDialogState('none')}
        dorsal={dorsal}
      />

      <RedToGoalKeeperDialog
        open={dialogState === 'redToGK'}
        onCancel={() => setDialogState('none')}
        onOpenChange={() => setDialogState('none')}
        dorsal={dorsal}
      />
    </>
  )
}

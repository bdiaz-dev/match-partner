import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  // DropdownMenuPortal,
  DropdownMenuSeparator,
  // DropdownMenuSub,
  // DropdownMenuSubContent,
  // DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import usePlayerMenu from '@/app/hooks/playerMenu/usePlayerMenu'
import { useEffect, useState } from 'react'
// import useMatchStore from '@/app/match/stores/matchStore'
import useMatchStoreSelectors from '@/app/hooks/data/useMatchStoreSelectors'
// import DorsalForMenu from './DorsalForMenu'
// import ChangeDialog from './ChangeDialog'

export default function PlayerMenu({ dorsal }: { dorsal: number }) {

  const { handlersPlayer, player, } = usePlayerMenu(dorsal)
  const { matchTeam } = useMatchStoreSelectors()
  const [playerColor, setPlayerColor] = useState('bg-blue-800')
  // const [showChangeDialog, setShowChangeDialog] = useState(false)

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

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className={playerColor}>{dorsal}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start">
          <DropdownMenuLabel className='font-bold  italic'>
            {player(dorsal)?.name + `(#${dorsal})` || 'Player ' + dorsal}
          </DropdownMenuLabel>
          {player(dorsal)?.isInjured &&
            <DropdownMenuLabel className='text-red-400'>
              Lesionado
            </DropdownMenuLabel>
          }
          <DropdownMenuSeparator />
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {player(dorsal)?.isPlaying &&
              <>
                <DropdownMenuItem
                  onClick={() => handlersPlayer.handleGoal({ dorsal, side: 'team' })}
                >
                  ⚽ GOL !!
                </DropdownMenuItem>
                <DropdownMenuSeparator />

              </>
            }
            {player(dorsal)?.isGoalKeeper &&
              <>
                <DropdownMenuItem
                  onClick={() => handlersPlayer.handleKeeperSave(dorsal)}
                >
                  🧤 Parada
                </DropdownMenuItem>

              </>
            }

            {player(dorsal)?.isPlaying &&
              <>
                <DropdownMenuItem
                  onClick={() => handlersPlayer.handleShot(dorsal)}
                >
                  🏹 Disparo
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handlersPlayer.handleInjury(dorsal)}
                >
                  🤕 Lesión
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handlersPlayer.handleFoul(dorsal)}
                >
                  🚫 Falta
                </DropdownMenuItem>

                {player(dorsal)?.card !== 'yellow' ?
                  <DropdownMenuItem
                    onClick={() => handlersPlayer.handleCard(dorsal, 'yellow')}
                  >
                    🟨 Tarjeta Amarilla
                  </DropdownMenuItem>
                  :
                  <DropdownMenuLabel className='text-black font-bold bg-yellow-500'>
                    Jugador amonestado
                  </DropdownMenuLabel>
                }
                <DropdownMenuItem
                  onClick={() => handlersPlayer.handleCard(dorsal, 'red')}
                >
                  🟥 Tarjeta Roja
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            }

            {
              // player(dorsal)?.card !== 'red' ?
              //   <DropdownMenuSub>
              //     <DropdownMenuSubTrigger>
              //       {player(dorsal)?.isPlaying ? 'Salir al banquillo' : 'Entrar al campo'}
              //     </DropdownMenuSubTrigger>
              //     <DropdownMenuPortal>
              //       <DropdownMenuSubContent>
              //         <DropdownMenuLabel className='font-bold'>
              //           {'Elige el cambio'}
              //         </DropdownMenuLabel>

              //         {handlersPlayer.filterPlayersForSubstitution().map(p => (
              //           <DropdownMenuItem
              //             key={p.dorsal}
              //             onClick={() => handlersPlayer.toggleSubstitution(p.dorsal, dorsal)}
              //           >
              //             {DorsalForMenu(p)}{p.name} {p.isInjured && '🤕'} {p.card === 'yellow' && '🟨'}
              //             {/* (#{p.dorsal}) */}
              //           </DropdownMenuItem>
              //         ))}

              //       </DropdownMenuSubContent>
              //     </DropdownMenuPortal>
              //   </DropdownMenuSub>
              //   :
              //   <DropdownMenuLabel className='text-white font-bold bg-red-600'>
              //     Jugador expulsado
              //   </DropdownMenuLabel>
            }
            {/* {
              player(dorsal)?.card !== 'red' ?
                <DropdownMenuItem onClick={() => setShowChangeDialog(true)}>
                  {player(dorsal)?.isPlaying ? '🔄 Salir al banquillo' : '🔄 Entrar al campo'}
                </DropdownMenuItem>
                :
                <DropdownMenuLabel className='text-white font-bold bg-red-600'>
                  Jugador expulsado
                </DropdownMenuLabel>
            } */}

          </DropdownMenuGroup>

        </DropdownMenuContent>
      </DropdownMenu>
      {/* <ChangeDialog
        open={showChangeDialog}
        onCancel={() => setShowChangeDialog(false)}
        onOpenChange={() => setShowChangeDialog(false)}
        dorsal={dorsal}
      /> */}
    </>
  )
}

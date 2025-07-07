import useGeneralEvents from '@/app/hooks/useGeneralEvents';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuLabel } from '@/components/ui/dropdown-menu';

export default function GeneralEvents() {

  const { handlers } = useGeneralEvents()

  return (
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
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

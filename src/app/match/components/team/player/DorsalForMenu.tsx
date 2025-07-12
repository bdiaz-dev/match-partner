import { MatchPlayer } from '@/app/match/stores/matchStore';

export default function DorsalForMenu(player : MatchPlayer | undefined) {
  if (!player) return null
  const className = `
  ${player.isInjured && ' border-red-400 border-2'}
  ${player.card === 'yellow' ? ' bg-yellow-500 text-black' : ' bg-blue-800 text-white'}
  px-1 rounded-sm
  `

  return (
    <div
      className={className}
    >
      {player.dorsal}
    </div>
  )
}

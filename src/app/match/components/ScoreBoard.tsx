import useMatchStore from '../stores/matchStore'

export default function ScoreBoard() {
  const matchGoals = useMatchStore(state => state.goals)
  const teamName = 'San Lorenzo C.F.'
  const opponentName = 'Boca Juniors'
  const isHome = true // Example value, replace with actual logic
  
  const teamGoals = matchGoals.filter(goal => goal.side === 'team')
  const opponentGoals = matchGoals.filter(goal => goal.side === 'opponent')
  
  
  return (
    <div>
      <div className='flex flex-row items-center justify-center bg-gray-100 p-4 rounded-lg shadow-md mb-4'>
        <p className='text-2xl font-semibold'>
          {isHome ? teamName : opponentName} : ( {isHome ? teamGoals.length : opponentGoals.length} )
        </p>
        <span className='mx-4 text-xl font-bold'>VS</span>
        <p className='text-2xl font-semibold'>
          ( {!isHome ? teamGoals.length : opponentGoals.length} ) : {!isHome ? teamName : opponentName}
        </p>
      </div>
    </div>
  )
}

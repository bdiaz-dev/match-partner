import useMatchStore from '../../stores/matchStore'
import MatchStopwatch from '../stopwatch/MatchStopwatch'

export default function ScoreBoard() {
  const matchGoals = useMatchStore(state => state.goals)
  const teamName = 'San Lorenzo C.F.'
  const opponentName = 'Boca Juniors'
  const isHome = true // Example value, replace with actual logic

const teamGoals = matchGoals.filter(goal => 
  (goal.side === 'team' && !goal.isOwnGoal) || 
  (goal.side === 'opponent' && goal.isOwnGoal)
)
const opponentGoals = matchGoals.filter(goal => 
  (goal.side === 'opponent' && !goal.isOwnGoal) || 
  (goal.side === 'team' && goal.isOwnGoal)
)

  const Goals = (side: 'team' | 'opponent') => {
    const isTeam = side === 'team'
    const goals = isTeam ? teamGoals : opponentGoals
    return (
      <div className={`${isTeam ? 'bg-green-600' : 'bg-orange-600'} font-bold max-w-fit text-white px-2 py-1 rounded-lg`}>
        {goals.length}
      </div>
    )
  }

  return (
    <div className='flex flex-col items-center justify-center bg-gray-100 p-4 rounded-lg shadow-md mb-4 min-w-full sticky top-5 z-10'>
      <MatchStopwatch />
      <div className='flex flex-row items-center justify-center  min-w-full'>
        <div className='flex-2 basis-2/5 text-xl font-semibold flex items-center gap-3 justify-end'>
          <p className='text-center'>
            {isHome ? teamName : opponentName}
          </p>
          {Goals(isHome ? 'team' : 'opponent')}
        </div>
        <div className='flex-1 basis-1/6 p-2 rounded-full text-xl font-bold flex justify-center'>VS</div>
        <div className='flex-2 basis-2/5 text-xl font-semibold flex items-center gap-3 justify-start'>
          {Goals(isHome ? 'opponent' : 'team')}
          <p className='text-center'>
            {!isHome ? teamName : opponentName}
          </p>
        </div>
      </div>
    </div>
  )
}

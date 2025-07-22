'use client'

import { Button } from "@/components/ui/button"
import MatchTeam from './components/team/MatchTeam'
import useHasHydrated from '../hooks/data/useHasHydrated'
import { useRefreshStopwatchOnVisibility } from '../hooks/stopwatch/useRefreshStopwatchOnVisibility'
import ScoreBoard from './components/matchData/ScoreBoard'
import EventsList from './components/matchData/EventsList'
import GeneralEvents from './components/generalEvents/GeneralEvents'
import useMatchStoreSelectors from '../hooks/data/useMatchStoreSelectors'
import MatchStatistics from './components/matchData/MatchStatistics'


export default function Match() {

  const {
    isStarted,
    setIsStarted,
  } = useMatchStoreSelectors()

  const hasHydrated = useHasHydrated()

  useRefreshStopwatchOnVisibility()

  if (!hasHydrated) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen'>
        <span className="text-lg font-semibold">Cargando datos...</span>
      </div>
    )
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen min-w-full'>
      
      <ScoreBoard />
      
      {!isStarted &&
        (
          <Button className='mt-2 mb-2' onClick={() => setIsStarted(!isStarted)}>
            Start Match
          </Button>
        )
      }
      
      {
        isStarted &&
        <div className='flex flex-row items-center justify-center gap-2'>
          <GeneralEvents />
        </div>
      }

      <section className='flex flex-col items-center justify-center'>
        {isStarted && (
          <>
            <MatchTeam />
            <EventsList />
            <MatchStatistics />
          </>
        )
        }

      </section>

    </div>
  )
}

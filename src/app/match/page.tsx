'use client'

import { Button } from "@/components/ui/button"
import MatchTeam from './components/team/MatchTeam'
import useMatchStore from './stores/matchStore'
import MatchStopwatch from './components/MatchStopwatch'
import useHasHydrated from '../hooks/useHasHydrated'
import { useReloadOnVisibility } from '../hooks/useReloadOnVisibility'
// import usePlayerMenu from '../hooks/usePlayerMenu'
import ScoreBoard from './components/ScoreBoard'
import EventsList from './components/EventsList'
import GeneralEvents from './components/GeneralEvents'


export default function Match() {

  const isStarted = useMatchStore((state) => state.isStarted)
  const setIsStarted = useMatchStore((state) => state.setIsStarted)
  const isPaused = useMatchStore((state) => state.isPaused)
  const archiveMatch = useMatchStore((state) => state.archiveMatch)
  const startPause = useMatchStore((state) => state.startPause)
  const endPause = useMatchStore((state) => state.endPause)
  const hasHydrated  = useHasHydrated()
  // const {handleGoal} = usePlayerMenu(undefined) // Example usage, replace with actual dorsal

  


  
  useReloadOnVisibility()

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
      {/* <MatchStopwatch /> */}
      {isStarted ? (
        <>
          <Button className='mt-2 mb-2' onClick={() => archiveMatch()}>
            End Match
          </Button>
        </>
      )
        : (
          <Button className='mt-2 mb-2' onClick={() => setIsStarted(!isStarted)}>
            Start Match
          </Button>
        )
      }
      {
        isStarted &&
        <div className='flex flex-row items-center justify-center gap-2'>
          {
            isPaused ?
              <Button
                onClick={() => endPause()}
              >
                Resume
              </Button>
              :
              <Button
                onClick={() => startPause()}
              >
                Pause
              </Button>
          }
          <GeneralEvents />
          {/* <Button
            onClick={() => handleGoal({ dorsal: undefined, side: 'opponent' })}
            className='bg-red-600 text-white mt-2 mb-2'
          >
            Gol Rival
          </Button> */}
        </div>
      }
      <section className='flex flex-col items-center justify-center'>
        {isStarted && (
          <>
            <MatchTeam />
            <EventsList />
          </>
        )
        }

      </section>

    </div>
  )
}

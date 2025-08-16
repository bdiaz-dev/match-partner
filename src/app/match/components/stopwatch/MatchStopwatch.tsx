'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import useMatchStore from '../../stores/matchStore'
import BaseStopwatch from './BaseStopWatch'
import useMatchStoreSelectors from '@/app/hooks/data/useMatchStoreSelectors'
import { useMatchElapsedTime } from '@/app/hooks/stopwatch/useMatchElapsedTime'

export default function MatchStopwatch() {


  const {
    extraTimeFirstHalf,
    extraTimeSecondHalf,
    isExtraTime,
    isSecondHalf,
    startTime,
    setStartTime,
    isStarted,
    isPaused,
  } = useMatchStoreSelectors()

  const {
    elapsed,
  } = useMatchElapsedTime()

  const [hasHydrated, setHasHydrated] = useState(false)
  const [timestamp, setTimestamp] = useState<number | undefined>(undefined)


  useEffect(() => {
    // Verifica si el estado de hidratación ha cambiado
    const checkHydration = () => {
      const hydrated = useMatchStore.persist?.hasHydrated?.() ?? false
      if (hydrated !== hasHydrated) {
        setHasHydrated(hydrated)
      }
    }
    checkHydration()
  }, [hasHydrated])


  useEffect(() => {
    if (isStarted && !startTime) {
      const now = new Date().toISOString()
      setStartTime(now)
      toast('📣 Empieza el partido')
    }

    if (!isStarted && startTime) {
      toast('📣 Fin del partido')
    }
  }, [isStarted, startTime, setStartTime])


  useEffect(() => {
    
    if (!hasHydrated) return
    const timestamp = startTime ? (Date.now() - elapsed * 1000 ) : undefined
    // console.log(timestamp)
    setTimestamp(timestamp)
  }, [startTime, elapsed, hasHydrated, isPaused])

  if (!hasHydrated || timestamp === undefined) return null

  return (
    <>
      <div className={`flex flex-row items-center justify-center gap-4 w-full ${!isExtraTime && 'mb-2'}`}>
        <span className='font-bold text-2xl'>---------</span>
        <BaseStopwatch
          startTimestamp={timestamp}
          isRunning={isStarted && !isPaused}
          className={`text-3xl font-bold text-center ${isExtraTime ? 'text-amber-600' : 'text-gray-800'}`}
          isMatchStopwatch={true}
        />
        <span className='font-bold text-2xl'>---------</span>
      </div>
      {isExtraTime && (
        <span className="text-sm text-gray-500 mb-2">
          {`Tiempo Extra: ${isSecondHalf ? extraTimeSecondHalf : extraTimeFirstHalf} minutos`}
        </span>
      )}
    </>
  )
}

'use client'

import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import useMatchStore from '../stores/matchStore'
import BaseStopwatch from './BaseStopWatch'
import { getElapsedWithPauses } from '@/app/utils/getElapsedWithPauses'

export default function MatchStopwatch() {
  const startTime = useMatchStore(state => state.startTime)
  const setStartTime = useMatchStore(state => state.setStartTime)
  const isStarted = useMatchStore(state => state.isStarted)
  const isPaused = useMatchStore(state => state.isPaused)
  const pausePeriods = useMatchStore(state => state.pausePeriods)
  // const hasHydrated = useMatchStore.persist?.hasHydrated?.() ?? false
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
      toast('Match started')
    }

    if (!isStarted && startTime) {
      toast('Match ended')
    }
  }, [isStarted, startTime, setStartTime])


  // Calcula el tiempo jugado real descontando pausas
  const elapsed = useMemo(() => {
    if (!startTime) return 0
    return getElapsedWithPauses(startTime, pausePeriods).elapsed
  }, [startTime, pausePeriods])

  useEffect(() => {
    if (!hasHydrated) return
    // Calcula el timestamp inicial para el cronómetro visual
    const timestamp = startTime ? Date.now() - elapsed * 1000 : undefined
    setTimestamp(timestamp)
  }, [startTime, elapsed, hasHydrated])


  // console.log({
  //   startTime,
  //   elapsed,
  //   pausePeriods
  // })

  if (!hasHydrated || timestamp === undefined) return null

  return (
    <div className='flex flex-row items-center justify-center gap-4 w-full mb-2'>
      <span className='font-bold text-2xl'>---------</span>
      <BaseStopwatch
        startTimestamp={timestamp}
        isRunning={isStarted && !isPaused}
        className="text-4xl font-bold text-center text-gray-800"
      />
      <span className='font-bold text-2xl'>---------</span>
    </div>
  )
}

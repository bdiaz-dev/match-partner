import { useCallback, useEffect, useState } from "react"
import useMatchStoreSelectors from "../data/useMatchStoreSelectors"

export function useMatchElapsedTime() {

  const {
    startTime,
    pausePeriods,
    isSecondHalf,
    secondHalfStartTime,
    matchLongTime,
    isHalfTime
  } = useMatchStoreSelectors()

  const [elapsed, setElapsed] = useState(0)
  const [minutes, setMinutes] = useState('00')
  const [seconds, setSeconds] = useState('00')

  const calculateElapsed = useCallback(() => {

    if (!startTime) {
      setElapsed(0)
      setMinutes('00')
      setSeconds('00')
      return
    }

    const startTimeToUse = () => {
      if (isSecondHalf && secondHalfStartTime) {
        const startTimeInSecondHalf = new Date(secondHalfStartTime)
        startTimeInSecondHalf.setMinutes(new Date(secondHalfStartTime).getMinutes() - (matchLongTime / 2))
        return startTimeInSecondHalf.toISOString()
      }
      return startTime
    }

    const startTimeGetTime = new Date(startTimeToUse()).getTime()

    const now = Date.now()
    const elapsed = Math.floor((now - startTimeGetTime) / 1000)
    let pausedSeconds = 0

    for (const p of pausePeriods.filter(p => p.moment === (isSecondHalf ? 'secondHalf' : isHalfTime ? 'halfTime' : 'firstHalf'))) {
      const pauseStart = new Date(p.start).getTime()
      const pauseEnd = p.end ? new Date(p.end).getTime() : now
      // Solo cuenta pausas que ocurrieron después de startTime
      const startTimeToPauses = new Date(startTime).getTime()
      if (pauseEnd > startTimeToPauses) {
        const overlapStart = Math.max(startTimeToPauses, pauseStart)
        const overlapEnd = pauseEnd
        if (overlapEnd > overlapStart) {
          pausedSeconds += Math.floor((overlapEnd - overlapStart) / 1000)
        }
      }
    }
    const realElapsed = Math.max(0, elapsed - pausedSeconds)
    const pad = (num: number) => num.toString().padStart(2, '0')
    const minutes = pad(Math.floor(realElapsed / 60))
    const seconds = pad(realElapsed % 60)

    setElapsed(realElapsed)
    setMinutes(minutes)
    setSeconds(seconds)

  }, [startTime, pausePeriods, isSecondHalf, secondHalfStartTime, matchLongTime, isHalfTime])

  // Actualizar automáticamente cada segundo si hay startTime
  useEffect(() => {
    if (!startTime) return

    const interval = setInterval(calculateElapsed, 1000)
    calculateElapsed() // Llamada inicial

    return () => clearInterval(interval)
  }, [calculateElapsed, startTime])

  return {
    calculateElapsed,
    elapsed,
    minutes,
    seconds,
  }

}

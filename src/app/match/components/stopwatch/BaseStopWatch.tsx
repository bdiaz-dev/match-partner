'use client'

import { useEffect, useRef, useState } from 'react'
import useMatchStore from '../../stores/matchStore'
import useMatchStoreSelectors from '@/app/hooks/data/useMatchStoreSelectors'

interface BaseStopwatchProps {
  startTimestamp?: number
  isRunning: boolean
  className?: string
  isMatchStopwatch?: boolean
}

export default function BaseStopwatch({
  startTimestamp = 0,
  isRunning,
  className = '',
  isMatchStopwatch = false
}: BaseStopwatchProps) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const hasHydrated = useMatchStore.persist?.hasHydrated?.() ?? false;
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const {
    matchLongTime,
    setExtraTimeFirstHalf,
    setExtraTimeSecondHalf,
    isExtraTime,
    setIsExtraTime,
    isSecondHalf
  } = useMatchStoreSelectors()

  const computeElapsedSeconds = () => {
    return Math.floor((Date.now() - startTimestamp) / 1000)
  }



  useEffect(() => {

    const update = () => {
      // const diff = Math.floor((Date.now() - startTimestamp) / 1000)
      // setElapsedSeconds(diff)
      setElapsedSeconds(computeElapsedSeconds())
    }
    update()
    if (!isRunning || !startTimestamp) return

    intervalRef.current = setInterval(update, 1000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, startTimestamp])

  useEffect(() => {
    const handleSync = () => {
      setElapsedSeconds(computeElapsedSeconds())
    }

    if (!isRunning) return
    window.addEventListener('sync-clocks', handleSync)
    return () => {
      window.removeEventListener('sync-clocks', handleSync)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startTimestamp])


  const formatTime = (value: number, length: number = 2) =>
    String(value).padStart(length, '0')

  useEffect(() => {
    const minutes = Math.floor(elapsedSeconds / 60)
    const seconds = elapsedSeconds % 60
    setMinutes(minutes)
    setSeconds(seconds)
  }, [elapsedSeconds])

  useEffect(() => {
    if (isMatchStopwatch) {
      if (isSecondHalf && minutes >= matchLongTime) {
        setExtraTimeSecondHalf(minutes - matchLongTime)
        if (!isExtraTime) {
          setIsExtraTime(true)
          console.log('Inicia tiempo extra segunda mitad')
        }
      } else if (!isSecondHalf && minutes >= (matchLongTime/ 2)) {
        setExtraTimeFirstHalf(minutes - (matchLongTime / 2))
        if (!isExtraTime) {
          setIsExtraTime(true)
          console.log('Inicia tiempo extra primera mitad')
        }
      } else if (isExtraTime) {
        setIsExtraTime(false)
      }
    }
  }, [isMatchStopwatch, isSecondHalf, minutes, matchLongTime, setExtraTimeFirstHalf, setExtraTimeSecondHalf, isExtraTime, setIsExtraTime])



  if (!hasHydrated || startTimestamp === undefined) return null

  // console.log({
  //   minutes,
  //   seconds,
  // })

  return (
    <div>
      <h1 className={className}>
        {`${formatTime(minutes)}:${formatTime(seconds)}`}
      </h1>

    </div>
  )
}

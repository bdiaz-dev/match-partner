'use client'

import { useEffect, useCallback, useMemo, useState } from 'react'
import BaseStopwatch from '../../BaseStopWatch'
import useMatchStore from '../../../stores/matchStore'
import { getElapsedWithPauses } from '@/app/utils/getElapsedWithPauses'
import useMatchStoreSelectors from '@/app/hooks/useMatchStoreSelectors'

export default function PlayerStopwatch({ dorsal }: { dorsal: number }) {
  // const matchTeam = useMatchStore(state => state.matchTeam)
  // const setMatchTeam = useMatchStore(state => state.setMatchTeam)
  // const isStarted = useMatchStore(state => state.isStarted)
  // const isPaused = useMatchStore(state => state.isPaused)
  // const pausePeriods = useMatchStore(state => state.pausePeriods)
  const {matchTeam, setMatchTeam, isStarted, isPaused, pausePeriods} = useMatchStoreSelectors()
  const hasHydrated = useMatchStore.persist.hasHydrated();
  const [startTimestamp, setStartTimestamp] = useState<number | undefined>(undefined)

  const player = matchTeam?.find(p => p.dorsal === dorsal)

  const updatePlayer = useCallback(
    (data: Partial<typeof player>) => {
      if (!player || !matchTeam) return
      const updated = matchTeam.map(p =>
        p.dorsal === dorsal ? { ...p, ...data } : { ...p }
      )
      setMatchTeam(updated)
    },
    [player, matchTeam, setMatchTeam, dorsal]
  )

  // Entrar al campo
  useEffect(() => {
    // if (!hasHydrated) return;
    if (isStarted && player?.isPlaying && !player.lastStartTime) {
      updatePlayer({ lastStartTime: new Date().toISOString() })
    }
  }, [hasHydrated, isStarted, player?.isPlaying, player?.lastStartTime, updatePlayer])

  // Salir del campo → sumar tiempo jugado
  useEffect(() => {
    if (!player) return
    // if (!hasHydrated) return
    if (
      isStarted &&
      !player?.isPlaying &&
      player?.lastStartTime
    ) {
      const now = Date.now()
      const started = new Date(player.lastStartTime).getTime()
      const delta = Math.floor((now - started) / 1000)

      updatePlayer({
        playedTime: (player.playedTime || 0) + delta,
        lastStartTime: undefined
      })

    }
  }, [player, isStarted, player?.isPlaying, player?.lastStartTime, player?.playedTime, updatePlayer])



  // Tiempo jugado descontando pausas
  const currentTime = useMemo(() => {
    if (!player) return 0
    // Suma el tiempo jugado anterior y el actual (si está en juego)
    let extra = 0
    if (player.isPlaying && player.lastStartTime) {
      extra = getElapsedWithPauses(player.lastStartTime, pausePeriods).elapsed
    }
    return (player.playedTime || 0) + extra
  }, [player, pausePeriods])

  useEffect(() => {
    const startTimestamp = Date.now() - currentTime * 1000
    setStartTimestamp(startTimestamp)
  }, [currentTime, isPaused])
  

  if (!player) return null;

  return (
    <BaseStopwatch
      startTimestamp={startTimestamp}
      isRunning={player?.isPlaying && !isPaused}
      className="font-bold text-center text-gray-600"
    />
  )
}

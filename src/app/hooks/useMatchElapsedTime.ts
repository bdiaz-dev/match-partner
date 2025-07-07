// utils/useMatchElapsedTime.ts

import useMatchStore from '../match/stores/matchStore'

export function useMatchElapsedTime() {
  
  
  const startTime = useMatchStore(state => state.startTime)
  const isStarted = useMatchStore(state => state.isStarted)
  const pausePeriods = useMatchStore(state => state.pausePeriods)
  const pad = (num: number) => num.toString().padStart(2, '0')

  if (!isStarted || !startTime) return { minutes: 0, seconds: 0, elapsed: 0 }

  const now = Date.now()
  let elapsed = Math.floor((now - new Date(startTime).getTime()) / 1000)

  // Descontar los periodos de pausa
  let pausedSeconds = 0
  for (const p of pausePeriods) {
    const start = new Date(p.start).getTime()
    const end = p.end ? new Date(p.end).getTime() : now
    pausedSeconds += Math.floor((end - start) / 1000)
  }
  elapsed -= pausedSeconds

  const minutes = pad(Math.floor(elapsed / 60))
  const seconds = pad(elapsed % 60)
  
//   console.log({
//   now,
//   startTime,
//   elapsed,
//   pausePeriods
// })

  // console.log(`Elapsed time: ${minutes}:${seconds} (Total seconds: ${elapsed})`)

  return { minutes, seconds, elapsed }
}

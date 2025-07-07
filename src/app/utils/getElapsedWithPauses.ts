// utils/getElapsedWithPauses.ts
export function getElapsedWithPauses(
  startTime: string,
  pausePeriods: { start: string; end?: string }[],
  now: number = Date.now()
) {
  const elapsed = Math.floor((now - new Date(startTime).getTime()) / 1000)
  let pausedSeconds = 0

  for (const p of pausePeriods) {
    const pauseStart = new Date(p.start).getTime()
    const pauseEnd = p.end ? new Date(p.end).getTime() : now
    // Solo cuenta pausas que ocurrieron después de startTime
    if (pauseEnd > new Date(startTime).getTime()) {
      const overlapStart = Math.max(new Date(startTime).getTime(), pauseStart)
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

  return { elapsed: realElapsed, minutes, seconds }
}

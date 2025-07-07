'use client'

import { useEffect, useState } from 'react'
import useMatchStore from '../match/stores/matchStore'

export default function SyncStoreAcrossTabs() {
  const setStartTime = useMatchStore(state => state.setStartTime)
  const setIsStarted = useMatchStore(state => state.setIsStarted)
  const startTime = useMatchStore(state => state.startTime)
  const isStarted = useMatchStore(state => state.isStarted)

  // Para evitar el parpadeo, vamos a usar un estado para controlar cuando sincronizar
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'match-storage') {
        const newState = event.newValue ? JSON.parse(event.newValue).state : null
        if (newState) {
          // Solo sincronizamos si el estado ha cambiado, para evitar actualizaciones innecesarias
          if (newState.startTime !== startTime || newState.isStarted !== isStarted) {
            setStartTime(newState.startTime)
            setIsStarted(newState.isStarted)
          }
        }
      }
    }

    window.addEventListener('storage', handleStorage)

    // Inicia la sincronización solo después de que el componente se haya montado
    if (!initialized) {
      setInitialized(true)
      // Esto sincroniza el estado inicial al cargar la pestaña
      localStorage.setItem(
        'match-storage',
        JSON.stringify({ state: { startTime, isStarted } })
      )
    }

    return () => window.removeEventListener('storage', handleStorage)
  }, [startTime, isStarted, initialized, setStartTime, setIsStarted])

  return null
}

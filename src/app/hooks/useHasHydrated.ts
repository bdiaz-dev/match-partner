import { useEffect, useState } from 'react';
import useMatchStore from '../match/stores/matchStore';

export default function useHasHydrated() {
  // const hasHydrated = useMatchStore.persist?.hasHydrated?.() ?? false;
  const [hasHydrated, setHasHydrated] = useState(false);

  // Update hydration state when the store hydrates
  // useEffect(() => {

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


  //   if (hasHydrated) {
  //     setIsHydrated(true);
  //   }
  // }, [hasHydrated]);

  return hasHydrated;
}

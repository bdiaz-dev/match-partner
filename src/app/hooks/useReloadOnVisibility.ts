// hooks/useReloadOnVisibility.ts
import { useEffect } from "react"

export function useReloadOnVisibility() {
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        window.location.reload()
      }
    }

    document.addEventListener("visibilitychange", handleVisibility)
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility)
    }
  }, [])
}

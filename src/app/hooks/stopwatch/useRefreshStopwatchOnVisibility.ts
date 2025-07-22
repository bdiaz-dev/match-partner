import { useEffect } from "react"

export function useRefreshStopwatchOnVisibility() {
  useEffect(() => {
    const sync = () => {
      window.dispatchEvent(new Event("sync-clocks"))
    }

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        sync()
      }
    }

    window.addEventListener("focus", sync)
    document.addEventListener("visibilitychange", handleVisibility)

    return () => {
      window.removeEventListener("focus", sync)
      document.removeEventListener("visibilitychange", handleVisibility)
    }
  }, [])
}

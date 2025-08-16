
interface Handlers {
    handleGoal: (args: { dorsal: number | undefined; side: 'opponent' | 'team', isOwnGoal?: boolean }) => void;
    handleShot: () => void;
    handleCornerOpponent: () => void;
    handleOffsideOpponent: () => void;
    handleFoul: () => void;
    handleOpponentYellowCard: () => void;
    handleOpponentRedCard: () => void;
    handleCorner: () => void;
    handleOffside: () => void;
    handlePauseMatch: () => void;
}

export default function useGeneralEventButtons({
    handlers,
    setShowHalfTimeDialog,
    setShowEndMatchDialog,
    setShowPlayerSelectorForKeeperSave,
    isSecondHalf,
}: {
    handlers: Handlers;
    setShowHalfTimeDialog: (v: boolean) => void;
    setShowEndMatchDialog: (v: boolean) => void;
    setShowPlayerSelectorForKeeperSave: (v: boolean) => void;
    isSecondHalf: boolean;
}) {

    const opponentEventsButtons = [
        { label: '⚽ Gol Rival', callback: () => handlers.handleGoal({ dorsal: undefined, side: 'opponent' }) },
        { label: '🏹 Disparo Rival', callback: () => handlers.handleShot() },
        { label: '🏳️ Córner Rival', callback: () => handlers.handleCornerOpponent() },
        { label: '🚩 Fuera de Juego Rival', callback: () => handlers.handleOffsideOpponent() },
        { label: '🚫 Falta Rival', callback: () => handlers.handleFoul() },
        { label: '🟨 Tarjeta Amarilla Rival', callback: () => handlers.handleOpponentYellowCard() },
        { label: '🟥 Tarjeta Roja Rival', callback: () => handlers.handleOpponentRedCard() },
        { label: '🧤 Parada Rival', callback: () => setShowPlayerSelectorForKeeperSave(true) },
        { label: '⛔ Gol en propia rival', callback: () => handlers.handleGoal({ dorsal: undefined, side: 'opponent', isOwnGoal: true }) },
    ]

    const teamEventsButtons = [
        { label: '🏳️ Córner', callback: () => handlers.handleCorner() },
        { label: '🚩 Fuera de Juego', callback: () => handlers.handleOffside() },
    ]

    const matchEventButtons = [
        {
            label: '⌚ Media parte',
            condition: !isSecondHalf,
            callback: () => setShowHalfTimeDialog(true),
        },
        {
            label: '✋ Pausa excepcional',
            callback: () => handlers.handlePauseMatch(),
        },
        {
            label: '📣 Fin del Partido',
            callback: () => setShowEndMatchDialog(true),
        },
    ]

    return {
        opponentEventsButtons,
        teamEventsButtons,
        matchEventButtons,
    }
}

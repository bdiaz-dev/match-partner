'use client'

import React, { useCallback, useMemo, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { DropdownMenuLabel } from '@/components/ui/dropdown-menu'

import DorsalForMenu from '../team/player/DorsalForMenu'
import PlayerStopwatch from '../team/player/PlayerStopwatch'
import usePlayerMenu from '@/app/hooks/playerMenu/usePlayerMenu'
import { MatchPlayer } from '@/app/match/stores/matchStore'

/* -------------------- SUB-COMPONENTES FUERA (memo) -------------------- */

const GoalkeeperSelectionStep = React.memo(function GoalkeeperSelectionStep({
  players,
  onSelect,
}: {
  players: MatchPlayer[]
  onSelect: (p: MatchPlayer) => void
}) {
  const playingPlayers = useMemo(() => players.filter(p => p.isPlaying), [players])
  const benchPlayers = useMemo(() => players.filter(p => !p.isPlaying), [players])
  const classNamesForPlayersList = 'flex flex-col gap-1'

  return (
    <div className='max-h-150 overflow-y-auto custom-scrollbar'>
      <div className={classNamesForPlayersList}>
        <DropdownMenuLabel>Campo</DropdownMenuLabel>
        {playingPlayers.map(p => (
          <Button key={p.dorsal} onClick={() => onSelect(p)} size='lg'>
            {DorsalForMenu(p)}{p.name} {p.isInjured && '🤕'} {p.card === 'yellow' && '🟨'} -{' '}
            <PlayerStopwatch dorsal={p.dorsal} style='forChange' />
          </Button>
        ))}
      </div>

      <div className={classNamesForPlayersList}>
        <DropdownMenuLabel>Banquillo</DropdownMenuLabel>
        {benchPlayers.map(p => (
          <Button key={p.dorsal} onClick={() => onSelect(p)} size='lg'>
            {DorsalForMenu(p)}{p.name} {p.isInjured && '🤕'} {p.card === 'yellow' && '🟨'} -{' '}
            <PlayerStopwatch dorsal={p.dorsal} style='forChange' />
          </Button>
        ))}
      </div>
    </div>
  )
})

const PlayerRemovalStep = React.memo(function PlayerRemovalStep({
  playingPlayers,
  onRemove,
}: {
  playingPlayers: MatchPlayer[]
  onRemove: (p: MatchPlayer) => void
}) {
  const classNamesForPlayersList = 'flex flex-col gap-1'
  return (
    <div className='max-h-150 overflow-y-auto custom-scrollbar'>
      <div className={classNamesForPlayersList}>
        <DropdownMenuLabel>Elige quién sale del campo</DropdownMenuLabel>
        {playingPlayers.map(p => (
          <Button key={p.dorsal} onClick={() => onRemove(p)} size='lg'>
            {DorsalForMenu(p)}{p.name} {p.isInjured && '🤕'} {p.card === 'yellow' && '🟨'} -{' '}
            <PlayerStopwatch dorsal={p.dorsal} style='forChange' />
          </Button>
        ))}
      </div>
    </div>
  )
})

/* -------------------- COMPONENTE PRINCIPAL -------------------- */

interface ConfirmDeleteDialogProps {
  open: boolean
  onCancel: () => void
  onOpenChange: () => void
  dorsal: number
}

export default function RedToGoalKeeperDialog({
  open,
  onCancel,
  onOpenChange,
  dorsal
}: ConfirmDeleteDialogProps) {
  const { handlersPlayer, player } = usePlayerMenu(dorsal)
  const [selectedNewGoalkeeper, setSelectedNewGoalkeeper] = useState<MatchPlayer | null>(null)
  const [step, setStep] = useState<'selectGoalkeeper' | 'selectPlayerToRemove'>('selectGoalkeeper')

  const playersForGK = useMemo(
    () => handlersPlayer.filterPlayersForRedToGoalKeeper(),
    // Si handlersPlayer cambia de identidad a menudo, puedes extraer justo lo necesario
    [handlersPlayer]
  )
  const playingPlayersOnly = useMemo(
    () => playersForGK.filter(p => p.isPlaying),
    [playersForGK]
  )

  const resetDialog = useCallback(() => {
    setSelectedNewGoalkeeper(null)
    setStep('selectGoalkeeper')
  }, [])

  const handleCancel = useCallback(() => {
    onCancel()
    resetDialog()
  }, [onCancel, resetDialog])

  const completeSubstitution = useCallback((newGoalkeeper: MatchPlayer, playerToRemove: MatchPlayer | null) => {
    handlersPlayer.setAsGoalKeeper({
      dorsal: newGoalkeeper.dorsal,
      playerToRemove,
      playerToRedCard: player(dorsal) as MatchPlayer
    })
    onCancel()
    resetDialog()
  }, [handlersPlayer, player, dorsal, onCancel, resetDialog])

  const handleGoalkeeperSelection = useCallback((newGoalkeeper: MatchPlayer) => {
    setSelectedNewGoalkeeper(newGoalkeeper)
    if (newGoalkeeper.isPlaying) {
      completeSubstitution(newGoalkeeper, null)
    } else {
      setStep('selectPlayerToRemove')
    }
  }, [completeSubstitution])

  const dialogTitle = step === 'selectGoalkeeper'
    ? 'Debe haber un portero.'
    : 'Elige quién sale del campo'

  const dialogSubtitle = step === 'selectGoalkeeper'
    ? (
      <div className='flex flex-row justify-center gap-2'>
        <span>{DorsalForMenu(player(dorsal))}</span>
        <span>{player(dorsal)?.name || 'Player ' + dorsal}</span>
        <span>está expulsado</span>
      </div>
    )
    : (
      <div className='flex flex-row justify-center gap-2'>
        <span>{selectedNewGoalkeeper && DorsalForMenu(selectedNewGoalkeeper)}</span>
        <span>{selectedNewGoalkeeper?.name}</span>
        <span>será el nuevo portero</span>
      </div>
    )

  const dialogDescription = step === 'selectGoalkeeper'
    ? 'Han expulsado a tu portero. Elige un jugador para cubrir la portería. Si eliges un jugador del banquillo, deberás retirar alguno del campo.'
    : 'Como has elegido un jugador del banquillo, debes sacar a un jugador del campo para cumplir con la expulsión.'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='text-red-600 text-center'>{dialogTitle}</DialogTitle>
          <DialogTitle>{dialogSubtitle}</DialogTitle>
          <DialogDescription className='text-left'>{dialogDescription}</DialogDescription>
        </DialogHeader>

        {step === 'selectGoalkeeper' ? (
          <GoalkeeperSelectionStep
            players={playersForGK}
            onSelect={handleGoalkeeperSelection}
          />
        ) : (
          <PlayerRemovalStep
            playingPlayers={playingPlayersOnly}
            onRemove={(p) => completeSubstitution(selectedNewGoalkeeper!, p)}
          />
        )}

        <DialogFooter>
          {step === 'selectPlayerToRemove' && (
            <Button variant='outline' onClick={() => setStep('selectGoalkeeper')}>
              Atrás
            </Button>
          )}
          <Button variant='destructive' onClick={handleCancel}>
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

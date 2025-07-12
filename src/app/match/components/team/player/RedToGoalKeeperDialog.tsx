'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import DorsalForMenu from './DorsalForMenu'
import usePlayerMenu from '@/app/hooks/usePlayerMenu'
import { Button } from '@/components/ui/button'
import PlayerStopwatch from './PlayerStopwatch'
import { MatchPlayer } from '@/app/match/stores/matchStore'
import { DropdownMenuLabel } from '@/components/ui/dropdown-menu'
import { useState } from 'react'

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

  const handleGoalkeeperSelection = (newGoalkeeper: MatchPlayer) => {
    setSelectedNewGoalkeeper(newGoalkeeper)
    
    if (newGoalkeeper.isPlaying) {
      // Si el nuevo portero está jugando, completar directamente
      completeSubstitution(newGoalkeeper, null)
    } else {
      // Si está en el banquillo, pasar al siguiente paso
      setStep('selectPlayerToRemove')
    }
  }

  const completeSubstitution = (newGoalkeeper: MatchPlayer, playerToRemove: MatchPlayer | null) => {
    handlersPlayer.setAsGoalKeeper({
      dorsal: newGoalkeeper.dorsal,
      playerToRemove: playerToRemove,
      playerToRedCard: player(dorsal) as MatchPlayer
    })
    
    // Cerrar el diálogo
    onCancel()
    resetDialog()
  }

  const resetDialog = () => {
    setSelectedNewGoalkeeper(null)
    setStep('selectGoalkeeper')
  }

  const handleCancel = () => {
    onCancel()
    resetDialog()
  }

  const GoalkeeperSelectionStep = () => {
    const players = handlersPlayer.filterPlayersForRedToGoalKeeper()
    const playingPlayers = players.filter(p => p.isPlaying)
    const benchPlayers = players.filter(p => !p.isPlaying)
    const classNamesForPlayersList = 'flex flex-col gap-1'

    return (
      <div className='max-h-150 overflow-y-auto custom-scrollbar'>
        {/* Jugadores que están jugando */}
        <div className={classNamesForPlayersList}>
          <DropdownMenuLabel>Campo</DropdownMenuLabel>
          {playingPlayers.map(p => (
            <Button
              key={p.dorsal}
              onClick={() => handleGoalkeeperSelection(p)}
              size='lg'
            >
              {DorsalForMenu(p)}{p.name} {p.isInjured && '🤕'} {p.card === 'yellow' && '🟨'}
              -
              {<PlayerStopwatch dorsal={p.dorsal} style='forChange' />}
            </Button>
          ))}
        </div>

        {/* Jugadores que no están jugando */}
        <div className={classNamesForPlayersList}>
          <DropdownMenuLabel>Banquillo</DropdownMenuLabel>
          {benchPlayers.map(p => (
            <Button
              key={p.dorsal}
              onClick={() => handleGoalkeeperSelection(p)}
              size='lg'
            >
              {DorsalForMenu(p)}{p.name} {p.isInjured && '🤕'} {p.card === 'yellow' && '🟨'}
              -
              {<PlayerStopwatch dorsal={p.dorsal} style='forChange' />}
            </Button>
          ))}
        </div>
      </div>
    )
  }

  const PlayerRemovalStep = () => {
    const playingPlayers = handlersPlayer.filterPlayersForRedToGoalKeeper()
      .filter(p => p.isPlaying)
    const classNamesForPlayersList = 'flex flex-col gap-1'

    return (
      <div className='max-h-150 overflow-y-auto custom-scrollbar'>
        <div className={classNamesForPlayersList}>
          <DropdownMenuLabel>Elige quién sale del campo</DropdownMenuLabel>
          {playingPlayers.map(p => (
            <Button
              key={p.dorsal}
              onClick={() => completeSubstitution(selectedNewGoalkeeper!, p)}
              size='lg'
            >
              {DorsalForMenu(p)}{p.name} {p.isInjured && '🤕'} {p.card === 'yellow' && '🟨'}
              -
              {<PlayerStopwatch dorsal={p.dorsal} style='forChange' />}
            </Button>
          ))}
        </div>
      </div>
    )
  }

  const getDialogContent = () => {
    if (step === 'selectGoalkeeper') {
      return {
        title: 'Debe haber un portero.',
        subtitle: (
          <div className='flex flex-row justify-center gap-2'>
            <span>{DorsalForMenu(player(dorsal))}</span>
            <span>{player(dorsal)?.name || 'Player ' + dorsal}</span>
            <span>está expulsado</span>
          </div>
        ),
        description: 'Han expulsado a tu portero. Elige un jugador para cubrir la portería. Si eliges un jugador del banquillo, deberás retirar alguno del campo.',
        content: <GoalkeeperSelectionStep />
      }
    } else {
      return {
        title: 'Elige quién sale del campo',
        subtitle: (
          <div className='flex flex-row justify-center gap-2'>
            <span>{DorsalForMenu(selectedNewGoalkeeper!)}</span>
            <span>{selectedNewGoalkeeper!.name}</span>
            <span>será el nuevo portero</span>
          </div>
        ),
        description: 'Como has elegido un jugador del banquillo, debes sacar a un jugador del campo para cumplir con la expulsión.',
        content: <PlayerRemovalStep />
      }
    }
  }

  const dialogContent = getDialogContent()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='text-red-600 text-center'>
            {dialogContent.title}
          </DialogTitle>
          <DialogTitle>
            {dialogContent.subtitle}
          </DialogTitle>
          <DialogDescription className='text-left'>
            {dialogContent.description}
          </DialogDescription>
        </DialogHeader>

        {dialogContent.content}

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

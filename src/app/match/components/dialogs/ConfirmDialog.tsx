'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface ConfirmDeleteDialogProps {
  open: boolean
  onCancel: () => void
  onConfirm: () => void
  onOpenChange: () => void
  type: 'delete' | 'endMatch' | 'halfTime'
}

export default function ConfirmDialog({
  open,
  onCancel,
  onConfirm,
  onOpenChange,
  type
}: ConfirmDeleteDialogProps) {

  const text = {
    delete: {
      title: '¿Estás seguro de eliminar?',
      description: 'Esta acción no se puede deshacer. Se eliminará de forma permanente.'
    },
    endMatch: {
      title: '¿Fin del partido?',
      description: 'El partido terminará y no se podrá regresar.'
    },
    halfTime: {
      title: '¿Nos vamos al descanso?',
      description: 'La pausa y el evento registrado por este descanso no se pueden eliminar. Este evento es de un solo uso.'
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {text[type].title}
            </AlertDialogTitle>
          <AlertDialogDescription>
            {text[type].description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className='bg-red-700 text-white' onClick={onCancel}>No</AlertDialogCancel>
          <AlertDialogAction className='bg-green-900' onClick={onConfirm}>Sí</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog'

interface EventButton {
  label: string
  callback: () => void
  condition?: boolean
}

interface EventDialogProps {
  title: string
  triggerLabel: string
  buttons: EventButton[]
  destructiveCancel?: boolean
}

export default function EventsDialog({
  title,
  triggerLabel,
  buttons,
  destructiveCancel = true
}: EventDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className='bg-blue-800'>{triggerLabel}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <div className='flex flex-col gap-1'>
          {buttons.map((btn, index) =>
            btn.condition === false ? null : (
              <DialogClose asChild key={index}>
                <Button onClick={btn.callback}>{btn.label}</Button>
              </DialogClose>
            )
          )}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant={destructiveCancel ? 'destructive' : 'default'}>
              Cancelar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

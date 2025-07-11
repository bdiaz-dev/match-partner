// import { Button } from '@/components/ui/button';
import PlayerMenu from './PlayerMenu';
import PlayerStopwatch from './PlayerStopwatch';

export default function Player({ dorsal }: { dorsal: number }) {
  return (
    <div className='flex flex-row gap-2 items-center justify-center bg-slate-300 rounded-lg p-2'>
      <PlayerMenu dorsal={dorsal} />
      <PlayerStopwatch dorsal={dorsal} />
    </div>
  )
}

'use client'

import { useEffect } from 'react'
import useMatchStore, { MatchPlayer } from '../../stores/matchStore'
import Player from './player/Player'

export default function MatchTeam() {
  const matchTeam = useMatchStore(state => state.matchTeam)
  const setMatchTeam = useMatchStore(state => state.setMatchTeam)

  useEffect(() => {
    if (matchTeam?.length === 0) {
      const now = new Date().toISOString()
      const newMatchTeam = [
        { dorsal: 1, name: 'Juan Pérez', isPlaying: true, playedTime: 0, startPlayingTime: now, lastStartTime: now, isGoalKeeper: true, card: '' },
        { dorsal: 2, name: 'Carlos Gómez', isPlaying: true, playedTime: 0, startPlayingTime: now, lastStartTime: now, isGoalKeeper: false, card: '' },
        { dorsal: 3, name: 'Luis Fernández', isPlaying: true, playedTime: 0, startPlayingTime: now, lastStartTime: now, isGoalKeeper: false, card: '' },
        { dorsal: 4, name: 'Miguel Sánchez', isPlaying: true, playedTime: 0, startPlayingTime: now, lastStartTime: now, isGoalKeeper: false, card: '' },
        { dorsal: 5, name: 'Andrés Ramírez', isPlaying: true, playedTime: 0, startPlayingTime: now, lastStartTime: now, isGoalKeeper: false, card: '' },
        { dorsal: 6, name: 'Jorge Torres', isPlaying: true, playedTime: 0, startPlayingTime: now, lastStartTime: now, isGoalKeeper: false, card: '' },
        { dorsal: 7, name: 'Pedro Martínez', isPlaying: true, playedTime: 0, startPlayingTime: now, lastStartTime: now, isGoalKeeper: false, card: '' },
        { dorsal: 8, name: 'Diego López', isPlaying: true, playedTime: 0, startPlayingTime: now, lastStartTime: now, isGoalKeeper: false, card: '' },
        { dorsal: 9, name: 'Sergio Morales', isPlaying: true, playedTime: 0, startPlayingTime: now, lastStartTime: now, isGoalKeeper: false, card: '' },
        { dorsal: 10, name: 'Fernando Castillo', isPlaying: true, playedTime: 0, startPlayingTime: now, lastStartTime: now, isGoalKeeper: false, card: '' },
        { dorsal: 11, name: 'Ricardo Herrera', isPlaying: true, playedTime: 0, startPlayingTime: undefined, lastStartTime: undefined, isGoalKeeper: false, card: '' },
        { dorsal: 12, name: 'Héctor Vargas', isPlaying: false, playedTime: 0, startPlayingTime: undefined, lastStartTime: undefined, isGoalKeeper: false, card: '' },
        { dorsal: 13, name: 'Manuel Ortega', isPlaying: false, playedTime: 0, startPlayingTime: undefined, lastStartTime: undefined, isGoalKeeper: false, card: '' },
        { dorsal: 14, name: 'Adrián Ruiz', isPlaying: false, playedTime: 0, startPlayingTime: undefined, lastStartTime: undefined, isGoalKeeper: false, card: '' },
        { dorsal: 15, name: 'Pablo Mendoza', isPlaying: false, playedTime: 0, startPlayingTime: undefined, lastStartTime: undefined, isGoalKeeper: false, card: '' },
        { dorsal: 16, name: 'Tomás Silva', isPlaying: false, playedTime: 0, startPlayingTime: undefined, lastStartTime: undefined, isGoalKeeper: false, card: '' },
      ] as MatchPlayer[]
      setMatchTeam(newMatchTeam)
    }
  }, [matchTeam?.length, setMatchTeam])

  if (!matchTeam) return null

  const team = matchTeam.filter(player => player.isPlaying)
  const bench = matchTeam.filter(player => !player.isPlaying)

  const goalKeeper = team.find(player => player.isGoalKeeper)
  const fieldPlayers = team.filter(player => !player.isGoalKeeper)

  return (
    <div className='flex flex-col items-center justify-center max-w-100 gap-2 flex-wrap mt-4 mb-4'>
      <h2 className='text-2xl font-bold text-gray-800'>Campo</h2>

      <div
        className='w-full h-full bg-[url(/field.svg)] bg-cover bg-center rounded'
      >
      {/* Portero separado arriba */}
      {goalKeeper && (
        <div className='flex flex-col items-center mb-4'>
          {/* <p className='text-sm font-semibold text-blue-800'>Portero</p> */}
          <Player dorsal={goalKeeper.dorsal} />
        </div>
      )}

      {/* Jugadores de campo */}
      <div className='flex items-center justify-center max-w-100 gap-4 flex-wrap mt-4 mb-4'>
        {fieldPlayers.map(player => (
          <div key={player.dorsal} className='flex flex-col items-center'>
            <Player dorsal={player.dorsal} />
          </div>
        ))}
      </div>

      </div>


      {/* Banquillo */}
      <div className='flex flex-col items-center justify-center max-w-100 gap-4 flex-wrap mt-4 mb-4'>
        <h2 className='text-2xl font-bold text-gray-800'>Banquillo</h2>
        <div className='bg-blue-300 rounded'>

        <div className='flex items-center justify-center gap-2 flex-wrap mt-4 mb-4'>
          {bench.map(player => (
            <div key={player.dorsal} className='flex flex-col items-center'>
              <Player dorsal={player.dorsal} />
            </div>
          ))}

          </div>
        </div>
      </div>
    </div>
  )
}

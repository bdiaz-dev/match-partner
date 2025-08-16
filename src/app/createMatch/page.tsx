'use client'

import { useState } from 'react'
import { MatchPlayer } from "../match/stores/matchStore"

export default function CreateMatch() {
  const [selectedTeam, setSelectedTeam] = useState<string>('')
  const [duration, setDuration] = useState<string>('')
  const [opponentName, setOpponentName] = useState<string>('')
  const [isHomeMatch, setIsHomeMatch] = useState<boolean>(true)

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

  const teamsList = [
    { id: '1', name: 'San Lorenzo C.F.', players: newMatchTeam },
  ]

  const durationOptions = [
    { value: '50', label: '50 minutos' },
    { value: '60', label: '60 minutos' },
    { value: '70', label: '70 minutos' },
    { value: '80', label: '80 minutos' },
    { value: '90', label: '90 minutos' },
  ]

  const handleCreateMatch = () => {
    if (!selectedTeam || !duration || !opponentName.trim()) {
      alert('Por favor, completa todos los campos obligatorios')
      return
    }

    const selectedTeamData = teamsList.find(team => team.id === selectedTeam)
    
    const matchData = {
      team: selectedTeamData,
      duration: parseInt(duration),
      opponentName: opponentName.trim(),
      isHomeMatch,
      createdAt: new Date().toISOString()
    }

    console.log('Nuevo partido creado:', matchData)
    // Aquí puedes agregar la lógica para crear el partido
    // Por ejemplo, navegar a la página del partido o guardarlo en el store
  }

  const isFormValid = selectedTeam && duration && opponentName.trim()

  return (
    <div className='flex flex-col items-center justify-center min-h-screen p-5 bg-gray-50'>
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Crear Partido</h1>
          <p className="text-gray-600 mt-2">Configura los detalles del nuevo partido</p>
        </div>

        <div className="space-y-6">
          {/* Selección de equipo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Equipo *
            </label>
            <select 
              value={selectedTeam} 
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Selecciona tu equipo</option>
              {teamsList.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>

          {/* Duración del partido */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duración del partido *
            </label>
            <select 
              value={duration} 
              onChange={(e) => setDuration(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Selecciona la duración</option>
              {durationOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Nombre del equipo rival */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Equipo rival *
            </label>
            <input
              type="text"
              placeholder="Nombre del equipo rival"
              value={opponentName}
              onChange={(e) => setOpponentName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Local o visitante */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              {isHomeMatch ? 'Partido en casa' : 'Partido de visitante'}
            </label>
            <button
              type="button"
              onClick={() => setIsHomeMatch(!isHomeMatch)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                isHomeMatch ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isHomeMatch ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Resumen */}
          <div className="pt-4 border-t border-gray-200">
            <h3 className="font-medium text-gray-800 mb-2">Resumen:</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Equipo:</strong> {selectedTeam ? teamsList.find(t => t.id === selectedTeam)?.name : 'Sin seleccionar'}</p>
              <p><strong>Duración:</strong> {duration ? `${duration} minutos` : 'Sin seleccionar'}</p>
              <p><strong>Rival:</strong> {opponentName || 'Sin especificar'}</p>
              <p><strong>Modalidad:</strong> {isHomeMatch ? 'Local' : 'Visitante'}</p>
            </div>
          </div>

          {/* Botón crear partido */}
          <button 
            onClick={handleCreateMatch}
            disabled={!isFormValid}
            className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
              isFormValid
                ? 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Crear Partido
          </button>
        </div>
      </div>
    </div>
  )
}
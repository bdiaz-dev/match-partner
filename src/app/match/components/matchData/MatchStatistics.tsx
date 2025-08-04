import useMatchStoreSelectors from '@/app/hooks/data/useMatchStoreSelectors'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { BarChart3 } from 'lucide-react'

interface StatBarProps {
  label: string
  teamValue: number
  opponentValue: number
  teamColor?: string
  opponentColor?: string
}

const StatBar = ({ label, teamValue, opponentValue, teamColor = 'bg-green-700', opponentColor = 'bg-orange-700' }: StatBarProps) => {
  const total = teamValue + opponentValue
  const teamPercentage = total > 0 ? (teamValue / total) * 100 : 0
  const opponentPercentage = total > 0 ? (opponentValue / total) * 100 : 0

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-white bg-green-800 rounded-full w-8 h-8 flex items-center justify-center">
          {teamValue}
        </span>
        <span className="text-sm font-medium text-gray-800">{label}</span>
        <span className="text-sm font-medium text-white bg-orange-800 rounded-full w-8 h-8 flex items-center justify-center">
          {opponentValue}
        </span>
      </div>
      <div className="flex h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`${teamColor} h-full`}
          style={{ width: `${teamPercentage}%` }}
        />
        <div
          className={`${opponentColor} h-full`}
          style={{ width: `${opponentPercentage}%` }}
        />
      </div>
    </div>
  )
}

interface ShotsBreakdownProps {
  teamOnTarget: number
  teamOffTarget: number
  opponentOnTarget: number
  opponentOffTarget: number
}

const ShotsBreakdown = ({ teamOnTarget, teamOffTarget, opponentOnTarget, opponentOffTarget }: ShotsBreakdownProps) => {
  return (
    <div className="space-y-0">
      <StatBar
        label="Tiros a puerta"
        teamValue={teamOnTarget}
        opponentValue={opponentOnTarget}
      />
      <StatBar
        label="Tiros fuera"
        teamValue={teamOffTarget}
        opponentValue={opponentOffTarget}
      />
    </div>
  )
}

const MatchStatistics = () => {
  const {
    events,
    goals,
  } = useMatchStoreSelectors()

  // Calcular estadísticas basadas en los datos reales del partido
  const calculateStats = () => {
    // Goles que resultaron de tiros reales (sin goles en propia de ningún equipo)
    const teamShotGoals = goals.filter(g => g.side === 'team' && !g.isOwnGoal).length
    const opponentShotGoals = goals.filter(g => g.side === 'opponent' && !g.isOwnGoal).length

    // Goles totales para el resultado (incluyendo beneficios de goles en propia)
    const teamTotalGoals = goals.filter(g => 
      (g.side === 'team' && !g.isOwnGoal) || 
      (g.side === 'opponent' && g.isOwnGoal)
    ).length
    const opponentTotalGoals = goals.filter(g => 
      (g.side === 'opponent' && !g.isOwnGoal) || 
      (g.side === 'team' && g.isOwnGoal)
    ).length

    // Goles en propia puerta
    const teamOwnGoals = goals.filter(g => g.side === 'team' && g.isOwnGoal).length
    const opponentOwnGoals = goals.filter(g => g.side === 'opponent' && g.isOwnGoal).length

    // Faltas - eventos con playerName son nuestros
    const teamFouls = events.filter(e => e.type === 'foul' && e.playerName).length
    const opponentFouls = events.filter(e => e.type === 'foul' && !e.playerName).length

    // Tarjetas amarillas
    const teamYellowCards = events.filter(e => e.type === 'card' && e.playerName).length
    const opponentYellowCards = events.filter(e => e.type === 'card' && !e.playerName).length

    // Tarjetas rojas
    const teamRedCards = events.filter(e => e.type === 'redCard' && e.playerName).length
    const opponentRedCards = events.filter(e => e.type === 'redCard' && !e.playerName).length

    // Paradas del portero - las paradas nuestras son tiros a puerta rivales
    const teamSaves = events.filter(e => e.type === 'keeperSave' && e.playerName).length
    const opponentSaves = events.filter(e => e.type === 'keeperSave' && !e.playerName).length

    // Tiros (disparos fuera de la portería)
    const teamShots = events.filter(e => e.type === 'shot' && e.playerName).length
    const opponentShots = events.filter(e => e.type === 'shot' && !e.playerName).length

    // Corners
    const teamCorners = events.filter(e => e.type === 'corner' && e.side !== 'opponent').length
    const opponentCorners = events.filter(e => e.type === 'corner' && e.side === 'opponent').length

    // Offsides
    const teamOffsides = events.filter(e => e.type === 'offside' && e.side !== 'opponent').length
    const opponentOffsides = events.filter(e => e.type === 'offside' && e.side === 'opponent').length

    return {
      teamTotalGoals,
      opponentTotalGoals,
      teamShotGoals,
      opponentShotGoals,
      teamOwnGoals,
      opponentOwnGoals,
      teamFouls,
      opponentFouls,
      teamYellowCards,
      opponentYellowCards,
      teamRedCards,
      opponentRedCards,
      teamSaves,
      opponentSaves,
      teamShots,
      opponentShots,
      teamCorners,
      opponentCorners,
      teamOffsides,
      opponentOffsides
    }
  }

  const stats = calculateStats()

  return (
    <Dialog>
      <DialogTrigger asChild className='fixed bottom-4 right-4'>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <BarChart3 size={18} />
          {/* Estadísticas */}
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-[90vw] mx-auto bg-white text-gray-800 border-gray-300 max-h-[70vh] overflow-y-auto custom-scrollbar">
        <DialogHeader>
          <DialogTitle className="text-center text-gray-800">
            Estadísticas del Partido
          </DialogTitle>
        </DialogHeader>

        <DropdownMenuSeparator />

        <div className="space-y-6">
          {/* Resultado */}
          <div>
            <h3 className="text-center text-sm font-bold text-gray-600 mb-4">RESULTADO</h3>
            <StatBar
              label="Goles"
              teamValue={stats.teamTotalGoals}
              opponentValue={stats.opponentTotalGoals}
            />
          </div>

          <DropdownMenuSeparator />

          {/* Generales */}
          <div>
            <h3 className="text-center text-sm font-bold text-gray-600 mb-4">GENERALES</h3>
            <StatBar
              label="Saques de esquina"
              teamValue={stats.teamCorners}
              opponentValue={stats.opponentCorners}
            />
            <StatBar
              label="Fueras de juego"
              teamValue={stats.teamOffsides}
              opponentValue={stats.opponentOffsides}
            />
          </div>

          <DropdownMenuSeparator />

          {/* Ataque */}
          <div>
            <h3 className="text-center text-sm font-bold text-gray-600 mb-4">ATAQUE</h3>
            <StatBar
              label="Tiros totales"
              teamValue={stats.teamShots + stats.opponentSaves + stats.teamShotGoals}
              opponentValue={stats.opponentShots + stats.teamSaves + stats.opponentShotGoals}
            />
            <ShotsBreakdown
              teamOnTarget={stats.opponentSaves + stats.teamShotGoals}
              teamOffTarget={stats.teamShots}
              opponentOnTarget={stats.teamSaves + stats.opponentShotGoals}
              opponentOffTarget={stats.opponentShots}
            />
          </div>

          <DropdownMenuSeparator />

          {/* Defensa */}
          <div>
            <h3 className="text-center text-sm font-bold text-gray-600 mb-4">DEFENSA</h3>
            <StatBar
              label="Paradas del portero"
              teamValue={stats.teamSaves}
              opponentValue={stats.opponentSaves}
            />
          </div>

          <DropdownMenuSeparator />

          {/* Disciplina */}
          <div>
            <h3 className="text-center text-sm font-bold text-gray-600 mb-4">DISCIPLINA</h3>
            <StatBar
              label="Faltas"
              teamValue={stats.teamFouls}
              opponentValue={stats.opponentFouls}
            />
            <StatBar
              label="Tarjetas amarillas"
              teamValue={stats.teamYellowCards}
              opponentValue={stats.opponentYellowCards}
            />
            <StatBar
              label="Tarjetas rojas"
              teamValue={stats.teamRedCards}
              opponentValue={stats.opponentRedCards}
            />
          </div>

          <DropdownMenuSeparator />

          {/* Errores */}
          <div>
            <h3 className="text-center text-sm font-bold text-gray-600 mb-4">ERRORES</h3>
            <StatBar
              label="Goles en propia"
              teamValue={stats.teamOwnGoals}
              opponentValue={stats.opponentOwnGoals}
              // teamColor="bg-red-600"
              // opponentColor="bg-red-500"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default MatchStatistics
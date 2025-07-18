// // import Match from '../match/page'
// import { GoalItem, MatchEvent, MatchPlayer } from '../match/stores/matchStore'
// import { getElapsedWithPauses } from '../utils/getElapsedWithPauses'
// import useMatchStoreSelectors from './useMatchStoreSelectors'

// export default function usePlayerMenu(dorsal: number | undefined) {
//   const {
//     matchTeam,
//     setMatchTeam,
//     events,
//     setEvents,
//     goals,
//     setGoals,
//     pausePeriods,
//     startTime
//   } = useMatchStoreSelectors()

//   // Función auxiliar para encontrar un jugador por dorsal
//   const player = (dorsalToFind: number) => matchTeam?.find(player => player.dorsal === dorsalToFind)

//   // Función auxiliar para crear y añadir un evento
//   function addEvent(event: Omit<MatchEvent, 'id' | 'time'> & { id?: string, time?: string }) {
//     if (!startTime) return
//     const { minutes, seconds } = getElapsedWithPauses(startTime, pausePeriods)
//     const id = event.id ?? `${event.type}-${minutes}-${seconds}`
//     const time = event.time ?? `${minutes} : ${seconds}`
//     const newEvent: MatchEvent = { ...event, id, time }
//     setEvents([newEvent, ...events])
//   }

//   const handleGoal = ({ dorsal, side }: { dorsal: number | undefined, side: 'team' | 'opponent' }) => {
//     if (!matchTeam || !startTime) return
//     const { minutes, seconds } = getElapsedWithPauses(startTime, pausePeriods)
//     const idForGoal = `goal-${side}-${minutes}-${seconds}`

//     // error por no poner dorsal en gol del equipo
//     if (!dorsal && side === 'team') {
//       console.error('Dorsal is required to handle goal')
//       return

//       // gol rival
//     } else if (!dorsal && side === 'opponent') {
//       setGoals([
//         ...goals,
//         {
//           time: `${minutes} : ${seconds}`,
//           side,
//           id: idForGoal
//         }
//       ])
//       addEvent({
//         title: '⚽ Gol rival',
//         type: 'goal',
//         id: idForGoal
//       })
//       return

//       // gol del equipo
//     } else if (dorsal && side === 'team') {
//       const goalPlayer = player(dorsal)
//       if (!goalPlayer) {
//         console.error(`Player with dorsal ${dorsal} not found`)
//         return
//       }
//       const newGoal: GoalItem = {
//         playerName: goalPlayer.name,
//         playerDorsal: dorsal,
//         time: `${minutes} : ${seconds}`,
//         side,
//         id: idForGoal
//       }
//       setGoals([...goals, newGoal])
//       addEvent({
//         title: '⚽ Gol equipo',
//         type: 'goal',
//         playerName: goalPlayer.name,
//         playerDorsal: dorsal,
//         id: idForGoal
//       })
//     }
//   }

//   const togglePlayerStatus = (dorsal: number) => {
//     if (!matchTeam || !startTime) return

//     const updatedTeam = matchTeam.map((player) => {
//       if (player.dorsal === dorsal) {
//         const isEntering = !player.isPlaying
//         return {
//           ...player,
//           isPlaying: isEntering,
//           startPlayingTime: isEntering ? new Date().toISOString() : undefined
//         }
//       }
//       return player
//     })

//     const playerObj = updatedTeam.find(player => player.dorsal === dorsal)
//     addEvent({
//       title: playerObj?.isPlaying ? 'Entra al campo' : 'Sale del campo',
//       type: 'changeStatus',
//       playerName: playerObj?.name || 'Desconocido',
//       playerDorsal: dorsal
//     })
//     setMatchTeam(updatedTeam)
//   }

// const setAsGoalKeeper = ({ dorsal, playerToRemove, playerToRedCard }: {
//   dorsal: number,
//   playerToRemove: MatchPlayer | null,
//   playerToRedCard: MatchPlayer | null
// }) => {
//   if (!matchTeam || !startTime) return

//   const newGoalkeeper = player(dorsal)
  
//   const updatedTeam = matchTeam.map((player) => {
//     // 1. Nuevo portero
//     if (player.dorsal === dorsal) {
//       if (player.isPlaying) {
//         // Ya está jugando, solo cambiar a portero
//         return {
//           ...player,
//           isGoalKeeper: true,
//         }
//       } else {
//         // Está en banquillo, entra a jugar como portero
//         return {
//           ...player,
//           isGoalKeeper: true,
//           isPlaying: true,
//           startPlayingTime: new Date().toISOString(),
//         }
//       }
//     }

//     // 2. Portero que recibe tarjeta roja
//     if (playerToRedCard && player.dorsal === playerToRedCard.dorsal) {
//       return {
//         ...player,
//         card: 'red' as const,
//         isGoalKeeper: false,
//         isPlaying: false,
//       }
//     }

//     // 3. Jugador que debe salir del campo (si aplica)
//     if (playerToRemove && player.dorsal === playerToRemove.dorsal) {
//       return {
//         ...player,
//         isPlaying: false,
//       }
//     }

//     // 4. Resto de jugadores: quitar isGoalKeeper si lo tenían
//     return {
//       ...player,
//       isGoalKeeper: false
//     }
//   })

//   // Generar todos los eventos de una vez
//   const eventsToAdd: (Omit<MatchEvent, 'id' | 'time'> & { id?: string, time?: string })[] = []
  
//   // 1. Evento de tarjeta roja al portero expulsado
//   if (playerToRedCard) {
//     eventsToAdd.push({
//       title: '🟥 Tj. Roja',
//       type: 'redCard',
//       playerName: playerToRedCard.name,
//       playerDorsal: playerToRedCard.dorsal,
//       unremovable: true
//     })
//   }

//   // 2. Evento del nuevo portero
//   if (newGoalkeeper) {
//     if (!newGoalkeeper.isPlaying) {
//       // Si entra desde el banquillo
//       eventsToAdd.push({
//         title: '🥅 Nuevo portero (entra)',
//         type: 'changeStatus',
//         playerName: newGoalkeeper.name,
//         playerDorsal: dorsal,
//         unremovable: true
//       })
//     } else {
//       // Si ya estaba jugando, solo cambio de posición
//       eventsToAdd.push({
//         title: '🥅 Nuevo portero',
//         type: 'changeStatus',
//         playerName: newGoalkeeper.name,
//         playerDorsal: dorsal,
//         unremovable: true
//       })
//     }
//   }

//   // 3. Evento del jugador que sale (si aplica)
//   if (playerToRemove) {
//     eventsToAdd.push({
//       title: '🔚 Sale del campo',
//       type: 'changeStatus',
//       playerName: playerToRemove.name,
//       playerDorsal: playerToRemove.dorsal,
//       unremovable: true
//     })
//   }

//   // Añadir todos los eventos de una vez
//   if (eventsToAdd.length > 0) {
//     const { minutes, seconds } = getElapsedWithPauses(startTime, pausePeriods)
//     const processedEvents = eventsToAdd.map((event, index) => {
//       const id = event.id ?? `${event.type}-${minutes}-${seconds}-${index}`
//       const time = event.time ?? `${minutes} : ${seconds}`
//       return { ...event, id, time }
//     })
    
//     setEvents([...processedEvents, ...events])
//   }

//   setMatchTeam(updatedTeam)
// }

//   const toggleSubstitution = (dorsal1: number, dorsal2: number) => {
//     if (!matchTeam || !startTime) return

//     // Verifica si alguno de los dos dorsales es portero
//     const isSomeOneGoalKeeper =
//       matchTeam.some(player =>
//         (player.dorsal === dorsal1 || player.dorsal === dorsal2) && player.isGoalKeeper
//       )

//     // Actualiza el estado de los jugadores
//     const updatedTeam = matchTeam.map((player) => {
//       if (player.dorsal === dorsal1 || player.dorsal === dorsal2) {
//         const isEntering = !player.isPlaying
//         return {
//           ...player,
//           isPlaying: isEntering,
//           startPlayingTime: isEntering ? new Date().toISOString() : undefined,
//           isGoalKeeper: isSomeOneGoalKeeper && !player.isGoalKeeper
//         }
//       }
//       return player
//     })

//     const player1 = player(dorsal1)
//     const player2 = player(dorsal2)

//     addEvent({
//       title: '🔄 Cambio de jugador',
//       type: 'substitution',
//       playersOnSubstitution: [
//         {
//           name: player1?.name || 'Desconocido',
//           dorsal: dorsal1,
//           isEntering: !player1?.isPlaying
//         },
//         {
//           name: player2?.name || 'Desconocido',
//           dorsal: dorsal2,
//           isEntering: !player2?.isPlaying
//         }
//       ]
//     })

//     setMatchTeam(updatedTeam)
//   }

//   const filterPlayersForSubstitution = () => {
//     if (!matchTeam || dorsal === undefined) return []
//     const bool = player(dorsal)?.isPlaying ? false : true
//     return matchTeam?.filter(p => p.dorsal !== dorsal && p.isPlaying === bool && p.card !== 'red') || []
//   }
//   const filterPlayersForRedToGoalKeeper = () => {
//     if (!matchTeam || dorsal === undefined) return []
//     // const bool = player(dorsal)?.isPlaying ? false : true
//     return matchTeam?.filter(p => p.dorsal !== dorsal && p.card !== 'red') || []
//   }

//   const handleKeeperSave = (dorsal: number) => {
//     if (!matchTeam || !startTime) return
//     const keeperSave = player(dorsal)
//     addEvent({
//       title: '🧤 Parada del portero',
//       playerName: keeperSave?.name || 'Desconocido',
//       playerDorsal: dorsal,
//       type: 'keeperSave'
//     })
//   }

//   const handleFoul = (dorsal: number) => {
//     if (!matchTeam || !startTime) return
//     const fouler = player(dorsal)
//     addEvent({
//       title: '🚫 Falta',
//       type: 'foul',
//       playerName: fouler?.name || 'Desconocido',
//       playerDorsal: dorsal
//     })
//   }

//   const toggleCard = (dorsal: number, cardType: 'yellow' | 'red') => {
//     if (!matchTeam || !startTime) return
//     const updatedTeam = matchTeam.map((player) => {
//       if (player.dorsal === dorsal) {
//         return {
//           ...player,
//           card: cardType,
//           // Si es tarjeta roja, se asume que el jugador sale del campo
//           isPlaying: cardType === 'red' ? false : player.isPlaying,
//         }
//       }
//       return player
//     })
//     setMatchTeam(updatedTeam)
//   }

//   const handleCard = (dorsal: number, cardType: 'yellow' | 'red') => {
//     if (!matchTeam || !startTime) return
//     const cardedPlayer = player(dorsal)
//     if (cardedPlayer?.isPlaying && cardedPlayer?.isGoalKeeper && cardType === 'red') {
//       // logica de cambio
//     }
//     toggleCard(dorsal, cardType)
//     addEvent({
//       title: cardType === 'yellow' ? '🟨 Tj. Amarilla' : '🟥 Tj. Roja',
//       type: cardType === 'yellow' ? 'card' : 'redCard',
//       playerName: cardedPlayer?.name || 'Desconocido',
//       playerDorsal: dorsal
//     })
//   }
//   const handleShot = (dorsal: number) => {
//     if (!matchTeam || !startTime) return
//     const shotPlayer = player(dorsal)
//     addEvent({
//       title: '🏹 Disparo',
//       type: 'shot',
//       playerName: shotPlayer?.name || 'Desconocido',
//       playerDorsal: dorsal
//     })
//   }

//   const handleInjury = (dorsal: number) => {
//     if (!matchTeam || !startTime) return
//     const injuredPlayer = player(dorsal)
//     addEvent({
//       title: '🤕 Lesión',
//       type: 'injury',
//       playerName: injuredPlayer?.name || 'Desconocido',
//       playerDorsal: dorsal,
//     })
//     const updatedTeam = matchTeam.map((player) => {
//       if (player.dorsal === dorsal) {
//         return {
//           ...player,
//           isInjured: true,
//         }
//       }
//       return player
//     })
//     setMatchTeam(updatedTeam)
//   }

//   const handlersPlayer = {
//     togglePlayerStatus,
//     toggleSubstitution,
//     filterPlayersForSubstitution,
//     handleGoal,
//     handleKeeperSave,
//     handleFoul,
//     handleCard,
//     handleShot,
//     handleInjury,
//     filterPlayersForRedToGoalKeeper,
//     setAsGoalKeeper
//   }

//   return {
//     handlersPlayer,
//     player,
//     // togglePlayerStatus,
//     // toggleSubstitution,
//     // filterPlayersForSubstitution,
//     // handleGoal,
//     // handleKeeperSave,
//     // handleFoul,
//     // handleCard
//   }
// }

// // - [X] Registrar evento de **GOL**
// // - [ ] Registrar evento de **TARJETA AMARILLA**
// // - [ ] Registrar evento de **TARJETA ROJA**
// // - [X] Registrar evento de **FALTA**
// // - [X] Registrar evento de **PARADA DEL PORTERO**
// // - [ ] Registrar evento de **DISPARO**
// // - [ ] Registrar evento de **LESIÓN**

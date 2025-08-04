export default function getEventsColors (type: string, side: string) {
    if (type === 'ownGoal') return side === 'team' ? 'text-red-600' : 'text-green-700'
    if (type === 'goal') return side === 'team' ? 'text-green-700' : 'text-orange-600'
    if (type === 'redCard') return 'text-red-600'
    if (type === 'card') return 'text-yellow-600'
    if (type === 'pause') return 'text-purple-600'
    return 'text-gray-800'
}
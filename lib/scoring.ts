export function calculatePoints(
  predHome: number,
  predAway: number,
  resultHome: number,
  resultAway: number
): number {
  // Placar exato: 10 pontos
  if (predHome === resultHome && predAway === resultAway) {
    return 10
  }

  // Acertou empate: 5 pontos
  if (predHome === predAway && resultHome === resultAway) {
    return 5
  }

  // Acertou vencedor (mandante): 5 pontos
  if (predHome > predAway && resultHome > resultAway) {
    return 5
  }

  // Acertou vencedor (visitante): 5 pontos
  if (predHome < predAway && resultHome < resultAway) {
    return 5
  }

  return 0
}

export function getPointsLabel(points: number): string {
  if (points === 10) return 'Placar exato! 🎯'
  if (points === 5) return 'Resultado certo! ✅'
  return 'Resultado errado ❌'
}

export function getPointsColor(points: number): string {
  if (points === 10) return 'text-green-600 dark:text-green-400'
  if (points === 5) return 'text-blue-600 dark:text-blue-400'
  return 'text-red-500 dark:text-red-400'
}

export function getPointsBg(points: number): string {
  if (points === 10) return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
  if (points === 5) return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
  return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
}

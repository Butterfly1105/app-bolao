export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { BarChart2, Trophy, Target, Check } from 'lucide-react'

export default async function ClassificacaoPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: rankings } = await supabase
    .from('rankings')
    .select('*, profile:profiles(id, name, email)')
    .order('total_points', { ascending: false })
    .order('exact_scores', { ascending: false })
    .order('correct_results', { ascending: false })

  const allRankings = rankings ?? []

  const medals = ['🥇', '🥈', '🥉']
  const podiumColors = [
    'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
    'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700',
    'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800',
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 gradient-copa rounded-xl flex items-center justify-center">
          <BarChart2 className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Classificação</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {allRankings.length} participante{allRankings.length !== 1 ? 's' : ''} no bolão
          </p>
        </div>
      </div>

      {/* Legenda de pontuação */}
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-4">
        <p className="text-sm font-semibold text-green-800 dark:text-green-300 mb-2">Sistema de pontuação:</p>
        <div className="flex flex-wrap gap-4 text-sm">
          <span className="flex items-center gap-1.5 text-green-700 dark:text-green-400">
            <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">10</span>
            Placar exato
          </span>
          <span className="flex items-center gap-1.5 text-blue-700 dark:text-blue-400">
            <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">5</span>
            Vencedor ou empate
          </span>
          <span className="flex items-center gap-1.5 text-red-500 dark:text-red-400">
            <span className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold">0</span>
            Resultado errado
          </span>
        </div>
      </div>

      {/* Pódio - Top 3 */}
      {allRankings.length >= 1 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {allRankings.slice(0, 3).map((r: any, i: number) => {
            const isMe = r.user_id === user.id
            return (
              <div key={r.id} className={`${podiumColors[i] ?? 'bg-white dark:bg-gray-900'} border rounded-2xl p-5 text-center card-hover`}>
                <div className="text-4xl mb-2">{medals[i] ?? `${i + 1}º`}</div>
                <div className="w-14 h-14 gradient-copa rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-3 shadow-lg">
                  {r.profile?.name?.charAt(0) ?? '?'}
                </div>
                <p className="font-bold text-gray-900 dark:text-white truncate">
                  {r.profile?.name ?? 'Participante'}
                  {isMe && <span className="text-xs text-green-600 ml-1">(você)</span>}
                </p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">{r.total_points}</p>
                <p className="text-xs text-gray-500 mt-1">pontos</p>
                <div className="flex justify-center gap-4 mt-3 text-xs text-gray-600 dark:text-gray-400">
                  <span>🎯 {r.exact_scores}</span>
                  <span>✅ {r.correct_results}</span>
                  <span>📊 {r.total_predictions}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Tabela completa */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <h2 className="font-semibold text-gray-900 dark:text-white">Ranking Completo</h2>
        </div>

        {allRankings.length === 0 ? (
          <div className="py-16 text-center text-gray-500 dark:text-gray-400">
            <Trophy className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p>Nenhum resultado disponível ainda</p>
            <p className="text-sm mt-1">Os pontos são calculados após os jogos</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">#</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Participante</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Pts</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide hidden sm:table-cell">
                    <span title="Placares exatos">🎯 Exatos</span>
                  </th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide hidden sm:table-cell">
                    <span title="Resultados corretos">✅ Certos</span>
                  </th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide hidden md:table-cell">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {allRankings.map((r: any, i: number) => {
                  const isMe = r.user_id === user.id
                  return (
                    <tr
                      key={r.id}
                      className={`transition-colors ${isMe
                        ? 'bg-green-50 dark:bg-green-900/20'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800/30'
                      }`}
                    >
                      <td className="px-4 py-3">
                        <span className="text-lg font-bold">
                          {i < 3 ? medals[i] : `${i + 1}º`}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 ${
                            isMe ? 'bg-green-500' : 'gradient-copa'
                          }`}>
                            {r.profile?.name?.charAt(0) ?? '?'}
                          </div>
                          <div className="min-w-0">
                            <p className={`font-semibold truncate text-sm ${
                              isMe ? 'text-green-700 dark:text-green-400' : 'text-gray-900 dark:text-white'
                            }`}>
                              {r.profile?.name ?? 'Participante'}
                              {isMe && <span className="text-xs font-normal ml-1 opacity-70">(você)</span>}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-xl font-bold text-green-600 dark:text-green-400">
                          {r.total_points}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center hidden sm:table-cell">
                        <span className="font-semibold text-gray-700 dark:text-gray-300">{r.exact_scores}</span>
                      </td>
                      <td className="px-4 py-3 text-center hidden sm:table-cell">
                        <span className="font-semibold text-gray-700 dark:text-gray-300">{r.correct_results}</span>
                      </td>
                      <td className="px-4 py-3 text-center hidden md:table-cell">
                        <span className="text-sm text-gray-500 dark:text-gray-400">{r.total_predictions}</span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

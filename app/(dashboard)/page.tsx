export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Trophy, Target, Star, TrendingUp, Calendar, Clock } from 'lucide-react'
import Link from 'next/link'
import { formatDate, formatTime } from '@/lib/utils'
import { Match, Ranking } from '@/types'

async function getDashboardData(userId: string) {
  const supabase = await createClient()

  const [rankingRes, predsRes, nextMatchesRes, topRankingRes] = await Promise.all([
    supabase.from('rankings').select('*').eq('user_id', userId).single(),
    supabase.from('predictions').select('id').eq('user_id', userId),
    supabase.from('matches')
      .select('*, home_team:teams!home_team_id(*), away_team:teams!away_team_id(*)')
      .eq('status', 'scheduled')
      .order('match_date', { ascending: true })
      .limit(3),
    supabase.from('rankings')
      .select('*, profile:profiles(*)')
      .order('total_points', { ascending: false })
      .order('exact_scores', { ascending: false })
      .limit(5),
  ])

  return {
    ranking: rankingRes.data,
    predCount: predsRes.data?.length ?? 0,
    nextMatches: nextMatchesRes.data ?? [],
    topRanking: topRankingRes.data ?? [],
  }
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  const { ranking, predCount, nextMatches, topRanking } = await getDashboardData(user.id)

  const stats = [
    {
      label: 'Pontuação Total',
      value: ranking?.total_points ?? 0,
      icon: Trophy,
      color: 'from-green-500 to-green-600',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      label: 'Placares Exatos',
      value: ranking?.exact_scores ?? 0,
      icon: Target,
      color: 'from-blue-500 to-blue-600',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      label: 'Palpites Certos',
      value: (ranking?.correct_results ?? 0) + (ranking?.exact_scores ?? 0),
      icon: Star,
      color: 'from-yellow-500 to-yellow-600',
      textColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    },
    {
      label: 'Total de Palpites',
      value: predCount,
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Boas-vindas */}
      <div className="gradient-copa rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold">
              Olá, {profile?.name?.split(' ')[0] ?? 'Participante'}! 👋
            </h1>
            <p className="text-green-100 mt-1">
              {ranking?.position
                ? `Você está na ${ranking.position}ª posição do ranking`
                : 'Faça seus palpites e suba no ranking!'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-green-200 text-sm">Copa do Mundo</p>
            <p className="text-2xl font-bold">2026 🏆</p>
          </div>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, textColor, bgColor }) => (
          <div key={label} className={`${bgColor} rounded-2xl p-4 card-hover`}>
            <Icon className={`w-6 h-6 ${textColor} mb-2`} />
            <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Próximos jogos */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green-600" />
              <h2 className="font-semibold text-gray-900 dark:text-white">Próximos Jogos</h2>
            </div>
            <Link href="/palpites" className="text-sm text-green-600 hover:text-green-700 font-medium">
              Ver todos →
            </Link>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {nextMatches.length === 0 ? (
              <div className="px-5 py-8 text-center text-gray-500 dark:text-gray-400">
                <Clock className="w-10 h-10 mx-auto mb-2 opacity-40" />
                <p>Nenhum jogo programado</p>
              </div>
            ) : (
              nextMatches.map((match: any) => (
                <div key={match.id} className="px-5 py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-lg">{match.home_team?.flag_emoji ?? '🏳️'}</span>
                    <span className="font-medium text-gray-900 dark:text-white text-sm truncate">
                      {match.home_team?.short_name ?? match.home_team_placeholder}
                    </span>
                  </div>
                  <div className="text-center flex-shrink-0">
                    <div className="text-xs text-gray-500 dark:text-gray-400">{formatDate(match.match_date)}</div>
                    <div className="text-xs font-bold text-green-600 dark:text-green-400">{formatTime(match.match_date)}</div>
                  </div>
                  <div className="flex items-center gap-2 flex-1 justify-end min-w-0">
                    <span className="font-medium text-gray-900 dark:text-white text-sm truncate text-right">
                      {match.away_team?.short_name ?? match.away_team_placeholder}
                    </span>
                    <span className="text-lg">{match.away_team?.flag_emoji ?? '🏳️'}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top 5 ranking */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <h2 className="font-semibold text-gray-900 dark:text-white">Ranking Atual</h2>
            </div>
            <Link href="/classificacao" className="text-sm text-green-600 hover:text-green-700 font-medium">
              Ver completo →
            </Link>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {topRanking.length === 0 ? (
              <div className="px-5 py-8 text-center text-gray-500 dark:text-gray-400">
                <Trophy className="w-10 h-10 mx-auto mb-2 opacity-40" />
                <p>Nenhum resultado ainda</p>
              </div>
            ) : (
              topRanking.map((r: any, i: number) => {
                const medals = ['🥇', '🥈', '🥉']
                const isMe = r.user_id === user.id
                return (
                  <div key={r.id} className={`px-5 py-3 flex items-center gap-3 ${isMe ? 'bg-green-50 dark:bg-green-900/20' : ''}`}>
                    <span className="text-xl w-7 text-center">
                      {i < 3 ? medals[i] : `${i + 1}º`}
                    </span>
                    <div className="w-8 h-8 gradient-copa rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {r.profile?.name?.charAt(0) ?? '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium text-sm truncate ${isMe ? 'text-green-700 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>
                        {r.profile?.name ?? 'Participante'} {isMe && '(você)'}
                      </p>
                      <p className="text-xs text-gray-500">{r.exact_scores} exatos · {r.correct_results} certos</p>
                    </div>
                    <span className="font-bold text-green-600 dark:text-green-400 text-lg">
                      {r.total_points}
                    </span>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>

      {/* CTA Palpites */}
      <div className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="font-bold text-gray-900 dark:text-white text-lg">⚽ Faça seus palpites!</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
            10pts placar exato · 5pts resultado certo · 5pts empate certo
          </p>
        </div>
        <Link
          href="/palpites"
          className="px-6 py-3 gradient-copa text-white font-semibold rounded-xl hover:opacity-90 transition shadow-md"
        >
          Palpitar agora
        </Link>
      </div>
    </div>
  )
}

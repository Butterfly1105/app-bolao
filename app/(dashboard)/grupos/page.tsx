export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Shield } from 'lucide-react'
import { formatDate, formatTime } from '@/lib/utils'
import { Match } from '@/types'

export default async function GruposPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [matchesRes, groupsRes] = await Promise.all([
    supabase
      .from('matches')
      .select('*, home_team:teams!home_team_id(*), away_team:teams!away_team_id(*), group:groups(*)')
      .eq('stage', 'group')
      .order('match_date', { ascending: true }),
    supabase.from('groups').select('*').order('letter'),
  ])

  const matches: Match[] = matchesRes.data ?? []
  const groups = groupsRes.data ?? []

  const matchesByGroup = groups.reduce((acc, group) => {
    acc[group.letter] = matches.filter(m => m.group_id === group.id)
    return acc
  }, {} as Record<string, Match[]>)

  const statusBadge = (status: string, home: number | null, away: number | null) => {
    if (status === 'finished') return (
      <span className="text-2xl font-bold text-gray-900 dark:text-white">
        {home} – {away}
      </span>
    )
    if (status === 'live') return (
      <span className="flex flex-col items-center">
        <span className="inline-flex items-center gap-1 text-xs bg-red-500 text-white px-2 py-0.5 rounded-full font-bold animate-pulse">
          AO VIVO
        </span>
      </span>
    )
    return <span className="text-xl font-bold text-gray-400">VS</span>
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 gradient-copa rounded-xl flex items-center justify-center">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Fase de Grupos</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Todos os jogos por grupo</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {groups.map(group => (
          <div
            key={group.id}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden"
          >
            <div className="gradient-copa px-5 py-3">
              <h2 className="font-bold text-white text-lg">{group.name}</h2>
              <p className="text-green-200 text-xs">{matchesByGroup[group.letter]?.length ?? 0} partidas</p>
            </div>

            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {(matchesByGroup[group.letter] ?? []).map((match: any) => (
                <div key={match.id} className="px-4 py-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="text-2xl">{match.home_team?.flag_emoji ?? '🏳️'}</span>
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                          {match.home_team?.name ?? match.home_team_placeholder}
                        </p>
                        <p className="text-xs text-gray-400">{match.home_team?.short_name}</p>
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-1 flex-shrink-0 px-2">
                      {statusBadge(match.status, match.home_score, match.away_score)}
                      <div className="text-center">
                        <p className="text-xs text-gray-500">{formatDate(match.match_date)}</p>
                        <p className="text-xs font-semibold text-green-600 dark:text-green-400">
                          {formatTime(match.match_date)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
                      <div className="min-w-0 text-right">
                        <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                          {match.away_team?.name ?? match.away_team_placeholder}
                        </p>
                        <p className="text-xs text-gray-400">{match.away_team?.short_name}</p>
                      </div>
                      <span className="text-2xl">{match.away_team?.flag_emoji ?? '🏳️'}</span>
                    </div>
                  </div>
                  {match.venue && (
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 text-center">
                      📍 {match.venue}, {match.city}
                    </p>
                  )}
                </div>
              ))}
              {(matchesByGroup[group.letter]?.length ?? 0) === 0 && (
                <div className="px-5 py-6 text-center text-gray-400 dark:text-gray-500 text-sm">
                  Nenhuma partida cadastrada
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

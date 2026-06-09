export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { GitBranch } from 'lucide-react'
import { formatDate, formatTime } from '@/lib/utils'
import { Match, MatchStage, STAGE_LABELS } from '@/types'

function MatchCard({ match }: { match: any }) {
  const isFinished = match.status === 'finished'
  const isLive = match.status === 'live'

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Header status */}
      <div className={`px-3 py-1.5 text-xs font-semibold flex items-center justify-between
        ${isFinished ? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400' :
          isLive ? 'bg-red-500 text-white' :
          'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'}`}>
        <span>{isLive ? '🔴 AO VIVO' : isFinished ? '✅ Encerrado' : '⏰ Programado'}</span>
        <span>{formatDate(match.match_date)}</span>
      </div>

      {/* Times */}
      <div className="p-3 space-y-2">
        {/* Home */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-xl flex-shrink-0">{match.home_team?.flag_emoji ?? '🏳️'}</span>
            <span className="font-semibold text-gray-900 dark:text-white text-sm truncate">
              {match.home_team?.name ?? match.home_team_placeholder ?? 'A definir'}
            </span>
          </div>
          {(isFinished || isLive) && (
            <span className={`text-xl font-bold tabular-nums ${
              isFinished && match.home_score > match.away_score ? 'text-green-600' : 'text-gray-700 dark:text-gray-300'
            }`}>
              {match.home_score ?? 0}
            </span>
          )}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-2">
          <div className="flex-1 border-t border-dashed border-gray-200 dark:border-gray-700" />
          <span className="text-xs text-gray-400 px-2">
            {isFinished || isLive ? 'X' : formatTime(match.match_date)}
          </span>
          <div className="flex-1 border-t border-dashed border-gray-200 dark:border-gray-700" />
        </div>

        {/* Away */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-xl flex-shrink-0">{match.away_team?.flag_emoji ?? '🏳️'}</span>
            <span className="font-semibold text-gray-900 dark:text-white text-sm truncate">
              {match.away_team?.name ?? match.away_team_placeholder ?? 'A definir'}
            </span>
          </div>
          {(isFinished || isLive) && (
            <span className={`text-xl font-bold tabular-nums ${
              isFinished && match.away_score > match.home_score ? 'text-green-600' : 'text-gray-700 dark:text-gray-300'
            }`}>
              {match.away_score ?? 0}
            </span>
          )}
        </div>
      </div>

      {match.city && (
        <div className="px-3 pb-2 text-xs text-gray-400 dark:text-gray-500 text-center">
          📍 {match.city}
        </div>
      )}
    </div>
  )
}

function StageSection({ title, matches, columns = 2 }: {
  title: string
  matches: any[]
  columns?: number
}) {
  if (matches.length === 0) return null
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-gray-200 dark:to-gray-700" />
        <h2 className="text-base font-bold text-gray-700 dark:text-gray-300 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full whitespace-nowrap">
          {title}
        </h2>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-gray-200 dark:to-gray-700" />
      </div>
      <div className={`grid gap-3 ${
        columns === 1 ? 'max-w-xs mx-auto' :
        columns === 2 ? 'grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto' :
        'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
      }`}>
        {matches.map((match: any) => (
          <MatchCard key={match.id} match={match} />
        ))}
      </div>
    </div>
  )
}

export default async function MataMataPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: matches } = await supabase
    .from('matches')
    .select('*, home_team:teams!home_team_id(*), away_team:teams!away_team_id(*)')
    .in('stage', ['round_of_16', 'quarter_final', 'semi_final', 'third_place', 'final'])
    .order('bracket_position', { ascending: true })

  const allMatches = matches ?? []

  const byStage = {
    round_of_16: allMatches.filter(m => m.stage === 'round_of_16'),
    quarter_final: allMatches.filter(m => m.stage === 'quarter_final'),
    semi_final: allMatches.filter(m => m.stage === 'semi_final'),
    third_place: allMatches.filter(m => m.stage === 'third_place'),
    final: allMatches.filter(m => m.stage === 'final'),
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 gradient-copa rounded-xl flex items-center justify-center">
          <GitBranch className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mata-Mata</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Chaveamento da Copa do Mundo 2026</p>
        </div>
      </div>

      {/* Visual bracket indicator */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {(['round_of_16', 'quarter_final', 'semi_final', 'final'] as MatchStage[]).map((stage, i, arr) => (
          <div key={stage} className="flex items-center gap-2 flex-shrink-0">
            <div className="px-3 py-1.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-400">
              {STAGE_LABELS[stage]}
            </div>
            {i < arr.length - 1 && <span className="text-gray-400">→</span>}
          </div>
        ))}
      </div>

      <StageSection title="⚔️ Oitavas de Final" matches={byStage.round_of_16} columns={4} />
      <StageSection title="🏟️ Quartas de Final" matches={byStage.quarter_final} columns={4} />
      <StageSection title="⭐ Semifinais" matches={byStage.semi_final} columns={2} />
      <StageSection title="🥉 Disputa de 3º Lugar" matches={byStage.third_place} columns={1} />
      <StageSection title="🏆 FINAL" matches={byStage.final} columns={1} />

      {allMatches.length === 0 && (
        <div className="text-center py-16 text-gray-500 dark:text-gray-400">
          <GitBranch className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <p className="text-lg font-medium">Mata-mata ainda não disponível</p>
          <p className="text-sm">As partidas serão definidas após a fase de grupos</p>
        </div>
      )}
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, Loader2, Trophy, AlertTriangle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { formatDate, formatTime } from '@/lib/utils'
import { STAGE_LABELS, MatchStage } from '@/types'

export default function ResultadosPage() {
  const [matches, setMatches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [scores, setScores] = useState<Record<string, { home: string; away: string }>>({})
  const supabase = createClient()

  useEffect(() => {
    loadMatches()
  }, [])

  const loadMatches = async () => {
    setLoading(true)
    try {
      const { data } = await supabase
        .from('matches')
        .select('*, home_team:teams!home_team_id(*), away_team:teams!away_team_id(*)')
        .neq('status', 'cancelled')
        .order('match_date', { ascending: true })
      setMatches(data ?? [])

      const initial: Record<string, { home: string; away: string }> = {}
      data?.forEach((m: any) => {
        if (m.status === 'finished') {
          initial[m.id] = {
            home: m.home_score?.toString() ?? '',
            away: m.away_score?.toString() ?? '',
          }
        }
      })
      setScores(initial)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveResult = async (matchId: string) => {
    const score = scores[matchId]
    if (!score) return

    const home = parseInt(score.home)
    const away = parseInt(score.away)

    if (isNaN(home) || isNaN(away) || home < 0 || away < 0) {
      toast.error('Informe um placar válido')
      return
    }

    setSaving(matchId)
    try {
      const { error } = await supabase
        .from('matches')
        .update({ home_score: home, away_score: away, status: 'finished' })
        .eq('id', matchId)

      if (error) throw error

      // Atualiza rankings via RPC
      await supabase.rpc('update_rankings_after_result', { match_uuid: matchId })

      toast.success('Resultado salvo e pontuações atualizadas! 🏆')
      await loadMatches()
    } catch (err: any) {
      toast.error(err.message || 'Erro ao salvar resultado')
    } finally {
      setSaving(null)
    }
  }

  const byStage = matches.reduce((acc, m) => {
    if (!acc[m.stage]) acc[m.stage] = []
    acc[m.stage].push(m)
    return acc
  }, {} as Record<MatchStage, any[]>)

  const stageOrder: MatchStage[] = ['group', 'round_of_16', 'quarter_final', 'semi_final', 'third_place', 'final']

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-green-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
          <CheckCircle className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Inserir Resultados</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Registre os placares oficiais das partidas</p>
        </div>
      </div>

      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 flex gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-amber-700 dark:text-amber-300">
          Ao salvar um resultado, os pontos de todos os participantes que fizeram palpites neste jogo serão calculados automaticamente.
        </p>
      </div>

      {stageOrder.map(stage => {
        const stageMatches = byStage[stage] ?? []
        if (stageMatches.length === 0) return null

        return (
          <div key={stage} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="gradient-copa px-5 py-3">
              <h2 className="font-bold text-white">{STAGE_LABELS[stage]}</h2>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {stageMatches.map((match: any) => {
                const score = scores[match.id] ?? { home: '', away: '' }
                const isFinished = match.status === 'finished'
                const isSaving = saving === match.id

                return (
                  <div key={match.id} className={`p-4 ${isFinished ? 'bg-green-50/30 dark:bg-green-900/10' : ''}`}>
                    <div className="flex items-center gap-4 flex-wrap">
                      {/* Status badge */}
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0 ${
                        isFinished
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                      }`}>
                        {isFinished ? '✅ Encerrado' : '⏳ Pendente'}
                      </span>

                      {/* Date */}
                      <span className="text-xs text-gray-500 flex-shrink-0">
                        {formatDate(match.match_date)} {formatTime(match.match_date)}
                      </span>

                      {/* Teams + score */}
                      <div className="flex items-center gap-3 flex-1 min-w-0 flex-wrap">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{match.home_team?.flag_emoji ?? '🏳️'}</span>
                          <span className="font-semibold text-gray-900 dark:text-white text-sm">
                            {match.home_team?.short_name ?? match.home_team_placeholder ?? '?'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            max="99"
                            value={score.home}
                            onChange={e => setScores(prev => ({
                              ...prev,
                              [match.id]: { ...prev[match.id] ?? { away: '' }, home: e.target.value }
                            }))}
                            placeholder="0"
                            className="w-12 h-10 text-center text-lg font-bold bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-green-500 transition text-gray-900 dark:text-white"
                          />
                          <span className="text-gray-400 font-bold">×</span>
                          <input
                            type="number"
                            min="0"
                            max="99"
                            value={score.away}
                            onChange={e => setScores(prev => ({
                              ...prev,
                              [match.id]: { ...prev[match.id] ?? { home: '' }, away: e.target.value }
                            }))}
                            placeholder="0"
                            className="w-12 h-10 text-center text-lg font-bold bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-green-500 transition text-gray-900 dark:text-white"
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900 dark:text-white text-sm">
                            {match.away_team?.short_name ?? match.away_team_placeholder ?? '?'}
                          </span>
                          <span className="text-2xl">{match.away_team?.flag_emoji ?? '🏳️'}</span>
                        </div>
                      </div>

                      {/* Save button */}
                      <button
                        onClick={() => handleSaveResult(match.id)}
                        disabled={isSaving}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition flex-shrink-0 ${
                          isFinished
                            ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400'
                            : 'gradient-copa text-white hover:opacity-90 shadow-sm'
                        }`}
                      >
                        {isSaving ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <CheckCircle className="w-4 h-4" />
                        )}
                        {isFinished ? 'Atualizar' : 'Confirmar'}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

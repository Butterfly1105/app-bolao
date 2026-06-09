'use client'

import { useState, useEffect, useCallback } from 'react'
import { Target, FileText, MessageCircle, Loader2, Check, ChevronDown, ChevronUp } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { formatDate, formatTime, isPastMatch } from '@/lib/utils'
import { getPointsBg } from '@/lib/scoring'
import { Match, Prediction, STAGE_LABELS, MatchStage } from '@/types'
import { generatePredictionsPDF, sharePDFWhatsApp } from '@/lib/pdf'

interface MatchWithPred extends Match {
  prediction?: Prediction | null
  home_team?: any
  away_team?: any
  group?: any
}

interface PredictionInput {
  [matchId: string]: { home: string; away: string }
}

function MatchPredictionCard({
  match,
  prediction,
  onSave,
  saving,
}: {
  match: MatchWithPred
  prediction?: Prediction | null
  onSave: (matchId: string, home: number, away: number) => Promise<void>
  saving: boolean
}) {
  const [home, setHome] = useState(prediction?.home_score?.toString() ?? '')
  const [away, setAway] = useState(prediction?.away_score?.toString() ?? '')
  const [dirty, setDirty] = useState(false)
  const isPast = isPastMatch(match.match_date)
  const isFinished = match.status === 'finished'
  const locked = isPast || isFinished

  const handleSave = async () => {
    const h = parseInt(home)
    const a = parseInt(away)
    if (isNaN(h) || isNaN(a) || h < 0 || a < 0) {
      toast.error('Informe um placar válido')
      return
    }
    await onSave(match.id, h, a)
    setDirty(false)
  }

  return (
    <div className={`bg-white dark:bg-gray-900 rounded-2xl border transition-all ${
      isFinished ? 'border-gray-200 dark:border-gray-700 opacity-80' :
      locked ? 'border-orange-200 dark:border-orange-800' :
      prediction ? 'border-green-200 dark:border-green-800' :
      'border-gray-200 dark:border-gray-800 hover:border-green-300 dark:hover:border-green-700'
    } overflow-hidden`}>
      {/* Status bar */}
      <div className={`px-4 py-1.5 text-xs font-medium flex items-center justify-between ${
        isFinished ? 'bg-gray-100 dark:bg-gray-800 text-gray-500' :
        locked ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600' :
        prediction ? 'bg-green-50 dark:bg-green-900/20 text-green-600' :
        'bg-gray-50 dark:bg-gray-800/50 text-gray-500'
      }`}>
        <span>
          {isFinished ? '✅ Encerrado' : locked ? '🔒 Bloqueado' : prediction ? '✏️ Palpite salvo' : '⚽ Sem palpite'}
        </span>
        <span>{formatDate(match.match_date)} {formatTime(match.match_date)}</span>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-3">
          {/* Home team */}
          <div className="flex-1 flex flex-col items-center gap-1">
            <span className="text-3xl">{match.home_team?.flag_emoji ?? '🏳️'}</span>
            <span className="text-sm font-semibold text-gray-900 dark:text-white text-center leading-tight">
              {match.home_team?.short_name ?? match.home_team_placeholder ?? '?'}
            </span>
          </div>

          {/* Score input */}
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              max="99"
              value={home}
              onChange={e => { setHome(e.target.value); setDirty(true) }}
              disabled={locked}
              placeholder="-"
              className="w-14 h-12 text-center text-xl font-bold bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition text-gray-900 dark:text-white"
            />
            <span className="text-gray-400 font-bold text-lg">×</span>
            <input
              type="number"
              min="0"
              max="99"
              value={away}
              onChange={e => { setAway(e.target.value); setDirty(true) }}
              disabled={locked}
              placeholder="-"
              className="w-14 h-12 text-center text-xl font-bold bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition text-gray-900 dark:text-white"
            />
          </div>

          {/* Away team */}
          <div className="flex-1 flex flex-col items-center gap-1">
            <span className="text-3xl">{match.away_team?.flag_emoji ?? '🏳️'}</span>
            <span className="text-sm font-semibold text-gray-900 dark:text-white text-center leading-tight">
              {match.away_team?.short_name ?? match.away_team_placeholder ?? '?'}
            </span>
          </div>
        </div>

        {/* Result exibição */}
        {isFinished && match.home_score !== null && (
          <div className="mt-3 text-center text-sm text-gray-500 dark:text-gray-400">
            Resultado: <span className="font-bold text-gray-900 dark:text-white">
              {match.home_score} – {match.away_score}
            </span>
            {prediction && (
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${getPointsBg(prediction.points_earned)}`}>
                +{prediction.points_earned} pts
              </span>
            )}
          </div>
        )}

        {/* Save button */}
        {!locked && dirty && (
          <button
            onClick={handleSave}
            disabled={saving}
            className="mt-3 w-full py-2 bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition flex items-center justify-center gap-2"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            Salvar palpite
          </button>
        )}
      </div>
    </div>
  )
}

export default function PalpitesPage() {
  const [matches, setMatches] = useState<MatchWithPred[]>([])
  const [predictions, setPredictions] = useState<Map<string, Prediction>>(new Map())
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [profile, setProfile] = useState<any>(null)
  const [expandedStage, setExpandedStage] = useState<MatchStage>('group')
  const [generatingPDF, setGeneratingPDF] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const [profileRes, matchesRes, predsRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('matches')
          .select('*, home_team:teams!home_team_id(*), away_team:teams!away_team_id(*), group:groups(*)')
          .order('match_date', { ascending: true }),
        supabase.from('predictions').select('*').eq('user_id', user.id),
      ])

      setProfile(profileRes.data)
      setMatches(matchesRes.data ?? [])

      const predMap = new Map<string, Prediction>()
      predsRes.data?.forEach(p => predMap.set(p.match_id, p))
      setPredictions(predMap)
    } finally {
      setLoading(false)
    }
  }

  const handleSavePrediction = async (matchId: string, home: number, away: number) => {
    setSaving(matchId)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const existing = predictions.get(matchId)

      if (existing) {
        const { data, error } = await supabase
          .from('predictions')
          .update({ home_score: home, away_score: away })
          .eq('id', existing.id)
          .select()
          .single()
        if (error) throw error
        setPredictions(prev => new Map(prev).set(matchId, data))
        toast.success('Palpite atualizado! ✏️')
      } else {
        const { data, error } = await supabase
          .from('predictions')
          .insert({ user_id: user.id, match_id: matchId, home_score: home, away_score: away })
          .select()
          .single()
        if (error) throw error
        setPredictions(prev => new Map(prev).set(matchId, data))
        toast.success('Palpite salvo! ⚽')
      }
    } catch (err: any) {
      toast.error(err.message || 'Erro ao salvar palpite')
    } finally {
      setSaving(null)
    }
  }

  const handleGeneratePDF = async () => {
    setGeneratingPDF(true)
    try {
      const matchesWithPreds = matches.map(m => ({
        ...m,
        prediction: predictions.get(m.id) ?? null,
      }))
      await generatePredictionsPDF(matchesWithPreds, profile, predictions)
      toast.success('PDF gerado com sucesso!')
    } catch (err) {
      toast.error('Erro ao gerar PDF')
    } finally {
      setGeneratingPDF(false)
    }
  }

  const handleShareWhatsApp = async () => {
    const text = buildWhatsAppText()
    sharePDFWhatsApp(text)
  }

  const buildWhatsAppText = () => {
    const predCount = predictions.size
    const lines = [`🏆 *Bolão da Copa 2026 - Palpites de ${profile?.name ?? 'Participante'}*\n`]
    lines.push(`📊 Total de palpites: ${predCount}\n`)

    const grouped = matches.reduce((acc, m) => {
      const stage = m.stage
      if (!acc[stage]) acc[stage] = []
      const pred = predictions.get(m.id)
      if (pred) {
        const homeName = m.home_team?.short_name ?? m.home_team_placeholder ?? '?'
        const awayName = m.away_team?.short_name ?? m.away_team_placeholder ?? '?'
        acc[stage].push(`${m.home_team?.flag_emoji ?? ''}${homeName} ${pred.home_score} x ${pred.away_score} ${awayName}${m.away_team?.flag_emoji ?? ''}`)
      }
      return acc
    }, {} as Record<string, string[]>)

    Object.entries(grouped).forEach(([stage, preds]) => {
      if (preds.length > 0) {
        lines.push(`\n*${STAGE_LABELS[stage as MatchStage]}*`)
        preds.forEach(p => lines.push(p))
      }
    })

    lines.push('\n_Gerado pelo Bolão da Copa 2026_ ⚽')
    return lines.join('\n')
  }

  const matchesByStage = matches.reduce((acc, m) => {
    if (!acc[m.stage]) acc[m.stage] = []
    acc[m.stage].push(m)
    return acc
  }, {} as Record<MatchStage, MatchWithPred[]>)

  const stageOrder: MatchStage[] = ['group', 'round_of_16', 'quarter_final', 'semi_final', 'third_place', 'final']
  const predCount = predictions.size
  const totalMatches = matches.filter(m => !isPastMatch(m.match_date) || m.status !== 'scheduled').length

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-green-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 gradient-copa rounded-xl flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Meus Palpites</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {predCount} palpite{predCount !== 1 ? 's' : ''} registrado{predCount !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Ações PDF/WhatsApp */}
        {predCount > 0 && (
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={handleGeneratePDF}
              disabled={generatingPDF}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition shadow"
            >
              {generatingPDF ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
              Gerar PDF
            </button>
            <button
              onClick={handleShareWhatsApp}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-xl transition shadow"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </button>
          </div>
        )}
      </div>

      {/* Progresso */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Progresso dos palpites
          </span>
          <span className="text-sm font-bold text-green-600 dark:text-green-400">
            {predCount} / {matches.length}
          </span>
        </div>
        <div className="h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full gradient-copa rounded-full transition-all duration-500"
            style={{ width: `${matches.length > 0 ? (predCount / matches.length) * 100 : 0}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
          {matches.length - predCount} partidas sem palpite
        </p>
      </div>

      {/* Partidas por fase */}
      {stageOrder.map(stage => {
        const stageMatches = matchesByStage[stage] ?? []
        if (stageMatches.length === 0) return null
        const isExpanded = expandedStage === stage
        const stagePreds = stageMatches.filter(m => predictions.has(m.id)).length

        return (
          <div key={stage} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <button
              onClick={() => setExpandedStage(isExpanded ? '' as any : stage)}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition"
            >
              <div className="flex items-center gap-3">
                <span className="font-bold text-gray-900 dark:text-white">{STAGE_LABELS[stage]}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                  stagePreds === stageMatches.length
                    ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                }`}>
                  {stagePreds}/{stageMatches.length}
                </span>
              </div>
              {isExpanded
                ? <ChevronUp className="w-5 h-5 text-gray-400" />
                : <ChevronDown className="w-5 h-5 text-gray-400" />
              }
            </button>

            {isExpanded && (
              <div className="px-4 pb-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-3 border-t border-gray-100 dark:border-gray-800 pt-4">
                {stageMatches.map(match => (
                  <MatchPredictionCard
                    key={match.id}
                    match={match}
                    prediction={predictions.get(match.id) ?? null}
                    onSave={handleSavePrediction}
                    saving={saving === match.id}
                  />
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

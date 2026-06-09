'use client'

import { useState, useEffect } from 'react'
import { ClipboardList, Loader2, Edit, Check, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { formatDate, formatTime } from '@/lib/utils'
import { STAGE_LABELS, MatchStage } from '@/types'

export default function PartidasAdminPage() {
  const [matches, setMatches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState<any>({})
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  useEffect(() => { loadMatches() }, [])

  const loadMatches = async () => {
    setLoading(true)
    try {
      const { data } = await supabase
        .from('matches')
        .select('*, home_team:teams!home_team_id(*), away_team:teams!away_team_id(*), group:groups(*)')
        .order('match_date', { ascending: true })
      setMatches(data ?? [])
    } finally {
      setLoading(false)
    }
  }

  const startEdit = (match: any) => {
    setEditingId(match.id)
    setEditData({
      match_date: match.match_date ? match.match_date.slice(0, 16) : '',
      venue: match.venue ?? '',
      city: match.city ?? '',
      status: match.status,
    })
  }

  const cancelEdit = () => { setEditingId(null); setEditData({}) }

  const saveEdit = async (matchId: string) => {
    setSaving(true)
    try {
      const updatePayload: any = {
        venue: editData.venue || null,
        city: editData.city || null,
        status: editData.status,
      }
      if (editData.match_date) {
        updatePayload.match_date = new Date(editData.match_date).toISOString()
      }

      const { error } = await supabase
        .from('matches')
        .update(updatePayload)
        .eq('id', matchId)

      if (error) throw error
      toast.success('Partida atualizada!')
      setEditingId(null)
      await loadMatches()
    } catch (err: any) {
      toast.error(err.message || 'Erro ao salvar')
    } finally {
      setSaving(false)
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
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
          <ClipboardList className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gerenciar Partidas</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{matches.length} partidas cadastradas</p>
        </div>
      </div>

      {stageOrder.map(stage => {
        const stageMatches = byStage[stage] ?? []
        if (stageMatches.length === 0) return null
        return (
          <div key={stage} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="bg-blue-600 px-5 py-3">
              <h2 className="font-bold text-white">{STAGE_LABELS[stage]}</h2>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {stageMatches.map((match: any) => {
                const isEditing = editingId === match.id
                return (
                  <div key={match.id} className="p-4">
                    {/* Times */}
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xl">{match.home_team?.flag_emoji ?? '🏳️'}</span>
                      <span className="font-semibold text-gray-900 dark:text-white text-sm">
                        {match.home_team?.name ?? match.home_team_placeholder ?? '?'}
                      </span>
                      <span className="text-gray-400 font-bold">×</span>
                      <span className="font-semibold text-gray-900 dark:text-white text-sm">
                        {match.away_team?.name ?? match.away_team_placeholder ?? '?'}
                      </span>
                      <span className="text-xl">{match.away_team?.flag_emoji ?? '🏳️'}</span>
                      <div className="ml-auto flex gap-2">
                        {!isEditing ? (
                          <button
                            onClick={() => startEdit(match)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => saveEdit(match.id)}
                              disabled={saving}
                              className="p-1.5 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition"
                            >
                              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {isEditing ? (
                      <div className="grid sm:grid-cols-2 gap-3 bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">Data e hora</label>
                          <input
                            type="datetime-local"
                            value={editData.match_date}
                            onChange={e => setEditData((p: any) => ({ ...p, match_date: e.target.value }))}
                            className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">Status</label>
                          <select
                            value={editData.status}
                            onChange={e => setEditData((p: any) => ({ ...p, status: e.target.value }))}
                            className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="scheduled">Programado</option>
                            <option value="live">Ao vivo</option>
                            <option value="finished">Encerrado</option>
                            <option value="cancelled">Cancelado</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">Estádio</label>
                          <input
                            value={editData.venue}
                            onChange={e => setEditData((p: any) => ({ ...p, venue: e.target.value }))}
                            placeholder="Nome do estádio"
                            className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">Cidade</label>
                          <input
                            value={editData.city}
                            onChange={e => setEditData((p: any) => ({ ...p, city: e.target.value }))}
                            placeholder="Cidade"
                            className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-4 text-xs text-gray-500 dark:text-gray-400 flex-wrap">
                        <span>📅 {formatDate(match.match_date)} {formatTime(match.match_date)}</span>
                        {match.venue && <span>📍 {match.venue}</span>}
                        {match.city && <span>🌎 {match.city}</span>}
                        <span className={`font-semibold ${
                          match.status === 'finished' ? 'text-green-600' :
                          match.status === 'live' ? 'text-red-500' :
                          'text-gray-500'
                        }`}>
                          {match.status === 'finished' ? '✅ Encerrado' :
                           match.status === 'live' ? '🔴 Ao vivo' :
                           '⏰ Programado'}
                        </span>
                      </div>
                    )}
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

'use client'

import { useState, useEffect } from 'react'
import { Users, Shield, ShieldOff, Loader2, Search } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { formatDate } from '@/lib/utils'

export default function UsuariosAdminPage() {
  const [users, setUsers] = useState<any[]>([])
  const [rankings, setRankings] = useState<Map<string, any>>(new Map())
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [currentUserId, setCurrentUserId] = useState<string>('')
  const supabase = createClient()

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setCurrentUserId(user.id)

      const [usersRes, rankingsRes] = await Promise.all([
        supabase.from('profiles').select('*').order('created_at', { ascending: false }),
        supabase.from('rankings').select('*'),
      ])

      setUsers(usersRes.data ?? [])
      const rankMap = new Map<string, any>()
      rankingsRes.data?.forEach((r: any) => rankMap.set(r.user_id, r))
      setRankings(rankMap)
    } finally {
      setLoading(false)
    }
  }

  const toggleAdmin = async (userId: string, currentValue: boolean) => {
    if (userId === currentUserId) {
      toast.error('Você não pode alterar seu próprio status de admin')
      return
    }
    setSaving(userId)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_admin: !currentValue })
        .eq('id', userId)
      if (error) throw error
      toast.success(!currentValue ? 'Usuário promovido a admin!' : 'Permissão de admin removida')
      await loadData()
    } catch (err: any) {
      toast.error(err.message || 'Erro ao atualizar')
    } finally {
      setSaving(null)
    }
  }

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  )

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
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
          <Users className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Usuários</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{users.length} participantes cadastrados</p>
        </div>
      </div>

      {/* Busca */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por nome ou e-mail..."
          className="w-full pl-9 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition"
        />
      </div>

      {/* Tabela */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Participante</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Pontos</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Palpites</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Cadastro</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Permissão</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filtered.map(u => {
                const rank = rankings.get(u.id)
                const isMe = u.id === currentUserId
                return (
                  <tr key={u.id} className={`hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors ${isMe ? 'bg-green-50/50 dark:bg-green-900/10' : ''}`}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 ${u.is_admin ? 'bg-amber-500' : 'gradient-copa'}`}>
                          {u.name?.charAt(0)?.toUpperCase() ?? '?'}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                            {u.name}
                            {isMe && <span className="text-xs text-green-600 ml-1">(você)</span>}
                          </p>
                          <p className="text-xs text-gray-500 truncate">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center hidden md:table-cell">
                      <span className="font-bold text-green-600 dark:text-green-400">
                        {rank?.total_points ?? 0}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center hidden sm:table-cell">
                      <span className="text-gray-700 dark:text-gray-300">
                        {rank?.total_predictions ?? 0}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-xs text-gray-500 hidden lg:table-cell">
                      {formatDate(u.created_at)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => toggleAdmin(u.id, u.is_admin)}
                        disabled={saving === u.id || isMe}
                        className={`flex items-center gap-1.5 mx-auto px-3 py-1.5 text-xs font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed ${
                          u.is_admin
                            ? 'bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400'
                        }`}
                      >
                        {saving === u.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : u.is_admin ? (
                          <><Shield className="w-3 h-3" /> Admin</>
                        ) : (
                          <><ShieldOff className="w-3 h-3" /> Usuário</>
                        )}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-10 text-center text-gray-500 dark:text-gray-400">
              Nenhum usuário encontrado
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

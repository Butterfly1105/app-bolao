export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Settings, ClipboardList, Users, Trophy, CheckCircle } from 'lucide-react'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single()
  if (!profile?.is_admin) redirect('/dashboard')

  const [matchesRes, usersRes, predsRes] = await Promise.all([
    supabase.from('matches').select('id, status'),
    supabase.from('profiles').select('id'),
    supabase.from('predictions').select('id'),
  ])

  const matches = matchesRes.data ?? []
  const finishedMatches = matches.filter(m => m.status === 'finished').length
  const pendingMatches = matches.filter(m => m.status === 'scheduled').length

  const adminCards = [
    {
      href: '/admin/resultados',
      icon: CheckCircle,
      title: 'Inserir Resultados',
      desc: 'Registre o placar oficial das partidas',
      color: 'from-green-500 to-green-600',
      badge: `${pendingMatches} pendentes`,
      badgeColor: pendingMatches > 0 ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-500',
    },
    {
      href: '/admin/partidas',
      icon: ClipboardList,
      title: 'Gerenciar Partidas',
      desc: 'Edite datas, horários e informações dos jogos',
      color: 'from-blue-500 to-blue-600',
      badge: `${matches.length} jogos`,
      badgeColor: 'bg-blue-100 text-blue-700',
    },
    {
      href: '/admin/usuarios',
      icon: Users,
      title: 'Usuários',
      desc: 'Gerencie participantes e permissões',
      color: 'from-purple-500 to-purple-600',
      badge: `${usersRes.data?.length ?? 0} participantes`,
      badgeColor: 'bg-purple-100 text-purple-700',
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center">
          <Settings className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Painel Administrativo</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Gerencie o Bolão da Copa 2026</p>
        </div>
      </div>

      {/* Stats rápidas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total de Jogos', value: matches.length, color: 'text-gray-900 dark:text-white' },
          { label: 'Jogos Encerrados', value: finishedMatches, color: 'text-green-600' },
          { label: 'Aguardando', value: pendingMatches, color: 'text-orange-600' },
          { label: 'Palpites', value: predsRes.data?.length ?? 0, color: 'text-purple-600' },
        ].map(stat => (
          <div key={stat.label} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4">
            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Cards de ação */}
      <div className="grid md:grid-cols-3 gap-5">
        {adminCards.map(card => (
          <Link
            key={card.href}
            href={card.href}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 card-hover group"
          >
            <div className={`w-12 h-12 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform`}>
              <card.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1">{card.title}</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">{card.desc}</p>
            <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${card.badgeColor}`}>
              {card.badge}
            </span>
          </Link>
        ))}
      </div>

      {/* Aviso importante */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-4">
        <p className="text-amber-800 dark:text-amber-300 text-sm font-medium flex items-start gap-2">
          <span className="text-lg">⚠️</span>
          <span>
            Ao inserir resultados, os pontos dos participantes são calculados automaticamente.
            Esta ação não pode ser desfeita facilmente — verifique o placar antes de confirmar.
          </span>
        </p>
      </div>
    </div>
  )
}

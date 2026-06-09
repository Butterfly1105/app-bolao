'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Users, Save, Loader2, Lock, Trophy } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const profileSchema = z.object({
  name: z.string().min(2, 'Mínimo 2 caracteres'),
  username: z.string().min(3, 'Mínimo 3 caracteres').regex(/^[a-z0-9_]+$/, 'Apenas letras minúsculas, números e _').optional().or(z.literal('')),
})

const passwordSchema = z.object({
  newPassword: z.string().min(6, 'Mínimo 6 caracteres'),
  confirmPassword: z.string(),
}).refine(d => d.newPassword === d.confirmPassword, {
  message: 'Senhas não coincidem',
  path: ['confirmPassword'],
})

type ProfileForm = z.infer<typeof profileSchema>
type PasswordForm = z.infer<typeof passwordSchema>

export default function PerfilPage() {
  const [profile, setProfile] = useState<any>(null)
  const [ranking, setRanking] = useState<any>(null)
  const [loadingProfile, setLoadingProfile] = useState(false)
  const [loadingPassword, setLoadingPassword] = useState(false)
  const supabase = createClient()

  const { register: regProfile, handleSubmit: submitProfile, formState: { errors: errP }, reset: resetProfile } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
  })

  const { register: regPwd, handleSubmit: submitPwd, formState: { errors: errPwd }, reset: resetPwd } = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  })

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const [pRes, rRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('rankings').select('*').eq('user_id', user.id).single(),
    ])

    if (pRes.data) {
      setProfile(pRes.data)
      resetProfile({ name: pRes.data.name, username: pRes.data.username ?? '' })
    }
    if (rRes.data) setRanking(rRes.data)
  }

  const onSaveProfile = async (data: ProfileForm) => {
    setLoadingProfile(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { error } = await supabase
        .from('profiles')
        .update({ name: data.name, username: data.username || null })
        .eq('id', user.id)
      if (error) throw error
      toast.success('Perfil atualizado!')
      await loadProfile()
    } catch (err: any) {
      toast.error(err.message || 'Erro ao salvar')
    } finally {
      setLoadingProfile(false)
    }
  }

  const onChangePassword = async (data: PasswordForm) => {
    setLoadingPassword(true)
    try {
      const { error } = await supabase.auth.updateUser({ password: data.newPassword })
      if (error) throw error
      toast.success('Senha alterada com sucesso!')
      resetPwd()
    } catch (err: any) {
      toast.error(err.message || 'Erro ao alterar senha')
    } finally {
      setLoadingPassword(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 gradient-copa rounded-xl flex items-center justify-center">
          <Users className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Meu Perfil</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Gerencie suas informações</p>
        </div>
      </div>

      {/* Avatar + stats */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 gradient-copa rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg">
            {profile?.name?.charAt(0)?.toUpperCase() ?? '?'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{profile?.name ?? '...'}</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{profile?.email}</p>
            <p className="text-sm mt-1">
              {profile?.is_admin
                ? <span className="text-amber-600 dark:text-amber-400 font-medium">👑 Administrador</span>
                : <span className="text-green-600 dark:text-green-400 font-medium">⚽ Participante</span>}
            </p>
          </div>
        </div>

        {ranking && (
          <div className="mt-5 grid grid-cols-3 gap-3">
            {[
              { label: 'Pontos', value: ranking.total_points, icon: '🏆' },
              { label: 'Exatos', value: ranking.exact_scores, icon: '🎯' },
              { label: 'Certos', value: ranking.correct_results, icon: '✅' },
            ].map(stat => (
              <div key={stat.label} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 text-center">
                <span className="text-xl">{stat.icon}</span>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Editar perfil */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center gap-2">
          <Users className="w-4 h-4 text-green-600" />
          <h3 className="font-semibold text-gray-900 dark:text-white">Informações Pessoais</h3>
        </div>
        <form onSubmit={submitProfile(onSaveProfile)} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Nome completo</label>
            <input
              {...regProfile('name')}
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            />
            {errP.name && <p className="text-red-500 text-xs mt-1">{errP.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Username (opcional)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">@</span>
              <input
                {...regProfile('username')}
                className="w-full pl-7 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                placeholder="seunome"
              />
            </div>
            {errP.username && <p className="text-red-500 text-xs mt-1">{errP.username.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">E-mail</label>
            <input
              value={profile?.email ?? ''}
              disabled
              className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-500 dark:text-gray-400 cursor-not-allowed"
            />
          </div>
          <button
            type="submit"
            disabled={loadingProfile}
            className="flex items-center gap-2 px-5 py-2.5 gradient-copa text-white text-sm font-semibold rounded-xl hover:opacity-90 transition disabled:opacity-60"
          >
            {loadingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Salvar alterações
          </button>
        </form>
      </div>

      {/* Alterar senha */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center gap-2">
          <Lock className="w-4 h-4 text-green-600" />
          <h3 className="font-semibold text-gray-900 dark:text-white">Alterar Senha</h3>
        </div>
        <form onSubmit={submitPwd(onChangePassword)} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Nova senha</label>
            <input
              {...regPwd('newPassword')}
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            />
            {errPwd.newPassword && <p className="text-red-500 text-xs mt-1">{errPwd.newPassword.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Confirmar nova senha</label>
            <input
              {...regPwd('confirmPassword')}
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            />
            {errPwd.confirmPassword && <p className="text-red-500 text-xs mt-1">{errPwd.confirmPassword.message}</p>}
          </div>
          <button
            type="submit"
            disabled={loadingPassword}
            className="flex items-center gap-2 px-5 py-2.5 bg-gray-800 dark:bg-gray-700 hover:bg-gray-700 dark:hover:bg-gray-600 text-white text-sm font-semibold rounded-xl transition disabled:opacity-60"
          >
            {loadingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
            Alterar senha
          </button>
        </form>
      </div>
    </div>
  )
}

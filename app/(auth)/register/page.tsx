'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Eye, EyeOff, Trophy, Loader2, UserPlus } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const schema = z.object({
  name: z.string().min(2, 'Nome deve ter ao menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, {
  message: 'Senhas não coincidem',
  path: ['confirmPassword'],
})

type FormData = z.infer<typeof schema>

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: { name: data.name },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
      toast.success('Conta criada! Verifique seu e-mail para confirmar o cadastro.')
      router.push('/login')
    } catch (err: any) {
      toast.error(err.message || 'Erro ao criar conta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-2xl mb-4 shadow-lg">
          <Trophy className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white">Criar Conta</h1>
        <p className="text-green-200 mt-1">Junte-se ao Bolão da Copa 2026!</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-green-100 mb-1.5">Nome completo</label>
          <input
            {...register('name')}
            placeholder="Seu nome"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-green-300/60 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          />
          {errors.name && <p className="text-red-300 text-sm mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-green-100 mb-1.5">E-mail</label>
          <input
            {...register('email')}
            type="email"
            placeholder="seu@email.com"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-green-300/60 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          />
          {errors.email && <p className="text-red-300 text-sm mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-green-100 mb-1.5">Senha</label>
          <div className="relative">
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-green-300/60 focus:outline-none focus:ring-2 focus:ring-green-400 transition pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-green-300 hover:text-white transition"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.password && <p className="text-red-300 text-sm mt-1">{errors.password.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-green-100 mb-1.5">Confirmar senha</label>
          <input
            {...register('confirmPassword')}
            type="password"
            placeholder="••••••••"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-green-300/60 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          />
          {errors.confirmPassword && <p className="text-red-300 text-sm mt-1">{errors.confirmPassword.message}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-green-500 hover:bg-green-400 disabled:opacity-60 text-white font-semibold rounded-xl transition flex items-center justify-center gap-2 shadow-lg mt-2"
        >
          {loading ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Criando conta...</>
          ) : (
            <><UserPlus className="w-5 h-5" /> Criar conta</>
          )}
        </button>
      </form>

      <p className="text-center text-green-200 mt-6">
        Já tem conta?{' '}
        <Link href="/login" className="text-white font-semibold hover:underline">
          Entrar
        </Link>
      </p>
    </div>
  )
}

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Eye, EyeOff, Trophy, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const schema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})

type FormData = z.infer<typeof schema>

export default function LoginPage() {
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
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })
      if (error) throw error
      toast.success('Bem-vindo ao Bolão da Copa! ⚽')
      router.push('/')
      router.refresh()
    } catch (err: any) {
      toast.error(err.message === 'Invalid login credentials'
        ? 'E-mail ou senha incorretos'
        : err.message || 'Erro ao fazer login')
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
        <h1 className="text-3xl font-bold text-white">Bolão da Copa</h1>
        <p className="text-green-200 mt-1">Copa do Mundo 2026 🏆</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-green-100 mb-1.5">
            E-mail
          </label>
          <input
            {...register('email')}
            type="email"
            placeholder="seu@email.com"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-green-300/60 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
          />
          {errors.email && (
            <p className="text-red-300 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-green-100 mb-1.5">
            Senha
          </label>
          <div className="relative">
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-green-300/60 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-green-300 hover:text-white transition"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-300 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-sm text-green-300 hover:text-white transition"
          >
            Esqueceu a senha?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-green-500 hover:bg-green-400 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition duration-200 flex items-center justify-center gap-2 shadow-lg"
        >
          {loading ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Entrando...</>
          ) : (
            'Entrar'
          )}
        </button>
      </form>

      <p className="text-center text-green-200 mt-6">
        Não tem conta?{' '}
        <Link href="/register" className="text-white font-semibold hover:underline">
          Cadastrar-se
        </Link>
      </p>
    </div>
  )
}

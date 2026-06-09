'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Trophy, Loader2, ArrowLeft, Mail } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const schema = z.object({
  email: z.string().email('E-mail inválido'),
})
type FormData = z.infer<typeof schema>

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const supabase = createClient()

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/perfil`,
      })
      if (error) throw error
      setSent(true)
      toast.success('E-mail de recuperação enviado!')
    } catch (err: any) {
      toast.error(err.message || 'Erro ao enviar e-mail')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-2xl mb-4">
          <Trophy className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white">Recuperar Senha</h1>
        <p className="text-green-200 mt-1 text-sm">Enviaremos um link para seu e-mail</p>
      </div>

      {sent ? (
        <div className="text-center py-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4">
            <Mail className="w-8 h-8 text-green-300" />
          </div>
          <p className="text-white font-semibold mb-2">E-mail enviado!</p>
          <p className="text-green-200 text-sm mb-6">
            Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
          </p>
          <Link href="/login" className="text-green-300 hover:text-white transition flex items-center justify-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Voltar ao login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-green-500 hover:bg-green-400 disabled:opacity-60 text-white font-semibold rounded-xl transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Enviando...</>
            ) : (
              'Enviar link de recuperação'
            )}
          </button>

          <Link href="/login" className="flex items-center justify-center gap-2 text-green-300 hover:text-white transition text-sm mt-2">
            <ArrowLeft className="w-4 h-4" /> Voltar ao login
          </Link>
        </form>
      )}
    </div>
  )
}

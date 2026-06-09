'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Trophy, LayoutDashboard, Users, BarChart2,
  Shield, Star, Menu, X, LogOut, Settings,
  Target, GitBranch
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Profile } from '@/types'
import { ThemeToggle } from './theme-toggle'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  profile: Profile | null
}

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/palpites', label: 'Meus Palpites', icon: Target },
  { href: '/grupos', label: 'Fase de Grupos', icon: Shield },
  { href: '/mata-mata', label: 'Mata-Mata', icon: GitBranch },
  { href: '/classificacao', label: 'Classificação', icon: BarChart2 },
  { href: '/perfil', label: 'Perfil', icon: Users },
]

export function Sidebar({ isOpen, onClose, profile }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    toast.success('Até logo!')
    router.push('/login')
    router.refresh()
  }

  return (
    <>
      {/* Overlay mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        'fixed top-0 left-0 h-full w-64 z-50 flex flex-col',
        'bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800',
        'transition-transform duration-300 ease-in-out',
        isOpen ? 'translate-x-0' : '-translate-x-full',
        'lg:translate-x-0 lg:static lg:z-auto'
      )}>
        {/* Logo */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-800">
          <Link href="/dashboard" className="flex items-center gap-3" onClick={onClose}>
            <div className="w-10 h-10 gradient-copa rounded-xl flex items-center justify-center shadow-md">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-gray-900 dark:text-white leading-tight">Bolão da</p>
              <p className="font-bold text-green-600 dark:text-green-400 leading-tight">Copa 2026</p>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Perfil */}
        {profile && (
          <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 gradient-copa rounded-full flex items-center justify-center text-white font-bold text-sm shadow">
                {profile.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 dark:text-white truncate text-sm">
                  {profile.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {profile.is_admin ? '👑 Administrador' : '⚽ Participante'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                  active
                    ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                )}
              >
                <Icon className={cn('w-5 h-5 flex-shrink-0', active ? 'text-green-600 dark:text-green-400' : '')} />
                {label}
                {active && <div className="ml-auto w-1.5 h-1.5 bg-green-500 rounded-full" />}
              </Link>
            )
          })}

          {profile?.is_admin && (
            <>
              <div className="pt-3 pb-1">
                <p className="px-3 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Administração
                </p>
              </div>
              <Link
                href="/admin"
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                  pathname.startsWith('/admin')
                    ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                )}
              >
                <Settings className="w-5 h-5" />
                Painel Admin
              </Link>
            </>
          )}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-800 space-y-1">
          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Tema</span>
            <ThemeToggle />
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
          >
            <LogOut className="w-5 h-5" />
            Sair
          </button>
        </div>
      </aside>
    </>
  )
}

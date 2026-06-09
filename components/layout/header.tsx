'use client'

import { Menu, Trophy } from 'lucide-react'

interface HeaderProps {
  onMenuClick: () => void
  title?: string
}

export function Header({ onMenuClick, title }: HeaderProps) {
  return (
    <header className="lg:hidden sticky top-0 z-30 bg-white/95 dark:bg-gray-900/95 backdrop-blur border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center gap-3">
      <button
        onClick={onMenuClick}
        className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition"
      >
        <Menu className="w-5 h-5 text-gray-700 dark:text-gray-300" />
      </button>
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 gradient-copa rounded-lg flex items-center justify-center">
          <Trophy className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-gray-900 dark:text-white">
          {title || 'Bolão da Copa'}
        </span>
      </div>
    </header>
  )
}

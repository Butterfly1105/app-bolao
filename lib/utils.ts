import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'A definir'
  try {
    return format(parseISO(dateStr), "dd/MM/yyyy", { locale: ptBR })
  } catch {
    return 'Data inválida'
  }
}

export function formatTime(dateStr: string | null): string {
  if (!dateStr) return '--:--'
  try {
    return format(parseISO(dateStr), "HH:mm", { locale: ptBR })
  } catch {
    return '--:--'
  }
}

export function formatDateTime(dateStr: string | null): string {
  if (!dateStr) return 'A definir'
  try {
    return format(parseISO(dateStr), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
  } catch {
    return 'A definir'
  }
}

export function formatDateLong(dateStr: string | null): string {
  if (!dateStr) return 'A definir'
  try {
    return format(parseISO(dateStr), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })
  } catch {
    return 'A definir'
  }
}

export function isPastMatch(dateStr: string | null): boolean {
  if (!dateStr) return false
  return new Date(dateStr) < new Date()
}

export function getRankBadgeColor(position: number): string {
  if (position === 1) return 'text-yellow-500'
  if (position === 2) return 'text-gray-400'
  if (position === 3) return 'text-amber-600'
  return 'text-gray-500'
}

export function getRankBadgeEmoji(position: number): string {
  if (position === 1) return '🥇'
  if (position === 2) return '🥈'
  if (position === 3) return '🥉'
  return `${position}º`
}

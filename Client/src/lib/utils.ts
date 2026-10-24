import { format, formatDistanceToNow, isPast, differenceInMinutes } from 'date-fns'
import type { TicketTier } from '../types'
export function formatEventDate(iso: string) {
  return format(new Date(iso), 'EEE, MMM d · h:mm a')
}
export function formatRelativeDate(iso: string) {
  return formatDistanceToNow(new Date(iso), { addSuffix: true })
}
export function formatPrice(paise: number) {
  if (paise === 0) return 'Free'
  return `₹${paise.toLocaleString('en-IN')}`
}
export function getEventStatus(scheduledAt: string, durationMinutes: number) {
  const start = new Date(scheduledAt)
  const end = new Date(start.getTime() + durationMinutes * 60 * 1000)
  const now = new Date()
  if (isPast(end)) return 'ended' as const
  if (isPast(start)) return 'live' as const
  if (differenceInMinutes(start, now) <= 15) return 'starting-soon' as const
  return 'upcoming' as const
}
export function canJoinEvent(scheduledAt: string, durationMinutes: number) {
  const start = new Date(scheduledAt)
  const end = new Date(start.getTime() + durationMinutes * 60 * 1000)
  const now = new Date()
  const joinWindow = new Date(start.getTime() - 15 * 60 * 1000)
  return now >= joinWindow && now <= end
}
export function tierColor(tier: TicketTier) {
  switch (tier) {
    case 'vip':
      return 'from-amber-400 to-orange-500'
    case 'standard':
      return 'from-violet-500 to-purple-600'
    default:
      return 'from-slate-400 to-slate-500'
  }
}
export function tierBadgeClass(tier: TicketTier) {
  switch (tier) {
    case 'vip':
      return 'bg-amber-500/20 text-amber-300 border-amber-500/30'
    case 'standard':
      return 'bg-violet-500/20 text-violet-300 border-violet-500/30'
    default:
      return 'bg-slate-500/20 text-slate-300 border-slate-500/30'
  }
}
export function saveTicketLocally(ticketId: string) {
  const existing = JSON.parse(localStorage.getItem('myTickets') || '[]') as string[]
  if (!existing.includes(ticketId)) {
    localStorage.setItem('myTickets', JSON.stringify([...existing, ticketId]))
  }
}
export function getLocalTickets(): string[] {
  return JSON.parse(localStorage.getItem('myTickets') || '[]')
}
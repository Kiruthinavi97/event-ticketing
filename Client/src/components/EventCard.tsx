import { Link } from 'react-router-dom'
import { Clock, Users } from 'lucide-react'
import type { Event } from '../types'
import { formatEventDate, formatPrice, getEventStatus } from '../lib/utils'
export default function EventCard({ event }: { event: Event }) {
  const status = getEventStatus(event.scheduledAt, event.durationMinutes)
  const minPrice = Math.min(...event.tiers.map((t) => t.price))
  const statusBadge = {
    live: { label: 'Live Now', class: 'bg-red-500/20 text-red-400 border-red-500/30 live-pulse' },
    'starting-soon': { label: 'Starting Soon', class: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
    upcoming: { label: 'Upcoming', class: 'bg-violet-500/20 text-violet-300 border-violet-500/30' },
    ended: { label: 'Ended', class: 'bg-slate-500/20 text-slate-400 border-slate-500/30' },
  }[status]
  return (
    <Link
      to={`/events/${event.id}`}
      className="glass rounded-2xl overflow-hidden card-hover block group"
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        <img
          src={event.coverImage}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <span
          className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-medium border ${statusBadge.class}`}
        >
          {statusBadge.label}
        </span>
        <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur text-sm font-semibold">
          From {formatPrice(minPrice)}
        </span>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-semibold text-white group-hover:text-violet-300 transition-colors line-clamp-2">
          {event.title}
        </h3>
        <p className="text-sm text-slate-400 mt-1.5 line-clamp-2">{event.description}</p>
        <div className="flex items-center gap-4 mt-4 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <Clock size={14} />
            {formatEventDate(event.scheduledAt)}
          </span>
          <span className="flex items-center gap-1.5">
            <Users size={14} />
            {event.attendeeCount} attending
          </span>
        </div>
      </div>
    </Link>
  )
}
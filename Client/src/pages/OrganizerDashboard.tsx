import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Calendar, Users, Video, Loader2 } from 'lucide-react'
import { api } from '../lib/api'
import { formatEventDate } from '../lib/utils'
import type { Event } from '../types'
export default function OrganizerDashboard() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    api.getEvents().then(setEvents).finally(() => setLoading(false))
  }, [])
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Organizer Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">Create events, manage tickets, and start video rooms</p>
        </div>
        <Link
          to="/organizer/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-medium hover:from-violet-500 hover:to-purple-500 transition-all"
        >
          <Plus size={18} />
          New Event
        </Link>
      </div>
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
        </div>
      ) : events.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center">
          <Video className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">No events yet. Create your first virtual meetup!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="glass rounded-xl p-5 flex flex-col sm:flex-row sm:items-center gap-4">
              <img
                src={event.coverImage}
                alt=""
                className="w-full sm:w-24 h-16 object-cover rounded-lg shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white truncate">{event.title}</h3>
                <div className="flex flex-wrap gap-3 mt-1.5 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {formatEventDate(event.scheduledAt)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users size={12} />
                    {event.attendeeCount} tickets sold
                  </span>
                  <span className={`capitalize ${event.roomStarted ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {event.roomStarted ? '● Room live' : '○ Room not started'}
                  </span>
                </div>
              </div>
              <Link
                to={`/organizer/${event.id}`}
                className="shrink-0 px-4 py-2 rounded-lg bg-white/5 text-sm text-white hover:bg-white/10 transition-colors text-center"
              >
                Manage
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

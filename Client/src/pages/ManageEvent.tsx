import { useEffect, useState, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Copy, Play, Square, Users, Loader2, ExternalLink } from 'lucide-react'
import { api } from '../lib/api'
import { formatEventDate } from '../lib/utils'
import type { Event } from '../types'
interface Attendee {
  id: string
  name: string
  email: string
  tier: string
  tierLabel: string
  checkedIn: boolean
}
export default function ManageEvent() {
  const { id } = useParams<{ id: string }>()
  const [event, setEvent] = useState<Event | null>(null)
  const [attendees, setAttendees] = useState<Attendee[]>([])
  const [loading, setLoading] = useState(true)
  const [pin, setPin] = useState('')
  const [actionLoading, setActionLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const refresh = useCallback(async () => {
    if (!id) return
    const [evt, att] = await Promise.all([api.getEvent(id), api.getAttendees(id)])
    setEvent(evt)
    setAttendees(att)
  }, [id])
  useEffect(() => {
    refresh().finally(() => setLoading(false))
    const interval = setInterval(refresh, 10000)
    return () => clearInterval(interval)
  }, [refresh])
  async function toggleRoom(start: boolean) {
    if (!event || !pin) return
    setActionLoading(true)
    try {
      if (start) await api.startRoom(event.id, pin)
      else await api.stopRoom(event.id, pin)
      await refresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Action failed')
    } finally {
      setActionLoading(false)
    }
  }
  function copyLink() {
    if (!event) return
    navigator.clipboard.writeText(`${window.location.origin}/events/${event.id}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
      </div>
    )
  }
  if (!event) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-slate-400">Event not found</p>
      </div>
    )
  }
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <Link to="/organizer" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white mb-6">
        <ArrowLeft size={16} /> Dashboard
      </Link>
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">{event.title}</h1>
          <p className="text-sm text-slate-400 mt-1">{formatEventDate(event.scheduledAt)} · {event.attendeeCount} tickets sold</p>
        </div>
        <button
          type="button"
          onClick={copyLink}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg glass text-sm text-white hover:bg-white/5"
        >
          <Copy size={14} />
          {copied ? 'Copied!' : 'Copy event link'}
        </button>
      </div>
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <div className="glass rounded-xl p-5">
          <h3 className="text-sm font-medium text-white mb-3">Video Room Control</h3>
          <p className="text-xs text-slate-500 mb-4">
            Enter your host PIN to start or stop the live room. Attendees in the waiting room will join automatically.
          </p>
          <input
            type="password"
            placeholder="Host PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500/50 mb-3"
          />
          <div className="flex gap-2">
            {!event.roomStarted ? (
              <button
                type="button"
                onClick={() => toggleRoom(true)}
                disabled={actionLoading || !pin}
                className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-500 disabled:opacity-50"
              >
                <Play size={16} /> Start Room
              </button>
            ) : (
              <button
                type="button"
                onClick={() => toggleRoom(false)}
                disabled={actionLoading || !pin}
                className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-600/80 text-white text-sm font-medium hover:bg-red-500 disabled:opacity-50"
              >
                <Square size={16} /> Stop Room
              </button>
            )}
            {event.roomStarted && (
              <Link
                to={`/room/${event.id}?host=true&name=${encodeURIComponent(event.organizerName)}`}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-medium hover:bg-violet-500"
              >
                <ExternalLink size={16} /> Join as Host
              </Link>
            )}
          </div>
          <p className={`text-xs mt-3 ${event.roomStarted ? 'text-emerald-400' : 'text-slate-500'}`}>
            Status: {event.roomStarted ? '● Room is live' : '○ Waiting for host'}
          </p>
        </div>
        <div className="glass rounded-xl p-5">
          <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
            <Users size={16} /> Attendee List
          </h3>
          {attendees.length === 0 ? (
            <p className="text-sm text-slate-500">No tickets sold yet</p>
          ) : (
            <ul className="space-y-2 max-h-48 overflow-y-auto">
              {attendees.map((a) => (
                <li key={a.id} className="flex items-center justify-between text-sm py-1.5 border-b border-white/5 last:border-0">
                  <div>
                    <p className="text-white">{a.name}</p>
                    <p className="text-xs text-slate-500">{a.email}</p>
                  </div>
                  <span className="text-xs text-violet-300">{a.tierLabel}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

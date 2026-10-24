import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ExternalLink, Loader2, Video } from 'lucide-react'
import TicketCard from '../components/TicketQR'
import { api } from '../lib/api'
import { canJoinEvent } from '../lib/utils'
import type { Event, Ticket } from '../types'
export default function TicketConfirmation() {
  const { id } = useParams<{ id: string }>()
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    if (!id) return
    api.getTicket(id).then(async (t) => {
      setTicket(t)
      const evt = await api.getEvent(t.eventId)
      setEvent(evt)
    }).finally(() => setLoading(false))
  }, [id])
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
      </div>
    )
  }
  if (!ticket) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-slate-400">Ticket not found</p>
        <Link to="/" className="text-violet-400 text-sm mt-2 inline-block">← Browse events</Link>
      </div>
    )
  }
  const joinable = event ? canJoinEvent(event.scheduledAt, event.durationMinutes) : false
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-8 animate-fade-in">
        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
          <svg className="w-7 h-7 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white">You're registered!</h1>
        <p className="text-slate-400 mt-2">Your ticket has been confirmed. Save this page or screenshot your QR code.</p>
      </div>
      <TicketCard ticket={ticket} />
      <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
        {joinable && event && (
          <Link
            to={`/room/${event.id}?token=${ticket.accessToken}&name=${encodeURIComponent(ticket.attendeeName)}`}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-medium hover:from-violet-500 hover:to-purple-500 transition-all"
          >
            <Video size={18} />
            Join Live Room
          </Link>
        )}
        <Link
          to={`/events/${ticket.eventId}`}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl glass text-white font-medium hover:bg-white/5 transition-colors"
        >
          <ExternalLink size={18} />
          Event Details
        </Link>
      </div>
      {!joinable && event && (
        <p className="text-center text-sm text-slate-500 mt-4">
          The join link activates 15 minutes before the event starts.
        </p>
      )}
    </div>
  )
}
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Ticket as TicketIcon, Loader2 } from 'lucide-react'
import { TicketSummary } from '../components/TicketQR'
import { api } from '../lib/api'
import { getLocalTickets } from '../lib/utils'
import type { Ticket } from '../types'
export default function MyTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const ids = getLocalTickets()
    if (ids.length === 0) {
      setLoading(false)
      return
    }
    Promise.all(ids.map((id) => api.getTicket(id).catch(() => null)))
      .then((results) => setTickets(results.filter(Boolean) as Ticket[]))
      .finally(() => setLoading(false))
  }, [])
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-2xl font-bold text-white mb-2">My Tickets</h1>
      <p className="text-slate-400 text-sm mb-8">Tickets you've purchased on this device</p>
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
        </div>
      ) : tickets.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center">
          <TicketIcon className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">No tickets yet</p>
          <Link to="/" className="text-violet-400 text-sm mt-2 inline-block">Browse events →</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {tickets.map((ticket) => (
            <Link key={ticket.id} to={`/tickets/${ticket.id}`}>
              <TicketSummary ticket={ticket} />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
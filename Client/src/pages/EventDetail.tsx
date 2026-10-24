      import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Check, Clock, Users, Loader2 } from 'lucide-react'
import { api, loadRazorpayScript, processPayment } from '../lib/api'
import {
  formatEventDate,
  formatPrice,
  getEventStatus,
  saveTicketLocally,
  tierBadgeClass,
} from '../lib/utils'
import type { Event, TicketTier } from '../types'
export default function EventDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedTier, setSelectedTier] = useState<TicketTier>('standard')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [purchasing, setPurchasing] = useState(false)
  const [error, setError] = useState('')
  useEffect(() => {
    if (!id) return
    api.getEvent(id).then(setEvent).finally(() => setLoading(false))
  }, [id])
  async function handlePurchase() {
    if (!event || !name.trim() || !email.trim()) {
      setError('Please fill in your name and email')
      return
    }
    setPurchasing(true)
    setError('')
    try {
      const order = await api.createOrder({
        eventId: event.id,
        tier: selectedTier,
        attendeeName: name.trim(),
        attendeeEmail: email.trim(),
      })

      
      if (!order.demo && !order.free) {
        await loadRazorpayScript()
      
      }
      const ticket = await processPayment(order, { name: name.trim(), email: email.trim() })
      saveTicketLocally(ticket.id)
      navigate(`/tickets/${ticket.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Purchase failed')
    } finally {
      setPurchasing(false)
    }
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
        <Link to="/" className="text-violet-400 text-sm mt-2 inline-block">← Back to events</Link>
      </div>
    )
  }
  const status = getEventStatus(event.scheduledAt, event.durationMinutes)
  const selectedTierConfig = event.tiers.find((t) => t.tier === selectedTier)
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white mb-6">
        <ArrowLeft size={16} /> All events
      </Link>
      <div className="grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <div className="rounded-2xl overflow-hidden aspect-[16/9] mb-6">
            <img src={event.coverImage} alt={event.title} className="w-full h-full object-cover" />
          </div>
          <h1 className="text-3xl font-bold text-white">{event.title}</h1>
          <p className="text-slate-400 mt-3 leading-relaxed">{event.description}</p>
          <div className="flex flex-wrap gap-4 mt-6 text-sm text-slate-400">
            <span className="flex items-center gap-2">
              <Clock size={16} className="text-violet-400" />
              {formatEventDate(event.scheduledAt)}
            </span>
            <span className="flex items-center gap-2">
              <Users size={16} className="text-violet-400" />
              {event.attendeeCount} attending
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs bg-violet-500/15 text-violet-300 capitalize">
              {status.replace('-', ' ')}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-4">
            Hosted by <span className="text-slate-300">{event.organizerName}</span>
          </p>
        </div>
        <div className="lg:col-span-2">
          <div className="glass rounded-2xl p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-white mb-4">Select a ticket</h2>
            <div className="space-y-3 mb-6">
              {event.tiers.map((tier) => (
                <button
                  key={tier.tier}
                  type="button"
                  onClick={() => setSelectedTier(tier.tier)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    selectedTier === tier.tier
                      ? 'border-violet-500/50 bg-violet-500/10'
                      : 'border-white/5 bg-white/[0.02] hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs border mb-1 ${tierBadgeClass(tier.tier)}`}>
                        {tier.label}
                      </span>
                      <p className="text-sm text-slate-400">{tier.description}</p>
                    </div>
                    <span className="text-lg font-bold text-white">{formatPrice(tier.price)}</span>
                  </div>
                  <ul className="mt-2 space-y-1">
                    {tier.perks.map((perk) => (
                      <li key={perk} className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Check size={12} className="text-violet-400 shrink-0" />
                        {perk}
                      </li>
                    ))}
                  </ul>
                </button>
              ))}
            </div>
            <div className="space-y-3 mb-5">
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500/50"
              />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500/50"
              />
            </div>
            {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
            <button
              type="button"
              onClick={handlePurchase}
              disabled={purchasing}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-medium hover:from-violet-500 hover:to-purple-500 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {purchasing ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Processing...
                </>
              ) : (
                <>Get Ticket — {formatPrice(selectedTierConfig?.price ?? 0)}</>
              )}
            </button>
            <p className="text-xs text-slate-500 text-center mt-3">
              Secure payment via Razorpay · Instant access link
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
    import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { api } from '../lib/api'
import type { TierConfig } from '../types'
const defaultTiers: TierConfig[] = [
  {
    tier: 'free',
    label: 'Free Pass',
    price: 0,
    description: 'Watch the live stream',
    perks: ['Live video access', 'Chat participation'],
  },
  {
    tier: 'standard',
    label: 'Standard',
    price: 499,
    description: 'Full access + recording',
    perks: ['Live video access', 'Event recording', 'Certificate'],
  },
  {
    tier: 'vip',
    label: 'VIP',
    price: 1499,
    description: 'Premium experience',
    perks: ['Front-row video', 'Recording', '1:1 networking', 'VIP badge'],
  },
]
export default function CreateEvent() {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    title: '',
    description: '',
    coverImage: '',
    scheduledAt: '',
    durationMinutes: 60,
    organizerName: '',
    organizerPin: '',
    freePrice: 0,
    standardPrice: 499,
    vipPrice: 1499,
  })
  function update(field: string, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title || !form.scheduledAt || !form.organizerName || !form.organizerPin) {
      setError('Please fill in all required fields')
      return
    }
    setSubmitting(true)
    setError('')
    const tiers: TierConfig[] = [
      { ...defaultTiers[0], price: form.freePrice },
      { ...defaultTiers[1], price: form.standardPrice },
      { ...defaultTiers[2], price: form.vipPrice },
    ]
    try {
      const event = await api.createEvent({
        title: form.title,
        description: form.description,
        coverImage: form.coverImage,
        scheduledAt: new Date(form.scheduledAt).toISOString(),
        durationMinutes: form.durationMinutes,
        organizerName: form.organizerName,
        organizerPin: form.organizerPin,
        tiers,
      })
      navigate(`/organizer/${event.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create event')
    } finally {
      setSubmitting(false)
    }
  }
  const inputClass =
    'w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500/50'
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
      <Link to="/organizer" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white mb-6">
        <ArrowLeft size={16} /> Dashboard
      </Link>
      <h1 className="text-2xl font-bold text-white mb-6">Create Event</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm text-slate-400 mb-1.5">Event Title *</label>
          <input className={inputClass} value={form.title} onChange={(e) => update('title', e.target.value)} placeholder="React Summit 2026" />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-1.5">Description</label>
          <textarea className={`${inputClass} min-h-[100px] resize-y`} value={form.description} onChange={(e) => update('description', e.target.value)} placeholder="Tell attendees what to expect..." />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-1.5">Cover Image URL</label>
          <input className={inputClass} value={form.coverImage} onChange={(e) => update('coverImage', e.target.value)} placeholder="https://images.unsplash.com/..." />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Date & Time *</label>
            <input type="datetime-local" className={inputClass} value={form.scheduledAt} onChange={(e) => update('scheduledAt', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Duration (minutes)</label>
            <input type="number" className={inputClass} value={form.durationMinutes} onChange={(e) => update('durationMinutes', Number(e.target.value))} min={15} />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Organizer Name *</label>
            <input className={inputClass} value={form.organizerName} onChange={(e) => update('organizerName', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Host PIN (4 digits) *</label>
            <input className={inputClass} value={form.organizerPin} onChange={(e) => update('organizerPin', e.target.value)} placeholder="1234" maxLength={6} />
          </div>
        </div>
        <div className="glass rounded-xl p-5">
          <h3 className="text-sm font-medium text-white mb-4">Ticket Tiers (₹)</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Free</label>
              <input type="number" className={inputClass} value={form.freePrice} onChange={(e) => update('freePrice', Number(e.target.value))} min={0} />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Standard</label>
              <input type="number" className={inputClass} value={form.standardPrice} onChange={(e) => update('standardPrice', Number(e.target.value))} min={0} />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">VIP</label>
              <input type="number" className={inputClass} value={form.vipPrice} onChange={(e) => update('vipPrice', Number(e.target.value))} min={0} />
            </div>
          </div>
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-medium hover:from-violet-500 hover:to-purple-500 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {submitting ? <><Loader2 size={18} className="animate-spin" /> Creating...</> : 'Create Event'}
        </button>
      </form>
    </div>
  )
}
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, Video, Ticket, Shield } from 'lucide-react'
import EventCard from '../components/EventCard'
import { api } from '../lib/api'
import type { Event } from '../types'
export default function Home() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    api.getEvents().then(setEvents).finally(() => setLoading(false))
  }, [])
  return (
    <>
      <section className="hero-glow py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs text-violet-300 mb-6">
            <Sparkles size={14} />
            Virtual events · Live video · Instant tickets
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white max-w-3xl mx-auto leading-tight">
            Buy a ticket.{' '}
            <span className="gradient-text">Join the room.</span>
          </h1>
          <p className="text-lg text-slate-400 mt-5 max-w-xl mx-auto">
            EventMeet combines ticketing and live video meetups into one seamless flow —
            perfect for workshops, summits, and virtual gatherings.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <a
              href="#events"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-medium hover:from-violet-500 hover:to-purple-500 transition-all shadow-lg shadow-violet-500/25"
            >
              Browse Events
              <ArrowRight size={18} />
            </a>
            <Link
              to="/organizer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass text-white font-medium hover:bg-white/5 transition-colors"
            >
              Create an Event
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-16 max-w-2xl mx-auto">
            {[
              { icon: Ticket, label: 'Pay per ticket', desc: 'Razorpay checkout' },
              { icon: Video, label: 'Live video', desc: 'Jitsi-powered rooms' },
              { icon: Shield, label: 'Secure access', desc: 'QR ticket confirmation' },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="glass rounded-xl p-4 text-left">
                <Icon className="w-5 h-5 text-violet-400 mb-2" />
                <p className="text-sm font-medium text-white">{label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section id="events" className="max-w-6xl mx-auto px-4 pb-20">
        <h2 className="text-2xl font-bold text-white mb-6">Upcoming Events</h2>
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass rounded-2xl h-72 animate-pulse" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <p className="text-slate-400">No events yet.</p>
            <Link to="/organizer/create" className="text-violet-400 hover:text-violet-300 text-sm mt-2 inline-block">
              Create the first one →
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>
    </>
  )
}
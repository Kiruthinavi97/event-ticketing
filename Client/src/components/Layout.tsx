import { Link, useLocation } from 'react-router-dom'
import { Calendar, LayoutDashboard, Ticket, Video } from 'lucide-react'
export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const nav = [
    { to: '/', label: 'Events', icon: Calendar },
    { to: '/my-tickets', label: 'My Tickets', icon: Ticket },
    { to: '/organizer', label: 'Organizer', icon: LayoutDashboard },
  ]
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 glass border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <Video className="w-4.5 h-4.5 text-white" size={18} />
            </div>
            <span className="text-lg font-semibold tracking-tight">
              Event<span className="gradient-text">Meet</span>
            </span>
          </Link>
          <nav className="flex items-center gap-1">
            {nav.map(({ to, label, icon: Icon }) => {
              const active = location.pathname === to
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? 'bg-violet-500/15 text-violet-300'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={16} />
                  <span className="hidden sm:inline">{label}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-white/5 py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-slate-500">
          EventMeet — Virtual events with integrated ticketing & live video
        </div>
      </footer>
    </div>
  )
}
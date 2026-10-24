import { useEffect, useState, useCallback } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { ArrowLeft, Loader2 } from 'lucide-react'
import JitsiRoom from '../components/JitsiRoom'
import WaitingRoom from '../components/WaitingRoom'
import { api } from '../lib/api'
import type { Event } from '../types'
export default function VideoRoom() {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const isHost = searchParams.get('host') === 'true'
  const displayName = searchParams.get('name') || 'Guest'
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const refresh = useCallback(async () => {
    if (!id) return
    const evt = await api.getEvent(id)
    setEvent(evt)
  }, [id])
  useEffect(() => {
    refresh().finally(() => setLoading(false))
    if (!isHost) {
      const interval = setInterval(refresh, 5000)
      return () => clearInterval(interval)
    }
  }, [refresh, isHost])
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
  const shouldShowVideo = isHost || event.roomStarted
  return (
    <div className="animate-fade-in">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          to={isHost ? `/organizer/${event.id}` : `/events/${event.id}`}
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white"
        >
          <ArrowLeft size={16} />
          {isHost ? 'Back to dashboard' : 'Event details'}
        </Link>
        <span className="text-sm text-slate-400 truncate max-w-[50%]">{event.title}</span>
      </div>
      {shouldShowVideo ? (
        <div className="max-w-6xl mx-auto px-4 pb-4">
          <JitsiRoom
            roomName={event.roomName}
            displayName={displayName}
            isModerator={isHost}
          />
        </div>
      ) : (
        <WaitingRoom
          eventTitle={event.title}
          attendeeCount={event.attendeeCount}
        />
      )}
    </div>
  )
}
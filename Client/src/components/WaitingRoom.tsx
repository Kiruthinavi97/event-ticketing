import { Clock, Users, Video } from 'lucide-react'
interface WaitingRoomProps {
  eventTitle: string
  attendeeCount: number
  isHost?: boolean
}
export default function WaitingRoom({ eventTitle, attendeeCount, isHost }: WaitingRoomProps) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="glass rounded-2xl p-8 max-w-lg w-full text-center animate-fade-in">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
          <Video className="w-10 h-10 text-violet-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Waiting Room</h2>
        <p className="text-slate-400 mb-6">{eventTitle}</p>
        <div className="flex justify-center gap-6 mb-8 text-sm">
          <div className="flex items-center gap-2 text-slate-400">
            <Clock size={16} />
            <span>Host hasn't started yet</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <Users size={16} />
            <span>{attendeeCount} registered</span>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex justify-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2.5 h-2.5 rounded-full bg-violet-500 animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
          <p className="text-sm text-slate-500">
            {isHost
              ? "Use the Start Room button in your dashboard when you're ready."
              : "You'll automatically join when the host starts the session."}
          </p>
        </div>
      </div>
    </div>
  )
}
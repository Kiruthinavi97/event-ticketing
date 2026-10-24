import { QRCodeSVG } from 'qrcode.react'
import type { Ticket } from '../types'
import { formatEventDate, formatPrice, tierBadgeClass } from '../lib/utils'
export default function TicketCard({ ticket }: { ticket: Ticket }) {
  const qrValue = JSON.stringify({
    id: ticket.id,
    token: ticket.accessToken,
    event: ticket.eventTitle,
  })
  return (
    <div className="glass rounded-2xl overflow-hidden max-w-md mx-auto animate-fade-in">
      <div className="h-2 bg-gradient-to-r from-violet-500 via-purple-500 to-cyan-500" />
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Event Ticket</p>
            <h2 className="text-xl font-bold text-white mt-1">{ticket.eventTitle}</h2>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${tierBadgeClass(ticket.tier)}`}>
            {ticket.tierLabel}
          </span>
        </div>
        <div className="flex gap-6 items-center">
          <div className="bg-white p-3 rounded-xl shrink-0">
            <QRCodeSVG value={qrValue} size={120} level="M" />
          </div>
          <div className="space-y-3 text-sm flex-1">
            <div>
              <p className="text-slate-500 text-xs">Attendee</p>
              <p className="text-white font-medium">{ticket.attendeeName}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs">Ticket ID</p>
              <p className="text-slate-300 font-mono text-xs">{ticket.id.slice(0, 8).toUpperCase()}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs">Amount Paid</p>
              <p className="text-white font-medium">{formatPrice(ticket.amountPaid)}</p>
            </div>
          </div>
        </div>
        <div className="mt-5 pt-4 border-t border-white/5 text-xs text-slate-500">
          Present this QR code at the event entrance · Valid for one attendee
        </div>
      </div>
    </div>
  )
}
export function TicketSummary({ ticket }: { ticket: Ticket }) {
  return (
    <div className="glass rounded-xl p-4 flex items-center justify-between">
      <div>
        <p className="font-medium text-white">{ticket.eventTitle}</p>
        <p className="text-sm text-slate-400">{ticket.tierLabel} · {formatEventDate(ticket.purchasedAt)}</p>
      </div>
      <span className={`px-2 py-0.5 rounded-full text-xs border ${tierBadgeClass(ticket.tier)}`}>
        {ticket.tierLabel}
      </span>
    </div>
  )
}
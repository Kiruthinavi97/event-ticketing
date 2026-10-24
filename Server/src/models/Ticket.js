import mongoose from 'mongoose'
const ticketSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    eventId: { type: String, required: true, index: true },
    eventTitle: String,
    tier: { type: String, enum: ['free', 'standard', 'vip'], required: true },
    tierLabel: String,
    attendeeName: String,
    attendeeEmail: String,
    accessToken: { type: String, required: true, index: true },
    amountPaid: Number,
    purchasedAt: { type: Date, default: Date.now },
    checkedIn: { type: Boolean, default: false },
  },
  { versionKey: false }
)
export function toTicketJson(doc) {
  if (!doc) return null
  const o = doc.toObject ? doc.toObject() : doc
  return {
    id: o.id,
    eventId: o.eventId,
    eventTitle: o.eventTitle,
    tier: o.tier,
    tierLabel: o.tierLabel,
    attendeeName: o.attendeeName,
    attendeeEmail: o.attendeeEmail,
    accessToken: o.accessToken,
    amountPaid: o.amountPaid,
    purchasedAt: new Date(o.purchasedAt).toISOString(),
    checkedIn: o.checkedIn,
  }
}
export const Ticket = mongoose.model('Ticket', ticketSchema)
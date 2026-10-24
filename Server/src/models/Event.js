import mongoose from 'mongoose'
const tierConfigSchema = new mongoose.Schema(
  {
    tier: { type: String, enum: ['free', 'standard', 'vip'], required: true },
    label: String,
    price: Number,
    description: String,
    perks: [String],
  },
  { _id: false }
)
const eventSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    description: String,
    coverImage: String,
    scheduledAt: { type: Date, required: true },
    durationMinutes: { type: Number, default: 60 },
    organizerName: { type: String, required: true },
    organizerPin: { type: String, required: true },
    roomName: { type: String, required: true },
    roomStarted: { type: Boolean, default: false },
    tiers: [tierConfigSchema],
    attendeeCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
)
export function toEventJson(doc) {
  if (!doc) return null
  const o = doc.toObject ? doc.toObject() : doc
  return {
    id: o.id,
    title: o.title,
    description: o.description,
    coverImage: o.coverImage,
    scheduledAt: new Date(o.scheduledAt).toISOString(),
    durationMinutes: o.durationMinutes,
    organizerName: o.organizerName,
    organizerPin: o.organizerPin,
    roomName: o.roomName,
    roomStarted: o.roomStarted,
    tiers: o.tiers,
    attendeeCount: o.attendeeCount,
    createdAt: new Date(o.createdAt).toISOString(),
  }
}
export function toPublicEvent(doc) {
  const event = toEventJson(doc)
  if (!event) return null
  const { organizerPin: _pin, ...publicEvent } = event
  return publicEvent
}
export const Event = mongoose.model('Event', eventSchema)
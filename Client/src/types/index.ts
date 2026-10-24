export type TicketTier = 'free' | 'standard' | 'vip'
export interface TierConfig {
  tier: TicketTier
  label: string
  price: number
  description: string
  perks: string[]
}
export interface Event {
  id: string
  title: string
  description: string
  coverImage: string
  scheduledAt: string
  durationMinutes: number
  organizerName: string
  organizerPin?: string
  roomName: string
  roomStarted: boolean
  tiers: TierConfig[]
  attendeeCount: number
  createdAt: string
}
export interface Ticket {
  id: string
  eventId: string
  eventTitle: string
  tier: TicketTier
  tierLabel: string
  attendeeName: string
  attendeeEmail: string
  accessToken: string
  amountPaid: number
  purchasedAt: string
  checkedIn: boolean
}
export interface CreateEventPayload {
  title: string
  description: string
  coverImage: string
  scheduledAt: string
  durationMinutes: number
  organizerName: string
  organizerPin: string
  tiers: TierConfig[]
}
export interface CreateOrderPayload {
  eventId: string
  tier: TicketTier
  attendeeName: string
  attendeeEmail: string
}
export interface VerifyPaymentPayload {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
  eventId: string
  tier: TicketTier
  attendeeName: string
  attendeeEmail: string
}
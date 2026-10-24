import { Router } from 'express'
import { createHmac } from 'crypto'
import { v4 as uuidv4 } from 'uuid'
import Razorpay from 'razorpay'
import { Event } from '../models/Event.js'
import { Ticket, toTicketJson } from '../models/Ticket.js'
const router = Router()
function generateAccessToken() {
  return uuidv4().replace(/-/g, '') + uuidv4().replace(/-/g, '').slice(0, 16)
}
async function issueTicket(payload, amountPaid) {
  const evt = await Event.findOne({ id: payload.eventId })
  if (!evt) throw new Error('Event not found')
  const tierConfig = evt.tiers.find((t) => t.tier === payload.tier)
  if (!tierConfig) throw new Error('Invalid tier')
  const ticket = await Ticket.create({
    id: uuidv4(),
    eventId: payload.eventId,
    eventTitle: evt.title,
    tier: payload.tier,
    tierLabel: tierConfig.label,
    attendeeName: payload.attendeeName,
    attendeeEmail: payload.attendeeEmail,
    accessToken: generateAccessToken(),
    amountPaid,
    purchasedAt: new Date(),
    checkedIn: false,
  })
  evt.attendeeCount += 1
  await evt.save()
  return toTicketJson(ticket)
}
router.post('/create-order', async (req, res) => {
  try {
    const body = req.body
    const evt = await Event.findOne({ id: body.eventId })
    if (!evt) return res.status(404).json({ error: 'Event not found' })
    const tierConfig = evt.tiers.find((t) => t.tier === body.tier)
    if (!tierConfig) return res.status(400).json({ error: 'Invalid tier' })
    if (tierConfig.price === 0) {
      return res.json({
        demo: true,
        free: true,
        amount: 0,
        eventId: body.eventId,
        tier: body.tier,
      })
    }
    const keyId = process.env.RAZORPAY_KEY_ID
    const keySecret = process.env.RAZORPAY_KEY_SECRET
    if (!keyId || !keySecret) {
      return res.json({
        demo: true,
        amount: tierConfig.price,
        currency: 'INR',
        eventId: body.eventId,
        tier: body.tier,
        message: 'Demo mode — Razorpay keys not configured',
      })
    }
    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret })
    const order = await razorpay.orders.create({
      amount: tierConfig.price * 100,
      currency: 'INR',
      receipt: `ticket_${body.eventId}_${Date.now()}`,
      notes: {
        eventId: body.eventId,
        tier: body.tier,
        attendeeName: body.attendeeName,
        attendeeEmail: body.attendeeEmail,
      },
    })
    res.json({
      orderId: order.id,
      amount: tierConfig.price,
      currency: 'INR',
      keyId,
      eventId: body.eventId,
      tier: body.tier,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to create order' })
  }
})
router.post('/verify', async (req, res) => {
  try {
    const body = req.body
    const evt = await Event.findOne({ id: body.eventId })
    if (!evt) return res.status(404).json({ error: 'Event not found' })
    const tierConfig = evt.tiers.find((t) => t.tier === body.tier)
    const amountPaid = tierConfig?.price ?? 0
    if (body.demo || body.free || amountPaid === 0) {
      const ticket = await issueTicket(body, amountPaid)
      return res.json({ success: true, ticket })
    }
    const keySecret = process.env.RAZORPAY_KEY_SECRET
    if (!keySecret) {
      const ticket = await issueTicket(body, amountPaid)
      return res.json({ success: true, ticket, demo: true })
    }
    const expectedSignature = createHmac('sha256', keySecret)
      .update(`${body.razorpay_order_id}|${body.razorpay_payment_id}`)
      .digest('hex')
    if (expectedSignature !== body.razorpay_signature) {
      return res.status(400).json({ error: 'Invalid payment signature' })
    }
    const ticket = await issueTicket(body, amountPaid)
    res.json({ success: true, ticket })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Payment verification failed' })
  }
})
export default router
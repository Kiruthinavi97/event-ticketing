import { Router } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { Event, toEventJson, toPublicEvent } from '../models/Event.js'
import { Ticket, toTicketJson } from '../models/Ticket.js'
import { slugify } from '../utils/slugify.js'
const router = Router()
router.get('/', async (_req, res) => {
  try {
    const docs = await Event.find().sort({ scheduledAt: 1 })
    res.json(docs.map((d) => toPublicEvent(d)))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})
router.get('/:id/attendees', async (req, res) => {
  try {
    const tickets = await Ticket.find({ eventId: req.params.id })
    res.json(
      tickets.map((t) => {
        const j = toTicketJson(t)
        return {
          id: j.id,
          name: j.attendeeName,
          email: j.attendeeEmail,
          tier: j.tier,
          tierLabel: j.tierLabel,
          checkedIn: j.checkedIn,
        }
      })
    )
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})
router.get('/:id', async (req, res) => {
  try {
    const doc = await Event.findOne({ id: req.params.id })
    if (!doc) return res.status(404).json({ error: 'Event not found' })
    res.json(toPublicEvent(doc))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})
router.post('/', async (req, res) => {
  try {
    const body = req.body
    const id = `${slugify(body.title || 'event')}-${uuidv4().slice(0, 8)}`
    const doc = await Event.create({
      id,
      title: body.title,
      description: body.description,
      coverImage:
        body.coverImage ||
        'https://images.unsplash.com/photo-1505373877841-8d25f39d4661?w=800&q=80',
      scheduledAt: new Date(body.scheduledAt),
      durationMinutes: body.durationMinutes || 60,
      organizerName: body.organizerName,
      organizerPin: body.organizerPin,
      roomName: `${slugify(body.title || 'event')}-${id.slice(-6)}`,
      roomStarted: false,
      tiers: body.tiers,
      attendeeCount: 0,
      createdAt: new Date(),
    })
    res.status(201).json(toEventJson(doc))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})
router.put('/:id', async (req, res) => {
  try {
    const doc = await Event.findOne({ id: req.params.id })
    if (!doc) return res.status(404).json({ error: 'Event not found' })
    const { action, pin } = req.body
    if (action === 'start-room') {
      if (pin !== doc.organizerPin) {
        return res.status(403).json({ error: 'Invalid organizer PIN' })
      }
      doc.roomStarted = true
      await doc.save()
      return res.json({ success: true, roomStarted: true })
    }
    if (action === 'stop-room') {
      if (pin !== doc.organizerPin) {
        return res.status(403).json({ error: 'Invalid organizer PIN' })
      }
      doc.roomStarted = false
      await doc.save()
      return res.json({ success: true, roomStarted: false })
    }
    res.status(400).json({ error: 'Unknown action' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})
export default router
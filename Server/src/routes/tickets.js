import { Router } from 'express'
import { Ticket, toTicketJson } from '../models/Ticket.js'
const router = Router()
router.get('/:id', async (req, res) => {
  try {
    const doc = await Ticket.findOne({ id: req.params.id })
    if (!doc) return res.status(404).json({ error: 'Ticket not found' })
    res.json(toTicketJson(doc))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})
export default router
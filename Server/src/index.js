import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import eventsRouter from './routes/events.js'
import paymentsRouter from './routes/payments.js'
import ticketsRouter from './routes/tickets.js'
import { seedDemoEventIfEmpty } from './seed.js'
const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '../../.env') })
dotenv.config()
const PORT = Number(process.env.PORT) || 5000
const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/eventmeet'
const app = express()
app.use(cors())
app.use(express.json())
app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})
app.use('/api/events', eventsRouter)
app.use('/api/payments', paymentsRouter)
app.use('/api/tickets', ticketsRouter)
async function start() {
  await mongoose.connect(MONGODB_URI)
  console.log('Connected to MongoDB')
  await seedDemoEventIfEmpty()
  app.listen(PORT, () => {
    console.log(`API listening on http://localhost:${PORT}`)
  })
}
start().catch((err) => {
  console.error('Failed to start server:', err)
  process.exit(1)
})
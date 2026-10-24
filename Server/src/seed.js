import { Event } from './models/Event.js'
export async function seedDemoEventIfEmpty() {
  const count = await Event.countDocuments()
  if (count > 0) return
  await Event.create({
    id: 'demo-react-summit',
    title: 'React Summit 2026 — Live Virtual Meetup',
    description:
      'Join 500+ developers for a live virtual summit on React 19, Server Components, and modern frontend architecture. Interactive Q&A with industry speakers.',
    coverImage:
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    scheduledAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
    durationMinutes: 90,
    organizerName: 'Tech Events Co.',
    organizerPin: '1234',
    roomName: 'react-summit-2026',
    roomStarted: false,
    tiers: [
      {
        tier: 'free',
        label: 'Free Pass',
        price: 0,
        description: 'Watch the live stream',
        perks: ['Live video access', 'Chat participation'],
      },
      {
        tier: 'standard',
        label: 'Standard',
        price: 499,
        description: 'Full access + recording',
        perks: ['Live video access', 'Event recording', 'Certificate'],
      },
      {
        tier: 'vip',
        label: 'VIP',
        price: 1499,
        description: 'Premium experience',
        perks: ['Front-row video', 'Recording', '1:1 networking', 'VIP badge'],
      },
    ],
    attendeeCount: 0,
    createdAt: new Date(),
  })
  console.log('Seeded demo event (organizer PIN: 1234)')
}
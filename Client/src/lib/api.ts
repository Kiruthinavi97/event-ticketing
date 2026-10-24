import type {
  CreateEventPayload,
  CreateOrderPayload,
  Event,
  Ticket,
  VerifyPaymentPayload,
} from '../types'
const BASE = import.meta.env.VITE_API_URL ?? '/api'
async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(err.error || 'Request failed')
  }
  return res.json()
}
export const api = {
  getEvents: () => request<Event[]>('/events'),
  getEvent: (id: string) => request<Event>(`/events/${id}`),
  getAttendees: (eventId: string) =>
    request<
      { id: string; name: string; email: string; tier: string; tierLabel: string; checkedIn: boolean }[]
    >(`/events/${eventId}/attendees`),
  createEvent: (payload: CreateEventPayload) =>
    request<Event>('/events', { method: 'POST', body: JSON.stringify(payload) }),
  startRoom: (eventId: string, pin: string) =>
    request<{ success: boolean }>(`/events/${eventId}`, {
      method: 'PUT',
      body: JSON.stringify({ action: 'start-room', pin }),
    }),
  stopRoom: (eventId: string, pin: string) =>
    request<{ success: boolean }>(`/events/${eventId}`, {
      method: 'PUT',
      body: JSON.stringify({ action: 'stop-room', pin }),
    }),
  createOrder: (payload: CreateOrderPayload) =>
    request<{
      orderId?: string
      amount: number
      currency?: string
      keyId?: string
      demo?: boolean
      free?: boolean
      eventId: string
      tier: string
    }>('/payments/create-order', { method: 'POST', body: JSON.stringify(payload) }),
  verifyPayment: (payload: VerifyPaymentPayload & { demo?: boolean; free?: boolean }) =>
    request<{ success: boolean; ticket: Ticket }>('/payments/verify', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  getTicket: (id: string) => request<Ticket>(`/tickets/${id}`),
}
declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void }
  }
}
export async function processPayment(
  orderData: Awaited<ReturnType<typeof api.createOrder>>,
  attendee: { name: string; email: string }
): Promise<Ticket> {
  if (orderData.free || orderData.demo) {
    const result = await api.verifyPayment({
      razorpay_order_id: 'demo',
      razorpay_payment_id: 'demo',
      razorpay_signature: 'demo',
      eventId: orderData.eventId,
      tier: orderData.tier as VerifyPaymentPayload['tier'],
      attendeeName: attendee.name,
      attendeeEmail: attendee.email,
      demo: true,
      free: orderData.free,
    })
    return result.ticket
  }
  return new Promise((resolve, reject) => {
    const options = {
      key: orderData.keyId,
      amount: orderData.amount * 100,
      currency: orderData.currency || 'INR',
      name: 'EventMeet',
      description: 'Event ticket purchase',
      order_id: orderData.orderId,
      handler: async (response: {
        razorpay_order_id: string
        razorpay_payment_id: string
        razorpay_signature: string
      }) => {
        try {
          const result = await api.verifyPayment({
            ...response,
            eventId: orderData.eventId,
            tier: orderData.tier as VerifyPaymentPayload['tier'],
            attendeeName: attendee.name,
            attendeeEmail: attendee.email,
          })
          resolve(result.ticket)
        } catch (err) {
          reject(err)
        }
      },
      prefill: { name: attendee.name, email: attendee.email },
      theme: { color: '#7c3aed' },
    }
    const rzp = new window.Razorpay(options)
    rzp.open()
  })
}
export function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve()
      return
    }
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Razorpay'))
    document.body.appendChild(script)
  })
}
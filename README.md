# EventMeet — Virtual Events & Live Meetups

EventMeet combines **event ticketing** and **live video meetups** in one flow. Organizers create virtual events and open a live room; attendees browse events, buy a ticket with Razorpay, and join the video room, all in one place.

**Live demo:** https://eventticketingguga.netlify.app/

> Note: the backend runs on a free Render instance, so the first request after a period of inactivity can take 30–60 seconds while it wakes up.

---

## Features

- **Browse events**: upcoming virtual events with cover image, schedule, duration and organizer details
- **Ticket tiers**: Free, Standard and VIP passes, each with its own price and perks
- **Razorpay checkout**: pay per ticket, with signature verification on the server
- **Demo / free mode**: free tickets and demo payments work without Razorpay keys
- **Live video rooms**: Jitsi-powered meeting rooms embedded in the app
- **Organizer dashboard**: create events, start and stop the live room (PIN-protected), view attendees and check-in status
- **My Tickets**: view purchased tickets with QR confirmation
- **Auto-seeded demo event**: the database is seeded with a sample event on first run

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, Vite, Tailwind CSS v4 |
| Backend | Node.js, Express (ES modules) |
| Database | MongoDB with Mongoose |
| Payments | Razorpay |
| Video | Jitsi Meet External API |
| Hosting | Netlify (frontend), Render (backend), MongoDB Atlas (database) |

## Project Structure

```
event-ticketing/
├── Client/                 # React + Vite frontend
│   ├── src/
│   │   ├── components/     # UI components (e.g. JitsiRoom)
│   │   ├── pages/          # Events, My Tickets, Organizer, ...
│   │   ├── lib/            # API client and Razorpay helpers
│   │   └── types/          # Shared TypeScript types
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
├── Server/                 # Express API
│   ├── src/
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # events, payments, tickets
│   │   ├── utils/
│   │   ├── seed.js         # Demo event seeding
│   │   └── index.js        # Server entry point
│   └── package.json
├── netlify.toml            # Netlify build + redirect config
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18 or later
- A MongoDB database (local MongoDB, or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster)
- Razorpay test keys (optional; the app falls back to demo mode without them)

### 1. Clone the repository

```bash
git clone https://github.com/Kiruthinavi97/event-ticketing.git
cd event-ticketing
```

### 2. Set up the backend

```bash
cd Server
npm install
```

Create `Server/.env` (see `Server/.env.example` for the exact variable names):

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/eventmeet
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
```

Start the server:

```bash
npm start
```

You should see `Connected to MongoDB` and `API listening on http://localhost:5000`. Check it at http://localhost:5000/api/health.

### 3. Set up the frontend

```bash
cd ../Client
npm install
npm run dev
```

The app runs at http://localhost:5173.

To let the frontend reach the API during development, either:

- add a proxy in `Client/vite.config.ts` (recommended locally):
  ```ts
  server: {
    proxy: {
      '/api': { target: 'http://localhost:5000', changeOrigin: true },
    },
  },
  ```
- or create `Client/.env` with `VITE_API_URL=http://localhost:5000/api`

Restart `npm run dev` after changing either one.

## Environment Variables

### Server

| Variable | Description |
|---|---|
| `PORT` | Port for the API (defaults to `5000`; Render sets this automatically) |
| `MONGODB_URI` | MongoDB connection string (use an Atlas URI in production) |
| `RAZORPAY_KEY_ID` | Razorpay key ID |
| `RAZORPAY_KEY_SECRET` | Razorpay key secret |

### Client

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the API, including `/api` (e.g. `https://your-service.onrender.com/api`). If unset, the app uses `/api`. |

## API Overview

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Health check |
| GET | `/api/events` | List events |
| GET | `/api/events/:id` | Get one event |
| POST | `/api/events` | Create an event |
| PUT | `/api/events/:id` | Start or stop the live room (`start-room` / `stop-room`, requires PIN) |
| GET | `/api/events/:id/attendees` | List attendees and check-in status |
| POST | `/api/payments/create-order` | Create a Razorpay order (or a free/demo order) |
| POST | `/api/payments/verify` | Verify payment and issue a ticket |
| GET | `/api/tickets/:id` | Get a ticket |

## Deployment

### Backend on Render

| Setting | Value |
|---|---|
| Root Directory | `Server` |
| Build Command | `npm install` |
| Start Command | `npm start` |

Add `MONGODB_URI` (an Atlas connection string) and the Razorpay variables under **Environment**. In Atlas, allow network access from Render (**Network Access → `0.0.0.0/0`**).

### Frontend on Netlify

`netlify.toml` at the repo root:

```toml
[build]
  base = "Client"
  command = "npm install && npm run build"
  publish = "dist"

[[redirects]]
  from = "/api/*"
  to = "https://<your-service>.onrender.com/api/:splat"
  status = 200
  force = true

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

The `/api/*` rule proxies API calls to Render, and the last rule makes client-side routes work on refresh. Alternatively, skip the proxy rule and set `VITE_API_URL` in Netlify's environment variables, then redeploy (Vite reads it at build time).

## Scripts

**Client**

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check with `tsc` and build for production |

**Server**

| Command | Description |
|---|---|
| `npm start` | Start the API (`node src/index.js`) |

## Screenshots

<!-- Add screenshots to a /docs or /screenshots folder and link them here -->

| Home | Event details | Live room |
|---|---|---|
| ![Home](docs/home.png) | ![Event](docs/event.png) | ![Room](docs/room.png) |

## Author

**Kiruthika** — [GitHub](https://github.com/Kiruthinavi97)

## License

This project was built for learning and portfolio purposes. Add a license of your choice (for example MIT) if you plan to share or reuse it.

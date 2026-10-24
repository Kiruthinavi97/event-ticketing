import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import EventDetail from './pages/EventDetail'
import TicketConfirmation from './pages/TicketConfirmation'
import OrganizerDashboard from './pages/OrganizerDashboard'
import CreateEvent from './pages/CreateEvent'
import ManageEvent from './pages/ManageEvent'
import VideoRoom from './pages/VideoRoom'
import MyTickets from './pages/MyTickets'
export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/tickets/:id" element={<TicketConfirmation />} />
          <Route path="/my-tickets" element={<MyTickets />} />
          <Route path="/organizer" element={<OrganizerDashboard />} />
          <Route path="/organizer/create" element={<CreateEvent />} />
          <Route path="/organizer/:id" element={<ManageEvent />} />
          <Route path="/room/:id" element={<VideoRoom />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
import { Route, Routes } from 'react-router-dom'
import HomePage from "./assets/pages/Home";
import CreateEventPage from "./assets/pages/CreateEvent";
import LoginPage from './assets/pages/Login';
import RegisterPage from './assets/pages/Register';
import GetStartedPage from './assets/pages/GetStarted';
import MyInvitationsPage from './assets/pages/MyInvitations';
import MyEventsPage from './assets/pages/MyEvents';
import EventPage from './assets/pages/Event';
import InvitationPage from './assets/pages/Invitation';

import EditEventPage from './assets/pages/EditEvent';
import { useSelector } from 'react-redux';
import LoginRequiredPage from './assets/pages/LoginRequired';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';

function App() {
  return (
    <> 
      <LocalizationProvider dateAdapter={ AdapterDateFns }>
        <Routes>
          <Route path="/get-started" element={<GetStartedPage />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          { protectedRoutes() }

        </Routes>
      </LocalizationProvider>
    </>
  )
}


function protectedRoutes() {
  const user = useSelector(state => state.user);
  const userIsLoggedIn = user._id != null;

  if(userIsLoggedIn === false) return ( <Route path='*' element={ <LoginRequiredPage /> } />)

  return (
    <>
      <Route path="/" element={<HomePage />} /> { /* A mix of information to be shown */}
      <Route path="/event/:event_id" element={<EventPage />} /> { /* Where specific event is shown */}
      <Route path="/create-event" element={<CreateEventPage />} /> { /* Where we create events */}
      <Route path="/edit-event/:event_id" element={<EditEventPage />} /> { /* Where we edit events */}
      <Route path="/events" element={<MyEventsPage />} /> { /* Where events are shown */}
      
      <Route path="/invitations" element={<MyInvitationsPage />} /> { /* Where invitations are shown */}
      <Route path="/invitation/:invitation_id" element={<InvitationPage />} /> { /* Where invitations are shown */}
    </>
  )
}

export default App

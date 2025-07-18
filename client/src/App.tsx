import { Routes, Route } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import Home from './pages/Home'
import TripPage from "./pages/TripPage"
import CartPage from './pages/CartPage'
import About from './pages/AboutPage'
import Services from './pages/ServicesPage'
import ProtectedRoute from './components/ProtectedRoute'
import DreamStayPage from './pages/DreamStayPage'
import HolidayPackagesPage from './pages/HolidayPackagesPage'
import CheckInPage from './pages/CheckInPage'
import ExplorePlacesPage from './pages/ExplorePlacesPage'
import ReviewPage from './pages/ReviewsPage'
import TermsPage from './pages/TermsPage'

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/trips/:id" element={<TripPage />} />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/dream-stay" element={<DreamStayPage />} />
        <Route path="/packages" element={<HolidayPackagesPage />} />
        <Route path="/checkin" element={<CheckInPage />} />
        <Route path="/tours" element={<ExplorePlacesPage/>} />
        <Route path="/reviews" element={<ReviewPage />} />
        <Route path="/terms" element={<TermsPage />} />
        {/* …другие маршруты… */}
      </Routes>
    </>
  )
}

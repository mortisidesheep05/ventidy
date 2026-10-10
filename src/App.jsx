import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import MainLayout from './layouts/MainLayout'
import AdminLayout from './layouts/AdminLayout'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import ComplaintRegistration from './pages/ComplaintRegistration'
import ComplaintTracking from './pages/ComplaintTracking'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'

import Dashboard from './pages/admin/Dashboard'
import AdminComplaints from './pages/admin/AdminComplaints'
import AdminUsers from './pages/admin/AdminUsers'
import AdminReports from './pages/admin/AdminReports'
import AdminSettings from './pages/admin/AdminSettings'

export default function App() {
  return (
    <>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/register-complaint" element={<ComplaintRegistration />} />
          <Route path="/track-complaint" element={<ComplaintTracking />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="complaints" element={<AdminComplaints />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>

      <ToastContainer position="top-right" theme="colored" autoClose={3500} />
    </>
  )
}

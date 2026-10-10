import { Outlet } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Chatbot from '../components/chatbot/Chatbot'

export default function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-ice text-navy-900 dark:bg-navy-950 dark:text-ice">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Chatbot />
    </div>
  )
}

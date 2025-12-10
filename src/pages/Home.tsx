import Navbar from '../components/Navbar'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Introduction section */}
      <section className="flex-1 flex flex-col items-center justify-center bg-gray-50 text-center px-4">
        <h1 className="text-4xl font-bold mb-4">Welcome to MyWebsite</h1>
        <p className="text-lg max-w-2xl mb-6">
          MyWebsite is a modern React application with JWT authentication, 
          protected routes, and a secure login system. Explore the features 
          by creating an account or logging in.
        </p>
        <div className="flex gap-3">
          <Link
            to="/register"
            className="px-6 py-3 rounded-3xl bg-green-600 text-white hover:bg-green-700"
          >
            Get Started
            <i className="fa-solid fa-arrow-right relative -right-2"></i>
          </Link>
          <Link
            to="/login"
            className="px-6 py-3 rounded-3xl bg-blue-600 text-white hover:bg-blue-700"
          >
            Login
          </Link>
        </div>
      </section>
    </div>
  )
}

import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="w-full bg-white shadow-md border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="text-xl font-bold text-gray-800">
          <Link to="/">MyWebsite</Link>
        </div>

        {/* Auth buttons */}
        <div className="flex gap-3">
          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="px-4 py-2 rounded-md font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-md font-medium text-white bg-green-600 hover:bg-green-700 transition-colors duration-200"
              >
                Sign up
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/dashboard"
                className="px-4 py-2 rounded-md font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
              >
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="px-4 py-2 rounded-md font-medium text-white bg-red-600 hover:bg-red-700 transition-colors duration-200"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
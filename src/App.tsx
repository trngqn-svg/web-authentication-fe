import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './hooks/useAuth'
import LoginPage from './pages/Login'
import Dashboard from './pages/Dashboard'
import { ProtectedRoute } from './components/ProtectedRoute'
import Home from './pages/Home'
import Register from './pages/Register'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="*" element={<div className="p-6">Not Found</div>} />
      </Routes>
    </AuthProvider>
  )
}

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './auth'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Admin from './pages/Admin'
import Home from './pages/Home'
import Kyc from './pages/Kyc'
import Login from './pages/Login'
import MyErrands from './pages/MyErrands'
import Profile from './pages/Profile'
import ProviderDetail from './pages/ProviderDetail'
import Providers from './pages/Providers'
import Register from './pages/Register'
import VerifyEmail from './pages/VerifyEmail'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/providers" element={<ProtectedRoute><Providers /></ProtectedRoute>} />
          <Route path="/providers/:userId" element={<ProtectedRoute><ProviderDetail /></ProtectedRoute>} />
          <Route path="/errands" element={<ProtectedRoute><MyErrands /></ProtectedRoute>} />
          <Route path="/kyc" element={<ProtectedRoute><Kyc /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute admin><Admin /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

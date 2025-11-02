import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import useAuthStore from '@/store/authStore'

// Pages
import Login from '@/pages/Login'
import Dashboard from '@/pages/Dashboard'
import Upload from '@/pages/Upload'
import EDA from '@/pages/EDA'
import MachineLearning from '@/pages/MachineLearning'
import Anomaly from '@/pages/Anomaly'
import Optimization from '@/pages/Optimization'
import Reports from '@/pages/Reports'
import Layout from '@/components/Layout'

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuthStore()
  return isAuthenticated ? children : <Navigate to="/login" />
}

function App() {
  return (
    <Router>
      <Toaster />
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="upload" element={<Upload />} />
          <Route path="eda/:uploadId" element={<EDA />} />
          <Route path="ml/:uploadId" element={<MachineLearning />} />
          <Route path="anomaly/:uploadId" element={<Anomaly />} />
          <Route path="optimization/:uploadId" element={<Optimization />} />
          <Route path="reports" element={<Reports />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App


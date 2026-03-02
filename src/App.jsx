import ExpenseTrackerApp from './expense_tracker_app'
import LoginPage from './components/LoginPage'
import { AuthProvider, useAuth } from './context/AuthContext'

function AppContent() {
  const { currentUser } = useAuth()
  
  return currentUser ? <ExpenseTrackerApp /> : <LoginPage />
}
{}
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

import ExpenseTrackerApp from './expense_tracker_app'
import { Analytics } from '@vercel/analytics/react'

export default function App() {
  return (
    <>
      <ExpenseTrackerApp />
      <Analytics />
    </>
  )
}

import { Analytics } from "@vercel/analytics/react";
import ExpenseTrackerApp from './expense_tracker_app'

export default function App() {
  return (
    <>
      <ExpenseTrackerApp />
      <Analytics />
    </>
  )
}

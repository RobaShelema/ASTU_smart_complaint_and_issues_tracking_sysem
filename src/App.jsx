import { BrowserRouter as Router } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            }
          }}
        />
        {/* Routes will go here */}
        <h1 className="text-3xl font-bold text-center mt-10">
          ASTU Smart Complaint System
        </h1>
      </div>
    </Router>
  )
}

export default App
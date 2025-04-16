import { Outlet } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import { AuthProvider } from './context/AuthContext'

function App() {
  console.log("App component rendered");

  return (
    <>
      <AuthProvider>
      <Header/>
      <main className="w-full min-h-screen px-0 py-0 ml-6">


          <Outlet/>
        </main>
      <Footer/>
      </AuthProvider>
    </>
  )
}

export default App
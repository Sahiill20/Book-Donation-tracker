import { Outlet } from 'react-router-dom'
import './App.css'
// import { Navbar } from './components/Navbar'
// import Footer from './components/Footer'
import { AuthProvider } from './context/AuthContext'

function App() {
  console.log("App component rendered");

  return (
    <>
      <AuthProvider>
      {/* <Navbar/> */}
        <main className='max-w-screen-2xl min-h-screen px-4 py-6 mx-auto '>
          <Outlet/>
        </main>
      {/* <Footer/> */}
      </AuthProvider>
    </>
  )
}

export default App
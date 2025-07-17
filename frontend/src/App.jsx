import { Outlet } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'

function App() {
  console.log("App component rendered");

  return (
    <>
      <Header/>
        
          <Outlet/>
        
      <Footer/>
    </>
  )
}

export default App
import React from 'react'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import { Outlet } from 'react-router-dom'
import LandingPage from '../layouts/LandingPage'

const Main = () => {
  return (
    <div>
      <Navbar/>

<Outlet/>
<LandingPage/>


      <Footer/>
    </div>
  )
}

export default Main

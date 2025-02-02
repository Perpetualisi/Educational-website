import React from 'react'
import Navbar from './component/Nav bar/Navbar'
import Hero from './component/Nav bar/Hero/Hero'
import Program from './component/Program/Program'
import Title from './component/Title/Title'
import About from './component/About/About'
import Campus from './component/Campus/Campus'
import Testimonial from './component/Testimonial/Testimonial'
import Contact from './component/Contact/Contact'
import Footer from './component/Footer/Footer'
import Videoplayer from './component/Videoplayer/Videoplayer'
import { useState } from "react";




const App = () => {

  const[playState, setPlayState] = useState(false);



  return (
    <div>
      <Navbar/>
      <Hero/>
      <div className="container">
      <Title subTitle= 'OUR PROGRAM' title= 'What We Offer'/>
      <Program/>
      <About setPlayState={setPlayState} />
      <Title subTitle= 'Gallary' title= 'Campus Photos'/>
      <Campus/>
      <Title subTitle= 'TESTIMONIALS' title= 'What Students Says'/>
      <Testimonial/>
      <Title subTitle= 'Contact Us' title= 'Get in Touch'/>
<Contact/>
<Footer/>  
      
      </div>
      <Videoplayer playState={playState} setPlayState={setPlayState}/> 
    </div>
  )
}

export default App


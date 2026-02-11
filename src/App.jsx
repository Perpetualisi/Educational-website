import React, { useState } from 'react'
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
import "./index.css"

const App = () => {
  const [playState, setPlayState] = useState(false);

  return (
    <div>
      <Navbar />
      <Hero />
      <div className="container">
        
        {/* PROGRAMS */}
        <div id="programs" className="scroll-mt">
          <Title subTitle='OUR PROGRAM' title='What We Offer' />
          <Program />
        </div>

        {/* ABOUT (ID is usually inside About.jsx, but we can wrap it here too for safety) */}
        <div id="about" className="scroll-mt">
          <About setPlayState={setPlayState} />
        </div>

        {/* CAMPUS / GALLERY */}
        <div id="campus" className="scroll-mt">
          <Title subTitle='Gallery' title='Campus Photos' />
          <Campus />
        </div>

        {/* TESTIMONIALS */}
        <div id="testimonial" className="scroll-mt">
          <Title subTitle='TESTIMONIALS' title='What Students Say' />
          <Testimonial />
        </div>

        {/* CONTACT */}
        <div id="contact" className="scroll-mt">
          <Title subTitle='Contact Us' title='Get in Touch' />
          <Contact />
        </div>

        <Footer />
      </div>
      <Videoplayer playState={playState} setPlayState={setPlayState} />
    </div>
  )
}

export default App
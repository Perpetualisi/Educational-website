import React from 'react'
import './Hero.css'
import dark_arrow from '../../../assets/dark-arrow.png'

const Hero = () => {
  return (
    <div className='hero container'>
      <div className='hero-text'>
      <h1>Empowering Minds for a Brighter Future</h1>
<p>At our institution, we offer an innovative curriculum designed to equip students with the knowledge, skills, and confidence to thrive in today’s ever-evolving world of education.</p>
        <br />
        <a href="#campus" className='btn'>
          Explore more <img className='imgg' src={dark_arrow} alt="" />
        </a>
      </div>
    </div>
  )
}

export default Hero

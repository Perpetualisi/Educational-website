import React from 'react'
import './Hero.css'
import dark_arrow from '../../../assets/dark-arrow.png'

const Hero = () => {
  return (
    <div className='hero container'>
      <div className='hero-text'>
        <h1>Empowering Minds, Shaping Futures</h1>
<p>
  We provide an innovative curriculum designed to help students grow, learn, and succeed, 
  fostering creativity, critical thinking, and the confidence to excel in an ever changing world.
</p>
        <br />
        <a href="#campus" className='btn'>
          Explore more <img className='imgg' src={dark_arrow} alt="" />
        </a>
      </div>
    </div>
  )
}

export default Hero

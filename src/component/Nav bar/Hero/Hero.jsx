import React from 'react'
import './Hero.css'
import dark_arrow from '../../../assets/dark-arrow.png'

const Hero = () => {
  return (
    <div className='hero container'>
      <div className='hero-text'>
        <h1>Empowering Minds, Shaping Futures</h1>
<p>
  Innovative learning to grow, think, and succeed in a changing world.
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

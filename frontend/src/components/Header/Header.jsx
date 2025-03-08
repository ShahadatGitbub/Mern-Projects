import React from 'react'
import './Header.css'
import banner_img from "../../assets/Banner-img.avif"
const Header = () => {
  return (
    <div className='header'>
      <div className="header-content">
        <div className="header-left">
            <h2>Streamline Your Campus Life with <span style = {{color: '#4b0082'}}>Campus 360</span></h2>
            <p>Without smart management, campus life can feel chaotic. With real-time solutions, simplify and excel effortlessly.</p>
            <button className='explore-btn'>Explore Now</button>
        </div>

        <div className="header-right">
            <img src={banner_img} alt="" />
        </div>
      </div>
    </div>
  )
}

export default Header;
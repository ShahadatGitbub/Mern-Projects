import React from 'react'
import Header from '../../components/Header/Header';
import Features from '../../components/Features/Features';
import UserGuide from '../../components/User Guide/UserGuide';
import Testimonial from '../../components/Testimonials/Testimonial';
const Home = () => {
  return (
    <div>
      <Header/>
      <UserGuide/>
      <Features/>
      <Testimonial/>
    </div>
  )
}

export default Home;
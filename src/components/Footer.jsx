import React from 'react'
import { FaCopyright, FaEnvelope, FaFacebook, FaGithub, FaLinkedin, FaPhone } from 'react-icons/fa'
import { FaAnglesRight, FaLocationDot } from 'react-icons/fa6'
import './Footer.css'
const Footer = () => {
  return (
    <>
      <footer id='footer'>
        <div className='container'>
          <div className='row'>
            <div className='col-md-3'>
              <a>
                <img src='/assets/images/flogo.png' alt='' className='img=fluid logo-footer' />
              </a>
            </div>
            <div className='col-md-3'>
              <div className='useful-link'>
                <h2>Useful Links</h2>
                <div className='use-links'>
                  <li><a href="/homepage"> <FaAnglesRight color='#ab875f'/> Home</a></li>
                  <li><a href="/about/us"> <FaAnglesRight color='#ab875f'/> About Us</a></li>
                  <li><a href='/contact_us'> <FaAnglesRight color='#ab875f'/> Contact Us</a></li>
                  <li><a href="/terms_condition"> <FaAnglesRight color='#ab875f'/> Terms and Conditions</a></li>
                </div>
              </div>
            </div>
            <div className='col-md-3'>
              <div className='social-links'>
                <h2>Follow Us</h2>
                <div className='f-social-icons'>
                  <a href='https://www.facebook.com/slesha.dahal.3'><i className='fa-brands fa-facebook-f'></i> <FaFacebook color='#ab875f' /> Facebook </a>
                  <a href='https://www.linkedin.com/in/slesha-dahal-047ba42a0/'><i className='fa-brands fa-linkedin'></i> <FaLinkedin color='#ab875f' /> LinkedIn </a>
                  <a href='https://github.com/slesha45'><i className='fa-brands fa-github'></i> <FaGithub color='#ab875f' /> GitHub</a>
                </div>
              </div>
            </div>
            <div className='col-md-3'>
              <div className='address'>
                <h2>Address</h2>
                <div className='address-links'>
                  <li> <FaLocationDot color='#ab875f' /> Maitidevi Kathmandu, Nepal</li>
                  <li> <FaPhone color='#ab875f' /> +977 9841297471</li>
                  <li> <FaEnvelope color='#ab875f' /> estateease@gmail.com</li>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <section id='copy-right'>
        <div className='copy-right-sec'>
          <FaCopyright /> 2024 EstateEase. All Rights Reserved.
        </div>
      </section>
    </>
  )
}

export default Footer

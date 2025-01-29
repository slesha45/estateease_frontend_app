import React from 'react'
import './Aboutus.css'

const Aboutus = () => {
  return (
    <>
    <div>
        <div className='heading'>
            <h1>About Us</h1>
            <p>A real estate management system, to make you find your desired property easier.</p>
        </div>
        <div className='container'>
            <section className='about'>
                <div className='about-image'>
                    <img src='/assets/images/register.png'></img>
                </div>
                <div className='about-content'>
                    <h2 style={{color: '#AB875F'}}>Welcome to Estate Ease!</h2>
                    <p>At our real estate management company, we are committed to offering our clients a diverse range of the latest and most innovative property solutions. Our journey has been extensive, giving us the expertise to provide you with premium quality services that are both efficient and cost-effective.</p>
                </div>
            </section>
        </div>
    </div>
    </>
  )
}

export default Aboutus

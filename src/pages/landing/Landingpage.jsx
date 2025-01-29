import React from 'react'
import { Link } from 'react-router-dom';

const Landingpage = () => {

  return (
    <div>
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="row w-100">
        <div className="col-12 d-flex justify-content-between align-items-start">
          <div className="left-side">
            <img src='../../assets/images/logo.png' alt="Estate Ease Logo" className="logo mb-4" />
            <h1 className="mb-4">Welcome to Estate Ease!</h1>
            <p className="mb-5">
              Look into Estate Ease to find the desired property you are looking for or trying to sell. Finding your happiness is our happiness. Explore more into Estate Ease.
            </p>
            <div className="d-flex justify-content-start mb-5">
              <Link to={'/login'} className="btn btn-secondary mx-2" style={{ backgroundColor: '#AB875F', borderColor: '#AB875F' }} >Login</Link>
              <Link to={'/register'} className="btn btn-secondary mx-2" style={{ backgroundColor: '#AB875F', borderColor: '#AB875F' }}>Register</Link>
            </div>
          </div>
          <div className="right-side">
            <img style={{ width: '89%', height: 'auto' }} src='../../assets/images/landing.png' alt="Landing" className="img-fluid landing-image" />
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}


export default Landingpage;

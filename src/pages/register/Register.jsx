import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { registerUserApi } from '../../apis/Api';
import ReCAPTCHA from 'react-google-recaptcha'; // <-- Import ReCAPTCHA
import './Register.css';

const Register = () => {
  // ---------- STATE DECLARATIONS ----------

  // Form Fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName]   = useState('');
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone]         = useState('');

  // Error Messages
  const [firstNameError, setFirstNameError]         = useState('');
  const [lastNameError, setLastNameError]           = useState('');
  const [emailError, setEmailError]                 = useState('');
  const [passwordError, setPasswordError]           = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [phoneError, setPhoneError]                 = useState('');
  const [captchaError, setCaptchaError]             = useState('');

  // Captcha State
  const [captchaToken, setCaptchaToken] = useState(null);

  // Password Strength
  const [passwordStrength, setPasswordStrength] = useState({ percentage: 0, label: '' });

  // ---------- HANDLERS FOR FIELD CHANGES ----------
  const handleFirstName = (e) => {
    setFirstName(e.target.value);
  };

  const handleLastName = (e) => {
    setLastName(e.target.value);
  };

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const handlePassword = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    evaluatePasswordStrength(newPassword);
  };

  const handleConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handlePhone = (e) => {
    setPhone(e.target.value);
  };

  // PASSWORD STRENGTH EVALUATION
  const evaluatePasswordStrength = (pwd) => {
    let strength = { percentage: 0, label: 'Weak' };

    if (pwd.length >= 8)       strength.percentage += 25;
    if (/[A-Z]/.test(pwd))     strength.percentage += 25;  
    if (/[a-z]/.test(pwd))     strength.percentage += 20;  
    if (/\d/.test(pwd))        strength.percentage += 15;  
    if (/[@$!%*?&]/.test(pwd)) strength.percentage += 15; 

    if (strength.percentage <= 40) {
      strength.label = 'Weak';
    } else if (strength.percentage <= 75) {
      strength.label = 'Strong';
    } else if (strength.percentage === 100) {
      strength.label = 'Very Strong';
    }
    setPasswordStrength(strength);
  };

  // ---------- CAPTCHA HANDLER ----------
  const handleCaptchaChange = (token) => {
    setCaptchaToken(token);
    setCaptchaError(''); // clear any captcha error on change
  };

  // ---------- VALIDATION ----------
  const validate = () => {
    let isValid = true;

    // Clear previous errors
    setFirstNameError('');
    setLastNameError('');
    setEmailError('');
    setPhoneError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setCaptchaError('');

    // Regex for robust password checks
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    // First Name
    if (!firstName.trim()) {
      setFirstNameError('First name is required!');
      isValid = false;
    }
    // Last Name
    if (!lastName.trim()) {
      setLastNameError('Last name is required!');
      isValid = false;
    }
    // Email: Must contain "@" and ".com"
    if (!email.trim() || !email.includes('@') || !email.includes('.com')) {
      setEmailError('A valid email is required!');
      isValid = false;
    }
    // Phone: Must be at least 10 characters
    if (!phone.trim() || phone.length < 10) {
      setPhoneError('A valid phone number is required!');
      isValid = false;
    }
    // Password
    if (!password.trim()) {
      setPasswordError('Password is required!');
      isValid = false;
    } else if (!passwordRegex.test(password)) {
      setPasswordError('Password must be at least 8 chars long, include uppercase, lowercase, number, and special char!');
      isValid = false;
    }
    // Confirm Password
    if (!confirmPassword.trim()) {
      setConfirmPasswordError('Confirm password is required!');
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match!');
      isValid = false;
    }
    // Captcha
    if (!captchaToken) {
      setCaptchaError('Captcha validation is required!');
      isValid = false;
    }

    return isValid;
  };

  // ---------- FORM SUBMIT ----------
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate
    if (!validate()) {
      return;
    }

    // Build data object
    const data = {
      firstName,
      lastName,
      email,
      password,
      phone,
      captchaToken
    };

    // API Call
    registerUserApi(data)
      .then((res) => {
        if (res.data.success === false) {
          toast.error(res.data.message);
        } else {
          toast.success(res.data.message);
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          toast.error(error.response.data.message);
        } else {
          toast.error('An error occurred. Please try again.');
        }
      });
  };

  // ---------- SOCIAL LOGIN HANDLERS (optional stubs) ----------
  const handleFacebookLogin = () => {
    // Implement your own Facebook login logic if desired
  };

  const handleGoogleLogin = () => {
    // Implement your own Google login logic if desired
  };

  // ---------- RENDER ----------
  return (
    <div className='register-container'>
      <div className="register-box">
        <div className="register-form">

          <h1>Welcome!</h1>
          <h2>Let's create an account!</h2>

          <form className='w-100' onSubmit={handleSubmit}>
            <label>First Name</label>
            <input
              onChange={handleFirstName}
              type='text'
              className='form-control'
              placeholder='Enter your first name'
            />
            {firstNameError && <p className='text-danger'>{firstNameError}</p>}

            <label className='mt-2'>Last Name</label>
            <input
              onChange={handleLastName}
              type='text'
              className='form-control'
              placeholder='Enter your last name'
            />
            {lastNameError && <p className='text-danger'>{lastNameError}</p>}

            <label className='mt-2'>Email</label>
            <input
              onChange={handleEmail}
              type='text'
              className='form-control'
              placeholder='Enter your email'
            />
            {emailError && <p className='text-danger'>{emailError}</p>}

            <label className='mt-2'>Phone Number</label>
            <input
              onChange={handlePhone}
              type='number'
              className='form-control'
              placeholder='Enter your phone number'
            />
            {phoneError && <p className='text-danger'>{phoneError}</p>}

            <label className='mt-2'>Password</label>
            <input
              onChange={handlePassword}
              type='password'
              className='form-control'
              placeholder='Enter your password'
            />
            {passwordError && <p className='text-danger'>{passwordError}</p>}

            {/* Password Strength Bar */}
            <div className="password-strength-bar">
              <div
                className={`password-strength-fill ${passwordStrength.label.toLowerCase()}`}
                style={{ width: `${passwordStrength.percentage}%` }}
              >
                <span>{passwordStrength.percentage}%</span>
              </div>
            </div>

            <label className='mt-2'>Confirm Password</label>
            <input
              onChange={handleConfirmPassword}
              type='password'
              className='form-control'
              placeholder='Confirm your password'
            />
            {confirmPasswordError && <p className='text-danger'>{confirmPasswordError}</p>}

            {/* reCAPTCHA */}
            <div className='mt-3'>
              <ReCAPTCHA
                sitekey="6LcZbb8qAAAAAK1Ik3xs59Lny8erLjrEzgeBttrd"
                onChange={handleCaptchaChange}
              />
              {captchaError && <p className='text-danger'>{captchaError}</p>}
            </div>

            <button type='submit' className='register-button'>
              Register
            </button>
          </form>

          <div className="social-login-container">
            <p className="or-text">or</p>
            <div className="social-icons">
              <img
                src="/assets/icons/facebook.png"
                alt="Facebook Login"
                onClick={handleFacebookLogin}
              />
              <img
                src="/assets/icons/google.png"
                alt="Google Login"
                onClick={handleGoogleLogin}
              />
            </div>
          </div>

          <p className='login-text'>
            Already have an account? <a href='/login'>Login</a>
          </p>
        </div>

        <div className="welcome-text">
          <h2>WELCOME!</h2>
          <img src='/assets/images/loginpage.png' alt='Register' />
          <p>Join us to find your dream home. Create an account now!</p>
        </div>
      </div>
    </div>
  );
};

export default Register;

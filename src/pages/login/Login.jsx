import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginUserApi } from "../../apis/Api";
import "./Login.css";

const Login = () => {
  // ---------- STATE DECLARATIONS ----------
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaToken, setCaptchaToken] = useState(null);

  // Errors
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [captchaError, setCaptchaError] = useState("");

  // Lockout & Attempts
  const [lockTime, setLockTime] = useState(null); // track how many seconds locked
  const [timer, setTimer] = useState(null);        // countdown state
  const [notification, setNotification] = useState(""); // In-case you want local messages

  const navigate = useNavigate();

  // ---------- VALIDATION ----------
  const validation = () => {
    let isValid = true;

    if (email.trim() === "" || !email.includes("@")) {
      setEmailError("Email is empty or invalid");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (password.trim() === "") {
      setPasswordError("Password is empty");
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (!captchaToken) {
      setCaptchaError("Please complete the CAPTCHA");
      isValid = false;
    } else {
      setCaptchaError("");
    }

    return isValid;
  };

  // ---------- LOCKOUT TIMER FUNCTION ----------
  const startCountdown = (lockDuration) => {
    let remainingTime = lockDuration; // in seconds
    setTimer(remainingTime);

    // Clear any existing intervals before setting a new one
    const interval = setInterval(() => {
      remainingTime -= 1;
      setTimer(remainingTime);

      if (remainingTime <= 0) {
        clearInterval(interval);
        setTimer(null);
        setLockTime(null);
        setNotification("");
      }
    }, 1000);
  };

  // ---------- LOGIN HANDLER ----------
  const handleLogin = async (e) => {
    e.preventDefault();

    // Perform validation
    if (!validation()) {
      return;
    }

    // Prepare data for API call
    const data = {
      email,
      password,
      captchaToken, // Include CAPTCHA token
    };

    try {
      const res = await loginUserApi(data);
      if (!res.data.success) {
        // If the response indicates a lockout (403 status + remainingTime)
        if (res.status === 403) {
          // If there's a remainingTime field => user is locked out
          if (res.data.remainingTime) {
            setLockTime(res.data.remainingTime);
            setNotification("Your account is locked. Please wait to try again.");
            toast.error(
              `Account is locked. Try again in ${res.data.remainingTime} seconds.`
            );
            startCountdown(res.data.remainingTime);
          } else {
            // fallback if locked but no remainingTime
            toast.error(res.data.message || "Account is locked!");
          }
        }
        // Handle incorrect password attempts and show attempts left
        else if (res.data.message === "Password not matched!") {
          const remainingAttempts = res.data.remainingAttempts;
          // If the API returns the number of attempts left, display it
          if (remainingAttempts !== undefined) {
            if (remainingAttempts === 3 || remainingAttempts === 2 || remainingAttempts === 1) {
              toast.error(
                `Password not matched! ${remainingAttempts} attempt(s) left.`
              );
            } else {
              // if a bigger number or different logic
              toast.error("Password not matched!");
            }
          } else {
            // fallback if no attempts info
            toast.error("Password not matched!");
          }
        }
        // General error
        else {
          toast.error(res.data.message);
        }
      } else {
        // ---------- SUCCESSFUL LOGIN ----------
        toast.success(res.data.message);
        // Save token and user data in localStorage
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.userData));

        // Redirect based on role
        if (res.data.userData.isAdmin) {
          window.location.href = "/admin/dashboard";
        } else {
          window.location.href = "/homepage";
        }
      }
    } catch (error) {
      // Catch any unexpected errors
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message || "User does not exist!");
      } else if (error.response && error.response.status === 403) {
        toast.error(error.response.data.message || "Account is locked!");
      } else {
        toast.error("An unexpected error occurred. Please try again later.");
      }
    }
  };

  // ---------- CAPTCHA CHANGE HANDLER ----------
  const handleCaptchaChange = (token) => {
    setCaptchaToken(token);
    setCaptchaError(""); // Clear previous CAPTCHA errors
  };

  // ---------- NAVIGATION HANDLERS ----------
  const handleForgotPassword = () => navigate("/forgot_password");
  const handleRegister = () => navigate("/register");

  // ---------- RENDER ----------
  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-form">
          <h2>Login</h2>

          {/* Notification or Lockout message (if any) */}
          {notification && (
            <div className="notification" style={{ color: "red" }}>
              {notification}
            </div>
          )}

          {/* Display lockout timer if lockTime is active */}
          {lockTime && timer && (
            <div className="lock-message" style={{ color: "red" }}>
              Your account is locked. Try again in {timer} seconds.
            </div>
          )}

          <form>
            <label>Email Address :</label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="text"
              className="form-control"
              placeholder="Enter your email address"
            />
            {emailError && <p className="error-message">{emailError}</p>}

            <label>Password</label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="form-control"
              placeholder="Enter your password"
            />
            {passwordError && <p className="error-message">{passwordError}</p>}

            <div className="captcha-container">
              <ReCAPTCHA
                sitekey="6LcZbb8qAAAAAK1Ik3xs59Lny8erLjrEzgeBttrd" // Replace with your actual site key
                onChange={handleCaptchaChange}
              />
              {captchaError && <p className="error-message">{captchaError}</p>}
            </div>

            {/* If account is locked, disable the button until timer ends */}
            <button
              onClick={handleLogin}
              className="btn login-button"
              disabled={!!lockTime}
            >
              Login
            </button>
            <p className="forgot-password-text">
              <span onClick={handleForgotPassword} style={{ cursor: "pointer" }}>
                Forgot your password?
              </span>
            </p>
          </form>

          <div className="social-login-container">
            <p className="or-text">or</p>
            <div className="social-icons">
              <img
                src="/assets/icons/facebook.png"
                alt="Facebook Login"
                onClick={() => toast.info("Facebook login is not implemented yet")}
              />
              <img
                src="/assets/icons/google.png"
                alt="Google Login"
                onClick={() => toast.info("Google login is not implemented yet")}
              />
            </div>
          </div>

          <p className="signup-text">
            Don't have an account?{" "}
            <span onClick={handleRegister} style={{ cursor: "pointer" }}>
              Sign Up
            </span>
          </p>
        </div>

        <div className="welcome-text">
          <h2>WELCOME BACK!</h2>
          <img src="/assets/images/loginpage.png" alt="Login" />
          <p>
            Hey there, please login to your account to continue Estate Ease! Always
            remember us if you're finding a home.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

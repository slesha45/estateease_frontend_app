import React, { useState, useEffect } from "react";
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
  const [timer, setTimer] = useState(null); // countdown state
  const [remainingAttempts, setRemainingAttempts] = useState(null); // attempts left
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

    const interval = setInterval(() => {
      remainingTime -= 1;
      setTimer(remainingTime);

      if (remainingTime <= 0) {
        clearInterval(interval);
        setTimer(null);
        setLockTime(null);
        // Optionally clear or update notification
        setNotification("");
      }
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
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

      // Log the response for debugging
      console.log("Login Response:", res.data);

      // Handle API responses based on status
      if (res.status === 200) {
        if (res.data.success) {
          // ---------- SUCCESSFUL LOGIN ----------
          toast.success(res.data.message);
          setNotification("");
          setRemainingAttempts(null);
          setLockTime(null);
          setTimer(null);

          // Save token and user data in localStorage
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("user", JSON.stringify(res.data.userData));

          // Redirect based on role
          if (res.data.userData.isAdmin) {
            window.location.href = "/admin/dashboard";
          } else {
            window.location.href = "/homepage";
          }
        } else {
          // Edge case: status=200 but success=false
          setNotification(res.data.message || "Something went wrong!");
          toast.error(res.data.message || "Something went wrong!");
        }
      } else if (res.status === 400) {
        // Typically "Incorrect password!" or "User does not exist!"
        if (res.data.message === "Incorrect password!") {
          const attemptsLeft = res.data.remainingAttempts;
          setRemainingAttempts(attemptsLeft);

          if (attemptsLeft > 0) {
            setNotification(`Password not matched! ${attemptsLeft} attempt(s) left.`);
            toast.error(`Password not matched! ${attemptsLeft} attempt(s) left.`);
          } else {
            setNotification("Password not matched!");
            toast.error("Password not matched!");
          }
        } else {
          // Could be 'User does not exist!'
          setNotification(res.data.message || "Login failed!");
          toast.error(res.data.message || "Login failed!");
        }
      } else if (res.status === 403) {
        // This is typically "Account locked due to multiple failed login attempts."
        // with a "remainingTime"
        if (res.data.remainingTime) {
          const lockDuration = res.data.remainingTime; // in seconds
          setLockTime(lockDuration);
          toast.error(`Account is locked. Try again in ${lockDuration} seconds.`);
          startCountdown(lockDuration);
        } else {
          toast.error(res.data.message || "Account is locked!");
        }
      } else {
        // Any other error status (500, etc.)
        toast.error(res.data.message || "An unexpected error occurred.");
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

  // ---------- EFFECT FOR CLEANUP ----------
  useEffect(() => {
    // Cleanup function to clear timer on component unmount
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [timer]);

  // ---------- RENDER ----------
  return (
    <>
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

            {/* Show attempts left if not locked */}
            {remainingAttempts !== null && remainingAttempts > 0 && !lockTime && (
              <div className="attempts-left" style={{ color: "orange", margin: "10px 0" }}>
                You have {remainingAttempts} attempt(s) left before the account locks.
              </div>
            )}

            {/* Display lockout timer if lockTime is active */}
            {lockTime && timer !== null && (
              <div className="lock-message" style={{ color: "red", margin: "10px 0" }}>
                Account locked! Try again in {timer} second{timer !== 1 ? "s" : ""}.
              </div>
            )}

            <form>
              <label>Email Address :</label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                type="text"
                className="form-control"
                placeholder="Enter your email address"
                value={email}
              />
              {emailError && <p className="error-message">{emailError}</p>}

              <label>Password</label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                className="form-control"
                placeholder="Enter your password"
                value={password}
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
                  style={{ cursor: "pointer" }}
                />
                <img
                  src="/assets/icons/google.png"
                  alt="Google Login"
                  onClick={() => toast.info("Google login is not implemented yet")}
                  style={{ cursor: "pointer" }}
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
    </>
  );
};

export default Login;
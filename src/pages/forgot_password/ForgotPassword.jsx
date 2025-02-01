import React, { useState } from 'react'
import { forgetPasswordApi, verifyOtpApi } from '../../apis/Api'
import { toast } from 'react-toastify'
import './ForgotPassword.css';
 
const ForgotPassword = () => {
    //make a state
    const [phone, setPhone] = useState('')
    const [isSent, setIsSent] = useState(false)
    const [otp, setOtp] = useState('')
    const [newPassword, setNewPassword] = useState('')
 
    //send otp function
    const handleSendOtp = (e) => {
        e.preventDefault()
 
        //api call
        forgetPasswordApi({ phone }).then((res) => {
            if (res.status === 200) {
                toast.success(res.data.message)
                setIsSent(true)
 
            }
        }).catch((error) => {
            if (error.response.status === 400 || 500) {
                toast.error(error.response.data.message)
            }
        })
    }
 
    //verify otp and set password
    const handleVerifyOtp = (e) => {
        e.preventDefault()
        const data = {
            'phone': phone,
            'otp': otp,
            'newPassword': newPassword
        }
        //api call
        verifyOtpApi(data).then((res) => {
            if (res.status === 200) {
                toast.success(res.data.message)
            }
        }).catch((error) => {
            if (error.response.status === 400 || 500) {
                toast.error(error.response.data.message)
            }
        })
    }
 
    return (
        <>
            <div className="forgot-password-container">
                <div className="form-card">
                    <h3>Forgot Password</h3>
                    <form>
                        <div className="input-group">
                            <span className="phone-prefix">+977</span>
                                <input
                                    disabled={isSent}
                                    onChange={(e) => setPhone(e.target.value)}
                                    type="number"
                                    className="form-control"
                                    placeholder="Enter valid phone number"
                                />
                            
                        </div>
                        <button
                            disabled={isSent}
                            onClick={handleSendOtp}
                            className={`btn forgot-password ${isSent ? 'disabled' : 'active'}`}
                        >
                            Send OTP
                        </button>
 
                        {isSent && (
                            <>
                                <p className="otp-sent-message">OTP has been sent to {phone}!</p>
                                <div className="input-group">
                                    <input
                                        onChange={(e) => setOtp(e.target.value)}
                                        type="number"
                                        className="form-control"
                                        placeholder="Enter valid OTP"
                                    />
                                </div>
                                <div className="input-group">
                                    <input
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        type="password"
                                        className="form-control"
                                        placeholder="Set new password"
                                    />
                                </div>
                                <button
                                    onClick={handleVerifyOtp}
                                    className="btn forgot-password active"
                                >
                                    Verify OTP and Set Password
                                </button>
                            </>
                        )}
                    </form>
                </div>
            </div>
        </>
    )
}
 
export default ForgotPassword

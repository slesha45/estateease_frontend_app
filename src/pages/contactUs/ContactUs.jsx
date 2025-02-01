import axios from 'axios';
import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import DOMPurify from 'dompurify'; // Import DOMPurify
import 'react-toastify/dist/ReactToastify.css';
import './ContactUs.css';

const ContactUs = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        message: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Sanitize user input before setting state
        const sanitizedValue = DOMPurify.sanitize(value);
        setFormData({ ...formData, [name]: sanitizedValue });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Sanitize formData before sending to backend
            const sanitizedFormData = {
                firstName: DOMPurify.sanitize(formData.firstName),
                lastName: DOMPurify.sanitize(formData.lastName),
                email: DOMPurify.sanitize(formData.email),
                message: DOMPurify.sanitize(formData.message)
            };

            const response = await axios.post('https://localhost:5000/api/contact/contact', sanitizedFormData);

            // Sanitize the response message before displaying
            const sanitizedMessage = DOMPurify.sanitize(response.data.message || 'Message submitted successfully');

            toast.success(sanitizedMessage); // Using toast for notifications
            // Reset form only if successful
            setFormData({ firstName: '', lastName: '', email: '', message: '' });
        } catch (error) {
            // Sanitize the error message before displaying
            const errorMessage = DOMPurify.sanitize(
                (error.response && error.response.data && error.response.data.message) || 'Error submitting form'
            );
            toast.error(errorMessage); // More robust error handling
        }
    };

    return (
        <div>
            <div className="contact-container">
                <div className="contact-form-container">
                    <h2>Contact Us</h2>
                    <p>Got confusion or have curious questions? Feel free to reach out to us!</p>
                    <form className="contact-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <input
                                type="text"
                                name="firstName"
                                placeholder="First Name"
                                required
                                value={formData.firstName}
                                onChange={handleChange}
                            />
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Last Name"
                                required
                                value={formData.lastName}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <textarea
                                name="message"
                                placeholder="Message"
                                required
                                value={formData.message}
                                onChange={handleChange}
                            ></textarea>
                        </div>
                        <button type="submit" className='send-button'>Send Message</button>
                    </form>
                </div>
                <div className="contact-image-container">
                    <img src="/assets/images/contact.png" alt="Contact Us" style={{ width: '100%', height: '50%' }} />
                </div>
            </div>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </div>
    );
};

export default ContactUs;
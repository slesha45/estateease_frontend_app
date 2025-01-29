import React, { useEffect, useState } from 'react';
import { FaBook, FaPhoneAlt } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { createBooking, getSingleProperty, getUserProfileApi, getReviewsApi, addReviewApi } from '../../../apis/Api';
import { toast } from 'react-toastify';
import Rating from 'react-rating-stars-component';

const ViewProperty = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [showCallModal, setShowCallModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: ''
  });
  const [minDate, setMinDate] = useState('');
  const [minTime, setMinTime] = useState('');
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState('');
  const [rating, setRating] = useState(1);
  const [averageRating, setAverageRating] = useState(0);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await getSingleProperty(id);
        setProperty(res.data.property);
      } catch (error) {
        console.log('Error fetching property:', error);
      }
    };

    const fetchUserProfile = async () => {
      try {
        const res = await getUserProfileApi();
        const { firstName, lastName, email, phone } = res.data;
        setBookingForm(prevForm => ({
          ...prevForm,
          name: `${firstName} ${lastName}`,
          email: email,
          phone: phone
        }));
      } catch (error) {
        console.log('Error fetching user profile:', error);
      }
    };

    const fetchReviews = async () => {
      try {
        const res = await getReviewsApi(id);
        setReviews(res.data.reviews);
        calculateAverageRating(res.data.reviews);
      } catch (err) {
        toast.error("Failed to fetch reviews");
      }
    };

    fetchProperty();
    fetchUserProfile();
    fetchReviews();

    const now = new Date();
    setMinDate(now.toISOString().split('T')[0]);
    setMinTime(now.toTimeString().slice(0, 5));
  }, [id]);

  const calculateAverageRating = (reviews) => {
    if (reviews.length === 0) {
      setAverageRating(0);
      return;
    }
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    setAverageRating(totalRating / reviews.length);
  };

  const handleCallClick = () => setShowCallModal(true);
  const handleBookClick = () => setShowBookingModal(true);
  const handleCloseCallModal = () => setShowCallModal(false);
  const handleCloseBookingModal = () => setShowBookingModal(false);

  const handleBookingFormChange = (e) => {
    const { name, value } = e.target;
    setBookingForm(prevForm => ({
      ...prevForm,
      [name]: value
    }));

    if (name === 'date') {
      const selectedDate = new Date(value);
      const currentDate = new Date(minDate);

      setMinTime(selectedDate.toDateString() === currentDate.toDateString()
        ? currentDate.toTimeString().slice(0, 5)
        : '00:00'
      );

      setBookingForm(prevForm => ({
        ...prevForm,
        time: ''
      }));
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
  
    const user = JSON.parse(localStorage.getItem('user')) // Fetch user from localStorage or context
  
    if (!user || !user._id) {
      toast.error("User not logged in. Please log in to continue.");
      return;
    }
  
    if (!bookingForm.date || !bookingForm.time) {
      toast.error("Please fill in all required fields.");
      return;
    }
  
    const bookingData = {
      userId: user._id,
      propertyId: id,
      date: bookingForm.date,
      time: bookingForm.time,
    };
  
    console.log("Booking Data:", bookingData);
  
    try {
      const res = await createBooking(bookingData);
      console.log("Booking Response:", res.data);
      toast.success("Booking created successfully!");
      setBookingForm({ name: '', email: '', phone: '', date: '', time: '' });
      setShowBookingModal(false);
    } catch (error) {
      console.error("Error creating booking:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Booking creation failed!");
    }
  };

  const submitReview = async () => {
    if (!rating || !newReview) {
      toast.error("Please provide both rating and comment");
      return;
    }

    try {
      const res = await addReviewApi({ propertyId: id, rating, comment: newReview });
      toast.success(res.data.message);
    // Refresh reviews after submitting a new one
      setRating(1); // Reset rating
      setNewReview(""); // Reset comment
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Failed to submit review");
      }
    }
  };

  if (!property) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-6">
            <img
              src={`https://localhost:5000/property/${property.propertyImage}`}
              alt={property.propertyTitle}
              className="img-fluid"
              style={{ width: '100%', height: '300px', objectFit: 'cover' }}
            />
            <div className="mt-3">
              <h2>{property.propertyTitle}</h2>
              <h4 className="text-danger">Rs {property.propertyPrice}</h4>
              <h5>Category: {property.propertyCategory}</h5>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card p-3">
              <h4>Property Details</h4>
              <p><strong>Location: </strong>{property.propertyLocation}</p>
              <p><strong>Date Added: </strong>{new Date(property.createdAt).toLocaleDateString()}</p>
              <p><strong>Status: </strong>Available</p>
              <p><strong>Views: </strong>{property.views}</p>
              <div className="mt-3">
                <button onClick={handleCallClick} className="btn btn-secondary me-2" style={{ backgroundColor: 'green', borderColor: 'green' }}>
                  <FaPhoneAlt /> Call
                </button>
                <button onClick={handleBookClick} className="btn btn-secondary" style={{ backgroundColor: '#AB875F', borderColor: '#AB875F' }}>
                  <FaBook /> Book
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container border p-3 rounded" style={{marginBottom: '50px', marginTop: '5px'}}>
        <div className="row">
          <div className="col-md-12">
            <h4>Customer Reviews</h4>
            <div className="review-summary mb-3">
            <Rating
              value={averageRating}
              edit={false}
              size={24}
              activeColor="#ffd700"
            />
            <p>{averageRating.toFixed(1)} out of 5 stars</p>
            <div className="reviews-list mt-3 ">
              {reviews.length === 0 ? (
                <p>No reviews yet.</p>
              ) : (
                reviews.map((rev, index) => (
                  <div key={index} className="review-item border p-3 rounded mt-1 ">
                    <p><strong>{rev.userId.firstName} {rev.userId.lastName}</strong></p>
                    <Rating
                      value={rev.rating}
                      edit={false}
                      size={20}
                      activeColor="#ffd700"
                    />
                    <p>{rev.comment}</p>
                  </div>
                ))
              )}
            </div>

            <div className="mt-3">
              <h4>Add a Review</h4>
              <div className="review-form border p-3 rounded">
              <textarea
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
                placeholder="Write your review here."
                rows="4"
                className="review-textarea form-control"
              />
              <div className="rating-input mt-2 d-flex align-items-center">
                <label className="me-2">Rating:</label>
                <select value={rating} onChange={(e) => setRating(parseInt(e.target.value, 10))}>
                  {[1, 2, 3, 4, 5].map(num => (
                    <option key={num} value={num}>{num} ★</option>
                  ))}
                </select>
              </div>
              <button className="btn btn-secondary mt-3" style={{ backgroundColor: '#AB875F', borderColor: '#AB875F' }} onClick={submitReview}>Submit Review</button>
            </div>
          </div>
        </div>
      </div>

      {showCallModal && (
        <div className="modal fade show" style={{ display: 'block' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Contact Information</h5>
                {/* <button type="button" className="btn-close" onClick={handleCloseCallModal}></button> */}
              </div>
              <div className="modal-body text-center">
                <img src='/assets/images/call.png' alt='call' className="img-fluid mb-3" style={{ width: '100px', height: '100px', objectFit: 'cover' }}></img>
                <h1>+977 9841297471</h1>
                <p>Make a call, get your property booked.</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" style={{ backgroundColor: '#AB875F', borderColor: '#AB875F' }} onClick={handleCloseCallModal}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

       {showBookingModal && (
        <div className="modal fade show" style={{ display: 'block' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" style={{ color: '#AB875F', alignContent: 'center' }}>Book Property</h5>
                <button type="button" className="btn-close" onClick={handleCloseBookingModal}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleBookingSubmit}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="text" className="form-control" id="name" name="name" value={bookingForm.name} onChange={handleBookingFormChange} required style={{ borderColor: '#AB875F' }} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" className="form-control" id="email" name="email" value={bookingForm.email} onChange={handleBookingFormChange} required style={{ borderColor: '#AB875F' }} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="phone" className="form-label">Phone</label>
                    <input type="tel" className="form-control" id="phone" name="phone" value={bookingForm.phone} onChange={handleBookingFormChange} required style={{ borderColor: '#AB875F' }}/>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="date" className="form-label">Preferred Date</label>
                    <input type="date" className="form-control" id="date" name="date" value={bookingForm.date} onChange={handleBookingFormChange} min={minDate} required style={{ borderColor: '#AB875F' }}/>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="time" className="form-label">Preferred Time</label>
                    <input type="time" className="form-control" id="time" name="time" value={bookingForm.time} onChange={handleBookingFormChange} min={minTime} required style={{ borderColor: '#AB875F' }}/>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                  <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#AB875F', borderColor: '#AB875F' }}>Submit Booking</button>
                  </div>
                  
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
      </div>
    </>
  );
};

export default ViewProperty;

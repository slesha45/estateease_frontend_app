import React, { useEffect, useState } from 'react';
import { FaBook, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { createBooking, getUserProfileApi, getUserWishlistApi, removeFromWishlistApi } from '../../apis/Api';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [error, setError] = useState(null);
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
  const [selectedProperty, setSelectedProperty] = useState(null);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const res = await getUserWishlistApi();
      if (Array.isArray(res.data.data)) {
        setWishlist(res.data.data);
      } else {
        throw new Error('Wishlist data is not an array');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching wishlist');
    }
  };

  const handleRemove = async (propertyId) => {
    const confirmDialog = window.confirm("Are you sure you want to remove this property from your wishlist?");
    if (!confirmDialog) return;

    try {
      await removeFromWishlistApi(propertyId);
      toast.success('Property removed from wishlist');
      fetchWishlist();
    } catch (err) {
      setError(err.response?.data?.message || 'Error removing property from wishlist');
      toast.error('Error removing property from wishlist');
    }
  };

  const handleBookClick = async (property) => {
    try {
      const res = await getUserProfileApi();
      const { firstName, lastName, email, phone } = res.data;
      setBookingForm({
        name: `${firstName} ${lastName}`,
        email: email,
        phone: phone,
        date: '',
        time: ''
      });
      const now = new Date();
      setMinDate(now.toISOString().split('T')[0]);
      setMinTime(now.toTimeString().slice(0, 5));
      setSelectedProperty(property);
      setShowBookingModal(true);
    } catch (error) {
      console.log('Error fetching user profile:', error);
    }
  };

  const handleBookingFormChange = (e) => {
    const { name, value } = e.target;
    setBookingForm(prevForm => ({
      ...prevForm,
      [name]: value
    }));

    if (name === 'date') {
      const selectedDate = new Date(value);
      const currentDate = new Date(minDate);
      setMinTime(selectedDate.toDateString() === currentDate.toDateString() ? currentDate.toTimeString().slice(0, 5) : '00:00');
      setBookingForm(prevForm => ({ ...prevForm, time: '' }));
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));
    const bookingData = {
      userId: user._id,
      propertyId: selectedProperty._id,
      date: bookingForm.date,
      time: bookingForm.time
    };

    try {
      const res = await createBooking(bookingData);
      console.log('Booking created:', res.data);
      setBookingForm({ name: '', email: '', phone: '', date: '', time: '' });
      setShowBookingModal(false);
      toast.success('Booking created successfully!');
    } catch (error) {
      console.error('Booking creation error:', error.response ? error.response.data : error.message);
      toast.error('Booking creation failed!');
    }
  };

  return (
    <>
      <div className="container mt-5" style={{ marginBottom: '50px' }}>
        <h2>My Wishlist</h2>
        {error && <p className="text-danger">{error}</p>}
        {wishlist.length === 0 ? (
          <p>Your wishlist is empty.</p>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
            {wishlist.map((property) => (
              <div key={property._id} className="col-md-4" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', border: '1px solid #ddd', padding: '10px', borderRadius: '5px', width: '300px', position: 'relative', backgroundColor: '#fff', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', width: '100%' }} />
                <img
                  src={`https://localhost:5000/property/${property.propertyImage}`}
                  alt={property.propertyTitle}
                  style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '5px 5px 0 0' }}
                />
                <div style={{ padding: '10px', textAlign: 'center' }}>
                  <h4>{property.propertyTitle}</h4>
                  <p className='text-danger'>
                    Rs {property.propertyPrice}</p>
                  <p>{property.propertyLocation}</p>
                  <button
                    style={{ marginTop: '10px', backgroundColor: '#AB875F', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}
                    onClick={() => handleBookClick(property)}
                  >
                    <FaBook /> Book
                  </button>
                </div>
                <button
                  style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', color: 'red', cursor: 'pointer' }}
                  onClick={() => handleRemove(property._id)}
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {showBookingModal && (
        <div className="modal fade show" style={{ display: 'block' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" style={{ color: '#AB875F', alignContent: 'center' }}>Book Property</h5>
                <button type="button" className="btn-close" onClick={() => setShowBookingModal(false)}></button>
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
                    <input type="tel" className="form-control" id="phone" name="phone" value={bookingForm.phone} onChange={handleBookingFormChange} required style={{ borderColor: '#AB875F' }} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="date" className="form-label">Preferred Date</label>
                    <input type="date" className="form-control" id="date" name="date" value={bookingForm.date} onChange={handleBookingFormChange} min={minDate} required style={{ borderColor: '#AB875F' }} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="time" className="form-label">Preferred Time</label>
                    <input type="time" className="form-control" id="time" name="time" value={bookingForm.time} onChange={handleBookingFormChange} min={minTime} required style={{ borderColor: '#AB875F' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                    <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#AB875F', border: 'none', padding: '10px 20px' }}>Book Now</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Wishlist;

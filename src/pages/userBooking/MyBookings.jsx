import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getUserBookings, updatePaymentMethod } from '../../apis/Api';
import KhaltiCheckout from "khalti-checkout-web";
import config from '../../components/KhaltiConfig';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await getUserBookings();
        console.log(response.data);
        setBookings(response.data.data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        toast.error('Error fetching bookings');
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, []);

  const handleProceedToPayment = (booking) => {
    setSelectedBooking(booking);
    setShowPaymentModal(true);
  };

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
    setSelectedBooking(null);
  };


  const handlePaymentMethod = async (method) => {
    try {
      await updatePaymentMethod({bookingId: selectedBooking._id, paymentMethod: method});
      setShowPaymentModal(false);
      toast.success('You need to wait for your booking approval !');
      const updatedBookings = bookings.map((booking) =>
        booking._id === selectedBooking._id ? { ...booking, paymentMethod: method } : booking
      );
      setBookings(updatedBookings);
    } catch (error) {
      console.error('Error updating payment method:', error);
      toast.error('Error updating payment method');
    }
  }
  const handleKhaltiPayment = () => {
    let checkout = new KhaltiCheckout(config);
    checkout.show({amount: 150})
}

  return (
    <div className="container mt-5" style={{marginBottom: '20px'}}>
      <h1>My Bookings</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="table table-bordered border-warning mt-2">
          <thead className='table-warning'>
            <tr>
              <th>Property</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <tr key={booking._id}>
                  <td>{booking.property?.propertyTitle}</td>
                  <td>{new Date(booking.date).toLocaleDateString()}</td>
                  <td>{booking.time}</td>
                  <td>{booking.status}</td>
                  <td>
                    {booking.paymentMethod ? (
                      <span>{booking.paymentMethod}</span>
                    ) : (
                      <button
                        className="btn btn-secondary"
                        style={{ backgroundColor: '#ab875f', borderColor: '#ab875f' }}
                        onClick={() => handleProceedToPayment(booking)}
                      >
                        Proceed to Payment
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  No bookings available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    {showPaymentModal && (
        <div className="modal fade show" style={{ display: 'block' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Select a payment method to book the property you are looking for:</h5>
                {/* <button type="button" className="btn-close" onClick={handleClosePaymentModal}></button> */}
              </div>
              <div className="modal-body text-center">
                <button className="btn btn-secondary me-2" style={{ backgroundColor: 'green', borderColor: 'green' }} onClick={() => handlePaymentMethod('Pay on arrival')}>
                  Pay upon Arrival
                </button>
                <button className="btn btn-secondary" style={{ backgroundColor: 'purple', borderColor: 'purple' }} onClick={()=>handleKhaltiPayment('Khalti Payment')}>
                  Khalti Payment
                </button>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" style={{ backgroundColor: '#AB875F', borderColor: '#AB875F' }} onClick={handleClosePaymentModal}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;

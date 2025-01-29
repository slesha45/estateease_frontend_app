import React, { useEffect, useState } from 'react';
import { getAllBookings, updateBookingStatus } from '../../../apis/Api';
import { toast } from 'react-toastify';

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await getAllBookings();
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

  const handleApprove = async (bookingId) => {
    try {
      await updateBookingStatus({bookingId, status: 'approved'});
      const updateBookings = bookings.map((booking) =>
        booking._id === bookingId ? { ...booking, status: 'approved' } : booking
      )
      setBookings(updateBookings);
    } catch (error) {
      console.error('Error approving booking:', error);
      toast.error('Error updating booking status');
    }
  };

  return (
    <div className="container mt-5">
      <h1>Booking List</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="table table-bordered border-warning mt-2">
          <thead className='table-warning'>
            <tr>
              <th>User</th>
              <th>Property</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Payment Method</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <tr key={booking._id}>
                  <td>{booking.user?.firstName}</td>
                  <td>{booking.property?.propertyTitle}</td>
                  <td>{new Date(booking.date).toLocaleDateString()}</td>
                  <td>{booking.time}</td>
                  <td>{booking.status}</td>
                  <td>{booking.paymentMethod}</td>
                  <td>
                    {booking.status === 'pending' && (
                      <button
                        className="btn btn-success"
                        onClick={() => handleApprove(booking._id)}
                        style={{ backgroundColor: '#ab875f', borderColor: 'ab875f' }}
                      >
                        Approve
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No bookings available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BookingList;

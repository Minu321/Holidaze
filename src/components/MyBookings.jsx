import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingApi } from '../utils/api';

export default function MyBookings({ user }) {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await bookingApi.getUserBookings(user.name);
        
        setBookings(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setError(error.message || 'An error occurred while fetching your bookings.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  if (!user) {
    return (
      <div className="text-center mt-8">
        <p>Please log in to view your bookings.</p>
        <Link to="/login" className="text-blue-500 hover:underline">Log in</Link>
      </div>
    );
  }

  if (isLoading) {
    return <div className="text-center mt-8">Loading your bookings...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>
      {bookings.length === 0 ? (
        <div className="text-center mt-8">
          <p>You don't have any bookings yet.</p>
          <Link to="/" className="text-blue-500 hover:underline">Browse venues</Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white shadow-md rounded-lg overflow-hidden">
              {booking.venue && booking.venue.media && booking.venue.media.length > 0 ? (
                <img
                  src={booking.venue.media[0].url}
                  alt={booking.venue.name}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">No image available</span>
                </div>
              )}
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{booking.venue ? booking.venue.name : 'Unknown Venue'}</h2>
                <p className="text-gray-600 mb-2">
                  {new Date(booking.dateFrom).toLocaleDateString()} - {new Date(booking.dateTo).toLocaleDateString()}
                </p>
                <p className="text-gray-600 mb-4">Guests: {booking.guests}</p>
                {booking.venue && (
                  <Link
                    to={`/venues/${booking.venue.id}`}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
                  >
                    View Venue
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
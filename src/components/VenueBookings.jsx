import React, { useState, useEffect } from 'react';
import { venueApi } from '../utils/api';

export default function VenueBookings({ venueId, onClose }) {
  const [venue, setVenue] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVenueBookings = async () => {
      try {
        const response = await venueApi.getVenue(venueId, true);
        setVenue(response.data);
      } catch (error) {
        console.error('Error fetching venue bookings:', error);
        setError(error.message || 'An error occurred while fetching venue bookings.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVenueBookings();
  }, [venueId]);

  const sortedBookings = venue?.bookings?.sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom)) || [];

  if (isLoading) return <div>Loading venue bookings...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!venue) return <div>No venue found</div>;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mt-2">{venue.name} Bookings</h3>
          <div className="mt-2 px-7 py-3">
            {sortedBookings.length === 0 ? (
              <p>No bookings for this venue.</p>
            ) : (
              <ul className="space-y-2">
                {sortedBookings.map((booking) => (
                  <li key={booking.id} className="text-sm text-gray-500">
                    <span className="font-semibold">
                      {new Date(booking.dateFrom).toLocaleDateString()} - {new Date(booking.dateTo).toLocaleDateString()}
                    </span>
                    <br />
                    Guests: {booking.guests}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="items-center px-4 py-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
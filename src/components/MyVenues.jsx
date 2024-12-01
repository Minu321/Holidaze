import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { profileApi } from '../utils/api';
import VenueBookings from './VenueBookings';

export default function MyVenues({ user }) {
  const [venues, setVenues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVenueId, setSelectedVenueId] = useState(null);

  useEffect(() => {
    const fetchVenues = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await profileApi.getUserVenues(user.name);
        setVenues(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching venues:', error);
        setError(error.message || 'An error occurred while fetching your venues.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVenues();
  }, [user]);

  if (!user) {
    return (
      <div className="text-center mt-8">
        <p>Please log in to view your venues.</p>
        <Link to="/login" className="text-blue-500 hover:underline">Log in</Link>
      </div>
    );
  }

  if (isLoading) {
    return <div className="text-center mt-8">Loading your venues...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Venues</h1>
      {venues.length === 0 ? (
        <div className="text-center mt-8">
          <p>You don't have any venues yet.</p>
          <Link to="/create-venue" className="text-blue-500 hover:underline">Create a venue</Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {venues.map((venue) => (
            <div key={venue.id} className="bg-white shadow-md rounded-lg overflow-hidden">
              {venue.media && venue.media.length > 0 ? (
                <img
                  src={venue.media[0].url}
                  alt={venue.name}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">No image available</span>
                </div>
              )}
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{venue.name}</h2>
                <p className="text-gray-600 mb-4">{venue.description}</p>
                <div className="flex justify-between items-center">
                  <Link
                    to={`/venues/${venue.id}`}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => setSelectedVenueId(venue.id)}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
                  >
                    View Bookings
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {selectedVenueId && (
        <VenueBookings
          venueId={selectedVenueId}
          onClose={() => setSelectedVenueId(null)}
        />
      )}
    </div>
  );
}
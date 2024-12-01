import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { profileApi, venueApi } from '../utils/api';

export default function MyVenues({ user }) {
  const [venues, setVenues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVenues = async () => {
      if (!user || !user.venueManager) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await profileApi.getUserVenues(user.name);
        if (response && response.data && Array.isArray(response.data)) {
          setVenues(response.data);
        } else {
          setVenues([]);
        }
      } catch (error) {
        console.error('Error fetching venues:', error);
        setError(error.message || 'An error occurred while fetching your venues.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVenues();
  }, [user]);

  const handleDelete = async (venueId) => {
    if (window.confirm('Are you sure you want to delete this venue?')) {
      try {
        await venueApi.deleteVenue(venueId);
        setVenues(venues.filter(venue => venue.id !== venueId));
      } catch (error) {
        setError(`Failed to delete venue: ${error.message}`);
      }
    }
  };

  if (isLoading) {
    return <div className="text-center mt-8">Loading your venues...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-600">Error: {error}</div>;
  }

  if (!user || !user.venueManager) {
    return <div className="text-center mt-8">You must be logged in as a venue manager to view this page.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Venues</h2>
        <Link 
          to="/create-venue" 
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300"
        >
          Create New Venue
        </Link>
      </div>
      {venues.length === 0 ? (
        <p>You haven't created any venues yet.</p>
      ) : (
        <div className="grid gap-6">
          {venues.map((venue) => (
            <div key={venue.id} className="bg-white shadow-md rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">{venue.name}</h3>
              <p className="mb-2">{venue.description ? `${venue.description.slice(0, 100)}...` : 'No description available'}</p>
              <p className="mb-2"><strong>Price:</strong> ${venue.price} per night</p>
              <p className="mb-2"><strong>Max Guests:</strong> {venue.maxGuests}</p>
              <div className="flex space-x-4 mt-4">
                <Link 
                  to={`/venues/${venue.id}`} 
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition duration-300"
                >
                  View Details
                </Link>
                <Link 
                  to={`/venues/${venue.id}/edit`} 
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded transition duration-300"
                >
                  Edit
                </Link>
                <button 
                  onClick={() => handleDelete(venue.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition duration-300"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
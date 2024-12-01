import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { venueApi } from '../utils/api';

export default function EditVenue({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [venue, setVenue] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVenue = async () => {
      if (!user || !user.venueManager) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await venueApi.getVenue(id);
        if (response && response.data) {
          setVenue(response.data);
        } else {
          throw new Error('Venue data not found');
        }
      } catch (error) {
        console.error('Error fetching venue:', error);
        setError(error.message || 'An error occurred while fetching the venue.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVenue();
  }, [user, id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setVenue(prevVenue => ({
      ...prevVenue,
      [name]: type === 'checkbox' 
        ? { ...prevVenue.meta, [name]: checked }
        : type === 'number' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await venueApi.updateVenue(id, venue);
      alert('Venue updated successfully!');
      navigate('/my-venues');
    } catch (error) {
      console.error('Error updating venue:', error);
      setError(`Failed to update venue: ${error.message}`);
    }
  };

  if (isLoading) {
    return <div className="text-center mt-8">Loading venue details...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-600">Error: {error}</div>;
  }

  if (!user || !user.venueManager) {
    return <div className="text-center mt-8">You must be logged in as a venue manager to edit venues.</div>;
  }

  if (!venue) {
    return <div className="text-center mt-8">Venue not found.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-2xl font-bold mb-6">Edit Venue: {venue.name}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Venue Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            name="name"
            type="text"
            value={venue.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
            Description
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="description"
            name="description"
            value={venue.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
            Price per Night
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="price"
            name="price"
            type="number"
            value={venue.price}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="maxGuests">
            Max Guests
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="maxGuests"
            name="maxGuests"
            type="number"
            value={venue.maxGuests}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <span className="block text-gray-700 text-sm font-bold mb-2">Amenities</span>
          <label className="inline-flex items-center mr-4">
            <input
              type="checkbox"
              name="wifi"
              className="form-checkbox"
              checked={venue.meta?.wifi || false}
              onChange={(e) => setVenue({...venue, meta: {...venue.meta, wifi: e.target.checked}})}
            />
            <span className="ml-2">WiFi</span>
          </label>
          <label className="inline-flex items-center mr-4">
            <input
              type="checkbox"
              name="parking"
              className="form-checkbox"
              checked={venue.meta?.parking || false}
              onChange={(e) => setVenue({...venue, meta: {...venue.meta, parking: e.target.checked}})}
            />
            <span className="ml-2">Parking</span>
          </label>
          <label className="inline-flex items-center mr-4">
            <input
              type="checkbox"
              name="breakfast"
              className="form-checkbox"
              checked={venue.meta?.breakfast || false}
              onChange={(e) => setVenue({...venue, meta: {...venue.meta, breakfast: e.target.checked}})}
            />
            <span className="ml-2">Breakfast</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              name="pets"
              className="form-checkbox"
              checked={venue.meta?.pets || false}
              onChange={(e) => setVenue({...venue, meta: {...venue.meta, pets: e.target.checked}})}
            />
            <span className="ml-2">Pets Allowed</span>
          </label>
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Update Venue
          </button>
        </div>
      </form>
    </div>
  );
}
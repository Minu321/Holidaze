import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export default function VenueDetails({ user }) {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [guests, setGuests] = useState(1);

  useEffect(() => {
    fetchVenueDetails();
  }, [id]);

  const fetchVenueDetails = async () => {
    try {
      const response = await fetch(`https://v2.api.noroff.dev/holidaze/venues/${id}`);
      const data = await response.json();
      setVenue(data.data);
    } catch (error) {
      console.error('Error fetching venue details:', error);
    }
  };

  const handleBooking = async () => {
    if (!user || !selectedDate || !venue) return;

    try {
      const response = await fetch('https://v2.api.noroff.dev/holidaze/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'X-Noroff-API-Key': import.meta.env.VITE_API_KEY,
        },
        body: JSON.stringify({
          dateFrom: selectedDate.toISOString(),
          dateTo: new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000).toISOString(),
          guests: guests,
          venueId: venue.id,
        }),
      });

      if (response.ok) {
        alert('Booking successful!');
      } else {
        alert('Booking failed. Please try again.');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('An error occurred. Please try again.');
    }
  };

  if (!venue) return <div>Loading...</div>;

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <img src={venue.media[0]?.url || '/placeholder.svg?height=400&width=800'} alt={venue.media[0]?.alt || venue.name} className="w-full h-64 object-cover" />
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">{venue.name}</h1>
        <p className="text-gray-600 mb-4">{venue.description}</p>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">Details</h2>
            <p>Price: ${venue.price}/night</p>
            <p>Max guests: {venue.maxGuests}</p>
            <p>Rating: {venue.rating.toFixed(1)} / 5</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Amenities</h2>
            <ul>
              {venue.meta.wifi && <li>WiFi</li>}
              {venue.meta.parking && <li>Parking</li>}
              {venue.meta.breakfast && <li>Breakfast</li>}
              {venue.meta.pets && <li>Pets allowed</li>}
            </ul>
          </div>
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Location</h2>
          <p>{venue.location.address}, {venue.location.city}</p>
          <p>{venue.location.zip}, {venue.location.country}</p>
        </div>
        {user && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Book this venue</h2>
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              className="mb-4"
            />
            <div className="mb-4">
              <label htmlFor="guests" className="block text-sm font-medium text-gray-700">
                Number of guests
              </label>
              <input
                type="number"
                id="guests"
                min="1"
                max={venue.maxGuests}
                value={guests}
                onChange={(e) => setGuests(parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <button
              onClick={handleBooking}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Book Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
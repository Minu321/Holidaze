import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Star, Wifi, Car, Coffee, PawPrint } from 'lucide-react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export default function VenueDetails({ user }) {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [dateRange, setDateRange] = useState([null, null]);
  const [guests, setGuests] = useState(1);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchVenueDetails();
  }, [id]);

  const fetchVenueDetails = async () => {
    try {
      const response = await fetch(`https://v2.api.noroff.dev/holidaze/venues/${id}?_bookings=true`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'X-Noroff-API-Key': import.meta.env.VITE_API_KEY,
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch venue details');
      }
      const data = await response.json();
      setVenue(data.data);
      setBookings(data.data.bookings || []);
    } catch (error) {
      console.error('Error fetching venue details:', error);
      setError('Failed to load venue details. Please try again later.');
    }
  };

  const isDateBooked = (date) => {
    return bookings.some(booking => {
      const bookingStart = new Date(booking.dateFrom);
      const bookingEnd = new Date(booking.dateTo);
      return date >= bookingStart && date <= bookingEnd;
    });
  };

  const isDateRangeValid = (start, end) => {
    if (!start || !end) return false;
    let current = new Date(start);
    while (current <= end) {
      if (isDateBooked(current)) return false;
      current.setDate(current.getDate() + 1);
    }
    return true;
  };

  const handleBooking = async () => {
    if (!user || !dateRange[0] || !dateRange[1] || !venue) return;

    try {
      const response = await fetch('https://v2.api.noroff.dev/holidaze/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'X-Noroff-API-Key': import.meta.env.VITE_API_KEY,
        },
        body: JSON.stringify({
          dateFrom: dateRange[0].toISOString(),
          dateTo: dateRange[1].toISOString(),
          guests: guests,
          venueId: venue.id,
        }),
      });

      if (response.ok) {
        alert('Booking successful!');
        fetchVenueDetails(); 
        setDateRange([null, null]); 
      } else {
        const errorData = await response.json();
        alert(`Booking failed: ${errorData.errors[0].message}`);
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('An error occurred. Please try again.');
    }
  };

  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;
  if (!venue) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="relative h-64 sm:h-80 md:h-96">
          <img 
            src={venue.media[0]?.url || '/placeholder.svg?height=400&width=800'} 
            alt={venue.media[0]?.alt || venue.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
            <h1 className="text-3xl font-bold text-white p-6">{venue.name}</h1>
          </div>
        </div>
        <div className="p-6">
          <p className="text-gray-600 mb-6">{venue.description}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Details</h2>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Price:</span>
                  <span className="text-indigo-600 font-bold">${venue.price}/night</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Max guests:</span>
                  <span>{venue.maxGuests}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Rating:</span>
                  <span className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500 mr-1" />
                    {venue.rating.toFixed(1)} / 5
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Amenities</h2>
              <ul className="space-y-2">
                {venue.meta.wifi && (
                  <li className="flex items-center">
                    <Wifi className="w-5 h-5 mr-2 text-indigo-600" /> WiFi
                  </li>
                )}
                {venue.meta.parking && (
                  <li className="flex items-center">
                    <Car className="w-5 h-5 mr-2 text-indigo-600" /> Parking
                  </li>
                )}
                {venue.meta.breakfast && (
                  <li className="flex items-center">
                    <Coffee className="w-5 h-5 mr-2 text-indigo-600" /> Breakfast
                  </li>
                )}
                {venue.meta.pets && (
                  <li className="flex items-center">
                    <PawPrint className="w-5 h-5 mr-2 text-indigo-600" /> Pets allowed
                  </li>
                )}
              </ul>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h2 className="text-xl font-semibold mb-4">Location</h2>
            <p>{venue.location.address}, {venue.location.city}</p>
            <p>{venue.location.zip}, {venue.location.country}</p>
          </div>
          {user && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Book this venue</h2>
              <div className="mb-4">
                <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-1">
                  Number of guests
                </label>
                <input
                  type="number"
                  id="guests"
                  min="1"
                  max={venue.maxGuests}
                  value={guests}
                  onChange={(e) => setGuests(parseInt(e.target.value))}
                  className="max-w-20 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="mb-6">
                <Calendar
                  onChange={setDateRange}
                  value={dateRange}
                  selectRange={true}
                  tileDisabled={({date}) => isDateBooked(date)}
                  tileClassName={({date}) => isDateBooked(date) ? 'bg-red-200' : null}
                  className="w-full max-w-md mx-auto border rounded-lg shadow-sm"
                />
              </div>
              
      
              <button
                onClick={handleBooking}
                disabled={!dateRange[0] || !dateRange[1] || !isDateRangeValid(dateRange[0], dateRange[1])}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Book Now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
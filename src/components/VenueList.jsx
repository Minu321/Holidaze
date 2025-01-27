import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

export default function VenueList() {
  const [venues, setVenues] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    try {
      const response = await fetch('https://v2.api.noroff.dev/holidaze/venues');
      const data = await response.json();
      setVenues(data.data);
    } catch (error) {
      console.error('Error fetching venues:', error);
    }
  };

  const filteredVenues = venues.filter(venue =>
    venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    venue.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Venues</h1>
      <input
        type="text"
        placeholder="Search venues..."
        className="w-full px-4 py-2 rounded-md border border-gray-300 mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVenues.map((venue) => (
          <Link key={venue.id} to={`/venues/${venue.id}`} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
            <div className="w-full h-48 overflow-hidden">
              <img 
                src={venue.media[0]?.url || '/placeholder.png'} 
                alt={venue.media[0]?.alt || venue.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4 flex flex-col flex-grow">
              <h2 className="text-xl font-semibold mb-2 line-clamp-1">{venue.name}</h2>
              <p className="text-gray-600 mb-4 flex-grow line-clamp-3">{venue.description}</p>
              <div className="flex justify-between items-center text-sm">
                <span className="text-indigo-600 font-bold">${venue.price}/night</span>
                <span className="text-gray-500">Max guests: {venue.maxGuests}</span>
              </div>
              <div className="mt-2 flex items-center">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500 mr-1" />
                <span className="text-gray-700">{venue.rating.toFixed(1)} / 5</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
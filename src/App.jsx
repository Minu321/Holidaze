import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import VenueList from './components/VenueList';
import VenueDetails from './components/VenueDetails';
import Register from './components/Register';
import Login from './components/Login';
import Profile from './components/Profile';
import CreateVenue from './components/CreateVenue';
import MyBookings from './components/MyBookings';
import MyVenues from './components/MyVenues';
import EditVenue from './components/EditVenue';
import Footer from './components/Footer';
import { profileApi } from './utils/api';

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    const storedAccessToken = localStorage.getItem('accessToken');
    if (storedUserData && storedAccessToken) {
      const parsedUserData = JSON.parse(storedUserData);
      setUser(parsedUserData);
      
      const fetchUserProfile = async () => {
        try {
          const response = await profileApi.getProfile(parsedUserData.name);
          const profileData = response.data; 
          const updatedUserData = {
            ...parsedUserData,
            ...profileData,
            venueManager: profileData.venueManager
          };
          setUser(updatedUserData);
          localStorage.setItem('userData', JSON.stringify(updatedUserData));
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      };
      fetchUserProfile();
    }
  }, []);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userData');
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <nav className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <Link to="/" className="flex-shrink-0 flex items-center">
                  <span className="text-xl font-bold text-indigo-600">Holidaze</span>
                </Link>
                <div className="ml-6 flex space-x-8">
                  <Link to="/" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                    Venues
                  </Link>
                  {user && (
                    <Link to="/my-bookings" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                      My Bookings
                    </Link>
                  )}
                  {user && user.venueManager && (
                    <Link to="/my-venues" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                      My Venues
                    </Link>
                  )}
                </div>
              </div>
              <div className="flex items-center">
                {user ? (
                  <>
                    <Link to="/profile" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="ml-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="ml-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl w-full mx-auto py-6 sm:px-6 lg:px-8 flex-grow flex-shrink-0">
          <Routes>
            <Route path="/" element={<VenueList />} />
            <Route path="/venues/:id" element={<VenueDetails user={user} />} />
            <Route path="/register" element={<Register setUser={setUser} />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/profile" element={<Profile user={user} setUser={setUser} />} />
            <Route path="/create-venue" element={<CreateVenue user={user} />} />
            <Route path="/my-bookings" element={<MyBookings user={user} />} />
            <Route path="/my-venues" element={<MyVenues user={user} />} />
            <Route path="/venues/:id/edit" element={<EditVenue user={user} />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
};
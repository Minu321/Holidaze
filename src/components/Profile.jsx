import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { profileApi } from '../utils/api';

export default function Profile({ user, setUser }) {
  const [isEditing, setIsEditing] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar?.url || '');
  const [avatarAlt, setAvatarAlt] = useState(user?.avatar?.alt || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [error, setError] = useState('');
  const [isVenueManager, setIsVenueManager] = useState(user?.venueManager || false);

  const fetchLatestUserData = async () => {
    if (user) {
      try {
        const response = await profileApi.getProfile(user.name);
        const profileData = response.data;
        const updatedUser = { 
          ...user, 
          ...profileData,
          venueManager: profileData.venueManager
        };
        setUser(updatedUser);
        setIsVenueManager(updatedUser.venueManager);
        localStorage.setItem('userData', JSON.stringify(updatedUser));
        if (!isEditing) {
          setAvatarUrl(updatedUser.avatar?.url || '');
          setAvatarAlt(updatedUser.avatar?.alt || '');
          setBio(updatedUser.bio || '');
        }
      } catch (error) {
        console.error('Error fetching latest user data:', error);
        setError('Failed to fetch latest user data. Please try again.');
      }
    }
  };

  useEffect(() => {
    fetchLatestUserData();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    setError('');

    try {
      const updateData = {
        bio: bio,
        avatar: {
          url: avatarUrl,
          alt: avatarAlt
        }
      };

      await profileApi.updateProfile(user.name, updateData);
      await fetchLatestUserData();
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      setError(`Failed to update profile: ${error.message}`);
    }
  };

  if (!user) return <div className="text-center mt-8">Please log in to view your profile.</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="bg-indigo-600 text-white p-6">
        <h2 className="text-3xl font-bold">Profile</h2>
      </div>
      <div className="p-6">
        <div className="flex items-center mb-6">
          <div className="w-24 h-24 rounded-full overflow-hidden mr-6">
            {avatarUrl ? (
              <img src={avatarUrl} alt={avatarAlt} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500">
                No Image
              </div>
            )}
          </div>
          <div>
            <h3 className="text-2xl font-semibold">{user.name}</h3>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        {!isEditing ? (
          <div>
            <p className="mb-4"><strong>Bio:</strong> {bio || 'No bio provided'}</p>
            <p className="mb-4"><strong>Venue Manager:</strong> {isVenueManager ? 'Yes' : 'No'}</p>
            <button
              onClick={() => setIsEditing(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition duration-300"
            >
              Update Profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="avatarUrl" className="block text-sm font-medium text-gray-700">
                Avatar URL
              </label>
              <input
                id="avatarUrl"
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="https://example.com/avatar.jpg"
              />
            </div>
            <div>
              <label htmlFor="avatarAlt" className="block text-sm font-medium text-gray-700">
                Avatar Alt Text
              </label>
              <input
                id="avatarAlt"
                type="text"
                value={avatarAlt}
                onChange={(e) => setAvatarAlt(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="Description of the avatar image"
              />
            </div>
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                Bio
              </label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                rows="3"
                placeholder="Tell us about yourself"
              />
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition duration-300"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition duration-300"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {isVenueManager && (
          <div className="mt-6">
            <Link
              to="/create-venue"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
            >
              Create New Venue
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
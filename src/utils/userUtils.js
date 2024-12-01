import { profileApi } from './api';

export async function fetchAndUpdateUserProfile(userData, setUser) {
  try {
    const profileData = await profileApi.getProfile(userData.name);
    const updatedUserData = {
      ...userData,
      ...profileData,
      venueManager: profileData.venueManager
    };
    setUser(updatedUserData);
    localStorage.setItem('userData', JSON.stringify(updatedUserData));
    return updatedUserData;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
}
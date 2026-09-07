import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const ALLERGIES_LIST = [
  { id: 'asthma', label: 'Asthma / Wheezing', hindi: 'अस्थमा / श्वास रोग', icon: '🫁', desc: 'Alerts for AQI > 150 and high humidity mold' },
  { id: 'pollen', label: 'Pollen / Hay Fever', hindi: 'पराग एलर्जी (हे फीवर)', icon: '🌸', desc: 'Warns when grass/tree pollen counts spike' },
  { id: 'dust', label: 'Dust & PM2.5 Sensitivity', hindi: 'धूल एवं पीएम2.5 संवेदनशीलता', icon: '😷', desc: 'Prompts N95 masks during smog and road dust' },
  { id: 'uv_sensitive', label: 'Sunburn / Skin Sensitivity', hindi: 'धूप व त्वचा संवेदनशीलता', icon: '☀️', desc: 'SPF 50+ warnings and peak ultraviolet shade hours' },
  { id: 'heat_sensitive', label: 'Heat Exhaustion Prone', hindi: 'अत्यधिक गर्मी / लू संवेदनशीलता', icon: '🔥', desc: 'Wet-bulb thermal stress & hydration warnings' }
];

export const DEFAULT_USER = {
  name: 'Citizen Guest',
  primaryInterest: 'health', // 'health' | 'fitness' | 'beach' | 'agri' | 'commute' | 'travel' | 'family' | 'events'
  allergies: ['dust', 'uv_sensitive'],
  commuteTime: '08:30',
  workoutTime: '06:30',
  isOnboarded: false,
};

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('mausam_user_profile');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read user profile from storage', e);
    }
    return DEFAULT_USER;
  });

  const [isOnboardingOpen, setIsOnboardingOpen] = useState(!user.isOnboarded);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('mausam_user_profile', JSON.stringify(user));
    } catch (e) {
      console.warn('Could not save user profile to storage', e);
    }
  }, [user]);

  const saveProfile = (newProfileData) => {
    setUser(prev => ({
      ...prev,
      ...newProfileData,
      isOnboarded: true
    }));
    setIsOnboardingOpen(false);
    setIsProfileModalOpen(false);
  };

  const resetProfile = () => {
    setUser(DEFAULT_USER);
    setIsOnboardingOpen(true);
  };

  return (
    <UserContext.Provider value={{
      user,
      saveProfile,
      resetProfile,
      isOnboardingOpen,
      setIsOnboardingOpen,
      isProfileModalOpen,
      setIsProfileModalOpen
    }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);

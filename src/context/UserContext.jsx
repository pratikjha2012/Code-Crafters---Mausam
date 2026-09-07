import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const INFORMATION_PRIORITIES = [
  { id: 'rain', label: 'Rain Probability', hindi: 'वर्षा की संभावना', icon: '🌧️', desc: 'Precipitation % and rain forecast hours' },
  { id: 'temp', label: 'Temperature & Feels-like', hindi: 'तापमान व वास्तविक अहसास', icon: '🌡️', desc: 'Current temp, heat index & highs/lows' },
  { id: 'aqi', label: 'Air Quality (AQI)', hindi: 'वायु गुणवत्ता सूचकांक', icon: '🫁', desc: 'US AQI, PM2.5, PM10 & allergen counts' },
  { id: 'alerts', label: 'Weather Alerts & Warnings', hindi: 'मौसम अलर्ट व चेतावनी', icon: '⚠️', desc: 'Official IMD warnings & severe storm alerts' },
  { id: 'outdoor', label: 'Outdoor Conditions', hindi: 'बाहरी गतिविधियां', icon: '🏃', desc: 'Workout comfort, running hours & heat stress' },
  { id: 'uv', label: 'UV Index & Sun Protection', hindi: 'पराबैंगनी (यूवी) इंडेक्स', icon: '☀️', desc: 'Sunburn risk, peak UV hours & SPF guidance' },
  { id: 'wind', label: 'Wind & Gusts', hindi: 'हवा की गति व झोंके', icon: '💨', desc: 'Wind speed, peak gusts & direction' },
  { id: 'visibility', label: 'Visibility & Fog', hindi: 'दृश्यता व कोहरा', icon: '👁️', desc: 'Road visibility range & dense fog warnings' },
  { id: 'sun', label: 'Sunrise & Sunset', hindi: 'सूर्योदय व सूर्यास्त', icon: '🌅', desc: 'Golden hour, daylight duration & twilight' },
  { id: 'travel', label: 'Travel & Commute', hindi: 'यात्रा व आवागमन', icon: '✈️', desc: 'Transit route delays, airport METAR & highways' },
  { id: 'agri', label: 'Agriculture & Garden', hindi: 'कृषि एवं बागवानी', icon: '🌾', desc: 'Soil moisture, spray suitability & agromet' },
  { id: 'family', label: 'Family & School Activities', hindi: 'परिवार व विद्यालय', icon: '👨‍👩‍👧', desc: 'Park hours, school commute & playground safety' }
];

export const ALLERGIES_LIST = [
  { id: 'asthma', label: 'Asthma / Wheezing', hindi: 'अस्थमा / श्वास रोग', icon: '🫁', desc: 'Alerts for AQI > 150 and high humidity mold' },
  { id: 'pollen', label: 'Pollen / Hay Fever', hindi: 'पराग एलर्जी (हे फीवर)', icon: '🌸', desc: 'Warns when grass/tree pollen counts spike' },
  { id: 'dust', label: 'Dust & PM2.5 Sensitivity', hindi: 'धूल एवं पीएम2.5 संवेदनशीलता', icon: '😷', desc: 'Prompts N95 masks during smog and road dust' },
  { id: 'uv_sensitive', label: 'Sunburn / Skin Sensitivity', hindi: 'धूप व त्वचा संवेदनशीलता', icon: '☀️', desc: 'SPF 50+ warnings and peak ultraviolet shade hours' },
  { id: 'heat_sensitive', label: 'Heat Exhaustion Prone', hindi: 'अत्यधिक गर्मी / लू संवेदनशीलता', icon: '🔥', desc: 'Wet-bulb thermal stress & hydration warnings' }
];

export const DEFAULT_USER = {
  name: 'Citizen',
  priorities: ['rain', 'temp', 'aqi', 'alerts', 'outdoor'],
  topPriority: 'rain',
  allergies: ['dust', 'uv_sensitive'],
  commuteTime: '08:30',
  workoutTime: '06:30',
  isOnboarded: false,
};

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('mausam_user_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure priorities array exists
        if (!parsed.priorities || parsed.priorities.length === 0) {
          parsed.priorities = DEFAULT_USER.priorities;
        }
        if (!parsed.topPriority) {
          parsed.topPriority = parsed.priorities[0] || 'rain';
        }
        return parsed;
      }
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

  const openOnboarding = () => {
    setIsOnboardingOpen(true);
  };

  const resetProfile = () => {
    setUser(DEFAULT_USER);
    setIsOnboardingOpen(true);
  };

  return (
    <UserContext.Provider value={{
      user,
      saveProfile,
      openOnboarding,
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

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

export const DEFAULT_ROUTINES = [
  { 
    id: 'routine-run', 
    title: 'Morning Workout & Run', 
    hindi: 'सुबह की दौड़ / व्यायाम', 
    time: '06:30', 
    persona: 'fitness', 
    icon: 'Flame', 
    days: 'Daily',
    enabled: true 
  },
  { 
    id: 'routine-commute', 
    title: 'Daily Office Commute', 
    hindi: 'दैनिक ऑफिस आवागमन', 
    time: '08:30', 
    persona: 'commute', 
    icon: 'Car', 
    days: 'Mon - Fri',
    enabled: true 
  },
  { 
    id: 'routine-school', 
    title: 'School Transit & Pickup', 
    hindi: 'स्कूल बस / पिकअप', 
    time: '07:45', 
    persona: 'family', 
    icon: 'ShieldCheck', 
    days: 'Mon - Fri',
    enabled: true 
  },
  { 
    id: 'routine-agri', 
    title: 'Agro Field Spray Routine', 
    hindi: 'खेत सिंचाई व कीटनाशक छिड़काव', 
    time: '07:00', 
    persona: 'agri', 
    icon: 'Sprout', 
    days: 'Weekly',
    enabled: true 
  }
];

export const DEFAULT_USER = {
  name: 'Citizen',
  activePersona: 'all',
  priorities: ['rain', 'temp', 'aqi', 'alerts', 'outdoor'],
  topPriority: 'rain',
  allergies: ['dust', 'uv_sensitive'],
  commuteTime: '08:30',
  workoutTime: '06:30',
  savedLocations: ['New Delhi', 'Mumbai', 'Bengaluru', 'Ranchi'],
  savedRoutines: DEFAULT_ROUTINES,
  dismissedInsights: {},
  notificationSettings: {
    severeOnly: true,
    morningBrief: true,
    rainWarning: true,
  },
  isOnboarded: false,
};

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('mausam_user_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_USER,
          ...parsed,
          priorities: (parsed.priorities && parsed.priorities.length > 0) ? parsed.priorities : DEFAULT_USER.priorities,
          savedLocations: parsed.savedLocations || DEFAULT_USER.savedLocations,
          savedRoutines: parsed.savedRoutines || DEFAULT_USER.savedRoutines,
          dismissedInsights: parsed.dismissedInsights || {},
          notificationSettings: { ...DEFAULT_USER.notificationSettings, ...(parsed.notificationSettings || {}) }
        };
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

  // Saved Location Helpers
  const toggleSaveLocation = (cityName) => {
    setUser(prev => {
      const list = prev.savedLocations || [];
      const exists = list.includes(cityName);
      const updated = exists ? list.filter(c => c !== cityName) : [...list, cityName];
      return { ...prev, savedLocations: updated };
    });
  };

  const isLocationSaved = (cityName) => {
    return (user.savedLocations || []).includes(cityName);
  };

  // Saved Routines Helpers
  const addSavedRoutine = (routine) => {
    setUser(prev => ({
      ...prev,
      savedRoutines: [
        ...(prev.savedRoutines || []),
        { id: `routine-${Date.now()}`, enabled: true, ...routine }
      ]
    }));
  };

  const deleteSavedRoutine = (id) => {
    setUser(prev => ({
      ...prev,
      savedRoutines: (prev.savedRoutines || []).filter(r => r.id !== id)
    }));
  };

  const toggleSavedRoutine = (id) => {
    setUser(prev => ({
      ...prev,
      savedRoutines: (prev.savedRoutines || []).map(r => 
        r.id === id ? { ...r, enabled: !r.enabled } : r
      )
    }));
  };

  // Dismiss / Snooze Insight Helpers
  const dismissInsight = (insightKey) => {
    setUser(prev => ({
      ...prev,
      dismissedInsights: {
        ...(prev.dismissedInsights || {}),
        [insightKey]: Date.now()
      }
    }));
  };

  const isInsightDismissed = (insightKey) => {
    const timestamp = user.dismissedInsights?.[insightKey];
    if (!timestamp) return false;
    // Dismiss lasts for 12 hours
    const twelveHoursMs = 12 * 60 * 60 * 1000;
    return (Date.now() - timestamp) < twelveHoursMs;
  };

  const resetDismissedInsights = () => {
    setUser(prev => ({
      ...prev,
      dismissedInsights: {}
    }));
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
      setIsProfileModalOpen,
      toggleSaveLocation,
      isLocationSaved,
      addSavedRoutine,
      deleteSavedRoutine,
      toggleSavedRoutine,
      dismissInsight,
      isInsightDismissed,
      resetDismissedInsights
    }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);

import React, { useState } from 'react';
import { useWeather } from '../context/WeatherContext';
import { useUser } from '../context/UserContext';
import { useTheme } from '../context/ThemeContext';
import { INDIAN_CITIES, reverseGeocode } from '../services/weatherApi';
import { 
  CloudSun, 
  Search, 
  MapPin, 
  Compass, 
  Radio, 
  RefreshCw,
  Sun,
  Moon,
  Laptop,
  Globe,
  SlidersHorizontal,
  Activity,
  Flame,
  Waves,
  Sprout,
  Car,
  Plane,
  ShieldCheck,
  CalendarDays,
  Menu,
  X
} from 'lucide-react';

export default function Navbar({ currentPage = 'home', onNavigate }) {
  const { 
    selectedCity, 
    setSelectedCity,
    language,
    setLanguage,
    loading,
    refreshData,
  } = useWeather();

  const { user, openOnboarding, setIsProfileModalOpen } = useUser();
  const { theme, setTheme } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const filteredCities = INDIAN_CITIES.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setSearchQuery('');
    setShowDropdown(false);
  };

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const geo = await reverseGeocode(lat, lon);
          setSelectedCity({
            name: geo?.name || 'My Station',
            state: geo?.state || 'GPS Coordinates',
            lat,
            lon,
            isCoastal: false,
            agroRegion: 'Local Micro-climate'
          });
        },
        (err) => {
          alert('Could not access GPS location.');
        }
      );
    }
  };

  const toggleTheme = () => {
    if (theme === 'dark') setTheme('light');
    else if (theme === 'light') setTheme('dark');
    else setTheme('dark');
  };

  const navLinks = [
    { id: 'home', label: 'Overview', hindi: 'मुख्य', icon: CloudSun },
    { id: 'health', label: 'Health', hindi: 'स्वास्थ्य', icon: Activity },
    { id: 'fitness', label: 'Fitness', hindi: 'फिटनेस', icon: Flame },
    { id: 'beach', label: 'Beach', hindi: 'तटीय', icon: Waves },
    { id: 'agri', label: 'Agriculture', hindi: 'कृषि', icon: Sprout },
    { id: 'commute', label: 'Commute', hindi: 'यातायात', icon: Car },
    { id: 'travel', label: 'Travel', hindi: 'यात्रा', icon: Plane },
    { id: 'family', label: 'Family', hindi: 'परिवार', icon: ShieldCheck },
    { id: 'events', label: 'Events', hindi: 'आयोजन', icon: CalendarDays },
  ];

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/90 dark:bg-slate-950/90 border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-200">
      {/* Official MoES / IMD Tricolor Ribbon */}
      <div className="bg-gradient-to-r from-orange-600 via-white to-green-700 h-1 w-full" />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-2.5">
        <div className="flex items-center justify-between gap-3">
          
          {/* Official Emblem & Branding */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onNavigate && onNavigate('home')}>
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-blue-600 via-sky-500 to-indigo-700 flex items-center justify-center shadow-md text-white font-bold text-lg border border-sky-400/30">
              <CloudSun className="w-5 h-5 text-sky-100" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg tracking-tight bg-gradient-to-r from-sky-600 via-blue-700 to-indigo-800 dark:from-sky-400 dark:via-white dark:to-blue-200 bg-clip-text text-transparent">
                  MAUSAM
                </span>
                <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-400 border border-sky-300 dark:border-sky-800">
                  IMD
                </span>
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-none">
                भारत मौसम विज्ञान विभाग (MoES)
              </div>
            </div>
          </div>

          {/* Search Station Input (Desktop / Tablet) */}
          <div className="flex-1 max-w-xs relative hidden sm:block">
            <div className="relative w-full">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={language === 'hi' ? 'स्टेशन खोजें (उदा. दिल्ली, रांची)...' : 'Search station (e.g. Delhi, Ranchi)...'}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                className="w-full pl-8 pr-14 py-1.5 text-xs bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <button
                onClick={handleLocateMe}
                title="Detect GPS Location"
                className="absolute right-1 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-sky-600 dark:text-sky-400 rounded-lg flex items-center gap-1 font-semibold"
              >
                <Compass className="w-3 h-3" />
                <span>GPS</span>
              </button>

              {/* City Dropdown */}
              {showDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 max-h-60 overflow-y-auto">
                  <div className="p-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                    <span>Key IMD Stations</span>
                    <button onClick={() => setShowDropdown(false)} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">Close</button>
                  </div>
                  {filteredCities.map((city) => (
                    <button
                      key={city.name}
                      onClick={() => handleCitySelect(city)}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-sky-50 dark:hover:bg-sky-950/50 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/50 text-slate-700 dark:text-slate-200"
                    >
                      <span className="font-medium">{city.name} ({city.state})</span>
                      {city.isCoastal && <span className="text-[9px] px-1 py-0.2 bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 rounded font-bold">Coastal</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Controls: Theme Toggle + Language + Refresh */}
          <div className="flex items-center gap-1.5">
            
            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 transition"
              title={`Switch theme (current: ${theme})`}
            >
              {theme === 'dark' ? (
                <Moon className="w-4 h-4 text-indigo-400" />
              ) : (
                <Sun className="w-4 h-4 text-amber-500" />
              )}
            </button>

            {/* Language Toggle */}
            <button
              type="button"
              onClick={() => setLanguage(l => l === 'en' ? 'hi' : 'en')}
              className="px-2.5 py-1 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 transition"
              title="Toggle Language"
            >
              {language === 'en' ? 'हिन्दी' : 'EN'}
            </button>

            {/* Preferences Quick Launcher */}
            <button
              type="button"
              onClick={openOnboarding}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 transition hidden sm:flex"
              title="Customize Preferences"
            >
              <SlidersHorizontal className="w-4 h-4 text-sky-500" />
            </button>

            {/* Telemetry Refresh */}
            <button
              type="button"
              onClick={refreshData}
              disabled={loading}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 transition"
              title="Refresh Live Telemetry"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-sky-500' : ''}`} />
            </button>

          </div>

        </div>
      </div>
    </header>
  );
}

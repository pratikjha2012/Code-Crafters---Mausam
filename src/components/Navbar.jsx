import React, { useState } from 'react';
import { useWeather } from '../context/WeatherContext';
import { useUser } from '../context/UserContext';
import { useTheme } from '../context/ThemeContext';
import { INDIAN_CITIES, reverseGeocode } from '../services/weatherApi';
import { 
  Search, 
  MapPin, 
  Compass, 
  RefreshCw,
  Sun,
  Moon,
  Bell,
  User,
  ChevronDown,
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
    weather
  } = useWeather();

  const { user } = useUser();
  const { theme, setTheme } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const activeAlertCount = weather?.alerts?.length || 0;

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
          setShowDropdown(false);
        },
        (err) => {
          alert('Could not access GPS location.');
        }
      );
    }
  };

  const toggleTheme = () => {
    if (theme === 'dark') setTheme('light');
    else setTheme('dark');
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/95 dark:bg-slate-950/95 border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-200">
      {/* Official MoES / IMD Tricolor Ribbon */}
      <div className="bg-gradient-to-r from-orange-600 via-white to-green-700 h-1 w-full" />
      
      <div className="max-w-5xl mx-auto px-3.5 sm:px-6 py-2.5">
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          
          {/* Official Emblem & Branding */}
          <div className="flex items-center gap-2 cursor-pointer shrink-0" onClick={() => onNavigate && onNavigate('home')}>
            <img 
              src="/imd-logo.png" 
              alt="IMD Emblem" 
              className="w-9 h-9 object-contain drop-shadow-sm transition-transform hover:scale-105"
            />
            <div>
              <div className="flex items-center gap-1">
                <span className="font-black text-base sm:text-lg tracking-tight bg-gradient-to-r from-sky-600 via-blue-700 to-indigo-800 dark:from-sky-400 dark:via-white dark:to-blue-200 bg-clip-text text-transparent">
                  MAUSAM
                </span>
                <span className="text-[9px] uppercase font-bold tracking-wider px-1 py-0.2 rounded bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-400 border border-sky-300 dark:border-sky-800">
                  IMD
                </span>
              </div>
              <div className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 leading-none hidden xs:block">
                भारत मौसम विज्ञान विभाग
              </div>
            </div>
          </div>

          {/* Location Selector Pill: [Location ▾] */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowDropdown(!showDropdown)}
              className="px-2.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 text-slate-800 dark:text-slate-100 flex items-center gap-1.5 transition text-xs font-semibold max-w-[150px] sm:max-w-[200px]"
              title="Change Station / Location"
            >
              <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <span className="truncate">{selectedCity?.name || 'New Delhi'}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
            </button>

            {/* Location Selector Dropdown */}
            {showDropdown && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0 mt-2 w-72 sm:w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="p-3 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
                    <span>Select IMD Station</span>
                    <button 
                      onClick={() => setShowDropdown(false)}
                      className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  
                  {/* Search Box */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder={language === 'hi' ? 'स्टेशन खोजें...' : 'Search station / city...'}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                      className="w-full pl-8 pr-16 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                    <button
                      onClick={handleLocateMe}
                      title="Use GPS"
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] bg-slate-100 dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-sky-950/60 text-sky-600 dark:text-sky-400 rounded-lg flex items-center gap-1 font-semibold"
                    >
                      <Compass className="w-3 h-3" />
                      <span>GPS</span>
                    </button>
                  </div>
                </div>

                {/* City list */}
                <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
                  {filteredCities.map((city) => {
                    const isSelected = selectedCity?.name === city.name;
                    return (
                      <button
                        key={city.name}
                        onClick={() => handleCitySelect(city)}
                        className={`w-full text-left px-3.5 py-2.5 text-xs flex items-center justify-between transition ${
                          isSelected
                            ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-bold'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        <div>
                          <span>{city.name}</span>
                          <span className="text-[10px] text-slate-400 ml-1.5">({city.state})</span>
                        </div>
                        {city.isCoastal && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 font-bold">
                            Coastal
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Controls: 🔔 Alerts + Profile ◉ + Theme + Lang + Refresh */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            
            {/* 🔔 Severe Weather Alert Bell */}
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('alerts')}
              className={`relative p-2 rounded-xl border transition ${
                activeAlertCount > 0
                  ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400'
                  : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
              title="Weather Warnings & Alerts"
            >
              <Bell className="w-4 h-4" />
              {activeAlertCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center ring-2 ring-white dark:ring-slate-950 animate-pulse">
                  {activeAlertCount}
                </span>
              )}
            </button>

            {/* Profile ◉ Button */}
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('profile')}
              className={`relative p-2 rounded-xl border flex items-center gap-1 transition ${
                currentPage === 'profile'
                  ? 'bg-sky-50 dark:bg-sky-950/70 border-sky-400 text-sky-600 dark:text-sky-300 font-bold'
                  : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
              title="Personalized Weather Profile"
            >
              <User className="w-4 h-4" />
              {/* Online / Active Indicator Dot */}
              <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-950 shrink-0" />
            </button>

            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 transition hidden xs:flex"
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
              className="px-2 py-1 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 transition"
              title="Toggle Language"
            >
              {language === 'en' ? 'हिन्दी' : 'EN'}
            </button>

            {/* Telemetry Refresh */}
            <button
              type="button"
              onClick={refreshData}
              disabled={loading}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 transition"
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

import React, { useState } from 'react';
import { useWeather } from '../context/WeatherContext';
import { useUser } from '../context/UserContext';
import { INDIAN_CITIES, reverseGeocode } from '../services/weatherApi';
import { 
  CloudSun, 
  Search, 
  MapPin, 
  Compass, 
  Globe2, 
  Radio, 
  Sparkles, 
  Smartphone, 
  Monitor, 
  RefreshCw,
  AlertTriangle,
  ChevronDown,
  User,
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
    isMobilePreview,
    setIsMobilePreview,
    loading,
    refreshData,
    weather
  } = useWeather();

  const { user, setIsProfileModalOpen } = useUser();

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
          setDataMode('real');
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
          alert('Could not access GPS location. Falling back to default city.');
        }
      );
    }
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
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-950/90 border-b border-slate-800 shadow-2xl">
      {/* Official MoES / IMD Tricolor Ribbon */}
      <div className="bg-gradient-to-r from-orange-600 via-white to-green-700 h-1 w-full" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5">
        <div className="flex items-center justify-between gap-3">
          
          {/* Official Emblem & Branding */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onNavigate && onNavigate('home')}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 via-sky-500 to-indigo-700 flex items-center justify-center shadow-lg shadow-sky-500/20 text-white font-bold text-lg border border-sky-400/30">
              <CloudSun className="w-5 h-5 text-sky-100 animate-pulse-slow" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg tracking-tight bg-gradient-to-r from-sky-400 via-white to-blue-200 bg-clip-text text-transparent">
                  MAUSAM
                </span>
                <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-sky-950 text-sky-400 border border-sky-800">
                  MoES
                </span>
              </div>
              <div className="text-[10px] text-slate-400 flex items-center gap-1">
                <span>भारत मौसम विज्ञान विभाग (IMD)</span>
              </div>
            </div>
          </div>

          {/* Search Station Input */}
          <div className="flex-1 max-w-xs sm:max-w-sm relative hidden md:block">
            <div className="relative w-full">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={language === 'hi' ? 'शहर / वेधशाला खोजें...' : 'Search station (e.g. Delhi, Mumbai)...'}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                className="w-full pl-8 pr-16 py-1.5 text-xs bg-slate-900 border border-slate-700/80 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
              />
              <button
                onClick={handleLocateMe}
                title="Detect GPS Location"
                className="absolute right-1 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] bg-slate-800 hover:bg-slate-700 text-sky-400 rounded-lg flex items-center gap-1 border border-slate-700"
              >
                <Compass className="w-3 h-3" />
                <span>GPS</span>
              </button>

              {/* City Dropdown */}
              {showDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 max-h-60 overflow-y-auto">
                  <div className="p-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-950 border-b border-slate-800 flex justify-between items-center">
                    <span>Key Meteorological Stations</span>
                    <button onClick={() => setShowDropdown(false)} className="text-slate-500 hover:text-slate-300">Close</button>
                  </div>
                  {filteredCities.map((city) => (
                    <button
                      key={city.name}
                      onClick={() => handleCitySelect(city)}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-sky-950/50 flex items-center justify-between border-b border-slate-800/50 text-slate-200"
                    >
                      <span className="font-medium">{city.name} ({city.state})</span>
                      {city.isCoastal && <span className="text-[9px] px-1 py-0.2 bg-cyan-950 text-cyan-300 rounded">Coastal</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Action Controls: Mode Switcher + User Profile Badge + Lang */}
          <div className="flex items-center gap-2">
            
            {/* Live Meteorological Telemetry Status */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-semibold text-emerald-400">
              <Radio className="w-3 h-3 animate-pulse text-emerald-400" />
              <span className="hidden sm:inline">Live NWP Feed</span>
            </div>

            {/* Refresh Satellite Feed Button */}
            <button
              onClick={refreshData}
              disabled={loading}
              className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition"
              title="Refresh Live Satellite Telemetry"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-sky-400' : ''}`} />
            </button>

            {/* User Profile Avatar & Login Button */}
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-200 transition shadow-sm"
              title="Edit Profile, Interests & Allergies"
            >
              <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-sky-500 to-blue-600 text-white font-bold text-[10px] flex items-center justify-center">
                {user.name.charAt(0).toUpperCase() || 'P'}
              </div>
              <span className="font-semibold hidden lg:inline max-w-[100px] truncate">{user.name}</span>
            </button>

            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(l => l === 'en' ? 'hi' : 'en')}
              className="p-1.5 sm:px-2.5 sm:py-1 text-xs rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white"
            >
              {language === 'en' ? 'हिन्दी' : 'EN'}
            </button>

            {/* Mobile View Toggle */}
            <button
              onClick={() => setIsMobilePreview(!isMobilePreview)}
              className="p-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-sky-400 hidden sm:flex"
              title="Toggle Phone Frame View"
            >
              {isMobilePreview ? <Monitor className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 lg:hidden"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>

          </div>

        </div>

        {/* Dedicated Persona Route Navigation Bar (Desktop) */}
        <nav className="mt-2.5 pt-2 border-t border-slate-800/80 hidden lg:flex items-center justify-between gap-1 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => onNavigate && onNavigate(link.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    isActive 
                      ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? link.hindi : link.label}</span>
                </button>
              );
            })}
          </div>

          <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Station: {selectedCity.name}</span>
          </div>
        </nav>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="mt-3 p-3 bg-slate-900 border border-slate-800 rounded-2xl lg:hidden space-y-2">
            <div className="grid grid-cols-3 gap-1.5">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = currentPage === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => {
                      onNavigate && onNavigate(link.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`p-2 rounded-xl text-xs font-semibold flex flex-col items-center justify-center gap-1 ${
                      isActive ? 'bg-sky-600 text-white' : 'bg-slate-950 text-slate-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{language === 'hi' ? link.hindi : link.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </header>
  );
}

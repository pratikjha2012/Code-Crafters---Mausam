import React, { useState } from 'react';
import { useWeather } from '../context/WeatherContext';
import { INDIAN_CITIES, reverseGeocode } from '../services/weatherApi';
import { DEMO_SCENARIOS } from '../data/demoScenarios';
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
  ChevronDown
} from 'lucide-react';

export default function Navbar() {
  const { 
    dataMode, 
    setDataMode, 
    activeScenarioId, 
    setActiveScenarioId, 
    selectedCity, 
    setSelectedCity,
    language,
    setLanguage,
    isMobilePreview,
    setIsMobilePreview,
    loading,
    refreshData
  } = useWeather();

  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredCities = INDIAN_CITIES.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setSearchQuery('');
    setShowDropdown(false);
    if (dataMode === 'demo') {
      // Find matching demo scenario or keep current
      if (city.name.includes('Delhi')) setActiveScenarioId('delhi_smog');
      else if (city.name.includes('Mumbai')) setActiveScenarioId('mumbai_monsoon');
      else if (city.name.includes('Goa')) setActiveScenarioId('goa_beach');
      else if (city.name.includes('Jaipur')) setActiveScenarioId('jaipur_heat');
      else setActiveScenarioId('pleasant');
    }
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

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/85 border-b border-slate-800 shadow-2xl">
      {/* Official Government of India MoES / IMD Top Bar */}
      <div className="bg-gradient-to-r from-orange-600 via-white to-green-700 h-1 w-full" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          
          {/* Official Emblem & Branding */}
          <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-start">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-sky-500 to-indigo-700 flex items-center justify-center shadow-lg shadow-sky-500/20 text-white font-bold text-xl border border-sky-400/30">
                <CloudSun className="w-6 h-6 text-sky-100 animate-pulse-slow" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-sky-400 via-white to-blue-200 bg-clip-text text-transparent">
                    {language === 'hi' ? 'मौसम MAUSAM' : 'MAUSAM 3.0'}
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-sky-950/90 text-sky-400 border border-sky-800">
                    Smart AI
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                  <span>भारत मौसम विज्ञान विभाग</span>
                  <span className="text-slate-600">•</span>
                  <span>IMD / MoES</span>
                </div>
              </div>
            </div>

            {/* Mobile View Toggle & Language on Mobile */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                onClick={() => setLanguage(l => l === 'en' ? 'hi' : 'en')}
                className="px-2.5 py-1 text-xs rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white"
              >
                {language === 'en' ? 'हिन्दी' : 'English'}
              </button>
              <button
                onClick={() => setIsMobilePreview(!isMobilePreview)}
                className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-sky-400"
                title="Toggle Phone Frame Mode"
              >
                {isMobilePreview ? <Monitor className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Central Controls: Location Search & Selector */}
          <div className="flex items-center gap-2 w-full lg:w-auto flex-1 max-w-md relative">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={language === 'hi' ? 'शहर खोजें (उदा. दिल्ली, मुंबई)...' : 'Search Indian city or station...'}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                className="w-full pl-9 pr-24 py-2 text-sm bg-slate-900/90 border border-slate-700/80 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all shadow-inner"
              />
              <button
                onClick={handleLocateMe}
                title="Use Current GPS"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-sky-400 rounded-lg flex items-center gap-1 border border-slate-700 transition"
              >
                <Compass className="w-3.5 h-3.5 animate-spin-slow" />
                <span className="hidden sm:inline">GPS</span>
              </button>

              {/* City Dropdown */}
              {showDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 max-h-60 overflow-y-auto">
                  <div className="p-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-950/80 border-b border-slate-800 flex justify-between items-center">
                    <span>{language === 'hi' ? 'प्रमुख शहर एवं वेधशालाएं' : 'Key Stations & Cities'}</span>
                    <button 
                      onClick={() => setShowDropdown(false)}
                      className="text-slate-500 hover:text-slate-300"
                    >
                      Close
                    </button>
                  </div>
                  {filteredCities.map((city) => (
                    <button
                      key={city.name}
                      onClick={() => handleCitySelect(city)}
                      className="w-full text-left px-3 py-2.5 text-sm hover:bg-sky-950/50 flex items-center justify-between border-b border-slate-800/50 transition group"
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-sky-400 group-hover:scale-110 transition" />
                        <span className="font-medium text-slate-200">{city.name}</span>
                        <span className="text-xs text-slate-500">({city.state})</span>
                      </div>
                      {city.isCoastal && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                          Coastal
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Action Controls: Real vs Demo Switcher + Scenario Picker */}
          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-end">
            
            {/* Live API vs Demo Toggle */}
            <div className="inline-flex p-1 bg-slate-900/90 rounded-xl border border-slate-800">
              <button
                onClick={() => setDataMode('real')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
                  dataMode === 'real' 
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Radio className={`w-3.5 h-3.5 ${dataMode === 'real' ? 'animate-pulse text-emerald-200' : ''}`} />
                <span>Live Satellite Feed</span>
              </button>
              <button
                onClick={() => setDataMode('demo')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
                  dataMode === 'demo' 
                    ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                <span>Curated Demo Scenarios</span>
              </button>
            </div>

            {/* Scenario Picker when in Demo Mode */}
            {dataMode === 'demo' && (
              <div className="relative">
                <select
                  value={activeScenarioId}
                  onChange={(e) => setActiveScenarioId(e.target.value)}
                  className="bg-slate-900 border border-amber-500/40 text-amber-300 text-xs font-medium rounded-xl px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-amber-500/50 appearance-none cursor-pointer"
                >
                  <option value="delhi_smog">🚨 Delhi Smog (AQI 412 / Fog)</option>
                  <option value="mumbai_monsoon">🌧️ Mumbai Monsoon (Red Alert / 4.2m Tide)</option>
                  <option value="goa_beach">🏄 Goa Swell (UV 9.8 / Rip Current)</option>
                  <option value="punjab_frost">❄️ Punjab Frost (Wheat Alert 2°C)</option>
                  <option value="jaipur_heat">🔥 Jaipur Loos (Extreme Heat 44°C)</option>
                  <option value="pleasant">🌸 Bengaluru Pleasant (Clear 24°C)</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-amber-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            )}

            {/* Refresh button for Real mode */}
            {dataMode === 'real' && (
              <button
                onClick={refreshData}
                disabled={loading}
                className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition"
                title="Refresh Satellite Data"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-sky-400' : ''}`} />
              </button>
            )}

            {/* Desktop Language Toggle */}
            <button
              onClick={() => setLanguage(l => l === 'en' ? 'hi' : 'en')}
              className="hidden lg:flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white transition"
            >
              <Globe2 className="w-3.5 h-3.5 text-sky-400" />
              <span>{language === 'en' ? 'हिन्दी' : 'English'}</span>
            </button>

            {/* Desktop Mobile Frame View Toggle */}
            <button
              onClick={() => setIsMobilePreview(!isMobilePreview)}
              className={`hidden lg:flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-xl border transition ${
                isMobilePreview 
                  ? 'bg-sky-600 border-sky-400 text-white shadow-lg shadow-sky-500/30' 
                  : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
              }`}
              title="Toggle Mobile Prototype Preview"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>{isMobilePreview ? 'App View ON' : 'Phone View'}</span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
}

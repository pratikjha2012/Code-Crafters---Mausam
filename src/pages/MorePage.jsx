import React from 'react';
import { useWeather } from '../context/WeatherContext';
import { useUser, INFORMATION_PRIORITIES } from '../context/UserContext';
import { useTheme } from '../context/ThemeContext';
import { INDIAN_CITIES, reverseGeocode } from '../services/weatherApi';
import { 
  Sun, 
  Moon, 
  Laptop, 
  Globe, 
  SlidersHorizontal, 
  MapPin, 
  LocateFixed, 
  ShieldCheck, 
  RefreshCw, 
  Activity, 
  Flame, 
  Waves, 
  Sprout, 
  Car, 
  Plane, 
  CalendarDays, 
  Sparkles,
  ChevronRight,
  Info
} from 'lucide-react';

export default function MorePage({ onNavigate }) {
  const { selectedCity, setSelectedCity, language, setLanguage, refreshData } = useWeather();
  const { user, openOnboarding, resetProfile } = useUser();
  const { theme, setTheme, resolvedTheme } = useTheme();

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
          alert('GPS location access was denied or timed out.');
        }
      );
    }
  };

  const hubLinks = [
    { id: 'health', label: 'Health & Allergies', hindi: 'स्वास्थ्य एवं एलर्जी', icon: Activity, color: 'text-emerald-500' },
    { id: 'fitness', label: 'Fitness & Running', hindi: 'फिटनेस एवं दौड़', icon: Flame, color: 'text-amber-500' },
    { id: 'beach', label: 'Beach & Marine Radar', hindi: 'तटीय व समुद्र', icon: Waves, color: 'text-cyan-500' },
    { id: 'agri', label: 'Kisan Agromet Portal', hindi: 'कृषि एवं किसान', icon: Sprout, color: 'text-lime-500' },
    { id: 'commute', label: 'Highway Commuter', hindi: 'ट्रैफिक व कोहरा', icon: Car, color: 'text-sky-500' },
    { id: 'travel', label: 'Travel & Aviation', hindi: 'यात्री व विमानन', icon: Plane, color: 'text-purple-500' },
    { id: 'family', label: 'Family & School Safety', hindi: 'परिवार व बच्चे', icon: ShieldCheck, color: 'text-pink-500' },
    { id: 'events', label: 'Events & Weddings', hindi: 'आयोजन व समारोह', icon: CalendarDays, color: 'text-violet-500' },
  ];

  return (
    <div className="space-y-5 pb-20">
      
      {/* Header */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
          {language === 'hi' ? 'सेटिंग्स व प्राथमिकताएं' : 'Preferences & Settings'}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Configure visual themes, language, information priorities, and station coordinates.
        </p>
      </div>

      {/* APPEARANCE / THEME TOGGLE */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {language === 'hi' ? 'दिखावट (थीम)' : 'Appearance'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Clean sky-inspired Light Mode or deep atmospheric Dark Mode
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 capitalize">
            {theme}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2.5 pt-1">
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition ${
              theme === 'light'
                ? 'bg-sky-50 dark:bg-sky-950/60 border-sky-500 text-sky-700 dark:text-sky-300 ring-2 ring-sky-500/30'
                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
            }`}
          >
            <Sun className="w-5 h-5 text-amber-500" />
            <span>Light</span>
          </button>

          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition ${
              theme === 'dark'
                ? 'bg-sky-50 dark:bg-sky-950/60 border-sky-500 text-sky-700 dark:text-sky-300 ring-2 ring-sky-500/30'
                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
            }`}
          >
            <Moon className="w-5 h-5 text-indigo-400" />
            <span>Dark</span>
          </button>

          <button
            type="button"
            onClick={() => setTheme('system')}
            className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition ${
              theme === 'system'
                ? 'bg-sky-50 dark:bg-sky-950/60 border-sky-500 text-sky-700 dark:text-sky-300 ring-2 ring-sky-500/30'
                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
            }`}
          >
            <Laptop className="w-5 h-5 text-slate-500" />
            <span>System</span>
          </button>
        </div>
      </div>

      {/* LANGUAGE SELECTION */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          Language / भाषा
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setLanguage('en')}
            className={`py-3 px-4 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
              language === 'en'
                ? 'bg-sky-600 text-white border-sky-600 shadow-md'
                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>English (Default)</span>
          </button>
          <button
            type="button"
            onClick={() => setLanguage('hi')}
            className={`py-3 px-4 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
              language === 'hi'
                ? 'bg-sky-600 text-white border-sky-600 shadow-md'
                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>हिन्दी (Hindi)</span>
          </button>
        </div>
      </div>

      {/* INFORMATION PRIORITIES CUSTOMIZATION ("Change my preferences") */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-sky-500" />
              <span>{language === 'hi' ? 'मेरी सूचना प्राथमिकताएं' : 'Information Priorities'}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Dynamic modular reordering based on your chosen priorities
            </p>
          </div>
          <button
            type="button"
            onClick={openOnboarding}
            className="px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow transition"
          >
            {language === 'hi' ? 'प्राथमिकताएं बदलें' : 'Change my preferences'}
          </button>
        </div>

        {/* Selected Priorities Pills */}
        <div className="flex flex-wrap gap-2 pt-1">
          {user.priorities.map((pid) => {
            const item = INFORMATION_PRIORITIES.find(p => p.id === pid);
            const isTop = user.topPriority === pid;
            return (
              <span 
                key={pid} 
                className={`text-xs px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 border ${
                  isTop 
                    ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-400 text-amber-900 dark:text-amber-200 ring-1 ring-amber-400/50' 
                    : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span>{item?.icon || '•'}</span>
                <span>{language === 'hi' ? item?.hindi : item?.label}</span>
                {isTop && <span className="text-[10px] text-amber-600 dark:text-amber-400 font-extrabold">(#1 First)</span>}
              </span>
            );
          })}
        </div>
      </div>

      {/* STATION / GPS SETTINGS */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <MapPin className="w-4 h-4 text-rose-500" />
            <span>Station & Location</span>
          </h3>
          <button
            type="button"
            onClick={handleLocateMe}
            className="text-xs text-sky-600 dark:text-sky-400 font-bold hover:underline flex items-center gap-1"
          >
            <LocateFixed className="w-3.5 h-3.5" />
            <span>Locate Me</span>
          </button>
        </div>

        <select
          value={selectedCity.name}
          onChange={(e) => {
            const found = INDIAN_CITIES.find(c => c.name === e.target.value);
            if (found) setSelectedCity(found);
          }}
          className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
        >
          {INDIAN_CITIES.map(c => (
            <option key={c.name} value={c.name}>
              {c.name}, {c.state}
            </option>
          ))}
        </select>
      </div>

      {/* SPECIALIZED HUBS DIRECT SHORTCUTS */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          {language === 'hi' ? 'विशेषीकृत मौसम हब' : 'Specialized Weather Portals'}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {hubLinks.map((h) => {
            const Icon = h.icon;
            return (
              <button
                key={h.id}
                type="button"
                onClick={() => onNavigate && onNavigate(h.id)}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 text-left flex items-center justify-between text-xs transition"
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${h.color}`} />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {language === 'hi' ? h.hindi : h.label}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            );
          })}
        </div>
      </div>

      {/* ABOUT & PROVENANCE */}
      <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-2">
        <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold">
          <Info className="w-4 h-4 text-sky-500" />
          <span>India Meteorological Department (IMD) • Ministry of Earth Sciences</span>
        </div>
        <p className="leading-relaxed">
          Mausam provides official high-resolution NWP telemetry, Doppler radar imagery, and personalized agro-meteorological advisories across the Indian subcontinent.
        </p>
        <div className="pt-2 flex items-center justify-between text-[11px] font-mono border-t border-slate-200 dark:border-slate-800">
          <span>Build: SIH 2026 Production</span>
          <button
            type="button"
            onClick={resetProfile}
            className="text-rose-500 hover:underline font-semibold"
          >
            Reset All Preferences
          </button>
        </div>
      </div>

    </div>
  );
}

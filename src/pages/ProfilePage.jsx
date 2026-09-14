import React, { useState } from 'react';
import { useWeather, PERSONAS } from '../context/WeatherContext';
import { useUser, INFORMATION_PRIORITIES, ALLERGIES_LIST } from '../context/UserContext';
import { 
  User, 
  Sparkles, 
  ShieldCheck, 
  SlidersHorizontal, 
  Heart, 
  Clock, 
  Bell, 
  Lock, 
  Check, 
  RotateCcw, 
  Save,
  Activity,
  Flame,
  Waves,
  Plane,
  Sprout,
  Car,
  CalendarDays,
  LayoutGrid
} from 'lucide-react';

export default function ProfilePage({ onNavigate }) {
  const { activePersona, setActivePersona, language } = useWeather();
  const { user, saveProfile, resetProfile } = useUser();

  const [name, setName] = useState(user.name || 'Citizen');
  const [selectedPriorities, setSelectedPriorities] = useState(user.priorities || ['rain', 'temp', 'aqi', 'alerts', 'outdoor']);
  const [topPriority, setTopPriority] = useState(user.topPriority || 'rain');
  const [allergies, setAllergies] = useState(user.allergies || ['dust', 'uv_sensitive']);
  const [commuteTime, setCommuteTime] = useState(user.commuteTime || '08:30');
  const [workoutTime, setWorkoutTime] = useState(user.workoutTime || '06:30');
  const [notificationSettings, setNotificationSettings] = useState(user.notificationSettings || {
    severeOnly: true,
    morningBrief: true,
    rainWarning: true
  });
  const [isSavedToast, setIsSavedToast] = useState(false);

  const getPersonaIcon = (iconName) => {
    const props = { className: 'w-5 h-5' };
    switch (iconName) {
      case 'LayoutGrid': return <LayoutGrid {...props} />;
      case 'Activity': return <Activity {...props} />;
      case 'Flame': return <Flame {...props} />;
      case 'Waves': return <Waves {...props} />;
      case 'Plane': return <Plane {...props} />;
      case 'ShieldCheck': return <ShieldCheck {...props} />;
      case 'Sprout': return <Sprout {...props} />;
      case 'Car': return <Car {...props} />;
      case 'CalendarDays': return <CalendarDays {...props} />;
      default: return <Activity {...props} />;
    }
  };

  const handleSelectPersona = (id) => {
    setActivePersona(id);
    saveProfile({ activePersona: id });
  };

  const togglePriority = (id) => {
    let next;
    if (selectedPriorities.includes(id)) {
      if (selectedPriorities.length <= 1) return; // Keep at least one
      next = selectedPriorities.filter(p => p !== id);
    } else {
      next = [...selectedPriorities, id];
    }
    setSelectedPriorities(next);
    if (!next.includes(topPriority)) {
      setTopPriority(next[0] || 'rain');
    }
  };

  const toggleAllergy = (id) => {
    setAllergies(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const handleSaveAll = () => {
    saveProfile({
      name,
      priorities: selectedPriorities,
      topPriority,
      allergies,
      commuteTime,
      workoutTime,
      notificationSettings
    });
    setIsSavedToast(true);
    setTimeout(() => setIsSavedToast(false), 3000);
  };

  return (
    <div className="space-y-6 pb-20 max-w-3xl mx-auto">
      
      {/* Header Profile Summary */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-sky-950/80 via-indigo-950/60 to-slate-900 border border-sky-800/40 text-white shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white font-black text-xl shadow-lg ring-2 ring-white/20">
            {name.charAt(0).toUpperCase() || 'C'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black">{name}</h2>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Active Profile
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Personalized Weather Intelligence • MoES IMD Network
            </p>
          </div>
        </div>

        <button
          onClick={handleSaveAll}
          className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      {isSavedToast && (
        <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center justify-between animate-in fade-in">
          <span>✓ Profile preferences saved successfully!</span>
        </div>
      )}

      {/* 1. PRIMARY PERSONA SWITCHER (Fewer than 3 interaction steps) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-500" />
              <span>{language === 'hi' ? 'प्राथमिक प्रोफ़ाइल (1-टैप स्विच)' : 'Primary Weather Profile (1-Tap Switch)'}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Select which lens drives your dynamic dashboard card priorities.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {PERSONAS.map((p) => {
            const isSelected = activePersona === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handleSelectPersona(p.id)}
                className={`p-3.5 rounded-2xl text-left border transition flex items-start justify-between gap-3 ${
                  isSelected
                    ? 'bg-sky-50 dark:bg-sky-950/70 border-sky-500 dark:border-sky-400 shadow-md ring-2 ring-sky-500/20'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-200'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className={`p-2 rounded-xl shrink-0 ${isSelected ? 'bg-sky-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                    {getPersonaIcon(p.icon)}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                      {language === 'hi' ? p.hindi : p.label}
                    </h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                      {p.id === 'health' && 'AQI, pollen, UV & asthma alerts'}
                      {p.id === 'fitness' && 'Sunrise, best workout hours, wind'}
                      {p.id === 'beach' && 'Tides, wave height, sea flag'}
                      {p.id === 'travel' && 'Saved destinations & packing'}
                      {p.id === 'family' && 'School commute & playground UV'}
                      {p.id === 'agri' && 'Soil moisture & spray window'}
                      {p.id === 'commute' && 'Corridor visibility & fog'}
                      {p.id === 'events' && 'Rain stability & comfort index'}
                      {p.id === 'all' && 'Balanced unified overview'}
                    </p>
                  </div>
                </div>

                {isSelected && (
                  <span className="w-5 h-5 rounded-full bg-sky-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. INFORMATION PRIORITIES */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-sky-500" />
              <span>{language === 'hi' ? 'सूचना प्राथमिकताएं' : 'Information Priorities'}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Toggle modules that should appear in your dynamic dashboard deck.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {INFORMATION_PRIORITIES.map((item) => {
            const isChecked = selectedPriorities.includes(item.id);
            const isTop = topPriority === item.id;
            return (
              <div
                key={item.id}
                onClick={() => togglePriority(item.id)}
                className={`p-2.5 rounded-2xl border text-xs cursor-pointer transition flex items-center justify-between gap-2 ${
                  isChecked
                    ? 'bg-sky-50/70 dark:bg-sky-950/40 border-sky-300 dark:border-sky-800 text-slate-900 dark:text-slate-100 font-semibold'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="text-base">{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </div>
                {isChecked && (
                  <span className="w-2 h-2 rounded-full bg-sky-500 shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. HEALTH & ALLERGY SENSITIVITIES */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Heart className="w-4 h-4 text-rose-500" />
          <span>{language === 'hi' ? 'स्वास्थ्य एवं एलर्जी संवेदनशीलता' : 'Health & Allergy Sensitivities'}</span>
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Mausam will proactively elevate respiratory and UV warnings when these triggers are detected.
        </p>

        <div className="flex flex-wrap gap-2 pt-1">
          {ALLERGIES_LIST.map((all) => {
            const active = allergies.includes(all.id);
            return (
              <button
                key={all.id}
                type="button"
                onClick={() => toggleAllergy(all.id)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition ${
                  active
                    ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-400 dark:border-rose-700 text-rose-700 dark:text-rose-300'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <span>{all.icon}</span>
                <span>{all.label}</span>
                {active && <Check className="w-3 h-3 ml-0.5" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. ROUTINE TIMINGS */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-500" />
          <span>{language === 'hi' ? 'दैनिक समय सारणी' : 'Daily Schedule Windows'}</span>
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Regular Workout / Run Time:
            </label>
            <input
              type="time"
              value={workoutTime}
              onChange={(e) => setWorkoutTime(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Regular Commute / Transit Time:
            </label>
            <input
              type="time"
              value={commuteTime}
              onChange={(e) => setCommuteTime(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>
      </div>

      {/* 5. NOTIFICATION SETTINGS */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Bell className="w-4 h-4 text-purple-500" />
          <span>{language === 'hi' ? 'सूचना एवं अलर्ट प्राथमिकताएं' : 'Notification Preferences'}</span>
        </h3>

        <div className="space-y-2 pt-1 text-xs">
          <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 cursor-pointer">
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200 block">Critical Weather Alerts Only</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Severe thunderstorms, cyclone & heatwave bulletins</span>
            </div>
            <input 
              type="checkbox" 
              checked={notificationSettings.severeOnly} 
              onChange={(e) => setNotificationSettings({ ...notificationSettings, severeOnly: e.target.checked })}
              className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500"
            />
          </label>

          <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 cursor-pointer">
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200 block">Daily Morning Briefing</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">At 07:00 AM tailored to your primary persona</span>
            </div>
            <input 
              type="checkbox" 
              checked={notificationSettings.morningBrief} 
              onChange={(e) => setNotificationSettings({ ...notificationSettings, morningBrief: e.target.checked })}
              className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500"
            />
          </label>
        </div>
      </div>

      {/* 6. PRIVACY & LOCAL DATA CONTROLS */}
      <div className="p-5 rounded-3xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
          <Lock className="w-4 h-4 text-emerald-500" />
          <span>Privacy & Data Transparency</span>
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
          MAUSAM personalizes weather intelligence completely on your device using browser local storage. No health, routine, or location profiles are ever uploaded to cloud ad-trackers or external profile graphs.
        </p>

        <div className="pt-2 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => {
              if (confirm('Reset profile to default citizen preferences?')) {
                resetProfile();
              }
            }}
            className="text-xs font-semibold text-rose-500 hover:text-rose-600 flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Profile to Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleSaveAll}
            className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow transition"
          >
            Save Profile
          </button>
        </div>
      </div>

    </div>
  );
}

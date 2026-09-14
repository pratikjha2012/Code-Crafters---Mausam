import React, { useState } from 'react';
import { useWeather } from '../context/WeatherContext';
import { useUser, DEFAULT_ROUTINES } from '../context/UserContext';
import { INDIAN_CITIES } from '../services/weatherApi';
import { 
  Bookmark, 
  Clock, 
  MapPin, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  Flame, 
  Car, 
  ShieldCheck, 
  Sprout, 
  Waves, 
  Plane, 
  CalendarDays,
  Sparkles,
  ArrowRight,
  Sun,
  Droplets,
  Wind
} from 'lucide-react';

export default function SavedPage({ onNavigate }) {
  const { weather, language, selectedCity, setSelectedCity } = useWeather();
  const { 
    user, 
    savedRoutines = [], 
    addSavedRoutine, 
    deleteSavedRoutine, 
    toggleSavedRoutine,
    toggleSaveLocation,
    isLocationSaved 
  } = useUser();

  const [activeSubTab, setActiveSubTab] = useState('routines'); // 'routines' | 'destinations'
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRoutine, setNewRoutine] = useState({
    title: '',
    time: '07:00',
    persona: 'fitness',
    days: 'Daily'
  });

  const current = weather?.current || {};
  const aqi = weather?.aqi || {};

  // Evaluate real-time weather suitability for each routine based on current telemetry
  const evaluateRoutineStatus = (routine) => {
    switch (routine.persona) {
      case 'fitness': {
        const isAqiBad = aqi.usAqi > 150;
        const isHeatStress = current.temp > 36 || current.feelsLike > 38;
        const isRaining = current.rainProb > 50;

        if (isRaining) {
          return {
            status: 'unfavorable',
            label: language === 'hi' ? 'वर्षा की संभावना' : 'Rain Predicted',
            desc: language === 'hi' ? 'सड़कें गीली हो सकती हैं; इंडोर वर्कआउट की सलाह।' : 'Wet pavement likely; indoor training recommended.',
            color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800'
          };
        }
        if (isAqiBad) {
          return {
            status: 'caution',
            label: language === 'hi' ? 'सावधानी (AQI ' + aqi.usAqi + ')' : `Caution (AQI ${aqi.usAqi})`,
            desc: language === 'hi' ? 'प्रदूषण बढ़ा हुआ है; हल्का व्यायाम करें।' : 'Elevated particulate matter; moderate intensity advised.',
            color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800'
          };
        }
        if (isHeatStress) {
          return {
            status: 'caution',
            label: language === 'hi' ? 'उच्च तापमान' : 'Thermal Load High',
            desc: language === 'hi' ? 'दोपहर की धूप से बचें; भरपूर पानी पिएं।' : 'High wet-bulb heat; hydrate frequently.',
            color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800'
          };
        }
        return {
          status: 'optimal',
          label: language === 'hi' ? 'अनुकूल परिस्थितियां' : 'Optimal Window',
          desc: language === 'hi' ? `तापमान ${current.temp}°C एवं अनुकूल हवा (${current.windSpeed} km/h)।` : `Ideal conditions (${current.temp}°C, breeze ${current.windSpeed} km/h).`,
          color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800'
        };
      }

      case 'commute': {
        const isFoggy = current.visibility < 1500;
        const isHeavyRain = current.rainProb > 60;
        if (isFoggy) {
          return {
            status: 'caution',
            label: language === 'hi' ? 'कोहरे की चेतावनी' : 'Dense Fog Alert',
            desc: language === 'hi' ? 'दृश्यता कम है; अतिरिक्त यात्रा समय लेकर चलें।' : 'Reduced highway visibility; allow +15m buffer.',
            color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800'
          };
        }
        if (isHeavyRain) {
          return {
            status: 'caution',
            label: language === 'hi' ? 'सड़क जलभराव जोखिम' : 'Wet Corridor Risk',
            desc: language === 'hi' ? 'भारी बारिश के कारण ट्रैफिक धीमा हो सकता है।' : 'Precipitation may slow city arterials.',
            color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800'
          };
        }
        return {
          status: 'optimal',
          label: language === 'hi' ? 'सुगम आवागमन' : 'Clear Transit',
          desc: language === 'hi' ? 'सड़कें सूखी हैं एवं दृश्यता सामान्य है।' : 'Normal corridor visibility & dry road surface.',
          color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800'
        };
      }

      case 'family': {
        const isUvExtreme = current.uvIndex >= 8;
        const isRainy = current.rainProb > 40;
        if (isRainy) {
          return {
            status: 'caution',
            label: language === 'hi' ? 'छाता आवश्यक' : 'Rain Gear Advised',
            desc: language === 'hi' ? 'स्कूल व पार्क के समय वर्षा की संभावना।' : 'Showers possible around school pickup hours.',
            color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800'
          };
        }
        if (isUvExtreme) {
          return {
            status: 'caution',
            label: language === 'hi' ? 'तीव्र धूप' : 'High UV Hours',
            desc: language === 'hi' ? 'बच्चों को धूप का चश्मा व हैट पहनाएं।' : 'Sun protection advised for playground time.',
            color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800'
          };
        }
        return {
          status: 'optimal',
          label: language === 'hi' ? 'परिवार हेतु उत्तम' : 'Great Family Window',
          desc: language === 'hi' ? 'खुशनुमा मौसम, बाहर खेलने हेतु अनुकूल।' : 'Gentle solar conditions & pleasant outdoor temperature.',
          color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800'
        };
      }

      case 'agri': {
        const isWindy = current.windSpeed > 18;
        const isRainy = current.rainProb > 40;
        if (isWindy || isRainy) {
          return {
            status: 'caution',
            label: language === 'hi' ? 'छिड़काव स्थगित करें' : 'Postpone Spray',
            desc: language === 'hi' ? 'हवा या बारिश के कारण दवा बहने का जोखिम।' : 'Elevated wind drift or rain washout risk.',
            color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800'
          };
        }
        return {
          status: 'optimal',
          label: language === 'hi' ? 'छिड़काव हेतु उत्तम' : 'Optimal Spray Window',
          desc: language === 'hi' ? 'शांत हवाएं एवं सूखी पत्तियां।' : 'Calm air (<15 km/h) with ideal foliage absorption.',
          color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800'
        };
      }

      default:
        return {
          status: 'optimal',
          label: language === 'hi' ? 'सामान्य' : 'Stable Conditions',
          desc: language === 'hi' ? 'मौसम सामान्य है।' : 'Normal meteorological parameters.',
          color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800'
        };
    }
  };

  const getPersonaIcon = (p) => {
    switch (p) {
      case 'fitness': return <Flame className="w-4 h-4 text-orange-500" />;
      case 'commute': return <Car className="w-4 h-4 text-sky-500" />;
      case 'family': return <ShieldCheck className="w-4 h-4 text-pink-500" />;
      case 'agri': return <Sprout className="w-4 h-4 text-lime-600" />;
      case 'beach': return <Waves className="w-4 h-4 text-cyan-500" />;
      default: return <Sparkles className="w-4 h-4 text-sky-500" />;
    }
  };

  const routinesList = user.savedRoutines || DEFAULT_ROUTINES;
  const savedCityList = user.savedLocations || ['New Delhi', 'Mumbai', 'Bengaluru', 'Ranchi'];

  const handleCreateRoutine = (e) => {
    e.preventDefault();
    if (!newRoutine.title.trim()) return;
    addSavedRoutine({
      title: newRoutine.title.trim(),
      hindi: newRoutine.title.trim(),
      time: newRoutine.time,
      persona: newRoutine.persona,
      days: newRoutine.days,
      enabled: true
    });
    setNewRoutine({ title: '', time: '07:00', persona: 'fitness', days: 'Daily' });
    setShowAddModal(false);
  };

  return (
    <div className="space-y-5 pb-20">
      
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Bookmark className="w-6 h-6 text-sky-500" />
            <span>{language === 'hi' ? 'सेव्ड संदर्भ एवं रूटीन' : 'Saved Context & Routines'}</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {language === 'hi' 
              ? 'आपकी दैनिक गतिविधियों और पसंदीदा स्थानों के लिए अनुकूलित मौसम सूचना' 
              : 'Weather intelligence mapped to your daily habits and frequent destinations'}
          </p>
        </div>
      </div>

      {/* Sub Tab Switcher: Routines vs Destinations */}
      <div className="flex rounded-2xl bg-slate-100 dark:bg-slate-900 p-1 border border-slate-200 dark:border-slate-800">
        <button
          type="button"
          onClick={() => setActiveSubTab('routines')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 ${
            activeSubTab === 'routines'
              ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>{language === 'hi' ? 'दैनिक रूटीन' : 'Saved Routines'} ({routinesList.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('destinations')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 ${
            activeSubTab === 'destinations'
              ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>{language === 'hi' ? 'पसंदीदा स्थान' : 'Saved Destinations'} ({savedCityList.length})</span>
        </button>
      </div>

      {/* 1. ROUTINES SECTION */}
      {activeSubTab === 'routines' && (
        <div className="space-y-3.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {language === 'hi' ? 'सक्रिय मौसम निगरानी' : 'Active Weather Watch'}
            </span>
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'नया रूटीन जोड़ें' : 'Add Routine'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {routinesList.map((routine) => {
              const evalInfo = evaluateRoutineStatus(routine);
              return (
                <div
                  key={routine.id}
                  className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 transition hover:border-slate-300 dark:hover:border-slate-700"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        {getPersonaIcon(routine.persona)}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                          {language === 'hi' ? (routine.hindi || routine.title) : routine.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          <span className="font-semibold text-sky-600 dark:text-sky-400">{routine.time}</span>
                          <span>•</span>
                          <span>{routine.days}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleSavedRoutine(routine.id)}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full border transition ${
                          routine.enabled !== false
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {routine.enabled !== false ? 'Active' : 'Paused'}
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteSavedRoutine(routine.id)}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                        title="Delete Routine"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Real-time Status Card */}
                  <div className={`p-3 rounded-2xl border text-xs flex items-start gap-2.5 ${evalInfo.color}`}>
                    <span className="shrink-0 mt-0.5 font-bold">
                      {evalInfo.status === 'optimal' ? '🟢' : evalInfo.status === 'caution' ? '🟡' : '🔴'}
                    </span>
                    <div className="flex-1">
                      <div className="font-bold text-[11px] uppercase tracking-wide">
                        {evalInfo.label}
                      </div>
                      <p className="text-[11px] mt-0.5 opacity-90 leading-relaxed">
                        {evalInfo.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. SAVED DESTINATIONS SECTION */}
      {activeSubTab === 'destinations' && (
        <div className="space-y-3.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {language === 'hi' ? 'त्वरित स्टेशन स्विच' : 'Quick Station Switch'}
            </span>
            <span className="text-[11px] text-slate-400">
              Active: <strong className="text-sky-600 dark:text-sky-400">{selectedCity?.name}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {savedCityList.map((cityName) => {
              const cityObj = INDIAN_CITIES.find(c => c.name === cityName) || {
                name: cityName,
                state: 'India',
                lat: 28.6139,
                lon: 77.2090
              };
              const isActive = selectedCity?.name === cityName;

              return (
                <div
                  key={cityName}
                  className={`p-4 rounded-3xl border transition flex items-center justify-between gap-3 ${
                    isActive
                      ? 'bg-sky-50 dark:bg-sky-950/60 border-sky-400 dark:border-sky-600 shadow-md ring-1 ring-sky-500/20'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-2xl ${isActive ? 'bg-sky-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-black text-sm text-slate-900 dark:text-white">
                        {cityName}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {cityObj.state} {cityObj.isCoastal && '• Coastal'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!isActive ? (
                      <button
                        type="button"
                        onClick={() => setSelectedCity(cityObj)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-sky-600 hover:text-white dark:hover:bg-sky-500 text-xs font-bold text-slate-700 dark:text-slate-200 transition flex items-center gap-1"
                      >
                        <span>Switch</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-sky-200 dark:bg-sky-900 text-sky-800 dark:text-sky-200">
                        Current
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => toggleSaveLocation(cityName)}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-rose-500 transition"
                      title="Remove from Saved"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Add City Dropdown */}
          <div className="p-4 rounded-3xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-2 mt-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              {language === 'hi' ? 'अन्य शहर सेव करें' : 'Save Additional Station'}
            </h4>
            <div className="flex flex-wrap gap-2 pt-1">
              {INDIAN_CITIES.filter(c => !savedCityList.includes(c.name)).slice(0, 8).map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => toggleSaveLocation(c.name)}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:border-sky-400 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 transition flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-3 h-3 text-sky-500" />
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Routine Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-sky-500" />
              <span>{language === 'hi' ? 'नया मौसम रूटीन जोड़ें' : 'Create Saved Weather Routine'}</span>
            </h3>

            <form onSubmit={handleCreateRoutine} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Routine Title:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Evening Cycling, School Transit..."
                  value={newRoutine.title}
                  onChange={(e) => setNewRoutine({ ...newRoutine, title: e.target.value })}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Scheduled Time:
                  </label>
                  <input
                    type="time"
                    value={newRoutine.time}
                    onChange={(e) => setNewRoutine({ ...newRoutine, time: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Persona Profile:
                  </label>
                  <select
                    value={newRoutine.persona}
                    onChange={(e) => setNewRoutine({ ...newRoutine, persona: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="fitness">Outdoor Fitness</option>
                    <option value="commute">Commute / Traffic</option>
                    <option value="family">Family / School</option>
                    <option value="agri">Agri / Farming</option>
                    <option value="beach">Beach / Surfer</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Days:
                </label>
                <select
                  value={newRoutine.days}
                  onChange={(e) => setNewRoutine({ ...newRoutine, days: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="Daily">Daily (हर दिन)</option>
                  <option value="Mon - Fri">Mon - Fri (सोमवार - शुक्रवार)</option>
                  <option value="Weekends">Weekends (शनि - रवि)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow transition"
                >
                  Save Routine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

import React, { useState } from 'react';
import { useUser, INFORMATION_PRIORITIES, ALLERGIES_LIST } from '../context/UserContext';
import { useWeather } from '../context/WeatherContext';
import { INDIAN_CITIES } from '../services/weatherApi';
import { 
  Sparkles, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  MapPin, 
  Globe, 
  X, 
  Star,
  CheckCircle2
} from 'lucide-react';

export default function OnboardingModal() {
  const { user, saveProfile, isOnboardingOpen, setIsOnboardingOpen } = useUser();
  const { selectedCity, setSelectedCity, language, setLanguage } = useWeather();

  const [step, setStep] = useState(1);
  const [name, setName] = useState(user.name === 'Citizen' ? '' : user.name);
  const [selectedPriorities, setSelectedPriorities] = useState(user.priorities || ['rain', 'temp', 'aqi', 'alerts', 'outdoor']);
  const [topPriority, setTopPriority] = useState(user.topPriority || 'rain');
  const [selectedAllergies, setSelectedAllergies] = useState(user.allergies || []);

  if (!isOnboardingOpen) return null;

  const togglePriority = (id) => {
    setSelectedPriorities(prev => {
      let updated;
      if (prev.includes(id)) {
        if (prev.length <= 1) return prev; // At least one priority required
        updated = prev.filter(item => item !== id);
        if (topPriority === id) {
          setTopPriority(updated[0] || 'rain');
        }
      } else {
        updated = [...prev, id];
      }
      return updated;
    });
  };

  const toggleAllergy = (id) => {
    setSelectedAllergies(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleFinish = () => {
    saveProfile({
      name: name.trim() || 'Citizen',
      priorities: selectedPriorities,
      topPriority: topPriority || selectedPriorities[0] || 'rain',
      allergies: selectedAllergies,
    });
  };

  const handleSkip = () => {
    saveProfile({
      name: 'Citizen',
      priorities: selectedPriorities.length > 0 ? selectedPriorities : ['rain', 'temp', 'aqi', 'alerts'],
      topPriority: topPriority || 'rain',
      allergies: selectedAllergies,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-900 dark:text-slate-100 flex flex-col max-h-[92vh]">
        
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-orange-600 via-white to-green-700 h-1.5 w-full shrink-0" />

        {/* Top Header Banner */}
        <div className="bg-gradient-to-br from-sky-600 via-blue-700 to-indigo-800 p-5 sm:p-6 text-white relative shrink-0">
          <button 
            onClick={handleSkip}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white/90 hover:text-white transition"
            title="Skip for now"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-1.5 text-sky-200 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-sky-300 animate-spin-slow" />
            <span>Official IMD • Meteorological Intelligence</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Make Mausam yours
          </h2>
          <p className="text-xs sm:text-sm text-sky-100/90 mt-0.5">
            Tell us what matters to you.
          </p>

          {/* Stepper Dots */}
          <div className="flex items-center gap-2 mt-4">
            <span className={`h-1.5 rounded-full transition-all ${step === 1 ? 'w-8 bg-white' : 'w-2 bg-white/40'}`} />
            <span className={`h-1.5 rounded-full transition-all ${step === 2 ? 'w-8 bg-white' : 'w-2 bg-white/40'}`} />
            <span className={`h-1.5 rounded-full transition-all ${step === 3 ? 'w-8 bg-white' : 'w-2 bg-white/40'}`} />
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          
          {/* STEP 1: Multi-Select Information Priorities */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  Select your weather priorities:
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Choose multiple topics. We will dynamically tailor your homepage without showing category labels.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {INFORMATION_PRIORITIES.map((p) => {
                  const isSelected = selectedPriorities.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => togglePriority(p.id)}
                      className={`p-3 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
                        isSelected 
                          ? 'bg-sky-50 dark:bg-sky-950/70 border-sky-500 text-sky-900 dark:text-sky-100 shadow-sm ring-1 ring-sky-500/50' 
                          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <span className="text-xl">{p.icon}</span>
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                          isSelected ? 'bg-sky-500 text-white' : 'border border-slate-300 dark:border-slate-600'
                        }`}>
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>
                      <div className="font-bold text-xs leading-snug">
                        {language === 'hi' ? p.hindi : p.label}
                      </div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                        {p.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: Top Priority & Allergies */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  Which information would you like to see first?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Pick your #1 top priority to pin prominently on your homepage.
                </p>

                <div className="grid grid-cols-2 gap-2 mt-3">
                  {INFORMATION_PRIORITIES.filter(p => selectedPriorities.includes(p.id)).map(p => {
                    const isTop = topPriority === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setTopPriority(p.id)}
                        className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition ${
                          isTop 
                            ? 'bg-amber-500/15 border-amber-500 text-amber-900 dark:text-amber-300 ring-1 ring-amber-500/50' 
                            : 'bg-slate-100 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <span className="text-base">{p.icon}</span>
                        <span className="truncate flex-1 text-left">{p.label}</span>
                        {isTop && <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  Any health or atmospheric sensitivities? (Optional)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  We will trigger subtle, proactive warnings when live AQI, dust or UV cross safe thresholds.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                  {ALLERGIES_LIST.map((al) => {
                    const isChecked = selectedAllergies.includes(al.id);
                    return (
                      <button
                        key={al.id}
                        type="button"
                        onClick={() => toggleAllergy(al.id)}
                        className={`p-2.5 rounded-xl border text-left text-xs transition flex items-center gap-2.5 ${
                          isChecked 
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200' 
                            : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <span className="text-base">{al.icon}</span>
                        <span className="flex-1 font-medium">{al.label}</span>
                        <div className={`w-4 h-4 rounded flex items-center justify-center ${
                          isChecked ? 'bg-emerald-600 text-white' : 'border border-slate-400 dark:border-slate-600'
                        }`}>
                          {isChecked && <Check className="w-3 h-3" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Location & Language */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Preferred Station / City
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <select
                    value={selectedCity.name}
                    onChange={(e) => {
                      const found = INDIAN_CITIES.find(c => c.name === e.target.value);
                      if (found) setSelectedCity(found);
                    }}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    {INDIAN_CITIES.map(c => (
                      <option key={c.name} value={c.name}>
                        {c.name}, {c.state}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Language / भाषा
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setLanguage('en')}
                    className={`py-2.5 px-4 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
                      language === 'en' 
                        ? 'bg-sky-600 text-white border-sky-600 shadow-md' 
                        : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span>English</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage('hi')}
                    className={`py-2.5 px-4 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
                      language === 'hi' 
                        ? 'bg-sky-600 text-white border-sky-600 shadow-md' 
                        : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span>हिन्दी</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Your Name (Optional)
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Citizen"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSkip}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition"
            >
              Use Defaults
            </button>
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-lg shadow-sky-600/30 transition flex items-center gap-1.5"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold shadow-lg shadow-emerald-600/30 transition flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Open Personalized Mausam</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

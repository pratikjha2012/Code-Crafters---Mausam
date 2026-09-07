import React, { useState } from 'react';
import { useUser, ALLERGIES_LIST } from '../context/UserContext';
import { PERSONAS } from '../context/WeatherContext';
import { 
  Sparkles, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Heart, 
  Clock, 
  User, 
  X, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export default function OnboardingModal() {
  const { user, saveProfile, isOnboardingOpen, setIsOnboardingOpen } = useUser();
  const [step, setStep] = useState(1);

  const [name, setName] = useState(user.name === 'Citizen Guest' ? '' : user.name);
  const [primaryInterest, setPrimaryInterest] = useState(user.primaryInterest || 'health');
  const [selectedAllergies, setSelectedAllergies] = useState(user.allergies || []);
  const [commuteTime, setCommuteTime] = useState(user.commuteTime || '08:30');
  const [workoutTime, setWorkoutTime] = useState(user.workoutTime || '06:30');

  if (!isOnboardingOpen) return null;

  const toggleAllergy = (id) => {
    setSelectedAllergies(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleFinish = () => {
    saveProfile({
      name: name.trim() || 'Pratik (Citizen)',
      primaryInterest,
      allergies: selectedAllergies,
      commuteTime,
      workoutTime
    });
  };

  const handleSkip = () => {
    saveProfile({
      name: name.trim() || 'Citizen Guest',
      primaryInterest,
      allergies: selectedAllergies,
      commuteTime,
      workoutTime
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[90vh]">
        
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 p-6 text-white relative">
          <button 
            onClick={handleSkip}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white/80 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 text-sky-200 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-sky-300" />
            <span>Personalized Intelligence Engine • MoES / IMD</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Customize Your 'Mausam' Experience
          </h2>
          <p className="text-xs text-sky-100/90 mt-1">
            Tell us about your interests & sensitivities so we can curate live weather advisories specifically for you.
          </p>

          {/* Stepper Dots */}
          <div className="flex items-center gap-2 mt-4">
            <span className={`h-1.5 rounded-full transition-all ${step === 1 ? 'w-8 bg-white' : 'w-2 bg-white/40'}`} />
            <span className={`h-1.5 rounded-full transition-all ${step === 2 ? 'w-8 bg-white' : 'w-2 bg-white/40'}`} />
            <span className={`h-1.5 rounded-full transition-all ${step === 3 ? 'w-8 bg-white' : 'w-2 bg-white/40'}`} />
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Step 1: Name & Role / Interests */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  1. What should we call you?
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Enter your name (e.g. Pratik, Dr. Sharma)..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  2. What is your primary interest or daily activity?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {PERSONAS.filter(p => p.id !== 'all').map((p) => {
                    const isSelected = primaryInterest === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setPrimaryInterest(p.id)}
                        className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                          isSelected 
                            ? 'bg-sky-950/80 border-sky-400 text-sky-200 ring-2 ring-sky-500/50' 
                            : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <span className="text-xs font-bold">{p.label.split(' ')[0]}</span>
                        <span className="text-[10px] text-slate-500 line-clamp-1">{p.hindi}</span>
                        {isSelected && <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse mt-0.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Allergies & Health Sensitivities */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-400" />
                  Environmental Sensitivities & Allergies
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Select any condition so our AI can send proactive air quality, pollen & UV alerts.
                </p>
              </div>

              <div className="space-y-2.5">
                {ALLERGIES_LIST.map((al) => {
                  const isChecked = selectedAllergies.includes(al.id);
                  return (
                    <div
                      key={al.id}
                      onClick={() => toggleAllergy(al.id)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                        isChecked 
                          ? 'bg-rose-950/40 border-rose-500/80 text-rose-100 ring-1 ring-rose-500' 
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/80'
                      }`}
                    >
                      <span className="text-xl mt-0.5">{al.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs">{al.label}</span>
                          <span className="text-[10px] text-slate-400">{al.hindi}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">{al.desc}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 ${
                        isChecked ? 'bg-rose-600 border-rose-400 text-white' : 'border-slate-700 bg-slate-900'
                      }`}>
                        {isChecked && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 3: Routine Timings */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  Daily Routine Hours
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  We check route visibility, fog, and rain for your specific transit windows.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <label className="text-xs font-semibold text-slate-300">
                    🚗 Morning Departure / Commute Hour:
                  </label>
                  <input
                    type="time"
                    value={commuteTime}
                    onChange={(e) => setCommuteTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                  <span className="text-[10px] text-slate-500 block">
                    Used for roadway fog and subway waterlogging forecasts.
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <label className="text-xs font-semibold text-slate-300">
                    🏃 Preferred Workout / Running Hour:
                  </label>
                  <input
                    type="time"
                    value={workoutTime}
                    onChange={(e) => setWorkoutTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                  <span className="text-[10px] text-slate-500 block">
                    Used for heat index and optimal outdoor running hours.
                  </span>
                </div>
              </div>

              {/* Profile Summary Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-950/60 to-indigo-950/60 border border-sky-800/60 text-xs text-sky-200 flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-sky-400 shrink-0" />
                <span>
                  Your profile will customize alerts instantly on the homepage and dedicated persona pages.
                </span>
              </div>
            </div>
          )}

        </div>

        {/* Bottom Actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(s => s - 1)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <button
              onClick={handleSkip}
              className="text-xs text-slate-400 hover:text-white px-2 py-1 transition"
            >
              Skip for now
            </button>
          )}

          {step < 3 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-lg shadow-sky-600/30 flex items-center gap-1.5 transition"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center gap-1.5 transition"
            >
              <Check className="w-4 h-4" />
              <span>Save & Launch My Portal</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

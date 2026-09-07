import React, { useState } from 'react';
import { useUser, ALLERGIES_LIST } from '../context/UserContext';
import { PERSONAS } from '../context/WeatherContext';
import { X, Save, RefreshCw, User, Heart, Clock, ShieldCheck } from 'lucide-react';

export default function UserProfileModal() {
  const { user, saveProfile, resetProfile, isProfileModalOpen, setIsProfileModalOpen } = useUser();

  const [name, setName] = useState(user.name || '');
  const [primaryInterest, setPrimaryInterest] = useState(user.primaryInterest || 'health');
  const [allergies, setAllergies] = useState(user.allergies || []);
  const [commuteTime, setCommuteTime] = useState(user.commuteTime || '08:30');
  const [workoutTime, setWorkoutTime] = useState(user.workoutTime || '06:30');

  if (!isProfileModalOpen) return null;

  const toggleAllergy = (id) => {
    setAllergies(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    saveProfile({
      name: name.trim() || 'Pratik (Citizen)',
      primaryInterest,
      allergies,
      commuteTime,
      workoutTime
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-950 p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-sky-600 flex items-center justify-center text-white font-bold text-sm">
              {name.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Citizen Weather Profile</h3>
              <p className="text-[10px] text-slate-400">Personalized MoES Meteorological Sync</p>
            </div>
          </div>
          <button 
            onClick={() => setIsProfileModalOpen(false)}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Your Name / Title:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Primary Focus */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Primary Persona Focus:</label>
            <select
              value={primaryInterest}
              onChange={(e) => setPrimaryInterest(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
            >
              {PERSONAS.filter(p => p.id !== 'all').map(p => (
                <option key={p.id} value={p.id}>{p.label} ({p.hindi})</option>
              ))}
            </select>
          </div>

          {/* Allergies & Conditions */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Tracked Sensitivities & Allergies:</label>
            <div className="space-y-2">
              {ALLERGIES_LIST.map(al => {
                const checked = allergies.includes(al.id);
                return (
                  <div
                    key={al.id}
                    onClick={() => toggleAllergy(al.id)}
                    className={`p-2.5 rounded-xl border text-xs cursor-pointer flex items-center justify-between ${
                      checked ? 'bg-rose-950/40 border-rose-500 text-rose-200' : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{al.icon}</span>
                      <span className="font-medium">{al.label}</span>
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-700">
                      {checked ? 'Active' : 'Disabled'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Routine Times */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Morning Commute:</label>
              <input
                type="time"
                value={commuteTime}
                onChange={(e) => setCommuteTime(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Workout Hour:</label>
              <input
                type="time"
                value={workoutTime}
                onChange={(e) => setWorkoutTime(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={resetProfile}
            className="text-xs text-rose-400 hover:underline flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Setup</span>
          </button>

          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow flex items-center gap-1.5 transition"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Preferences</span>
          </button>
        </div>

      </div>
    </div>
  );
}

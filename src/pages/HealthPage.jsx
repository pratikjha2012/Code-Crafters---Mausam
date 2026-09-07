import React, { useState } from 'react';
import { useWeather } from '../context/WeatherContext';
import { useUser } from '../context/UserContext';
import HealthModule from '../components/personas/HealthModule';
import { 
  ArrowLeft, 
  Activity, 
  Heart, 
  ShieldCheck, 
  AlertTriangle, 
  Wind, 
  Sparkles, 
  Info,
  ThermometerSnowflake,
  Sun
} from 'lucide-react';

export default function HealthPage({ onBack }) {
  const { weather, language } = useWeather();
  const { user } = useUser();
  const [selectedSensitivity, setSelectedSensitivity] = useState(user.allergies[0] || 'asthma');

  if (!weather) return null;
  const { aqi, current } = weather;

  return (
    <div className="space-y-6">
      {/* Top Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-950 border border-emerald-800/50">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-emerald-600 text-white"><Activity className="w-4 h-4" /></span>
              <h1 className="text-xl sm:text-2xl font-black text-white">
                {language === 'hi' ? 'स्वास्थ्य, श्वसन एवं एलर्जी केंद्र' : 'Health & Respiratory Intelligence Sanctuary'}
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Personalized for {user.name} • Active Health Profile: {user.allergies.join(', ') || 'General Wellness'}
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-400 block">Station: {weather.cityName}</span>
          <span className="text-sm font-extrabold text-emerald-400">AQI {aqi.usAqi} ({aqi.category})</span>
        </div>
      </div>

      {/* Main Core Health Module */}
      <HealthModule />

      {/* Deep-Dive Interactive Allergen Matrix & Medical Advice */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Allergen Matrix */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Live Environmental Allergen Matrix
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Real-time atmospheric biological particles scanned for {weather.cityName}:
          </p>

          <div className="space-y-2 pt-1 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
              <span className="text-slate-300">Grass Pollen:</span>
              <span className="font-bold text-emerald-400">{aqi.pollenGrass} grains/m³</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
              <span className="text-slate-300">Tree Pollen:</span>
              <span className="font-bold text-emerald-400">{aqi.pollenTree} grains/m³</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
              <span className="text-slate-300">Weed Pollen:</span>
              <span className="font-bold text-emerald-400">{aqi.pollenWeed} grains/m³</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
              <span className="text-slate-300">PM2.5 / Dust:</span>
              <span className="font-bold text-sky-400">{aqi.pm25} µg/m³</span>
            </div>
          </div>
        </div>

        {/* Protection Protocols */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-400" />
            Targeted Preventive Guidance
          </h3>
          <p className="text-xs text-slate-400">
            Clinical MoES advice for your recorded sensitivities:
          </p>

          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-2xl bg-rose-950/30 border border-rose-800/40 space-y-1">
              <span className="font-bold text-rose-300">🫁 Asthma & Wheezing Protocol:</span>
              <p className="text-slate-400 leading-relaxed">
                {aqi.usAqi > 150 
                  ? 'Keep inhalers close. Keep windows closed during early morning temperature inversions.' 
                  : 'Airway resistance is low. Outdoor ventilation is healthy.'}
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-amber-950/30 border border-amber-800/40 space-y-1">
              <span className="font-bold text-amber-300">☀️ UV & Skin Barrier:</span>
              <p className="text-slate-400 leading-relaxed">
                Solar UV index is {current.uvIndex}. Apply mineral sunscreen with zinc oxide/titanium dioxide.
              </p>
            </div>
          </div>
        </div>

        {/* Indoor Air Purifier Calculator */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Wind className="w-4 h-4 text-teal-400" />
            Indoor Air Quality (IAQ) Control
          </h3>
          <p className="text-xs text-slate-400">
            Recommended indoor ventilation & HEPA filtration settings:
          </p>

          <div className="space-y-2 text-xs pt-1">
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-300">Air Purifier Speed:</span>
              <span className="font-bold text-white px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800">
                {aqi.usAqi > 250 ? 'Turbo / High' : aqi.usAqi > 100 ? 'Medium' : 'Auto / Low'}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-300">Room Ventilation:</span>
              <span className="font-bold text-white px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800">
                {aqi.usAqi > 200 ? 'Recirculate / Sealed' : 'Cross-ventilation Safe'}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

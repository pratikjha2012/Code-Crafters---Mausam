import React from 'react';
import { useWeather } from '../context/WeatherContext';
import BeachModule from '../components/personas/BeachModule';
import { ArrowLeft, Waves, Anchor, Compass, LifeBuoy } from 'lucide-react';

export default function BeachPage({ onBack }) {
  const { weather, language } = useWeather();
  if (!weather) return null;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-3xl bg-gradient-to-r from-cyan-950/60 via-slate-900 to-slate-950 border border-cyan-800/50">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-cyan-600 text-white"><Waves className="w-4 h-4" /></span>
              <h1 className="text-xl sm:text-2xl font-black text-white">
                {language === 'hi' ? 'तटीय, समुद्र एवं सर्फिंग वेधशाला' : 'Coastal, Marine & Surfing Observatory'}
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              INCOIS / MoES Indian Ocean High Swell & Tide Radar
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-400 block">Station: {weather.cityName}</span>
          <span className="text-sm font-extrabold text-cyan-400">Coastal Zone</span>
        </div>
      </div>

      {/* Core Beach Module */}
      <BeachModule />
    </div>
  );
}

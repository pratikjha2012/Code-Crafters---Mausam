import React from 'react';
import { useWeather } from '../context/WeatherContext';
import { useUser } from '../context/UserContext';
import CommuteModule from '../components/personas/CommuteModule';
import { ArrowLeft, Car, Eye, Clock, ShieldAlert, Navigation } from 'lucide-react';

export default function CommutePage({ onBack }) {
  const { weather, language } = useWeather();
  const { user } = useUser();
  if (!weather) return null;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-3xl bg-gradient-to-r from-sky-950/60 via-slate-900 to-slate-950 border border-sky-800/50">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-sky-600 text-white"><Car className="w-4 h-4" /></span>
              <h1 className="text-xl sm:text-2xl font-black text-white">
                {language === 'hi' ? 'दैनिक यात्री एवं एक्सप्रेसवे रडार' : 'Highways, Transit & Urban Mobility Radar'}
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Personalized for your morning departure at <strong>{user.commuteTime}</strong>
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-400 block">Station: {weather.cityName}</span>
          <span className="text-sm font-extrabold text-sky-400">
            Visibility: {weather.current.visibility < 1000 ? `${weather.current.visibility}m` : `${(weather.current.visibility/1000).toFixed(1)}km`}
          </span>
        </div>
      </div>

      {/* Core Commute Module */}
      <CommuteModule />
    </div>
  );
}

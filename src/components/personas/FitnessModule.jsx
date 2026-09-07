import React, { useState } from 'react';
import { useWeather } from '../../context/WeatherContext';
import { 
  Flame, 
  Sunrise, 
  Sunset, 
  Wind, 
  ThermometerSun, 
  Timer, 
  CheckCircle, 
  AlertTriangle, 
  Activity, 
  GlassWater,
  Footprints,
  Bike
} from 'lucide-react';

export default function FitnessModule() {
  const { weather, language } = useWeather();
  const [workoutType, setWorkoutType] = useState('running');

  if (!weather) return null;
  const { current, aqi } = weather;

  // Calculate workout fitness score for today (0-100)
  const calculateWorkoutScore = (hourOffset) => {
    let score = 90;
    // Base temperature penalties
    if (current.temp > 38) score -= 45;
    else if (current.temp > 32) score -= 25;
    else if (current.temp < 5) score -= 25;

    // AQI penalties
    if (aqi.usAqi > 300) score -= 50;
    else if (aqi.usAqi > 150) score -= 30;
    else if (aqi.usAqi > 100) score -= 15;

    // Rain / Storm
    if (current.rainProb > 70) score -= 35;
    else if (current.rainProb > 40) score -= 15;

    // Wind
    if (current.windSpeed > 30) score -= 15;

    return Math.max(10, Math.min(98, score));
  };

  const currentScore = calculateWorkoutScore(0);

  // Hourly Running Score Forecast
  const hourlySlots = [
    { time: '05:30 AM', label: 'Early Dawn', temp: Math.round(current.tempMin + 1), score: aqi.usAqi > 300 ? 30 : 92, tag: 'Best Run Window' },
    { time: '07:00 AM', label: 'Sunrise Run', temp: Math.round(current.tempMin + 3), score: aqi.usAqi > 300 ? 25 : 88, tag: 'Cool & Crisp' },
    { time: '11:00 AM', label: 'Midday', temp: Math.round(current.tempMax - 2), score: current.temp > 35 ? 15 : 45, tag: 'High Heat/UV' },
    { time: '02:00 PM', label: 'Afternoon', temp: current.tempMax, score: current.temp > 35 ? 10 : 35, tag: 'Avoid Cardio' },
    { time: '05:30 PM', label: 'Sunset Glow', temp: Math.round(current.temp - 2), score: aqi.usAqi > 300 ? 35 : 82, tag: 'Recommended' },
    { time: '08:00 PM', label: 'Night Cool', temp: Math.round(current.tempMin + 4), score: aqi.usAqi > 300 ? 20 : 78, tag: 'Mild Jogging' },
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-950 text-amber-400 border border-amber-800/60">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-white flex items-center gap-2">
              {language === 'hi' ? 'आउटडोर फिटनेस एवं रनिंग हब' : 'Outdoor Fitness & Workout Optimization'}
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-700">
                Fitness Intelligence
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              {language === 'hi'
                ? 'सूर्योदय/सूर्यास्त, सर्वश्रेष्ठ दौड़ने के घंटे, हवा की गति और हीट इंडेक्स अलर्ट'
                : 'Golden hours, optimal running intervals, aerodynamic wind resistance & hydration guidelines'}
            </p>
          </div>
        </div>

        {/* Workout Activity Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setWorkoutType('running')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
              workoutType === 'running' ? 'bg-amber-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Footprints className="w-3.5 h-3.5" />
            <span>Running / Jog</span>
          </button>
          <button
            onClick={() => setWorkoutType('cycling')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
              workoutType === 'cycling' ? 'bg-amber-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bike className="w-3.5 h-3.5" />
            <span>Cycling</span>
          </button>
        </div>
      </div>

      {/* Main Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* 1. Golden Hour: Sunrise & Sunset */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between space-y-3">
          <span className="text-xs text-slate-400 font-medium">Solar Window (गोल्डन ऑवर)</span>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-300">
                <Sunrise className="w-4 h-4" />
                <span className="text-xs font-semibold">Sunrise:</span>
              </div>
              <span className="text-sm font-bold text-white">{current.sunrise}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-orange-400">
                <Sunset className="w-4 h-4" />
                <span className="text-xs font-semibold">Sunset:</span>
              </div>
              <span className="text-sm font-bold text-white">{current.sunset}</span>
            </div>
          </div>
          <span className="text-[10px] text-amber-400 font-medium">
            Optimal natural daylight workout window
          </span>
        </div>

        {/* 2. Heat Alert & Heat Index */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5"><ThermometerSun className="w-4 h-4 text-orange-400" /> Heat Alert Index</span>
            <span className="text-slate-500">Thermal Strain</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{current.temp}°C</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
              current.temp >= 40 ? 'bg-red-950 text-red-300 border border-red-700' :
              current.temp >= 32 ? 'bg-amber-950 text-amber-300 border border-amber-700' :
              'bg-emerald-950 text-emerald-300 border border-emerald-700'
            }`}>
              {current.temp >= 40 ? 'Danger / Loos' : current.temp >= 32 ? 'Caution' : 'Safe Zones'}
            </span>
          </div>
          <div className="text-[11px] text-slate-400">
            {current.temp >= 38 ? 'High stroke risk. Run indoors or before 6:30 AM.' : 'Thermal stress within normal biological range.'}
          </div>
        </div>

        {/* 3. Aerodynamic Wind Speed */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5"><Wind className="w-4 h-4 text-teal-400" /> Running Wind Resistance</span>
            <span className="text-slate-500">Km/h</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{current.windSpeed}</span>
            <span className="text-xs text-slate-400">km/h ({current.windDirection}°)</span>
          </div>
          <div className="text-[11px] text-slate-400">
            {current.windSpeed > 25 ? 'High drag. Headwind sprint recommended.' : 'Light aerodynamic resistance. Excellent for tempo runs.'}
          </div>
        </div>

        {/* 4. Hydration & Metabolic Demand */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5"><GlassWater className="w-4 h-4 text-sky-400" /> Hydration Guide</span>
            <span className="text-slate-500">Per Hour</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-sky-300">
              {current.temp >= 35 ? '800 - 1000' : current.temp >= 28 ? '600 - 750' : '450 - 500'}
            </span>
            <span className="text-xs text-slate-400">mL / hr</span>
          </div>
          <div className="text-[10px] text-sky-300/80">
            {current.humidity > 70 ? 'High sweat rate. Add electrolytes/salt tablets.' : 'Drink small sips every 15-20 minutes.'}
          </div>
        </div>

      </div>

      {/* "Best Running Hours" Timeline Chart */}
      <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Timer className="w-4 h-4 text-amber-400" />
            <h4 className="text-sm font-bold text-white">
              Best Running Hours (दिन के सर्वश्रेष्ठ दौड़ने के घंटे)
            </h4>
          </div>
          <span className="text-xs text-slate-400">
            Based on Temperature, AQI ({aqi.usAqi}), and Solar Intensity
          </span>
        </div>

        {/* Hour Slots Timeline */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {hourlySlots.map((slot, idx) => {
            const isTop = slot.score >= 80;
            const isPoor = slot.score <= 30;
            return (
              <div 
                key={idx}
                className={`p-3 rounded-xl border text-center transition-all ${
                  isTop 
                    ? 'bg-emerald-950/40 border-emerald-600/70 text-emerald-300 shadow-lg shadow-emerald-950/20' 
                    : isPoor
                    ? 'bg-red-950/30 border-red-800/40 text-red-300'
                    : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}
              >
                <div className="text-xs font-black text-white">{slot.time}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{slot.label}</div>
                
                <div className="my-2">
                  <div className="text-lg font-black">{slot.score}<span className="text-[10px] text-slate-400">/100</span></div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                    <div 
                      className={`h-full rounded-full ${
                        isTop ? 'bg-emerald-400' : isPoor ? 'bg-red-500' : 'bg-amber-400'
                      }`}
                      style={{ width: `${slot.score}%` }}
                    />
                  </div>
                </div>

                <div className="text-[10px] font-semibold text-slate-300 mt-1">
                  {slot.temp}°C
                </div>
                <div className="text-[9px] font-medium mt-1 truncate">
                  {slot.tag}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

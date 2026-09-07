import React, { useState } from 'react';
import { useWeather } from '../context/WeatherContext';
import { useUser } from '../context/UserContext';
import FitnessModule from '../components/personas/FitnessModule';
import { 
  ArrowLeft, 
  Flame, 
  Timer, 
  GlassWater, 
  Wind, 
  Footprints, 
  Bike, 
  Sliders,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export default function FitnessPage({ onBack }) {
  const { weather, language } = useWeather();
  const { user } = useUser();
  const [selectedHour, setSelectedHour] = useState(7); // 7 AM
  const [userWeight, setUserWeight] = useState(70); // 70 kg

  if (!weather || !weather.current || !weather.aqi) return null;
  const { current, aqi } = weather;

  // Compute metrics for the selected workout hour
  const getHourSimulation = (hour) => {
    let estimatedTemp = current.temp;
    if (hour >= 11 && hour <= 16) estimatedTemp = current.tempMax;
    else if (hour <= 7 || hour >= 20) estimatedTemp = current.tempMin + 2;
    else estimatedTemp = Math.round((current.tempMin + current.tempMax) / 2);

    let score = 95;
    if (estimatedTemp > 38) score -= 45;
    else if (estimatedTemp > 32) score -= 25;
    if (aqi.usAqi > 200) score -= 35;
    if (current.rainProb > 60) score -= 25;

    score = Math.max(15, Math.min(98, score));

    // Hydration demand based on body weight & temp
    const baseWater = (userWeight * 7); // ~500ml base
    const heatExtra = estimatedTemp > 30 ? (estimatedTemp - 30) * 35 : 0;
    const totalMl = Math.round(baseWater + heatExtra);

    return {
      temp: estimatedTemp,
      score,
      totalMl,
      verdict: score >= 80 ? 'Optimal Workout Window' : score >= 50 ? 'Moderate Heat / Hydrate Well' : 'High Heat Exertion Hazard'
    };
  };

  const sim = getHourSimulation(selectedHour);

  return (
    <div className="space-y-6">
      {/* Top Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-3xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-950 border border-amber-800/50">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-amber-600 text-white"><Flame className="w-4 h-4" /></span>
              <h1 className="text-xl sm:text-2xl font-black text-white">
                {language === 'hi' ? 'आउटडोर फिटनेस एवं रनिंग हब' : 'Athletic & Outdoor Fitness Station'}
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Personalized for {user.name} • Registered Workout Hour: {user.workoutTime}
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-400 block">Station: {weather.cityName}</span>
          <span className="text-sm font-extrabold text-amber-400">Current Temp: {current.temp}°C</span>
        </div>
      </div>

      {/* Interactive Workout Hour Planner Slider */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-400" />
            <h3 className="font-bold text-sm text-white">
              Interactive Workout Time Simulator
            </h3>
          </div>
          <span className="text-xs font-mono font-bold text-amber-400 px-3 py-1 rounded-full bg-amber-950 border border-amber-800">
            Selected Time: {selectedHour}:00 {selectedHour >= 12 ? 'PM' : 'AM'}
          </span>
        </div>

        <div>
          <input
            type="range"
            min="5"
            max="21"
            value={selectedHour}
            onChange={(e) => setSelectedHour(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
            <span>05:00 AM</span>
            <span>09:00 AM</span>
            <span>01:00 PM</span>
            <span>05:00 PM</span>
            <span>09:00 PM</span>
          </div>
        </div>

        {/* Real-time Dynamic Calculated Results */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-xs text-slate-400 font-medium">Estimated Temperature:</span>
            <div className="text-2xl font-black text-white mt-1">{sim.temp}°C</div>
            <span className="text-[10px] text-slate-500">Surface thermal model</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-xs text-slate-400 font-medium">Running Suitability Score:</span>
            <div className={`text-2xl font-black mt-1 ${
              sim.score >= 80 ? 'text-emerald-400' : sim.score >= 50 ? 'text-amber-400' : 'text-rose-400'
            }`}>
              {sim.score} <span className="text-xs text-slate-500">/ 100</span>
            </div>
            <span className="text-[10px] text-slate-400 truncate block">{sim.verdict}</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-xs text-slate-400 font-medium">Hydration Intake Target:</span>
            <div className="text-2xl font-black text-sky-400 mt-1">{sim.totalMl} mL</div>
            <span className="text-[10px] text-slate-500">For {userWeight} kg body weight</span>
          </div>
        </div>
      </div>

      {/* Main Core Fitness Module */}
      <FitnessModule />
    </div>
  );
}

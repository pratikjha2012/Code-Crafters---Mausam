import React, { useState } from 'react';
import { useWeather } from '../../context/WeatherContext';
import { 
  Waves, 
  Anchor, 
  Thermometer, 
  AlertTriangle, 
  Compass, 
  Clock, 
  ShieldAlert, 
  Sparkles, 
  CheckCircle2, 
  Sun,
  LifeBuoy
} from 'lucide-react';

export default function BeachModule() {
  const { weather, language } = useWeather();
  const [selectedBeach, setSelectedBeach] = useState('Goa - Calangute Beach');

  if (!weather) return null;
  const { marine, current } = weather;

  const coastalSpots = [
    { name: 'Goa - Calangute Beach', wave: 2.1, period: 9.2, temp: 29.0, flag: 'Yellow', rip: 'Moderate' },
    { name: 'Mumbai - Juhu Beach', wave: 3.8, period: 11.5, temp: 28.2, flag: 'Red', rip: 'High Swell' },
    { name: 'Chennai - Marina Beach', wave: 1.4, period: 8.0, temp: 29.5, flag: 'Green', rip: 'Low' },
    { name: 'Puri - Golden Beach', wave: 1.8, period: 8.8, temp: 28.0, flag: 'Yellow', rip: 'Moderate' },
    { name: 'Kovalam - Lighthouse Beach', wave: 1.6, period: 9.0, temp: 29.0, flag: 'Green', rip: 'Low' },
  ];

  // Active beach stats
  const activeSpot = coastalSpots.find(s => s.name === selectedBeach) || coastalSpots[0];
  const waveHeight = marine?.isCoastal ? marine.waveHeight : activeSpot.wave;
  const wavePeriod = marine?.isCoastal ? marine.wavePeriod : activeSpot.period;
  const waterTemp = marine?.isCoastal ? marine.waterTemp : activeSpot.temp;
  const safetyFlag = marine?.isCoastal ? marine.safetyFlag : activeSpot.flag;

  // Surfing Condition Rating
  const getSurfCondition = (h, p) => {
    if (h >= 4.0) return { score: 'Dangerous', color: 'text-red-400', desc: 'Closed out / Storm swell. Life guard warning.' };
    if (h >= 2.0 && p >= 9) return { score: 'Epic (शानदार)', color: 'text-emerald-400', desc: 'Clean peelers, long rideable waves.' };
    if (h >= 1.2) return { score: 'Good (उत्तम)', color: 'text-cyan-400', desc: 'Fun for shortboards & longboards.' };
    return { score: 'Small / Flat', color: 'text-slate-400', desc: 'Gentle ripples, beginner-friendly.' };
  };

  const surfRating = getSurfCondition(waveHeight, wavePeriod);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-cyan-950 text-cyan-400 border border-cyan-800/60">
            <Waves className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-white flex items-center gap-2">
              {language === 'hi' ? 'तटीय, समुद्र एवं सर्फिंग रडार' : 'Beachgoers, Surfers & Marine Portal'}
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-700">
                INCOIS / MoES Marine
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              {language === 'hi'
                ? 'समुद्र की स्थिति, ज्वार-भाटा का समय, लहरों की ऊंचाई एवं जल तापमान'
                : 'Live wave heights, swell frequency, high/low tide predictions & beach safety flag radar'}
            </p>
          </div>
        </div>

        {/* Coastal Location Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400">Coastal Spot:</label>
          <select
            value={selectedBeach}
            onChange={(e) => setSelectedBeach(e.target.value)}
            className="bg-slate-950 border border-cyan-800/80 text-cyan-300 text-xs font-semibold rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer"
          >
            {coastalSpots.map(s => (
              <option key={s.name} value={s.name}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Marine Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 1. Beach Safety Flag (INCOIS Standard) */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5"><LifeBuoy className="w-4 h-4 text-cyan-400" /> Beach Safety Flag</span>
            <span className="text-slate-500">Lifeguard</span>
          </div>
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shadow-md ${
              safetyFlag === 'Red' ? 'bg-red-600 text-white animate-pulse' :
              safetyFlag === 'Yellow' ? 'bg-amber-400 text-slate-950' : 'bg-emerald-500 text-white'
            }`}>
              {safetyFlag === 'Red' ? '🚩' : safetyFlag === 'Yellow' ? '⚠️' : '🟢'}
            </div>
            <div>
              <div className="text-xl font-black text-white">{safetyFlag} Flag</div>
              <div className="text-[11px] text-slate-400">
                {safetyFlag === 'Red' ? 'Swimming Prohibited' : safetyFlag === 'Yellow' ? 'Caution: Rip Currents' : 'Safe for Swimming'}
              </div>
            </div>
          </div>
          <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800">
            Patrolled by Coastal Police & Lifeguards
          </div>
        </div>

        {/* 2. Wave Height & Swell Period */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5"><Waves className="w-4 h-4 text-blue-400" /> Significant Wave Height</span>
            <span className="text-slate-500">Meters</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{waveHeight} m</span>
            <span className="text-xs text-slate-400 font-medium">Swell: {wavePeriod}s</span>
          </div>
          <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800 flex justify-between">
            <span>Surfing: <span className={`font-bold ${surfRating.color}`}>{surfRating.score}</span></span>
            <span className="text-slate-500">Direction: 245° SW</span>
          </div>
        </div>

        {/* 3. Water Temperature */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5"><Thermometer className="w-4 h-4 text-teal-400" /> Sea Surface Temp (SST)</span>
            <span className="text-slate-500">Coastal</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{waterTemp}°C</span>
            <span className="text-xs text-emerald-400 font-semibold">Tropical Warm</span>
          </div>
          <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
            No wetsuit required. Rash guard suggested for UV protection.
          </div>
        </div>

        {/* 4. Wind & Rip Current Hazard */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5"><Compass className="w-4 h-4 text-amber-400" /> Coastal Wind & Drift</span>
            <span className="text-slate-500">Offshore</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{current.windSpeed} km/h</span>
            <span className="text-xs text-cyan-400 font-semibold">{current.windSpeed > 20 ? 'Chop' : 'Glassy'}</span>
          </div>
          <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
            Rip Current Watch: <span className="font-semibold text-amber-300">{activeSpot.rip}</span>
          </div>
        </div>

      </div>

      {/* Tide Timings Schedule */}
      <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <h4 className="text-sm font-bold text-white">
              Tidal Timings & Sea Height Curve (आज के ज्वार-भाटा चक्र)
            </h4>
          </div>
          <span className="text-xs text-slate-400">
            {marine?.tideStatus || 'Astronomical Tide Prediction'}
          </span>
        </div>

        {/* Tide Curve Blocks */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <div className="text-[11px] text-slate-400 font-medium flex items-center justify-between">
              <span>Low Tide (भाटा)</span>
              <span className="text-blue-400">0.42 m</span>
            </div>
            <div className="text-base font-bold text-white mt-1">04:15 AM</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Shallow tide pool walking</div>
          </div>

          <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-800/60">
            <div className="text-[11px] text-cyan-300 font-medium flex items-center justify-between">
              <span>High Tide (ज्वार)</span>
              <span className="text-cyan-400 font-bold">2.45 m</span>
            </div>
            <div className="text-base font-bold text-white mt-1">10:48 AM</div>
            <div className="text-[10px] text-cyan-300/80 mt-0.5">Peak water level / surfing waves</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <div className="text-[11px] text-slate-400 font-medium flex items-center justify-between">
              <span>Low Tide (भाटा)</span>
              <span className="text-blue-400">0.58 m</span>
            </div>
            <div className="text-base font-bold text-white mt-1">05:22 PM</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Sunset beach stroll & volleyball</div>
          </div>

          <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-800/60">
            <div className="text-[11px] text-cyan-300 font-medium flex items-center justify-between">
              <span>High Tide (ज्वार)</span>
              <span className="text-cyan-400 font-bold">2.62 m</span>
            </div>
            <div className="text-base font-bold text-white mt-1">11:35 PM</div>
            <div className="text-[10px] text-cyan-300/80 mt-0.5">Night high surf, stay off rocks</div>
          </div>
        </div>
      </div>

    </div>
  );
}

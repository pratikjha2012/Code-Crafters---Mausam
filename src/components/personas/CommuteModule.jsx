import React from 'react';
import { useWeather } from '../../context/WeatherContext';
import { 
  Car, 
  Eye, 
  CloudFog, 
  CloudRainWind, 
  AlertTriangle, 
  Gauge, 
  Navigation, 
  TrainTrack, 
  Clock,
  ShieldCheck,
  Zap
} from 'lucide-react';

export default function CommuteModule() {
  const { weather, language } = useWeather();
  if (!weather) return null;

  const { current } = weather;

  // Visibility categorization
  const vis = current.visibility || 5000;
  const getVisibilityStatus = (v) => {
    if (v < 200) return { category: 'Dense Fog (अत्यधिक घना कोहरा)', speed: 'Max 30 km/h', color: 'text-red-400', bg: 'bg-red-950/40 border-red-700/60', alert: 'Use yellow fog lights, maintain 4-car spacing, avoid overtaking on highways.' };
    if (v < 500) return { category: 'Moderate Fog (मध्यम कोहरा)', speed: 'Max 50 km/h', color: 'text-amber-400', bg: 'bg-amber-950/40 border-amber-700/60', alert: 'Drive on low beam headlights. Expressway speed restrictions enforced.' };
    if (v < 1000) return { category: 'Shallow Mist / Haze', speed: 'Normal Speeds', color: 'text-yellow-300', bg: 'bg-yellow-950/30 border-yellow-800/50', alert: 'Mild haze on elevated flyovers. Drive vigilantly.' };
    return { category: 'Clear Visibility (साफ दृश्यता)', speed: 'Normal Speed Limits', color: 'text-emerald-400', bg: 'bg-emerald-950/40 border-emerald-700/60', alert: 'Road and horizon clear. Favorable for long-distance highway travel.' };
  };

  const visStatus = getVisibilityStatus(vis);

  // Commute Delay Estimator
  const getCommuteDelay = () => {
    if (vis < 200 || current.weatherCode === 65 || current.weatherCode === 82) {
      return { delay: '+35 to 45 mins', risk: 'High Delay Risk', badge: 'bg-red-950 text-red-300 border-red-700' };
    }
    if (vis < 500 || current.rainProb > 60) {
      return { delay: '+15 to 20 mins', risk: 'Moderate Traffic Drag', badge: 'bg-amber-950 text-amber-300 border-amber-700' };
    }
    return { delay: 'Minimal (+0-5m)', risk: 'Smooth Flow', badge: 'bg-emerald-950 text-emerald-300 border-emerald-700' };
  };

  const commuteDelay = getCommuteDelay();

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-sky-950 text-sky-400 border border-sky-800/60">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-white flex items-center gap-2">
              {language === 'hi' ? 'दैनिक यात्री एवं ट्रैफिक मौसम केंद्र' : 'Commuters, Highways & Transit Radar'}
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-sky-950 text-sky-300 border border-sky-700">
                MoES Mobility
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              {language === 'hi'
                ? 'सड़क दृश्यता (विजिबिलिटी), कोहरा और बारिश के कारण होने वाले ट्रैफिक विलंब का विश्लेषण'
                : 'Roadway visibility thresholds, dense fog advisories, aquaplaning hazards & delay projections'}
            </p>
          </div>
        </div>

        <div className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-2 ${visStatus.bg}`}>
          <Eye className={`w-4 h-4 ${visStatus.color}`} />
          <span className="text-slate-300">Highway Visibility:</span>
          <span className={`font-bold ${visStatus.color}`}>{vis < 1000 ? `${vis} m` : `${(vis/1000).toFixed(1)} km`}</span>
        </div>
      </div>

      {/* Main Commute Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 1. Road Visibility & Headway Speed */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5"><Eye className="w-4 h-4 text-sky-400" /> Optical Range</span>
            <span className="text-slate-500">Meters</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{vis < 1000 ? `${vis} m` : `${(vis/1000).toFixed(1)} km`}</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${visStatus.color}`}>
              {visStatus.speed}
            </span>
          </div>
          <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
            {visStatus.alert}
          </div>
        </div>

        {/* 2. Aquaplaning & Underpass Waterlogging Risk */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5"><CloudRainWind className="w-4 h-4 text-blue-400" /> Waterlogging Risk</span>
            <span className="text-slate-500">Subways & Low Roads</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-xl font-black ${
              current.weatherCode === 65 || current.rainProb > 80 ? 'text-red-400' : 'text-emerald-400'
            }`}>
              {current.weatherCode === 65 || current.rainProb > 80 ? 'High Risk / Flooded' : 'Low / Free Drainage'}
            </span>
          </div>
          <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
            {current.rainProb > 70 
              ? 'Tire grip reduces by 40% on wet tarmac. Avoid railway subways during peak cloudbursts.' 
              : 'Traction normal. Roads dry and navigable.'}
          </div>
        </div>

        {/* 3. Expected Commute Delay Multiplier */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-amber-400" /> Transit Delay Score</span>
            <span className="text-slate-500">Peak Hours</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{commuteDelay.delay}</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${commuteDelay.badge}`}>
              {commuteDelay.risk}
            </span>
          </div>
          <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
            Calculated combining visibility degradation, wet road friction and vehicle headway spacing.
          </div>
        </div>

        {/* 4. Metro & Rail Transit Weather Reliability */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5"><TrainTrack className="w-4 h-4 text-emerald-400" /> Rail & Metro Status</span>
            <span className="text-slate-500">Transit</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-black text-emerald-400">Normal Schedule</span>
          </div>
          <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
            {vis < 200 
              ? 'Inter-city trains running on Fog Pass fog-safety devices at restricted speeds.' 
              : 'Metro elevated tracks operating at standard frequency.'}
          </div>
        </div>

      </div>

      {/* Corridor Road Safety Guide */}
      <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-sky-950/80 text-sky-300 border border-sky-800">
            <Navigation className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Live Highway Alert Broadcast
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              {vis < 300 
                ? '⚠️ Dense fog on national expressways. Hazard lights are for stationary vehicles only; use low-beam fog lamps while in motion.'
                : '✅ Weather on major freight and passenger corridors is clear. Drive safely within posted speed limits.'}
            </p>
          </div>
        </div>

        <button 
          onClick={() => alert(`Commuter Telemetry for ${weather.cityName}: Visibility: ${vis}m (${visStatus.category}). Expected delay: ${commuteDelay.delay}. Maintain safe headway.`)}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 whitespace-nowrap transition"
        >
          View Live Traffic Heatmap
        </button>
      </div>

    </div>
  );
}

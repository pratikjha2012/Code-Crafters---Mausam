import React from 'react';
import { useWeather, PERSONAS } from '../context/WeatherContext';
import { 
  LayoutGrid, 
  Activity, 
  Flame, 
  Waves, 
  Plane, 
  ShieldCheck, 
  Sprout, 
  Car, 
  CalendarDays,
  Sparkles,
  AlertCircle
} from 'lucide-react';

export default function PersonaSelector() {
  const { activePersona, setActivePersona, language, weather } = useWeather();

  const getIcon = (iconName) => {
    const props = { className: 'w-4 h-4' };
    switch (iconName) {
      case 'LayoutGrid': return <LayoutGrid {...props} />;
      case 'Activity': return <Activity {...props} />;
      case 'Flame': return <Flame {...props} />;
      case 'Waves': return <Waves {...props} />;
      case 'Plane': return <Plane {...props} />;
      case 'ShieldCheck': return <ShieldCheck {...props} />;
      case 'Sprout': return <Sprout {...props} />;
      case 'Car': return <Car {...props} />;
      case 'CalendarDays': return <CalendarDays {...props} />;
      default: return <Activity {...props} />;
    }
  };

  // Smart Adaptive Recommendation based on current weather hazards
  const getSmartAdaptiveRecommendation = () => {
    if (!weather) return null;
    const { current, aqi, marine } = weather;

    if (aqi.usAqi >= 300) {
      return {
        target: 'health',
        tag: 'Health Emergency',
        message: 'Severe AQI alert (>300). Prioritizing Health-Conscious recommendations for sensitive groups.'
      };
    }
    if (marine?.safetyFlag === 'Red' || marine?.waveHeight >= 3.5) {
      return {
        target: 'beach',
        tag: 'Coastal Alert',
        message: 'Rough sea conditions & red flag detected. Prioritizing Beachgoers & Surfers safety data.'
      };
    }
    if (current.weatherCode === 65 || current.weatherCode === 82 || current.rainProb >= 85) {
      return {
        target: 'commute',
        tag: 'Monsoon Commute Watch',
        message: 'Heavy rain & waterlogging probability high. Prioritizing Commuters & School transit info.'
      };
    }
    if (current.soilTemp <= 4 || current.temp <= 5) {
      return {
        target: 'agri',
        tag: 'Agromet Warning',
        message: 'Near-freezing ground temperatures detected. Prioritizing Kisan Frost & Crop advisories.'
      };
    }
    if (current.temp >= 42) {
      return {
        target: 'fitness',
        tag: 'Heat Exertion Alert',
        message: 'Extreme heatwave (>42°C). Highlighting workout rescheduling and hydration alerts.'
      };
    }
    return {
      target: 'all',
      tag: 'Optimal Balance',
      message: 'Weather conditions are stable across key sectors. Showing unified multi-persona dashboard.'
    };
  };

  const smartRec = getSmartAdaptiveRecommendation();

  return (
    <div className="w-full space-y-3">
      {/* Smart Automation Banner */}
      {smartRec && (
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-sky-950/60 via-indigo-950/40 to-slate-900 border border-sky-800/40 text-xs shadow-md">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-400 animate-pulse" />
            <span className="font-bold text-sky-300 uppercase tracking-wider text-[11px] px-2 py-0.5 rounded-md bg-sky-900/60 border border-sky-700">
              Smart Automation
            </span>
            <span className="text-slate-300 font-medium">
              {smartRec.message}
            </span>
          </div>
          {activePersona !== smartRec.target && smartRec.target !== 'all' && (
            <button
              onClick={() => setActivePersona(smartRec.target)}
              className="px-2.5 py-1 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs shadow transition flex items-center gap-1"
            >
              <span>View {smartRec.tag}</span>
            </button>
          )}
        </div>
      )}

      {/* Horizontal Persona Tabs / Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {PERSONAS.map((p) => {
          const isSelected = activePersona === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setActivePersona(p.id)}
              className={`px-3.5 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2 shrink-0 transition-all border ${
                isSelected
                  ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white border-sky-400 shadow-lg shadow-sky-500/25 scale-[1.02]'
                  : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:bg-slate-800/80 hover:text-white hover:border-slate-700'
              }`}
            >
              {getIcon(p.icon)}
              <span>{language === 'hi' ? p.hindi : p.label}</span>
              {isSelected && (
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping ml-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

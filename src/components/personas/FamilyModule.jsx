import React from 'react';
import { useWeather } from '../../context/WeatherContext';
import { 
  ShieldCheck, 
  Bus, 
  CloudRain, 
  Sun, 
  Bug, 
  Baby, 
  BellRing, 
  Clock, 
  AlertTriangle, 
  CheckCircle2,
  Sparkles,
  Umbrella
} from 'lucide-react';

export default function FamilyModule() {
  const { weather, language } = useWeather();
  if (!weather) return null;

  const { current, aqi } = weather;

  // School commute risk calculation
  const getSchoolCommuteStatus = () => {
    if (aqi.usAqi > 350) {
      return { 
        status: 'Hazardous (कठिन स्थिति)', 
        tag: 'School Closure / Online Suggested', 
        color: 'text-red-400', 
        bg: 'bg-red-950/40 border-red-700/60',
        advice: 'Severe smog & visibility hazard. Ensure double masking or advocate for online classes under GRAP IV.'
      };
    }
    if (current.weatherCode === 65 || current.weatherCode === 82 || current.rainProb > 80) {
      return { 
        status: 'Severe Rain Alert', 
        tag: 'Allow +30m Commute Time', 
        color: 'text-amber-400', 
        bg: 'bg-amber-950/40 border-amber-700/60',
        advice: 'Waterlogging likely near school bus stops. Pack raincoats and waterproof boot covers.'
      };
    }
    if (current.visibility < 300) {
      return { 
        status: 'Dense Fog Delay', 
        tag: 'Slow School Bus Speeds', 
        color: 'text-amber-400', 
        bg: 'bg-amber-950/40 border-amber-700/60',
        advice: 'Heavy morning fog. Bus drivers instructed to follow strict headway speeds.'
      };
    }
    return { 
      status: 'Normal & Safe (अनुकूल)', 
      tag: 'Commute on Schedule', 
      color: 'text-emerald-400', 
      bg: 'bg-emerald-950/40 border-emerald-700/60',
      advice: 'Clear weather conditions. Smooth and safe commute for morning school buses.'
    };
  };

  const commute = getSchoolCommuteStatus();

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-rose-950 text-rose-400 border border-rose-800/60">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-white flex items-center gap-2">
              {language === 'hi' ? 'अभिभावक एवं बाल सुरक्षा केंद्र' : 'Parents, Children & Family Safety Portal'}
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-700">
                Family Care
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              {language === 'hi'
                ? 'स्कूल आवागमन की स्थिति, त्वरित वर्षा चेतावनी और बच्चों के स्वास्थ्य के लिए मौसम परामर्श'
                : 'School bus transit window, sudden rain countdowns & pediatric outdoor safety'}
            </p>
          </div>
        </div>

        <div className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-2 ${commute.bg}`}>
          <Bus className={`w-4 h-4 ${commute.color}`} />
          <span className="text-slate-300">Morning School Bus:</span>
          <span className={`font-bold ${commute.color}`}>{commute.status}</span>
        </div>
      </div>

      {/* Main Family Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 1. School Commute Window (07:00 - 09:00 AM) */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5"><Bus className="w-4 h-4 text-rose-400" /> Morning School Window</span>
            <span className="text-slate-500">07:00 - 09:00 AM</span>
          </div>
          <div className="space-y-1">
            <div className="text-sm font-bold text-white">{commute.tag}</div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {commute.advice}
            </p>
          </div>
          <div className="text-[10px] text-rose-300/90 pt-1 border-t border-slate-800 font-medium">
            Next status check: Tomorrow 06:00 AM
          </div>
        </div>

        {/* 2. Rain Alert & Umbrella Countdown */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5"><Umbrella className="w-4 h-4 text-sky-400" /> Rain Alert Radar</span>
            <span className="text-slate-500">Precipitation</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{current.rainProb}%</span>
            <span className="text-xs font-semibold text-slate-400">Probability</span>
          </div>
          <div className="text-[11px] text-slate-300 pt-1 border-t border-slate-800">
            {current.rainProb >= 60 
              ? '🌧️ Carry raincoat & umbrella in school bags today.' 
              : current.rainProb >= 20 
              ? '⛅ Patchy cloud cover. Low shower chances.' 
              : '☀️ Dry skies expected throughout the school hours.'}
          </div>
        </div>

        {/* 3. Outdoor Playground & Recess Safety */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5"><Baby className="w-4 h-4 text-amber-400" /> Recess & Playground Safety</span>
            <span className="text-slate-500">Play Hours</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-lg font-black ${
              aqi.usAqi > 250 || current.temp > 40 ? 'text-rose-400' : 'text-emerald-400'
            }`}>
              {aqi.usAqi > 250 ? 'Indoor Recess Only' : current.temp > 40 ? 'Shaded Play Only' : 'Safe for Outdoor Sports'}
            </span>
          </div>
          <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
            {aqi.usAqi > 200 
              ? 'Children breathe 50% more air per kg than adults. Curtail high-intensity sprinting.'
              : `Solar UV Index: ${current.uvIndex}. Apply SPF 30 sunscreen before playground.`}
          </div>
        </div>

        {/* 4. Dengue / Mosquito Vector Alert */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5"><Bug className="w-4 h-4 text-teal-400" /> Mosquito & Humidity Vector</span>
            <span className="text-slate-500">Vector Risk</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-base font-black ${
              current.humidity > 75 && current.temp > 24 ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {current.humidity > 75 && current.temp > 24 ? 'Elevated Breeding Risk' : 'Low Breeding Risk'}
            </span>
          </div>
          <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
            {current.humidity > 75 
              ? 'Humid conditions favor Aedes mosquitoes. Dress kids in full sleeves; inspect water coolers.'
              : 'Dryer air reduces vector proliferation.'}
          </div>
        </div>

      </div>

      {/* Daily Routine Planner Assistant */}
      <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-rose-950/80 text-rose-300 border border-rose-800">
            <BellRing className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Family Routine Planner Summary
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              School return window (02:00 - 04:00 PM): Temp {current.tempMax}°C, rain probability {current.rainProb}%. Hydration bottle recommended.
            </p>
          </div>
        </div>

        <button 
          onClick={() => alert(`Parent Checklist for ${weather.cityName}: School Bus Commute: ${commute.status}. Rain Prob: ${current.rainProb}%. Sunscreen & hydration advised.`)}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 whitespace-nowrap transition"
        >
          Export Family Daily Brief
        </button>
      </div>

    </div>
  );
}

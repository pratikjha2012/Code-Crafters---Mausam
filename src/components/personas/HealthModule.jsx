import React from 'react';
import { useWeather } from '../../context/WeatherContext';
import { 
  Activity, 
  Wind, 
  Sun, 
  Droplets, 
  AlertCircle, 
  ShieldAlert, 
  CheckCircle2, 
  Sparkles, 
  Flower2, 
  HeartHandshake,
  AlertTriangle
} from 'lucide-react';

export default function HealthModule() {
  const { weather, language } = useWeather();
  if (!weather) return null;

  const { current, aqi } = weather;

  // Compute Asthma & Allergy Risk Level
  const computeHealthRisk = () => {
    let score = 0;
    if (aqi.usAqi > 250) score += 4;
    else if (aqi.usAqi > 150) score += 3;
    else if (aqi.usAqi > 100) score += 2;
    else if (aqi.usAqi > 50) score += 1;

    if (aqi.pollenGrass > 40 || aqi.pollenTree > 40) score += 2;
    if (current.humidity > 80 || current.humidity < 25) score += 1;

    if (score >= 5) return { level: 'High Risk (गंभीर जोखिम)', color: 'text-red-400', bg: 'bg-red-950/40 border-red-700/60' };
    if (score >= 3) return { level: 'Moderate Risk (मध्यम जोखिम)', color: 'text-amber-400', bg: 'bg-amber-950/40 border-amber-700/60' };
    return { level: 'Low / Favorable (अनुकूल)', color: 'text-emerald-400', bg: 'bg-emerald-950/40 border-emerald-700/60' };
  };

  const risk = computeHealthRisk();

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-950 text-emerald-400 border border-emerald-800/60">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-white flex items-center gap-2">
              {language === 'hi' ? 'स्वास्थ्य-सचेत डैशबोर्ड' : 'Health & Respiratory Intelligence'}
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700">
                MoES Health
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              {language === 'hi' 
                ? 'अस्थमा, एलर्जी और संवेदनशील त्वचा के लिए वास्तविक समय मार्गदर्शन' 
                : 'Real-time air quality, pollen thresholds, and asthma & allergy advisories'}
            </p>
          </div>
        </div>

        <div className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-2 ${risk.bg}`}>
          <HeartHandshake className={`w-4 h-4 ${risk.color}`} />
          <span className="text-slate-300">Asthma/Allergy:</span>
          <span className={`font-bold ${risk.color}`}>{risk.level}</span>
        </div>
      </div>

      {/* Grid of Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 1. Air Quality Index Gauge */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5"><Wind className="w-4 h-4 text-sky-400" /> Air Quality (AQI)</span>
            <span className="text-slate-500">US Standard</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{aqi.usAqi}</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
              aqi.usAqi > 300 ? 'bg-red-950 text-red-300 border border-red-700' :
              aqi.usAqi > 150 ? 'bg-orange-950 text-orange-300 border border-orange-700' :
              aqi.usAqi > 100 ? 'bg-amber-950 text-amber-300 border border-amber-700' :
              'bg-emerald-950 text-emerald-300 border border-emerald-700'
            }`}>
              {aqi.category}
            </span>
          </div>
          {/* Particulate Matter details */}
          <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[11px]">
            <div>
              <span className="text-slate-500">PM2.5:</span>{' '}
              <span className="font-semibold text-slate-200">{aqi.pm25} µg/m³</span>
            </div>
            <div>
              <span className="text-slate-500">PM10:</span>{' '}
              <span className="font-semibold text-slate-200">{aqi.pm10} µg/m³</span>
            </div>
          </div>
        </div>

        {/* 2. Pollen Count */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5"><Flower2 className="w-4 h-4 text-emerald-400" /> Pollen Tracker</span>
            <span className="text-slate-500">Grains/m³</span>
          </div>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Grass Pollen:</span>
              <span className="font-bold text-slate-200">{aqi.pollenGrass} (Low-Med)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Tree Pollen:</span>
              <span className="font-bold text-slate-200">{aqi.pollenTree} (Normal)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Weed Pollen:</span>
              <span className="font-bold text-slate-200">{aqi.pollenWeed} (Trace)</span>
            </div>
          </div>
          <div className="text-[10px] text-emerald-400/90 font-medium pt-1">
            {aqi.pollenGrass > 30 ? '⚠️ High pollen: rinse eyes after outdoors' : '✅ Low pollen allergy risk today'}
          </div>
        </div>

        {/* 3. UV Index & Skin Sensitivity */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5"><Sun className="w-4 h-4 text-amber-400" /> UV Radiation</span>
            <span className="text-slate-500">Solar Index</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-300">{current.uvIndex}</span>
            <span className="text-xs font-semibold text-slate-300">
              {current.uvIndex >= 8 ? 'Very High (बहुत तेज)' : current.uvIndex >= 5 ? 'Moderate' : 'Low (हल्का)'}
            </span>
          </div>
          <div className="text-[11px] text-slate-300 space-y-1 pt-1 border-t border-slate-800">
            <p className="flex items-center gap-1">
              <span className="text-amber-400 font-bold">•</span>
              {current.uvIndex >= 7 ? 'SPF 50+ Sunscreen recommended' : 'SPF 30+ sufficient'}
            </p>
            <p className="text-[10px] text-slate-400">
              {current.uvIndex >= 7 ? 'Avoid sun between 11:30 AM - 3:30 PM' : 'Safe for prolonged sun exposure'}
            </p>
          </div>
        </div>

        {/* 4. Humidity & Respiratory Comfort */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5"><Droplets className="w-4 h-4 text-sky-400" /> Relative Humidity</span>
            <span className="text-slate-500">Dew Point</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{current.humidity}%</span>
            <span className="text-xs font-medium text-slate-400">
              {current.humidity > 80 ? 'Muggy / High' : current.humidity < 30 ? 'Very Dry' : 'Comfortable'}
            </span>
          </div>
          <div className="text-[11px] text-slate-300 pt-1 border-t border-slate-800">
            {current.humidity > 80 && (
              <p className="text-amber-300/90">
                High humidity favors mold & dust mites. Keep rooms ventilated.
              </p>
            )}
            {current.humidity < 30 && (
              <p className="text-amber-300/90">
                Dry air may irritate throat & eczema. Use moisturizer.
              </p>
            )}
            {current.humidity >= 30 && current.humidity <= 80 && (
              <p className="text-emerald-300/90">
                Optimal respiratory comfort level.
              </p>
            )}
          </div>
        </div>

      </div>

      {/* Actionable Health Advisories based on Current Severity */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-950 to-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-sky-950 text-sky-300 border border-sky-800 mt-0.5">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Personalized Health Recommendations (IMD Smart Advisory)
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              {aqi.usAqi > 200 
                ? '🔴 High pollution alert: Vulnerable individuals, asthmatics, and children must wear N95 masks outdoors and keep HEPA purifiers running.'
                : aqi.usAqi > 100
                ? '🟡 Moderate air quality: Sensitive individuals may experience mild cough; carry an inhaler if prescribed.'
                : '🟢 Pristine air quality: Outdoor breathing is safe and encouraging for walks and respiratory recovery.'
              }
            </p>
          </div>
        </div>

        <button 
          onClick={() => alert(`Official MoES/IMD Health Advisory for ${weather.cityName}: AQI is ${aqi.usAqi} (${aqi.category}). PM2.5: ${aqi.pm25} µg/m³. UV Index: ${current.uvIndex}. Consult your physician if experiencing wheezing.`)}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 whitespace-nowrap transition"
        >
          Download Medical Summary
        </button>
      </div>

    </div>
  );
}

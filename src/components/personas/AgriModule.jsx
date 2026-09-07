import React, { useState } from 'react';
import { useWeather } from '../../context/WeatherContext';
import { 
  Sprout, 
  Droplets, 
  CloudRain, 
  ThermometerSnowflake, 
  Wind, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  Tractor,
  Layers,
  Sparkles
} from 'lucide-react';

export default function AgriModule() {
  const { weather, language } = useWeather();
  const [cropType, setCropType] = useState('wheat');

  if (!weather) return null;
  const { current, rawDaily } = weather;

  // Soil moisture interpretation (Volumetric m3/m3)
  const moisture = current.soilMoisture || 0.28;
  const getSoilMoistureStatus = (val) => {
    if (val < 0.15) return { status: 'Deficit / Dry (शुष्क)', color: 'text-amber-400', bg: 'bg-amber-950/40 border-amber-700/60', advice: 'Urgent light irrigation required to prevent wilting.' };
    if (val > 0.45) return { status: 'Saturated / Waterlogged (अत्यधिक नमी)', color: 'text-rose-400', bg: 'bg-rose-950/40 border-rose-700/60', advice: 'Ensure field drainage channels are clear to prevent root rot.' };
    return { status: 'Optimal Field Capacity (उपयुक्त नमी)', color: 'text-emerald-400', bg: 'bg-emerald-950/40 border-emerald-700/60', advice: 'Ideal moisture for germination and nutrient uptake.' };
  };

  const moistureStatus = getSoilMoistureStatus(moisture);

  // Frost Alert Evaluation
  const isFrostAlert = current.soilTemp <= 4 || current.temp <= 4;

  // Spray Suitability Window (Pesticide/Fertilizer)
  // Needs wind < 15 km/h and rain < 20%
  const isSpraySuitable = current.windSpeed < 18 && current.rainProb < 25;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-lime-950 text-lime-400 border border-lime-800/60">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-white flex items-center gap-2">
              {language === 'hi' ? 'कृषि मौसम एवं किसान परामर्श' : 'Agriculture, Kisan & Gardening Intelligence'}
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-lime-950 text-lime-300 border border-lime-700">
                GKMS Agromet
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              {language === 'hi'
                ? 'मृदा नमी, 7-दिवसीय वर्षा अनुमान, पाला (फ्रॉस्ट) चेतावनी और मौसमी बुवाई मार्गदर्शन'
                : 'Soil moisture strata, 7-day cumulative rainfall projections, ground frost radar & GKMS crop advisories'}
            </p>
          </div>
        </div>

        {/* Agro-climatic zone badge */}
        <div className="flex items-center gap-2 text-xs">
          <Tractor className="w-4 h-4 text-lime-400" />
          <span className="text-slate-400">Zone:</span>
          <span className="font-semibold text-lime-300">{weather.agroRegion}</span>
        </div>
      </div>

      {/* Critical Frost Alert if applicable */}
      {isFrostAlert && (
        <div className="p-4 rounded-2xl bg-cyan-950/70 border border-cyan-500 text-cyan-200 flex items-start gap-3 shadow-lg shadow-cyan-950/40 animate-pulse">
          <ThermometerSnowflake className="w-6 h-6 text-cyan-300 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-sm tracking-wide flex items-center gap-2">
              <span>IMD Agromet Ground Frost Alert (पाला चेतावनी)</span>
              <span className="text-[10px] uppercase bg-cyan-900 border border-cyan-400 px-2 py-0.5 rounded-full font-extrabold">
                Critical Kisan Advisory
              </span>
            </div>
            <p className="text-xs text-cyan-100/90 mt-1 leading-relaxed">
              Ground temperatures dropped to {current.soilTemp}°C (near freezing). Apply light sprinkler irrigation to standing crops (mustard, wheat, potato) tonight and create smoke mulching around orchards to protect against frost injury.
            </p>
          </div>
        </div>
      )}

      {/* Core Agri Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 1. Volumetric Soil Moisture */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5"><Layers className="w-4 h-4 text-lime-400" /> Soil Moisture (0-7 cm)</span>
            <span className="text-slate-500">Volumetric</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{(moisture * 100).toFixed(1)}%</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${moistureStatus.color}`}>
              {moistureStatus.status.split(' ')[0]}
            </span>
          </div>
          <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
            {moistureStatus.advice}
          </div>
        </div>

        {/* 2. Soil Surface Temperature */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5"><ThermometerSnowflake className="w-4 h-4 text-cyan-400" /> Soil Temperature</span>
            <span className="text-slate-500">Topsoil</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{current.soilTemp}°C</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
              isFrostAlert ? 'bg-cyan-950 text-cyan-300 border border-cyan-700' : 'bg-emerald-950 text-emerald-300'
            }`}>
              {isFrostAlert ? 'Frost Threat' : 'Healthy Root Bed'}
            </span>
          </div>
          <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
            Root metabolism active. Ideal seed bed temperature is 18°C - 26°C.
          </div>
        </div>

        {/* 3. Rainfall Projections & Irrigation Guidance */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5"><CloudRain className="w-4 h-4 text-sky-400" /> Rainfall Prediction</span>
            <span className="text-slate-500">Irrigation</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{current.rainProb}%</span>
            <span className="text-xs text-slate-400 font-semibold">Today's Risk</span>
          </div>
          <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
            {current.rainProb > 60 
              ? '🚫 Postpone canal & tube-well irrigation; natural rainfall incoming.' 
              : '💧 Safe to irrigate crops according to routine rotational roster.'}
          </div>
        </div>

        {/* 4. Chemical Spraying Window (Agro-Chemicals) */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5"><Wind className="w-4 h-4 text-amber-400" /> Pesticide / Fertilizer Spray</span>
            <span className="text-slate-500">Drift Check</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-base font-black ${isSpraySuitable ? 'text-emerald-400' : 'text-amber-400'}`}>
              {isSpraySuitable ? 'Suitable Window' : 'Not Recommended'}
            </span>
          </div>
          <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
            {isSpraySuitable 
              ? `Wind speed ${current.windSpeed} km/h is below 18 km/h threshold. Low droplet drift.` 
              : `High wind (${current.windSpeed} km/h) or rain risk causes chemical wash-off and drift.`}
          </div>
        </div>

      </div>

      {/* GKMS Seasonal Agromet Bulletin */}
      <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tractor className="w-4 h-4 text-lime-400" />
            <h4 className="text-sm font-bold text-white">
              Gramin Krishi Mausam Sewa (GKMS) Crop Advisory
            </h4>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            Rabi & Kharif Seasonal Guidance
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-xs">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="font-bold text-lime-300">🌾 Wheat & Cereal Crops</span>
            <p className="text-slate-400 leading-relaxed">
              Crown root initiation (CRI) stage requires adequate moisture. If no rain is expected in 48 hours, apply second irrigation.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="font-bold text-lime-300">🌱 Mustard & Oilseeds</span>
            <p className="text-slate-400 leading-relaxed">
              Monitor for aphid infestation during cloudy and humid intervals. Spray neem seed kernel extract (NSKE 5%) if pests exceed ETL.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="font-bold text-lime-300">🥕 Vegetables & Kitchen Garden</span>
            <p className="text-slate-400 leading-relaxed">
              Ensure proper staking for tomatoes and peas against sudden wind gusts. Mulch garden beds to retain soil moisture.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}

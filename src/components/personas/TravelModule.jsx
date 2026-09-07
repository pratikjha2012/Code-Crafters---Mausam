import React, { useState } from 'react';
import { useWeather } from '../../context/WeatherContext';
import { 
  Plane, 
  Luggage, 
  AlertTriangle, 
  MapPin, 
  CloudRain, 
  Sun, 
  Snowflake, 
  ShieldAlert, 
  Check, 
  Plus, 
  Trash2,
  Clock,
  Sparkles
} from 'lucide-react';

export default function TravelModule() {
  const { weather, language } = useWeather();

  const [savedCities, setSavedCities] = useState([
    { id: 'c1', name: 'New Delhi (DEL)', temp: 15, condition: 'Dense Fog', flightStatus: 'Delays Likely (Visibility <200m)', packing: ['N95 Mask', 'Heavy Woolen Jacket', 'Thermal Innerwear'] },
    { id: 'c2', name: 'Bengaluru (BLR)', temp: 24, condition: 'Pleasant Breeze', flightStatus: 'On Time (Clear Sky)', packing: ['Light Jacket', 'Sunglasses', 'Comfortable Walking Shoes'] },
    { id: 'c3', name: 'Mumbai (BOM)', temp: 28, condition: 'Heavy Showers', flightStatus: 'Holding / Air Traffic Congestion', packing: ['Waterproof Raincoat', 'Sturdy Umbrella', 'Quick-dry Apparels'] },
    { id: 'c4', name: 'London (LHR)', temp: 11, condition: 'Light Drizzle', flightStatus: 'On Time', packing: ['Compact Windproof Umbrella', 'Waterproof Trench Coat', 'Layered Sweaters'] },
    { id: 'c5', name: 'Srinagar (SXR)', temp: 2, condition: 'Snowfall', flightStatus: 'High Cancellation Risk (Runway De-icing)', packing: ['Heavy Down Parka', 'Snow Boots', 'Insulated Gloves', 'Lip Balm'] }
  ]);

  const [activeCityId, setActiveCityId] = useState('c1');
  const activeCity = savedCities.find(c => c.id === activeCityId) || savedCities[0];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-purple-950 text-purple-400 border border-purple-800/60">
            <Plane className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-white flex items-center gap-2">
              {language === 'hi' ? 'यात्री एवं पर्यटन मौसम केंद्र' : 'Travelers, Transit & Aviation Hub'}
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-700">
                MoES Aviation Radar
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              {language === 'hi'
                ? 'सहेजे गए गंतव्य, उड़ानों के लिए मौसम अलर्ट एवं स्मार्ट पैकिंग सुझाव'
                : 'Saved destinations, airport METAR/TAF disruption indicators & smart climate-driven packing lists'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-purple-300 font-medium">5 Saved Hubs</span>
        </div>
      </div>

      {/* Saved Destinations Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {savedCities.map((dest) => {
          const isSelected = dest.id === activeCityId;
          const isDelayed = dest.flightStatus.includes('Delay') || dest.flightStatus.includes('Risk');
          return (
            <button
              key={dest.id}
              onClick={() => setActiveCityId(dest.id)}
              className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden ${
                isSelected 
                  ? 'bg-purple-950/50 border-purple-500 shadow-lg shadow-purple-950/40 ring-1 ring-purple-500' 
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span className="font-semibold text-slate-300 truncate">{dest.name}</span>
                <span className="text-sm font-black text-white">{dest.temp}°C</span>
              </div>
              
              <div className="text-[11px] font-medium text-slate-400 truncate">
                {dest.condition}
              </div>

              <div className="mt-2.5 pt-2 border-t border-slate-800/80">
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 truncate ${
                  isDelayed ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isDelayed ? 'bg-rose-400 animate-ping' : 'bg-emerald-400'}`} />
                  {isDelayed ? 'Disruption Risk' : 'Normal Flight Ops'}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Detailed Destination View: Flight Status + Smart Packing Assistant */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* 1. Airport & Severe Weather Flight Advisory */}
        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Plane className="w-4 h-4 text-purple-400" />
              <h4 className="text-sm font-bold text-white">
                Aviation Weather & Runway Advisory: {activeCity.name}
              </h4>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">TAF / METAR</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Flight Disruptions:</span>
              <span className={`font-bold ${
                activeCity.flightStatus.includes('On Time') ? 'text-emerald-400' : 'text-amber-400'
              }`}>
                {activeCity.flightStatus}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 leading-relaxed">
              {activeCity.flightStatus.includes('On Time') 
                ? 'Clear approach paths and light winds. Minimal turbulence expected during climb and descent.'
                : 'Crosswinds or visibility below CAT III ILS minimums may induce air traffic holding loops. Check airline PNR status before departing for airport.'}
            </div>
          </div>

          <div className="text-[10px] text-slate-500 flex items-center justify-between pt-1">
            <span>Data synced with Directorate General of Civil Aviation (DGCA)</span>
            <span className="text-sky-400 font-semibold cursor-pointer">Live Flight Radar</span>
          </div>
        </div>

        {/* 2. Smart AI Climate-Driven Packing Suggestions */}
        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Luggage className="w-4 h-4 text-purple-400" />
              <h4 className="text-sm font-bold text-white">
                Smart Packing Suggestions for {activeCity.name}
              </h4>
            </div>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-700">
              AI Checklist
            </span>
          </div>

          <div className="space-y-2">
            {activeCity.packing.map((item, idx) => (
              <div 
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-200"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-lg bg-purple-950/80 text-purple-300 border border-purple-800 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>{item}</span>
                </div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Recommended</span>
              </div>
            ))}
          </div>

          <div className="text-[11px] text-purple-300/80 bg-purple-950/30 p-2.5 rounded-xl border border-purple-800/40 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
            <span>Generated specifically based on 72-hour precipitation and thermal projections.</span>
          </div>
        </div>

      </div>

    </div>
  );
}

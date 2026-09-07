import React, { useState } from 'react';
import { useWeather } from '../../context/WeatherContext';
import { 
  CalendarDays, 
  PartyPopper, 
  CloudRain, 
  Wind, 
  Sun, 
  Sparkles, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  Tent,
  ThermometerSun
} from 'lucide-react';

export default function EventModule() {
  const { weather, language } = useWeather();
  const [eventType, setEventType] = useState('wedding');

  if (!weather) return null;
  const { current } = weather;

  // Compute Comfort Index (0-100)
  // Optimal temp: 22-26C, humidity: 45-60%, rain: 0%
  const calculateComfortIndex = () => {
    let index = 95;
    const tempDiff = Math.abs(current.temp - 24);
    index -= tempDiff * 2.5;

    if (current.humidity > 70) index -= (current.humidity - 70) * 0.8;
    if (current.humidity < 30) index -= (30 - current.humidity) * 0.5;

    index -= current.rainProb * 0.5;

    if (current.windSpeed > 30) index -= 15;

    return Math.max(15, Math.min(98, Math.round(index)));
  };

  const comfortScore = calculateComfortIndex();

  const getComfortDescription = (score) => {
    if (score >= 80) return { label: 'Optimal / Luxurious (अत्यंत आरामदायक)', color: 'text-emerald-400', bg: 'bg-emerald-950/40 border-emerald-700/60', text: 'Guests will feel thoroughly comfortable. Minimal misting or heating required.' };
    if (score >= 60) return { label: 'Pleasant (संतोषजनक)', color: 'text-cyan-400', bg: 'bg-cyan-950/40 border-cyan-700/60', text: 'Good outdoor ambiance. Fans or mild evening heaters recommended.' };
    if (score >= 40) return { label: 'Moderate Discomfort', color: 'text-amber-400', bg: 'bg-amber-950/40 border-amber-700/60', text: 'High humidity or chill. Enclosed banquet or heavy climate control advised.' };
    return { label: 'Challenging (प्रतिकूल)', color: 'text-rose-400', bg: 'bg-rose-950/40 border-rose-700/60', text: 'Severe heat, heavy rain or storm hazard. Strongly recommend indoor ballroom backup.' };
  };

  const comfort = getComfortDescription(comfortScore);

  // 7-day Wedding / Event Forecast Slots
  const days = ['Today', 'Tomorrow', 'Day 3', 'Day 4', 'Day 5', 'Weekend (Sat)', 'Weekend (Sun)'];
  const forecastSlots = days.map((day, i) => {
    const isToday = i === 0;
    const rain = isToday ? current.rainProb : Math.min(90, Math.max(5, Math.round((current.rainProb + i * 12) % 85)));
    const temp = isToday ? current.tempMax : Math.round(current.tempMax + (i % 2 === 0 ? 1 : -1));
    const isSafe = rain < 35;
    return {
      day,
      rain,
      temp,
      isSafe,
      verdict: isSafe ? 'Ideal for Lawn' : rain > 70 ? 'Indoor Mandatory' : 'Waterproof Canopy Needed'
    };
  });

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-violet-950 text-violet-400 border border-violet-800/60">
            <CalendarDays className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-white flex items-center gap-2">
              {language === 'hi' ? 'इवेंट प्लानर एवं विवाह मौसम केंद्र' : 'Event Planners, Outdoor Gatherings & Weddings'}
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-violet-950 text-violet-300 border border-violet-700">
                MoES Event Cast
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              {language === 'hi'
                ? 'विस्तारित 7-दिवसीय पूर्वानुमान, वर्षा की संभावना और आउटडोर समारोहों के लिए कम्फर्ट इंडेक्स'
                : 'Extended forecasts, hourly rain probability radar, tent wind limits & guest comfort index'}
            </p>
          </div>
        </div>

        {/* Comfort Badge */}
        <div className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-2 ${comfort.bg}`}>
          <PartyPopper className={`w-4 h-4 ${comfort.color}`} />
          <span className="text-slate-300">Guest Comfort:</span>
          <span className={`font-bold ${comfort.color}`}>{comfortScore}/100</span>
        </div>
      </div>

      {/* Main Event Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 1. Outdoor Comfort Index */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5"><ThermometerSun className="w-4 h-4 text-violet-400" /> Comfort Index</span>
            <span className="text-slate-500">Biometeorology</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-white">{comfortScore}</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${comfort.color}`}>
              {comfort.label.split(' ')[0]}
            </span>
          </div>
          <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
            {comfort.text}
          </div>
        </div>

        {/* 2. Rain Probability & Canopy Risk */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5"><CloudRain className="w-4 h-4 text-sky-400" /> Rain Probability</span>
            <span className="text-slate-500">Precipitation</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{current.rainProb}%</span>
            <span className="text-xs text-slate-400 font-semibold">Today's Risk</span>
          </div>
          <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
            {current.rainProb >= 50 
              ? '⚠️ High precipitation probability. Mandatory waterproof German hanger / covered marquee.' 
              : '✅ Low precipitation risk. Open lawn seating is favorable.'}
          </div>
        </div>

        {/* 3. Canopy & Shamiana Wind Gust Limits */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5"><Tent className="w-4 h-4 text-amber-400" /> Canopy Structural Safety</span>
            <span className="text-slate-500">Wind Load</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{current.windSpeed} km/h</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
              current.windSpeed > 35 ? 'bg-red-950 text-red-300 border border-red-700' : 'bg-emerald-950 text-emerald-300'
            }`}>
              {current.windSpeed > 35 ? 'Gust Alert' : 'Stable'}
            </span>
          </div>
          <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
            {current.windSpeed > 30 
              ? 'Strong winds may lift lightweight gazebos. Secure all truss anchors with counterweights.' 
              : 'Truss and floral installations safe under normal anchoring.'}
          </div>
        </div>

        {/* 4. Evening Golden Hour for Photography */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5"><Sun className="w-4 h-4 text-orange-400" /> Photo Golden Hour</span>
            <span className="text-slate-500">Photography</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-orange-300">05:15 - 06:15 PM</span>
          </div>
          <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
            Sunset at {current.sunset}. Warm diffused natural lighting ideal for bridal & couple portraits.
          </div>
        </div>

      </div>

      {/* 7-Day Event Outlook Slots */}
      <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-violet-400" />
            <h4 className="text-sm font-bold text-white">
              7-Day Extended Gathering Suitability (7-दिवसीय आयोजन कैलेंडर)
            </h4>
          </div>
          <span className="text-xs text-slate-400">
            Optimal Slot Finder
          </span>
        </div>

        {/* Forecast Days Horizontal Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {forecastSlots.map((slot, idx) => (
            <div 
              key={idx}
              className={`p-3 rounded-xl border text-center transition-all ${
                slot.isSafe 
                  ? 'bg-slate-900/90 border-slate-800 text-slate-200' 
                  : 'bg-rose-950/30 border-rose-800/50 text-rose-200'
              }`}
            >
              <div className="text-xs font-bold text-white">{slot.day}</div>
              <div className="text-sm font-black text-white mt-1">{slot.temp}°C</div>
              
              <div className="my-1.5 flex items-center justify-center gap-1 text-[11px]">
                <CloudRain className={`w-3.5 h-3.5 ${slot.rain > 50 ? 'text-blue-400' : 'text-slate-500'}`} />
                <span className={slot.rain > 50 ? 'text-blue-300 font-bold' : 'text-slate-400'}>{slot.rain}%</span>
              </div>

              <div className={`text-[9px] font-semibold px-1.5 py-0.5 rounded mt-1 line-clamp-1 ${
                slot.isSafe ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-rose-950 text-rose-300 border border-rose-800'
              }`}>
                {slot.verdict}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

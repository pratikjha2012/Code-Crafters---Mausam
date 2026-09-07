import React, { useMemo } from 'react';
import { useWeather } from '../context/WeatherContext';
import { useUser, INFORMATION_PRIORITIES } from '../context/UserContext';
import OverviewHero from '../components/OverviewHero';
import { getWeatherDescription } from '../services/weatherApi';
import { 
  Droplets, 
  Sun, 
  Wind, 
  Eye, 
  Activity, 
  Sunrise, 
  Sunset, 
  Clock, 
  AlertTriangle, 
  ShieldCheck, 
  Compass, 
  ChevronRight, 
  Sparkles,
  ArrowUp,
  ArrowDown,
  CalendarDays,
  Sprout,
  Car,
  Plane,
  Flame,
  Waves
} from 'lucide-react';

export default function HomePage({ onNavigate }) {
  const { weather, language } = useWeather();
  const { user } = useUser();

  if (!weather || !weather.current || !weather.aqi) return null;
  const { current, aqi, marine, alerts, rawHourly, rawDaily, cityName } = weather;

  // 1. Time-of-Day Context Detection
  const timeContext = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 21) return 'evening';
    return 'night';
  }, []);

  // 2. Real Live Weather Insights Generator (Zero Mock Data)
  const weatherInsights = useMemo(() => {
    const list = [];
    
    // Rain insight
    if (current.rainProb > 60) {
      list.push({
        id: 'rain-high',
        text: language === 'hi' ? 'आज वर्षा की प्रबल संभावना है, छाता साथ रखें।' : 'Rain is highly likely today; carry an umbrella or rain gear.',
        icon: '🌧️',
        highlight: true
      });
    } else if (current.rainProb > 25) {
      list.push({
        id: 'rain-mod',
        text: language === 'hi' ? 'कुछ क्षेत्रों में हल्की बौछारें पड़ सकती हैं।' : 'Scattered light showers possible in some sectors.',
        icon: '🌦️'
      });
    }

    // AQI insight
    if (aqi.usAqi > 200) {
      list.push({
        id: 'aqi-bad',
        text: language === 'hi' ? 'वायु गुणवत्ता गंभीर है। बाहर निकलते समय N95 मास्क अवश्य पहनें।' : 'Air quality is very unhealthy. N95 respirator advised outdoors.',
        icon: '😷',
        highlight: true
      });
    } else if (aqi.usAqi <= 50) {
      list.push({
        id: 'aqi-good',
        text: language === 'hi' ? 'हवा स्वच्छ एवं ताज़ा है। खुली हवा में व्यायाम के लिए अनुकूल।' : 'Air quality is clean and fresh. Ideal for outdoor activities.',
        icon: '🍃'
      });
    }

    // UV insight
    if (current.uvIndex >= 7 && (timeContext === 'morning' || timeContext === 'afternoon')) {
      list.push({
        id: 'uv-high',
        text: language === 'hi' ? 'दोपहर में यूवी इंडेक्स उच्च रहेगा। धूप का चश्मा व सनस्क्रीन लगाएं।' : 'Peak solar UV index reaches high levels this afternoon.',
        icon: '☀️'
      });
    }

    // Visibility / Fog insight
    if (current.visibility < 1500) {
      list.push({
        id: 'fog-dense',
        text: language === 'hi' ? 'कम दृश्यता के कारण सड़कों पर फॉग लाइट जलाकर चलें।' : 'Reduced road visibility; drive with low-beam fog headlights.',
        icon: '🌫️'
      });
    }

    // Wind insight
    if (current.windSpeed > 25) {
      list.push({
        id: 'wind-breezy',
        text: language === 'hi' ? `तेज़ हवाएं (${current.windSpeed} km/h) चलने की संभावना है।` : `Gusty winds up to ${current.windSpeed} km/h recorded.`,
        icon: '💨'
      });
    }

    if (list.length === 0) {
      list.push({
        id: 'clear',
        text: language === 'hi' ? 'मौसम शांत एवं सामान्य है। किसी विशेष सावधानी की आवश्यकता नहीं।' : 'Atmospheric metrics are calm and stable. Favorable day ahead.',
        icon: '🌤️'
      });
    }

    return list;
  }, [current, aqi, timeContext, language]);

  // 3. Hourly Forecast (next 12 hours for Home horizontal strip)
  const hourlyStrip = useMemo(() => {
    if (!rawHourly?.time) return [];
    const items = [];
    const count = Math.min(rawHourly.time.length, 12);
    for (let i = 0; i < count; i++) {
      const d = new Date(rawHourly.time[i]);
      const h = d.getHours();
      const code = rawHourly.weather_code ? rawHourly.weather_code[i] : 0;
      const desc = getWeatherDescription(code);
      items.push({
        time: i === 0 ? (language === 'hi' ? 'अभी' : 'Now') : `${h % 12 || 12} ${h >= 12 ? 'PM' : 'AM'}`,
        temp: Math.round(rawHourly.temperature_2m[i]),
        rainProb: rawHourly.precipitation_probability ? rawHourly.precipitation_probability[i] : (rawHourly.precipitation?.[i] > 0 ? 80 : 0),
        icon: desc.icon,
      });
    }
    return items;
  }, [rawHourly, language]);

  // 4. Dynamic Modular Reordering Engine
  // Determines which modules render and their order based on:
  // - Top Priority first
  // - User's selected information priorities
  // - Time-of-day contextual elevation
  const orderedModuleIds = useMemo(() => {
    const priorities = user.priorities || ['rain', 'temp', 'aqi', 'alerts', 'outdoor'];
    const top = user.topPriority || priorities[0];

    // Priority score calculation
    const scores = {};
    priorities.forEach((p, idx) => {
      scores[p] = 50 - idx * 2;
    });

    // Boost top priority
    if (top && scores[top] !== undefined) {
      scores[top] += 100;
    }

    // Contextual boost based on time of day
    if (timeContext === 'morning') {
      if (scores['visibility']) scores['visibility'] += 15;
      if (scores['travel']) scores['travel'] += 15;
      if (scores['outdoor']) scores['outdoor'] += 10;
    } else if (timeContext === 'afternoon') {
      if (scores['uv']) scores['uv'] += 20;
      if (scores['temp']) scores['temp'] += 15;
    } else if (timeContext === 'evening') {
      if (scores['outdoor']) scores['outdoor'] += 20;
      if (scores['sun']) scores['sun'] += 15;
      if (scores['rain']) scores['rain'] += 10;
    } else { // night
      if (scores['temp']) scores['temp'] += 15;
      if (scores['aqi']) scores['aqi'] += 10;
    }

    // Sort by score descending
    const sorted = Object.keys(scores).sort((a, b) => scores[b] - scores[a]);
    return sorted;
  }, [user.priorities, user.topPriority, timeContext]);

  // Render individual modular cards
  const renderModule = (id) => {
    switch (id) {
      case 'rain':
        return (
          <div key="rain" className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Droplets className="w-4 h-4 text-sky-500" />
                {language === 'hi' ? 'वर्षा की संभावना' : 'Precipitation Probability'}
              </span>
              <span className="font-extrabold text-sky-600 dark:text-sky-400 text-sm">
                {current.rainProb}%
              </span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-sky-400 to-blue-600 rounded-full transition-all duration-500" 
                style={{ width: `${current.rainProb}%` }} 
              />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {current.rainProb > 50 ? 'High probability of rain in your sector.' : 'Minimal chance of precipitation next 6 hours.'}
            </p>
          </div>
        );

      case 'temp':
        return (
          <div key="temp" className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Sun className="w-4 h-4 text-amber-500" />
                {language === 'hi' ? 'तापमान विस्तार' : 'Temperature Range'}
              </span>
              <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                {current.temp}°C
              </span>
            </div>
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-slate-600 dark:text-slate-400">
                Feels like: <strong className="text-slate-900 dark:text-white">{current.feelsLike}°C</strong>
              </span>
              <div className="flex items-center gap-2 font-semibold">
                <span className="text-rose-500 flex items-center"><ArrowUp className="w-3 h-3" /> {current.tempMax}°</span>
                <span className="text-blue-500 flex items-center"><ArrowDown className="w-3 h-3" /> {current.tempMin}°</span>
              </div>
            </div>
          </div>
        );

      case 'aqi':
        return (
          <div key="aqi" className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-emerald-500" />
                {language === 'hi' ? 'वायु गुणवत्ता (AQI)' : 'Air Quality Index'}
              </span>
              <span className={`font-black text-xs px-2 py-0.5 rounded-full ${
                aqi.usAqi > 150 ? 'bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400' : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
              }`}>
                {aqi.usAqi} • {aqi.category}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-1 text-[11px] text-slate-600 dark:text-slate-400">
              <div className="bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl text-center">
                <span className="block text-[10px]">PM2.5</span>
                <strong className="text-slate-900 dark:text-white">{aqi.pm25} µg/m³</strong>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl text-center">
                <span className="block text-[10px]">PM10</span>
                <strong className="text-slate-900 dark:text-white">{aqi.pm10} µg/m³</strong>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl text-center">
                <span className="block text-[10px]">Ozone</span>
                <strong className="text-slate-900 dark:text-white">{aqi.ozone} µg/m³</strong>
              </div>
            </div>
          </div>
        );

      case 'uv':
        return (
          <div key="uv" className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Sun className="w-4 h-4 text-amber-500" />
                {language === 'hi' ? 'यूवी इंडेक्स' : 'UV Index'}
              </span>
              <span className="font-extrabold text-amber-600 dark:text-amber-400 text-sm">
                {current.uvIndex} ({current.uvIndex >= 6 ? 'High' : 'Moderate'})
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              {current.uvIndex >= 6 
                ? 'High ultraviolet exposure. Sun protection (SPF 50+, hat) recommended between 11 AM – 3 PM.' 
                : 'Moderate solar index. Safe for normal outdoor exposure.'}
            </p>
          </div>
        );

      case 'wind':
        return (
          <div key="wind" className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Wind className="w-4 h-4 text-teal-500" />
                {language === 'hi' ? 'हवा की गति' : 'Wind & Gusts'}
              </span>
              <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                {current.windSpeed} km/h
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 pt-1">
              <span>Peak Gusts: <strong className="text-slate-900 dark:text-white">{current.windGusts || current.windSpeed} km/h</strong></span>
              <span>Direction: <strong className="text-slate-900 dark:text-white">{current.windDirection}°</strong></span>
            </div>
          </div>
        );

      case 'visibility':
        return (
          <div key="visibility" className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-indigo-500" />
                {language === 'hi' ? 'सड़क दृश्यता' : 'Road Visibility'}
              </span>
              <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                {current.visibility >= 1000 ? `${(current.visibility / 1000).toFixed(1)} km` : `${current.visibility} m`}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              {current.visibility < 1000 ? 'Dense fog alert. Reduce driving speed.' : 'Clear visual range across highway sectors.'}
            </p>
          </div>
        );

      case 'sun':
        return (
          <div key="sun" className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Sunrise className="w-4 h-4 text-amber-500" />
                {language === 'hi' ? 'सूर्य चक्र' : 'Astronomical Cycle'}
              </span>
            </div>
            <div className="flex items-center justify-around pt-1 text-xs">
              <div className="flex items-center gap-2">
                <Sunrise className="w-4 h-4 text-amber-500" />
                <div>
                  <span className="text-[10px] text-slate-500 block">Sunrise</span>
                  <strong className="text-slate-900 dark:text-white">{current.sunrise}</strong>
                </div>
              </div>
              <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800" />
              <div className="flex items-center gap-2">
                <Sunset className="w-4 h-4 text-indigo-500" />
                <div>
                  <span className="text-[10px] text-slate-500 block">Sunset</span>
                  <strong className="text-slate-900 dark:text-white">{current.sunset}</strong>
                </div>
              </div>
            </div>
          </div>
        );

      case 'outdoor':
        return (
          <div key="outdoor" className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-orange-500" />
                {language === 'hi' ? 'बाहरी गतिविधियां' : 'Outdoor Exercise Window'}
              </span>
              <span className="font-bold text-xs text-emerald-600 dark:text-emerald-400">
                {aqi.usAqi < 100 ? 'Favorable' : 'Moderate Caution'}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              {timeContext === 'morning' ? 'Best workout hours: 06:00 – 08:30 AM before peak solar heating.' : 'Late afternoon brings cooling thermal relief for running.'}
            </p>
          </div>
        );

      case 'travel':
        return (
          <div key="travel" className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Plane className="w-4 h-4 text-purple-500" />
                {language === 'hi' ? 'यात्रा व आवागमन' : 'Transit & Highways'}
              </span>
              <span className="font-bold text-xs text-sky-600 dark:text-sky-400">Normal</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Corridor visibility is normal ({current.visibility >= 1000 ? `${(current.visibility / 1000).toFixed(1)} km` : `${current.visibility} m`}); zero severe thunderstorm delay alerts.
            </p>
          </div>
        );

      case 'agri':
        return (
          <div key="agri" className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Sprout className="w-4 h-4 text-lime-600" />
                {language === 'hi' ? 'कृषि व मृदा' : 'Soil & Spray Conditions'}
              </span>
              <span className="font-bold text-xs text-lime-600 dark:text-lime-400">
                Moisture: {(current.soilMoisture * 100).toFixed(0)}%
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              {current.windSpeed < 15 && current.rainProb < 40 
                ? 'Optimal agrochemical spraying window active (calm winds, low rain chance).' 
                : 'Postpone chemical spray due to elevated winds / precipitation probability.'}
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-5 pb-20">
      
      {/* 1. SEVERE WEATHER ALERT OVERRIDE (Jumps to top if alert exists) */}
      {alerts && alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((al) => (
            <div
              key={al.id}
              onClick={() => onNavigate && onNavigate('alerts')}
              className={`p-4 rounded-3xl border shadow-md cursor-pointer transition flex items-start gap-3.5 ${
                al.type === 'critical'
                  ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-300 dark:border-rose-800 text-rose-950 dark:text-rose-100'
                  : 'bg-amber-50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-100'
              }`}
            >
              <div className="p-2 rounded-2xl bg-rose-500 text-white shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5 animate-pulse" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-xs sm:text-sm">{al.title}</h3>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-rose-200 dark:bg-rose-900 text-rose-800 dark:text-rose-200">
                    IMD Alert
                  </span>
                </div>
                <p className="text-xs mt-1 opacity-90 line-clamp-2 leading-relaxed">
                  {al.desc}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 self-center text-slate-400 shrink-0" />
            </div>
          ))}
        </div>
      )}

      {/* 2. CURRENT WEATHER HERO (with Dynamic Weather-Reactive Background) */}
      <OverviewHero />

      {/* 3. CONCISE WEATHER INSIGHTS (Generated from live telemetry) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-sky-500" />
            {language === 'hi' ? 'मौसम संज्ञान एवं सुझाव' : 'Live Atmospheric Insights'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {weatherInsights.map((ins) => (
            <div
              key={ins.id}
              className={`p-3.5 rounded-2xl border text-xs flex items-start gap-2.5 transition ${
                ins.highlight 
                  ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-200 shadow-sm' 
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 shadow-sm'
              }`}
            >
              <span className="text-base shrink-0">{ins.icon}</span>
              <p className="font-semibold leading-relaxed pt-0.5">{ins.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 4. SWIPEABLE 24-HOUR HOURLY FORECAST SECTION */}
      <div className="space-y-2.5 pt-1">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-sky-500" />
            <span>{language === 'hi' ? 'घंटेवार पूर्वानुमान' : 'Hourly Forecast (24h)'}</span>
          </h3>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('forecast')}
            className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-0.5"
          >
            <span>7-Day</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex gap-2.5 overflow-x-auto pb-2 pt-0.5 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
          {hourlyStrip.map((item, idx) => (
            <div
              key={idx}
              className={`shrink-0 w-20 p-3 rounded-2xl border text-center transition flex flex-col justify-between items-center ${
                idx === 0 
                  ? 'bg-sky-50 dark:bg-sky-950/60 border-sky-400 dark:border-sky-600 shadow-sm' 
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm'
              }`}
            >
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                {item.time}
              </span>
              <div className="my-1.5 text-xl">
                {item.icon === 'Sun' ? '☀️' : 
                 item.icon === 'CloudSun' ? '⛅' :
                 item.icon === 'Cloud' ? '☁️' :
                 item.icon === 'CloudRain' ? '🌧️' :
                 item.icon === 'CloudLightning' ? '⛈️' :
                 item.icon === 'CloudFog' ? '🌫️' :
                 item.icon === 'Snowflake' ? '❄️' : '⛅'}
              </div>
              <span className="text-sm font-black text-slate-900 dark:text-white">
                {item.temp}°
              </span>
              <div className="mt-1 flex items-center gap-0.5 text-[10px] text-sky-600 dark:text-sky-400 font-bold">
                <Droplets className="w-2.5 h-2.5" />
                <span>{item.rainProb}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. DYNAMIC PERSONALIZED MODULES (Invisible Personalization) */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {language === 'hi' ? 'आपकी प्राथमिक मौसम सूचना' : 'Information Priorities'}
          </h3>
          <span className="text-[10px] text-slate-500 font-medium">
            Dynamic Ordering
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {orderedModuleIds.map((id) => renderModule(id))}
        </div>
      </div>

    </div>
  );
}

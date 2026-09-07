import React from 'react';
import { useWeather } from '../context/WeatherContext';
import { getWeatherDescription } from '../services/weatherApi';
import { 
  CalendarDays, 
  Clock, 
  Droplets, 
  Sun, 
  Sunrise, 
  Sunset, 
  Wind, 
  Compass, 
  ArrowUp, 
  ArrowDown,
  Sparkles
} from 'lucide-react';

export default function ForecastPage() {
  const { weather, language } = useWeather();

  if (!weather || !weather.current) return null;
  const { current, rawHourly, rawDaily, cityName } = weather;

  // Process next 24 hours
  const hourlyData = [];
  if (rawHourly && rawHourly.time) {
    const nowHour = new Date().getHours();
    const count = Math.min(rawHourly.time.length, 24);
    for (let i = 0; i < count; i++) {
      const timeStr = rawHourly.time[i];
      const hourDate = new Date(timeStr);
      const h = hourDate.getHours();
      const code = rawHourly.weather_code ? rawHourly.weather_code[i] : 0;
      const desc = getWeatherDescription(code);
      hourlyData.push({
        time: i === 0 ? (language === 'hi' ? 'अभी' : 'Now') : `${h % 12 || 12} ${h >= 12 ? 'PM' : 'AM'}`,
        temp: Math.round(rawHourly.temperature_2m[i]),
        rainProb: rawHourly.precipitation_probability ? rawHourly.precipitation_probability[i] : (rawHourly.precipitation ? (rawHourly.precipitation[i] > 0 ? 75 : 0) : 0),
        windSpeed: rawHourly.wind_speed_10m ? Math.round(rawHourly.wind_speed_10m[i]) : current.windSpeed,
        icon: desc.icon,
        desc: language === 'hi' ? desc.hindi : desc.label,
      });
    }
  }

  // Process 7-day forecast
  const dailyData = [];
  if (rawDaily && rawDaily.time) {
    for (let i = 0; i < rawDaily.time.length; i++) {
      const date = new Date(rawDaily.time[i]);
      const isToday = i === 0;
      const dayName = isToday 
        ? (language === 'hi' ? 'आज' : 'Today')
        : date.toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-US', { weekday: 'short' });
      
      const code = rawDaily.weather_code ? rawDaily.weather_code[i] : 0;
      const desc = getWeatherDescription(code);
      dailyData.push({
        day: dayName,
        date: date.toLocaleDateString([], { month: 'short', day: 'numeric' }),
        maxTemp: Math.round(rawDaily.temperature_2m_max[i]),
        minTemp: Math.round(rawDaily.temperature_2m_min[i]),
        rainProb: rawDaily.precipitation_probability_max ? rawDaily.precipitation_probability_max[i] : 10,
        uvMax: rawDaily.uv_index_max ? rawDaily.uv_index_max[i] : 5,
        desc: language === 'hi' ? desc.hindi : desc.label,
        icon: desc.icon,
      });
    }
  }

  return (
    <div className="space-y-6 pb-20">
      
      {/* Header */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
              <CalendarDays className="w-4 h-4" />
              <span>NWP Multi-Model Meteogram</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">
              {cityName} {language === 'hi' ? 'पूर्वानुमान' : 'Forecast'}
            </h2>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
            {weather.lastUpdatedText}
          </span>
        </div>
      </div>

      {/* 24-Hour Swipeable Meteogram Bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-sky-500" />
            <span>{language === 'hi' ? 'अगले 24 घंटे का पूर्वानुमान' : 'Hourly Forecast (Next 24h)'}</span>
          </h3>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">Swipe horizontally ➔</span>
        </div>

        <div className="flex gap-2.5 overflow-x-auto pb-3 pt-1 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
          {hourlyData.map((h, idx) => (
            <div
              key={idx}
              className={`shrink-0 w-24 p-3 rounded-2xl border text-center transition flex flex-col justify-between items-center ${
                idx === 0 
                  ? 'bg-sky-50 dark:bg-sky-950/60 border-sky-400 dark:border-sky-600 shadow-sm' 
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
              }`}
            >
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {h.time}
              </span>
              
              <div className="my-2 text-2xl">
                {h.icon === 'Sun' ? '☀️' : 
                 h.icon === 'CloudSun' ? '⛅' :
                 h.icon === 'Cloud' ? '☁️' :
                 h.icon === 'CloudRain' ? '🌧️' :
                 h.icon === 'CloudLightning' ? '⛈️' :
                 h.icon === 'CloudFog' ? '🌫️' :
                 h.icon === 'Snowflake' ? '❄️' : '⛅'}
              </div>

              <span className="text-base font-black text-slate-900 dark:text-white">
                {h.temp}°
              </span>

              <div className="mt-1.5 flex items-center gap-1 text-[11px] text-sky-600 dark:text-sky-400 font-bold">
                <Droplets className="w-3 h-3" />
                <span>{h.rainProb}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7-Day Extended Outlook */}
      <div className="space-y-3">
        <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2 px-1">
          <CalendarDays className="w-4 h-4 text-indigo-500" />
          <span>{language === 'hi' ? '7-दिवसीय विस्तृत पूर्वानुमान' : '7-Day Extended Outlook'}</span>
        </h3>

        <div className="space-y-2">
          {dailyData.map((d, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-3"
            >
              {/* Day & Date */}
              <div className="w-24 shrink-0">
                <div className="font-bold text-sm text-slate-900 dark:text-white">{d.day}</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">{d.date}</div>
              </div>

              {/* Weather Icon & Rain */}
              <div className="flex items-center gap-2 w-28 shrink-0">
                <span className="text-xl">
                  {d.icon === 'Sun' ? '☀️' : 
                   d.icon === 'CloudSun' ? '⛅' :
                   d.icon === 'Cloud' ? '☁️' :
                   d.icon === 'CloudRain' ? '🌧️' :
                   d.icon === 'CloudLightning' ? '⛈️' :
                   d.icon === 'CloudFog' ? '🌫️' :
                   d.icon === 'Snowflake' ? '❄️' : '⛅'}
                </span>
                <span className="text-xs text-slate-700 dark:text-slate-300 truncate font-medium">
                  {d.desc}
                </span>
              </div>

              {/* Rain Probability Badge */}
              <div className="flex items-center gap-1 text-xs text-sky-600 dark:text-sky-400 font-bold shrink-0">
                <Droplets className="w-3.5 h-3.5" />
                <span>{d.rainProb}%</span>
              </div>

              {/* Temperature Bar */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-semibold text-blue-500 dark:text-blue-400 w-7 text-right">
                  {d.minTemp}°
                </span>
                <div className="w-16 h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden relative">
                  <div 
                    className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-blue-400 to-amber-500"
                    style={{
                      left: `${Math.max(0, (d.minTemp / 45) * 100)}%`,
                      right: `${Math.max(0, 100 - (d.maxTemp / 45) * 100)}%`,
                    }}
                  />
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-white w-7">
                  {d.maxTemp}°
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Astronomical & Day Cycles */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500">
            <Sunrise className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {language === 'hi' ? 'सूर्योदय' : 'Sunrise'}
            </span>
            <div className="text-base font-black text-slate-900 dark:text-white">
              {current.sunrise}
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-500">
            <Sunset className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {language === 'hi' ? 'सूर्यास्त' : 'Sunset'}
            </span>
            <div className="text-base font-black text-slate-900 dark:text-white">
              {current.sunset}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

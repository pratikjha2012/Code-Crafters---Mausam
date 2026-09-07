import React from 'react';
import { useWeather } from '../context/WeatherContext';
import { useTheme } from '../context/ThemeContext';
import WeatherBackground from './WeatherBackground';
import { 
  Sun, 
  SunDim, 
  CloudSun, 
  Cloud, 
  CloudFog, 
  CloudRain, 
  CloudRainWind, 
  CloudLightning, 
  Snowflake, 
  Wind, 
  Droplets, 
  Eye, 
  Compass, 
  ArrowUp, 
  ArrowDown, 
  Activity, 
  MapPin,
  Clock,
  Sparkles
} from 'lucide-react';

export default function OverviewHero() {
  const { weather, language } = useWeather();
  const { resolvedTheme } = useTheme();

  if (!weather || !weather.current || !weather.aqi) return null;

  const { current, aqi, marine, cityName, state, lastUpdatedText } = weather;

  // Weather Icon renderer
  const renderWeatherIcon = (iconName) => {
    const props = { className: 'w-16 h-16 sm:w-20 sm:h-20 drop-shadow-lg' };
    switch (iconName) {
      case 'Sun': return <Sun {...props} className="w-16 h-16 sm:w-20 sm:h-20 text-amber-400 fill-amber-400/20" />;
      case 'SunDim': return <SunDim {...props} className="w-16 h-16 sm:w-20 sm:h-20 text-amber-300" />;
      case 'CloudFog': return <CloudFog {...props} className="w-16 h-16 sm:w-20 sm:h-20 text-slate-300" />;
      case 'CloudRain': return <CloudRain {...props} className="w-16 h-16 sm:w-20 sm:h-20 text-sky-400" />;
      case 'CloudRainWind': return <CloudRainWind {...props} className="w-16 h-16 sm:w-20 sm:h-20 text-blue-500" />;
      case 'CloudLightning': return <CloudLightning {...props} className="w-16 h-16 sm:w-20 sm:h-20 text-purple-400" />;
      case 'Snowflake': return <Snowflake {...props} className="w-16 h-16 sm:w-20 sm:h-20 text-cyan-200" />;
      default: return <CloudSun {...props} className="w-16 h-16 sm:w-20 sm:h-20 text-sky-400" />;
    }
  };

  return (
    <WeatherBackground className="w-full shadow-xl border border-slate-200/40 dark:border-slate-800/80">
      <div className="p-6 sm:p-8 backdrop-blur-sm bg-white/20 dark:bg-slate-950/40 text-slate-900 dark:text-white rounded-3xl">
        
        {/* Top Header Row: Station & Real-Time Sync Indicator */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-sky-900 dark:text-sky-300 bg-white/60 dark:bg-slate-900/60 px-3 py-1 rounded-full backdrop-blur-md border border-white/40 dark:border-slate-800 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
            <span className="truncate">Live NWP Satellite Telemetry</span>
          </div>

          <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1 bg-white/50 dark:bg-slate-900/50 px-2.5 py-1 rounded-full backdrop-blur-md">
            <Clock className="w-3 h-3" />
            <span>{lastUpdatedText}</span>
          </div>
        </div>

        {/* Location Name & State */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight flex items-center gap-2">
            <MapPin className="w-6 h-6 text-sky-600 dark:text-sky-400 shrink-0" />
            <span>{cityName}</span>
            <span className="text-sm sm:text-base font-normal text-slate-600 dark:text-slate-400">
              ({state})
            </span>
          </h1>
          <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
            {weather.agroRegion}
          </p>
        </div>

        {/* Current Temperature & Primary Condition */}
        <div className="my-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-baseline gap-4">
            <div className="text-6xl sm:text-8xl font-black tracking-tighter">
              {current.temp}°
            </div>
            <div className="space-y-1">
              <div className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200">
                {language === 'hi' ? 'महसूस होता है: ' : 'Feels like: '}
                <span className="text-sky-700 dark:text-sky-300">{current.feelsLike}°</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                <span className="flex items-center text-rose-600 dark:text-rose-400"><ArrowUp className="w-3.5 h-3.5" /> {current.tempMax}°</span>
                <span className="flex items-center text-blue-600 dark:text-blue-400"><ArrowDown className="w-3.5 h-3.5" /> {current.tempMin}°</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white/40 dark:bg-slate-900/40 p-3.5 rounded-2xl backdrop-blur-md border border-white/30 dark:border-slate-800 shadow-sm">
            {renderWeatherIcon(current.icon)}
            <div>
              <div className="text-xl sm:text-2xl font-black tracking-tight leading-snug">
                {current.condition}
              </div>
              <div className="text-xs text-slate-700 dark:text-slate-300 font-medium mt-0.5">
                {language === 'hi' ? 'वर्षा की संभावना' : 'Rain Probability'}: <strong className="text-sky-700 dark:text-sky-300">{current.rainProb}%</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Atmospheric Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-slate-900/10 dark:border-white/10 text-xs">
          <div className="p-2.5 rounded-xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-md flex flex-col justify-center">
            <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Droplets className="w-3 h-3 text-sky-500" /> Humidity
            </span>
            <span className="text-sm font-extrabold mt-0.5">{current.humidity}%</span>
          </div>

          <div className="p-2.5 rounded-xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-md flex flex-col justify-center">
            <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Wind className="w-3 h-3 text-teal-500" /> Wind
            </span>
            <span className="text-sm font-extrabold mt-0.5">{current.windSpeed} km/h</span>
          </div>

          <div className="p-2.5 rounded-xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-md flex flex-col justify-center">
            <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Sun className="w-3 h-3 text-amber-500" /> UV Index
            </span>
            <span className="text-sm font-extrabold mt-0.5">{current.uvIndex} (Max)</span>
          </div>

          <div className="p-2.5 rounded-xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-md flex flex-col justify-center">
            <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Activity className="w-3 h-3 text-emerald-500" /> US AQI
            </span>
            <span className="text-sm font-extrabold mt-0.5">{aqi.usAqi} • {aqi.category}</span>
          </div>
        </div>

      </div>
    </WeatherBackground>
  );
}

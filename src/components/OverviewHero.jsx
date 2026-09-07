import React from 'react';
import { useWeather } from '../context/WeatherContext';
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
  CloudHail, 
  Wind, 
  Droplets, 
  Eye, 
  Compass, 
  AlertOctagon, 
  ArrowUp, 
  ArrowDown, 
  Activity, 
  Thermometer, 
  Waves,
  ShieldAlert
} from 'lucide-react';

export default function OverviewHero() {
  const { weather, language, dataMode } = useWeather();

  if (!weather) return null;

  const { current, aqi, marine, alerts, cityName, state } = weather;

  // Icon mapping
  const renderWeatherIcon = (iconName) => {
    const props = { className: 'w-20 h-20 text-sky-300 drop-shadow-[0_10px_20px_rgba(56,189,248,0.3)] animate-pulse-slow' };
    switch (iconName) {
      case 'Sun': return <Sun {...props} className="w-20 h-20 text-amber-400 drop-shadow-[0_10px_20px_rgba(251,191,36,0.4)]" />;
      case 'SunDim': return <SunDim {...props} className="w-20 h-20 text-amber-300" />;
      case 'CloudFog': return <CloudFog {...props} className="w-20 h-20 text-slate-300 drop-shadow-[0_10px_20px_rgba(148,163,184,0.3)]" />;
      case 'CloudRain': return <CloudRain {...props} className="w-20 h-20 text-blue-400 drop-shadow-[0_10px_20px_rgba(96,165,250,0.4)]" />;
      case 'CloudRainWind': return <CloudRainWind {...props} className="w-20 h-20 text-blue-500" />;
      case 'CloudLightning': return <CloudLightning {...props} className="w-20 h-20 text-purple-400 drop-shadow-[0_10px_20px_rgba(192,132,252,0.4)]" />;
      case 'Snowflake': return <Snowflake {...props} className="w-20 h-20 text-cyan-200" />;
      default: return <CloudSun {...props} />;
    }
  };

  // AQI color styling
  const getAqiBadge = (val) => {
    if (val <= 50) return { label: 'Good (अच्छा)', bg: 'bg-emerald-950/80 text-emerald-300 border-emerald-700' };
    if (val <= 100) return { label: 'Moderate (मध्यम)', bg: 'bg-yellow-950/80 text-yellow-300 border-yellow-700' };
    if (val <= 200) return { label: 'Poor (खराब)', bg: 'bg-orange-950/80 text-orange-300 border-orange-700' };
    if (val <= 300) return { label: 'Very Poor (बहुत खराब)', bg: 'bg-red-950/80 text-red-300 border-red-700' };
    return { label: 'Severe / Hazardous (गंभीर)', bg: 'bg-purple-950/90 text-purple-300 border-purple-600 animate-pulse' };
  };

  const aqiBadge = getAqiBadge(aqi.usAqi);

  return (
    <div className="w-full space-y-4">
      {/* Active Critical Alerts Ticker */}
      {alerts && alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((al) => (
            <div 
              key={al.id}
              className={`p-3.5 rounded-2xl border flex items-start gap-3 shadow-lg transition-all ${
                al.type === 'critical' 
                  ? 'bg-red-950/60 border-red-700/80 text-red-200 shadow-red-950/40' 
                  : 'bg-amber-950/50 border-amber-700/70 text-amber-200 shadow-amber-950/30'
              }`}
            >
              <div className="p-2 rounded-xl bg-red-900/50 text-red-300 mt-0.5 shrink-0">
                <AlertOctagon className="w-5 h-5 animate-pulse" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm tracking-wide">{al.title}</span>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-red-900/80 text-red-200 border border-red-600">
                    IMD Alert
                  </span>
                </div>
                <p className="text-xs text-red-200/90 mt-1 leading-relaxed">
                  {al.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Main Meteorological Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800/90 shadow-2xl p-6 lg:p-8">
        {/* Glow ambient backdrops */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Left: Location & Current Temp */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-sky-950 text-sky-300 border border-sky-800/60 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                📡 Live Station Telemetry
              </span>
              <span className="text-xs text-slate-400">
                IST: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            <div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white flex items-center gap-3">
                {cityName}
                <span className="text-lg font-normal text-slate-400">({state})</span>
              </h1>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className="text-xs text-slate-400 font-medium">{weather.agroRegion}</span>
                {current.coords && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-sky-400">
                    📍 {current.coords.lat.toFixed(4)}° N, {current.coords.lon.toFixed(4)}° E
                  </span>
                )}
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                  {current.precision || 'High-Precision'}
                </span>
              </div>
            </div>

            <div className="flex items-baseline gap-4">
              <div className="text-6xl sm:text-7xl font-black tracking-tighter text-white">
                {current.temp}°<span className="text-3xl text-slate-400 font-medium">C</span>
              </div>
              <div className="space-y-1">
                <div className="text-sm font-semibold text-slate-300">
                  {language === 'hi' ? 'महसूस होता है: ' : 'Feels like: '}
                  <span className="text-sky-400 font-bold">{current.feelsLike}°C</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="flex items-center text-rose-400"><ArrowUp className="w-3.5 h-3.5" /> {current.tempMax}°C</span>
                  <span className="flex items-center text-blue-400"><ArrowDown className="w-3.5 h-3.5" /> {current.tempMin}°C</span>
                </div>
              </div>
            </div>
          </div>

          {/* Center/Right: Visual Condition & Vital Stats */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 w-full md:w-auto justify-between">
            <div className="flex items-center gap-4">
              {renderWeatherIcon(current.icon)}
              <div>
                <div className="text-xl font-bold text-slate-100">{current.condition}</div>
                <div className="text-xs text-slate-400 mt-0.5">
                  {language === 'hi' ? 'वर्षा की संभावना' : 'Rain Probability'}: <span className="text-sky-400 font-semibold">{current.rainProb}%</span>
                </div>
                <div className="text-xs text-slate-400">
                  UV Index: <span className="text-amber-400 font-semibold">{current.uvIndex}</span>
                </div>
              </div>
            </div>

            {/* Quick Badges Stack */}
            <div className="grid grid-cols-2 gap-2.5 w-full sm:w-auto">
              {/* AQI Quick Pill */}
              <div className={`p-3 rounded-2xl border ${aqiBadge.bg} flex flex-col justify-center`}>
                <div className="flex items-center justify-between text-[11px] font-semibold">
                  <span className="flex items-center gap-1"><Activity className="w-3 h-3" /> AQI</span>
                  <span className="font-extrabold text-sm">{aqi.usAqi}</span>
                </div>
                <span className="text-[10px] font-medium mt-0.5 line-clamp-1">{aqiBadge.label}</span>
              </div>

              {/* Humidity & Pressure */}
              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-center">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300">
                  <span className="flex items-center gap-1"><Droplets className="w-3 h-3 text-sky-400" /> Humidity</span>
                  <span className="font-bold text-white">{current.humidity}%</span>
                </div>
                <span className="text-[10px] text-slate-400 mt-0.5">{current.pressure} hPa</span>
              </div>

              {/* Wind Vector */}
              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-center">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300">
                  <span className="flex items-center gap-1"><Wind className="w-3 h-3 text-teal-400" /> Wind</span>
                  <span className="font-bold text-white">{current.windSpeed} km/h</span>
                </div>
                <span className="text-[10px] text-slate-400 mt-0.5">Dir: {current.windDirection}°</span>
              </div>

              {/* Visibility / Coastal Flag */}
              {marine && marine.isCoastal ? (
                <div className="p-3 rounded-2xl bg-cyan-950/50 border border-cyan-800/80 flex flex-col justify-center">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-cyan-300">
                    <span className="flex items-center gap-1"><Waves className="w-3 h-3" /> Coastal Flag</span>
                    <span className={`font-bold px-1.5 py-0.2 rounded text-[10px] ${
                      marine.safetyFlag === 'Red' ? 'bg-red-600 text-white' : 
                      marine.safetyFlag === 'Yellow' ? 'bg-amber-500 text-slate-950' : 'bg-emerald-600 text-white'
                    }`}>
                      {marine.safetyFlag}
                    </span>
                  </div>
                  <span className="text-[10px] text-cyan-200 mt-0.5">Wave {marine.waveHeight}m</span>
                </div>
              ) : (
                <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-center">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300">
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3 text-indigo-400" /> Visibility</span>
                    <span className="font-bold text-white">{current.visibility >= 1000 ? `${(current.visibility/1000).toFixed(1)} km` : `${current.visibility} m`}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-0.5">
                    {current.visibility < 500 ? 'Dense Fog Warning' : 'Normal Road Range'}
                  </span>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Hyper-Local Nowcasting & Aerodynamics Bar */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
              <span className="text-slate-400 font-medium">15-Min Precision Nowcast:</span>
              <span className="font-bold text-slate-200">
                {current.rainProb > 50 ? 'Rain showers likely within 30-45 mins' : 'Zero precipitation next 60 minutes'}
              </span>
            </div>

            <div className="flex items-center gap-3 font-mono text-[11px] text-slate-400">
              <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                Peak Wind Gusts: <strong className="text-white">{current.windGusts || current.windSpeed} km/h</strong>
              </span>
              <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                Dew Point: <strong className="text-white">{current.dewPoint || current.temp - 3}°C</strong>
              </span>
            </div>
          </div>

          <span className="text-[11px] text-slate-500 flex items-center gap-1">
            <span>High-Resolution Multi-Model NWP</span>
          </span>
        </div>
      </div>
    </div>
  );
}

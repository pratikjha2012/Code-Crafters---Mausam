import React, { useMemo } from 'react';
import { useWeather } from '../context/WeatherContext';
import { useTheme } from '../context/ThemeContext';

export default function WeatherBackground({ children, className = '' }) {
  const { weather } = useWeather();
  const { resolvedTheme } = useTheme();

  const isDark = resolvedTheme === 'dark';

  // Determine condition category and time of day
  const { conditionType, isDay } = useMemo(() => {
    if (!weather?.current) {
      return { conditionType: 'clear', isDay: true };
    }

    const code = weather.current.weatherCode ?? 0;
    const now = new Date();
    const hours = now.getHours();
    // Day roughly 06:00 to 18:30
    const dayTime = hours >= 6 && hours < 19;

    let type = 'clear';
    if (code === 0) {
      type = 'clear';
    } else if (code === 1 || code === 2) {
      type = 'partly_cloudy';
    } else if (code === 3) {
      type = 'cloudy';
    } else if (code === 45 || code === 48) {
      type = 'fog';
    } else if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) {
      type = 'rain';
    } else if (code >= 71 && code <= 77 || code === 85 || code === 86) {
      type = 'snow';
    } else if (code >= 95) {
      type = 'thunderstorm';
    }

    return { conditionType: type, isDay: dayTime };
  }, [weather]);

  // Background visual themes matching current state
  const backgroundStyle = useMemo(() => {
    switch (conditionType) {
      case 'clear':
        if (isDay) {
          return isDark
            ? 'from-sky-950 via-slate-900 to-indigo-950'
            : 'from-sky-400 via-sky-200 to-blue-100 text-slate-900';
        } else {
          return isDark
            ? 'from-slate-950 via-indigo-950 to-slate-900'
            : 'from-slate-800 via-indigo-900 to-slate-900 text-slate-100';
        }
      case 'partly_cloudy':
        if (isDay) {
          return isDark
            ? 'from-slate-900 via-sky-950 to-slate-900'
            : 'from-sky-300 via-blue-100 to-slate-100 text-slate-900';
        } else {
          return isDark
            ? 'from-slate-950 via-slate-900 to-indigo-950'
            : 'from-slate-800 via-slate-900 to-blue-950 text-slate-100';
        }
      case 'cloudy':
        return isDark
          ? 'from-slate-900 via-slate-950 to-zinc-900'
          : 'from-slate-300 via-slate-200 to-zinc-200 text-slate-900';
      case 'rain':
        return isDark
          ? 'from-slate-950 via-blue-950 to-slate-900'
          : 'from-slate-500 via-blue-300 to-slate-300 text-slate-900';
      case 'thunderstorm':
        return isDark
          ? 'from-zinc-950 via-purple-950 to-slate-950'
          : 'from-slate-800 via-purple-900 to-slate-800 text-white';
      case 'fog':
        return isDark
          ? 'from-slate-900 via-zinc-900 to-slate-950'
          : 'from-slate-300 via-zinc-200 to-slate-200 text-slate-900';
      case 'snow':
        return isDark
          ? 'from-slate-900 via-cyan-950 to-slate-950'
          : 'from-cyan-100 via-blue-100 to-slate-100 text-slate-900';
      default:
        return isDark ? 'from-slate-950 to-slate-900' : 'from-sky-100 to-slate-100 text-slate-900';
    }
  }, [conditionType, isDay, isDark]);

  return (
    <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br transition-all duration-1000 ${backgroundStyle} ${className}`}>
      {/* Visual atmospheric effects layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" aria-hidden="true">
        
        {/* CLEAR / SUNNY (Day sun glow or Night moon glow) */}
        {conditionType === 'clear' && (
          <>
            {isDay ? (
              <div className="absolute -top-12 -right-12 w-64 h-64 sm:w-80 sm:h-80 bg-gradient-to-br from-amber-300/40 via-yellow-200/25 to-transparent rounded-full blur-3xl animate-sun-glow" />
            ) : (
              <div className="absolute -top-8 -right-8 w-48 h-48 bg-gradient-to-br from-indigo-300/20 via-sky-200/10 to-transparent rounded-full blur-2xl animate-pulse-slow" />
            )}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-400/10 rounded-full blur-3xl pointer-events-none" />
          </>
        )}

        {/* PARTLY CLOUDY */}
        {conditionType === 'partly_cloudy' && (
          <>
            {isDay && (
              <div className="absolute -top-10 -right-10 w-56 h-56 bg-amber-300/25 rounded-full blur-3xl animate-sun-glow" />
            )}
            <div className="absolute top-4 left-[-10%] w-[120%] h-24 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-full blur-2xl animate-cloud-drift" />
            <div className="absolute top-16 right-[-10%] w-[100%] h-28 bg-gradient-to-r from-transparent via-white/15 to-transparent rounded-full blur-2xl animate-cloud-drift" style={{ animationDelay: '-12s' }} />
          </>
        )}

        {/* CLOUDY / OVERCAST */}
        {conditionType === 'cloudy' && (
          <>
            <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-slate-600/20 via-slate-700/15 to-transparent blur-xl" />
            <div className="absolute top-8 left-[-15%] w-[130%] h-32 bg-gradient-to-r from-transparent via-slate-400/20 to-transparent blur-2xl animate-cloud-drift" />
          </>
        )}

        {/* RAIN */}
        {conditionType === 'rain' && (
          <>
            <div className="absolute top-0 left-0 right-0 h-32 bg-slate-900/40 blur-xl" />
            {/* Elegant rain streaks */}
            <div className="absolute inset-0 flex justify-around opacity-75">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="w-[1.5px] bg-gradient-to-b from-transparent via-sky-300/60 to-transparent rounded-full animate-rain-streak"
                  style={{
                    height: `${30 + (i % 4) * 15}px`,
                    animationDelay: `${(i * 0.12).toFixed(2)}s`,
                    animationDuration: `${0.9 + (i % 3) * 0.2}s`,
                    transform: 'rotate(-12deg)',
                  }}
                />
              ))}
            </div>
          </>
        )}

        {/* THUNDERSTORM */}
        {conditionType === 'thunderstorm' && (
          <>
            <div className="absolute inset-0 bg-indigo-950/40" />
            {/* Restrained occasional lightning pulse */}
            <div className="absolute inset-0 bg-white/20 animate-lightning pointer-events-none" />
            {/* Rain streaks */}
            <div className="absolute inset-0 flex justify-around opacity-60">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="w-[1.5px] bg-gradient-to-b from-transparent via-purple-300/60 to-transparent rounded-full animate-rain-streak"
                  style={{
                    height: '40px',
                    animationDelay: `${(i * 0.15).toFixed(2)}s`,
                    animationDuration: '0.8s',
                    transform: 'rotate(-15deg)',
                  }}
                />
              ))}
            </div>
          </>
        )}

        {/* FOG / MIST */}
        {conditionType === 'fog' && (
          <>
            <div className="absolute inset-0 bg-slate-500/15 backdrop-blur-[2px]" />
            <div className="absolute top-1/3 left-[-20%] w-[140%] h-36 bg-gradient-to-r from-transparent via-slate-300/20 to-transparent blur-3xl animate-fog-roll" />
          </>
        )}

        {/* SNOW */}
        {conditionType === 'snow' && (
          <div className="absolute inset-0 flex justify-around">
            {[...Array(14)].map((_, i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-white/70 blur-[0.5px] animate-snow-flake"
                style={{
                  animationDelay: `${(i * 0.4).toFixed(2)}s`,
                  animationDuration: `${4.5 + (i % 4)}s`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Children content layer */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

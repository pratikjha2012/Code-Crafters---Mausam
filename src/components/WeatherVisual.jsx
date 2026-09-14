import React, { useMemo, useState } from 'react';

/**
 * Maps WMO weather code to condition type and day/night variant.
 */
export function getConditionFromCode(code, isDay = true) {
  if (code === undefined || code === null) {
    return { type: isDay ? 'clear_day' : 'clear_night', isDay };
  }

  const c = Number(code);
  if (c === 0) {
    return { type: isDay ? 'clear_day' : 'clear_night', isDay };
  }
  if (c === 1 || c === 2) {
    return { type: isDay ? 'partly_cloudy_day' : 'partly_cloudy_night', isDay };
  }
  if (c === 3) {
    return { type: 'cloudy', isDay };
  }
  if (c === 45 || c === 48) {
    return { type: 'fog', isDay };
  }
  if ((c >= 51 && c <= 67) || (c >= 80 && c <= 82)) {
    return { type: 'rain', isDay };
  }
  if ((c >= 71 && c <= 77) || c === 85 || c === 86) {
    return { type: 'snow', isDay };
  }
  if (c >= 95) {
    return { type: 'thunderstorm', isDay };
  }

  return { type: isDay ? 'partly_cloudy_day' : 'partly_cloudy_night', isDay };
}

/**
 * WeatherVisual: High-Performance, Responsive SVG/CSS Animated Weather Art Engine
 * Modes:
 * - 'loading': 140px centerpiece with atmospheric back-glow and particle layers
 * - 'hero': 72px living animated badge for current temperature card
 * - 'compact': 36px icon for 24-hour hourly forecast meteogram
 */
export default function WeatherVisual({
  conditionType,
  weatherCode,
  isDay = true,
  mode = 'hero',
  className = ''
}) {
  // Resolve condition type
  const resolved = useMemo(() => {
    if (conditionType) {
      if (conditionType === 'clear') return isDay ? 'clear_day' : 'clear_night';
      if (conditionType === 'partly_cloudy') return isDay ? 'partly_cloudy_day' : 'partly_cloudy_night';
      return conditionType;
    }
    return getConditionFromCode(weatherCode, isDay).type;
  }, [conditionType, weatherCode, isDay]);

  // Dimension scaling by mode
  const dims = useMemo(() => {
    switch (mode) {
      case 'loading':
        return { size: 'w-28 h-28 sm:w-36 sm:h-36', svgSize: 140, glow: 'w-36 h-36' };
      case 'compact':
        return { size: 'w-9 h-9', svgSize: 36, glow: 'w-10 h-10' };
      case 'hero':
      default:
        return { size: 'w-16 h-16 sm:w-20 sm:h-20', svgSize: 80, glow: 'w-24 h-24' };
    }
  }, [mode]);

  // State to track if local GIF exists or fails to load
  const [gifFailed, setGifFailed] = useState(false);

  // Check if custom GIF applies
  const activeCustomGif = useMemo(() => {
    if (gifFailed) return null;
    if (resolved === 'clear_day') return '/gifs/clear-sky.gif';
    if (resolved === 'rain') return '/gifs/rain.gif';
    return null;
  }, [resolved, gifFailed]);

  return (
    <div className={`relative inline-flex items-center justify-center select-none ${dims.size} ${className}`}>
      {/* Background Atmosphere Glow for Loading / Hero */}
      {mode !== 'compact' && (
        <div
          className={`absolute rounded-full blur-2xl pointer-events-none transition-opacity duration-1000 ${dims.glow} ${
            resolved.includes('clear_day')
              ? 'bg-amber-400/35 dark:bg-amber-500/25'
              : resolved.includes('clear_night')
              ? 'bg-indigo-400/30 dark:bg-indigo-500/20'
              : resolved.includes('rain')
              ? 'bg-sky-400/30 dark:bg-sky-600/25'
              : resolved.includes('thunderstorm')
              ? 'bg-purple-500/35 dark:bg-purple-600/30'
              : resolved.includes('snow')
              ? 'bg-cyan-300/35 dark:bg-cyan-500/25'
              : 'bg-slate-300/30 dark:bg-slate-600/20'
          }`}
        />
      )}

      {/* Render Custom GIF if available and active */}
      {activeCustomGif && !gifFailed ? (
        <img
          src={activeCustomGif}
          alt={resolved}
          onError={() => setGifFailed(true)}
          className={`w-full h-full object-cover ${mode === 'loading' ? 'rounded-full' : 'rounded-2xl'} drop-shadow-lg`}
        />
      ) : (
        <>
          {/* 1. SUNNY / CLEAR DAY */}
      {resolved === 'clear_day' && (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md overflow-visible">
          <defs>
            <radialGradient id="sunCore" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFBEB" />
              <stop offset="45%" stopColor="#FBBF24" />
              <stop offset="90%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </radialGradient>
            <radialGradient id="sunCorona" cx="50%" cy="50%" r="50%">
              <stop offset="40%" stopColor="#F59E0B" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Corona pulse */}
          <circle cx="50" cy="50" r="38" fill="url(#sunCorona)" className="animate-sun-glow" />

          {/* Rotating Radiant Sun Rays */}
          <g className="animate-spin-slow origin-center">
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => (
              <line
                key={deg}
                x1="50"
                y1={i % 2 === 0 ? "14" : "18"}
                x2="50"
                y2="24"
                stroke="#FBBF24"
                strokeWidth={i % 2 === 0 ? "3.5" : "2.5"}
                strokeLinecap="round"
                transform={`rotate(${deg} 50 50)`}
                opacity={i % 2 === 0 ? "0.95" : "0.75"}
              />
            ))}
          </g>

          {/* Solid Glowing Core */}
          <circle cx="50" cy="50" r="21" fill="url(#sunCore)" className="drop-shadow-sm" />
          
          {/* Subtle Inner Highlight */}
          <ellipse cx="44" cy="44" rx="7" ry="5" fill="#FFFFFF" opacity="0.45" />
        </svg>
      )}

      {/* 2. CLEAR NIGHT / MOONLIT SKY */}
      {resolved === 'clear_night' && (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md overflow-visible">
          <defs>
            <linearGradient id="moonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F8FAFC" />
              <stop offset="60%" stopColor="#E2E8F0" />
              <stop offset="100%" stopColor="#94A3B8" />
            </linearGradient>
            <filter id="moonGlow">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#93C5FD" floodOpacity="0.5" />
            </filter>
          </defs>

          {/* Twinkling Stars */}
          <g>
            <circle cx="22" cy="24" r="1.8" fill="#F8FAFC" className="animate-twinkle-1" />
            <polygon points="76,20 78,24 82,26 78,28 76,32 74,28 70,26 74,24" fill="#BAE6FD" className="animate-twinkle-2" transform="scale(0.8) translate(15, -2)" />
            <circle cx="82" cy="58" r="1.6" fill="#E2E8F0" className="animate-twinkle-3" />
            <circle cx="28" cy="74" r="1.4" fill="#F8FAFC" className="animate-twinkle-2" />
            <circle cx="70" cy="78" r="1.2" fill="#BAE6FD" className="animate-twinkle-1" />
          </g>

          {/* Shooting Star Streak */}
          {mode !== 'compact' && (
            <line
              x1="18"
              y1="15"
              x2="35"
              y2="28"
              stroke="#BAE6FD"
              strokeWidth="1.5"
              strokeLinecap="round"
              className="animate-shooting-star"
            />
          )}

          {/* Glowing Crescent Moon */}
          <g filter="url(#moonGlow)" className="animate-cloud-bob">
            <path
              d="M56 22C41.64 22 30 33.64 30 48C30 62.36 41.64 74 56 74C61.42 74 66.45 72.34 70.62 69.52C59.28 67.58 50.6 57.77 50.6 45.89C50.6 34.92 58.12 25.68 68.32 23.05C64.45 22.37 60.34 22 56 22Z"
              fill="url(#moonGrad)"
            />
            {/* Crater details */}
            <circle cx="44" cy="46" r="3.2" fill="#94A3B8" opacity="0.3" />
            <circle cx="52" cy="60" r="2.2" fill="#94A3B8" opacity="0.25" />
            <circle cx="41" cy="56" r="1.8" fill="#94A3B8" opacity="0.25" />
          </g>
        </svg>
      )}

      {/* 3. PARTLY CLOUDY (DAY) */}
      {resolved === 'partly_cloudy_day' && (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md overflow-visible">
          <defs>
            <linearGradient id="cloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="85%" stopColor="#E2E8F0" />
              <stop offset="100%" stopColor="#CBD5E1" />
            </linearGradient>
            <radialGradient id="sunPart" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFBEB" />
              <stop offset="60%" stopColor="#FBBF24" />
              <stop offset="100%" stopColor="#F59E0B" />
            </radialGradient>
          </defs>

          {/* Peeking Sun */}
          <g transform="translate(18, 6)" className="animate-spin-slow origin-center">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
              <line
                key={deg}
                x1="45"
                y1="18"
                x2="45"
                y2="24"
                stroke="#FBBF24"
                strokeWidth="3"
                strokeLinecap="round"
                transform={`rotate(${deg} 45 35)`}
              />
            ))}
          </g>
          <circle cx="63" cy="41" r="15" fill="url(#sunPart)" className="animate-sun-glow" />

          {/* Foreground Drifting Cloud */}
          <g className="animate-cloud-bob">
            <path
              d="M32 72h42a15 15 0 0 0 4.5-29.3A19 19 0 0 0 42.5 35 15 15 0 0 0 24 50 13 13 0 0 0 32 72z"
              fill="url(#cloudGrad)"
              className="drop-shadow-sm"
            />
          </g>
        </svg>
      )}

      {/* 4. PARTLY CLOUDY (NIGHT) */}
      {resolved === 'partly_cloudy_night' && (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md overflow-visible">
          <defs>
            <linearGradient id="cloudNightGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#F1F5F9" />
              <stop offset="85%" stopColor="#CBD5E1" />
              <stop offset="100%" stopColor="#94A3B8" />
            </linearGradient>
            <linearGradient id="moonMini" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#E2E8F0" />
            </linearGradient>
          </defs>

          {/* Moon Peeking */}
          <g transform="translate(16, 4)">
            <path
              d="M50 24c-9.5 0-17.2 7.7-17.2 17.2 0 9.5 7.7 17.2 17.2 17.2 3.6 0 7-1.1 9.8-3-7.5-1.3-13.2-7.8-13.2-15.7 0-7.3 5-13.4 11.8-15.1-2.6-.4-5.3-.6-8.6-.6z"
              fill="url(#moonMini)"
            />
            <circle cx="20" cy="22" r="1.5" fill="#E2E8F0" className="animate-twinkle-1" />
          </g>

          {/* Cloud */}
          <g className="animate-cloud-bob">
            <path
              d="M30 72h42a15 15 0 0 0 4.5-29.3A19 19 0 0 0 40.5 35 15 15 0 0 0 22 50 13 13 0 0 0 30 72z"
              fill="url(#cloudNightGrad)"
              className="drop-shadow-sm"
            />
          </g>
        </svg>
      )}

      {/* 5. OVERCAST / CLOUDY */}
      {resolved === 'cloudy' && (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md overflow-visible">
          <defs>
            <linearGradient id="cloudBack" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#CBD5E1" />
              <stop offset="100%" stopColor="#94A3B8" />
            </linearGradient>
            <linearGradient id="cloudFront" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="90%" stopColor="#E2E8F0" />
              <stop offset="100%" stopColor="#CBD5E1" />
            </linearGradient>
          </defs>

          {/* Background Cloud */}
          <g className="animate-cloud-bob opacity-70" style={{ animationDelay: '-2s' }}>
            <path
              d="M42 58h36a13 13 0 0 0 3.8-25.4A16.5 16.5 0 0 0 51 26a13 13 0 0 0-16 13 11 11 0 0 0 7 19z"
              fill="url(#cloudBack)"
            />
          </g>

          {/* Foreground Cloud */}
          <g className="animate-cloud-bob">
            <path
              d="M24 72h46a15 15 0 0 0 4.5-29.3A19 19 0 0 0 35 36 15 15 0 0 0 16 51 13 13 0 0 0 24 72z"
              fill="url(#cloudFront)"
              className="drop-shadow-sm"
            />
          </g>
        </svg>
      )}

      {/* 6. RAIN & DRIZZLE */}
      {resolved === 'rain' && (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md overflow-visible">
          <defs>
            <linearGradient id="rainCloud" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#94A3B8" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>
            <linearGradient id="rainDropGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>
          </defs>

          {/* Cloud */}
          <g className="animate-cloud-bob">
            <path
              d="M24 56h48a14 14 0 0 0 4.2-27.3A18 18 0 0 0 35 24 14 14 0 0 0 16 38 12 12 0 0 0 24 56z"
              fill="url(#rainCloud)"
              className="drop-shadow-sm"
            />
          </g>

          {/* Animated Falling Raindrops */}
          <g>
            <line x1="30" y1="62" x2="26" y2="74" stroke="url(#rainDropGrad)" strokeWidth="2.8" strokeLinecap="round" className="animate-raindrop-1" />
            <line x1="44" y1="62" x2="40" y2="74" stroke="url(#rainDropGrad)" strokeWidth="2.8" strokeLinecap="round" className="animate-raindrop-2" />
            <line x1="58" y1="62" x2="54" y2="74" stroke="url(#rainDropGrad)" strokeWidth="2.8" strokeLinecap="round" className="animate-raindrop-3" />
            <line x1="72" y1="62" x2="68" y2="74" stroke="url(#rainDropGrad)" strokeWidth="2.8" strokeLinecap="round" className="animate-raindrop-4" />
          </g>

          {/* Ground Splash Ripples (for hero/loading mode) */}
          {mode !== 'compact' && (
            <g opacity="0.6">
              <ellipse cx="28" cy="84" rx="6" ry="1.8" fill="none" stroke="#38BDF8" strokeWidth="1" className="animate-rain-ripple" />
              <ellipse cx="56" cy="84" rx="6" ry="1.8" fill="none" stroke="#38BDF8" strokeWidth="1" className="animate-rain-ripple" style={{ animationDelay: '0.6s' }} />
            </g>
          )}
        </svg>
      )}

      {/* 7. THUNDERSTORM */}
      {resolved === 'thunderstorm' && (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md overflow-visible">
          <defs>
            <linearGradient id="stormCloud" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="70%" stopColor="#1E293B" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
            <linearGradient id="boltGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFBEB" />
              <stop offset="50%" stopColor="#FBBF24" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
          </defs>

          {/* Ominous Storm Cloud */}
          <g className="animate-cloud-bob">
            <path
              d="M22 54h50a14 14 0 0 0 4.2-27.3A18 18 0 0 0 33 22 14 14 0 0 0 14 36 12 12 0 0 0 22 54z"
              fill="url(#stormCloud)"
              className="drop-shadow-md"
            />
          </g>

          {/* Rain streaks */}
          <g opacity="0.75">
            <line x1="28" y1="58" x2="24" y2="70" stroke="#60A5FA" strokeWidth="2.5" strokeLinecap="round" className="animate-raindrop-1" />
            <line x1="68" y1="58" x2="64" y2="70" stroke="#60A5FA" strokeWidth="2.5" strokeLinecap="round" className="animate-raindrop-3" />
          </g>

          {/* Electric Lightning Bolt Strike */}
          <polygon
            points="50,48 40,66 49,66 42,88 62,60 52,60 59,48"
            fill="url(#boltGrad)"
            className="animate-electric-strike"
          />
        </svg>
      )}

      {/* 8. SNOW / SLEET */}
      {resolved === 'snow' && (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md overflow-visible">
          <defs>
            <linearGradient id="snowCloud" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#E0F2FE" />
              <stop offset="100%" stopColor="#BAE6FD" />
            </linearGradient>
          </defs>

          {/* Frosty Cloud */}
          <g className="animate-cloud-bob">
            <path
              d="M24 56h48a14 14 0 0 0 4.2-27.3A18 18 0 0 0 35 24 14 14 0 0 0 16 38 12 12 0 0 0 24 56z"
              fill="url(#snowCloud)"
              className="drop-shadow-sm"
            />
          </g>

          {/* Rotating Snowflakes */}
          <g fill="#E0F2FE" stroke="#38BDF8" strokeWidth="1">
            <g className="animate-snow-1" transform="translate(32, 60)">
              <circle cx="0" cy="0" r="3" fill="#BAE6FD" />
              <line x1="-5" y1="0" x2="5" y2="0" />
              <line x1="0" y1="-5" x2="0" y2="5" />
            </g>
            <g className="animate-snow-2" transform="translate(50, 64)">
              <circle cx="0" cy="0" r="3.5" fill="#BAE6FD" />
              <line x1="-5.5" y1="0" x2="5.5" y2="0" />
              <line x1="0" y1="-5.5" x2="0" y2="5.5" />
            </g>
            <g className="animate-snow-3" transform="translate(66, 60)">
              <circle cx="0" cy="0" r="3" fill="#BAE6FD" />
              <line x1="-5" y1="0" x2="5" y2="0" />
              <line x1="0" y1="-5" x2="0" y2="5" />
            </g>
          </g>
        </svg>
      )}

      {/* 9. FOG / MIST / HAZE */}
      {resolved === 'fog' && (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md overflow-visible">
          <defs>
            <linearGradient id="fogGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#CBD5E1" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#E2E8F0" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#CBD5E1" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="fogGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#94A3B8" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#CBD5E1" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#94A3B8" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* Drifting Fog Lines */}
          <g className="animate-fog-roll">
            <rect x="18" y="32" width="64" height="6" rx="3" fill="url(#fogGrad1)" />
            <rect x="10" y="44" width="76" height="7" rx="3.5" fill="url(#fogGrad2)" />
            <rect x="22" y="57" width="58" height="6" rx="3" fill="url(#fogGrad1)" />
            <rect x="14" y="69" width="70" height="7" rx="3.5" fill="url(#fogGrad2)" />
          </g>
        </svg>
      )}
    </>
  )}
</div>
  );
}

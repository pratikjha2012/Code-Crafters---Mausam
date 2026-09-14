import React, { useState, useEffect, useMemo } from 'react';
import WeatherVisual, { getConditionFromCode } from './WeatherVisual';
import { Satellite, Radio, ShieldCheck, Sparkles } from 'lucide-react';

const MET_INSIGHTS = [
  {
    en: "IMD Doppler Weather Radars scan cloud convection & storm velocity within 400 km in real-time.",
    hi: "आईएमडी डॉपलर मौसम रडार 400 किमी तक तूफानी बादलों और वायु गति की वास्तविक समय में निगरानी करते हैं।"
  },
  {
    en: "Established in 1875, the India Meteorological Department has served the nation for over 150 years.",
    hi: "1875 में स्थापित, भारत मौसम विज्ञान विभाग 150 वर्षों से निरंतर राष्ट्र की सेवा कर रहा है।"
  },
  {
    en: "High-resolution NWP numerical models evaluate temperature and humidity across 16 vertical atmospheric layers.",
    hi: "संख्यात्मक मौसम भविष्यवाणी (NWP) मॉडल वायुमंडल की 16 परतों में तापमान और आर्द्रता का सटीक विश्लेषण करते हैं।"
  },
  {
    en: "INSAT-3DR geostationary satellite transmits multi-spectral thermal infrared weather telemetry every 15 minutes.",
    hi: "इनसेट-3डीआर उपग्रह हर 15 मिनट में भारतीय उपमहाद्वीप का थर्मल इन्फ्रारेड मौसम डेटा रिले करता है।"
  },
  {
    en: "Mausam uses Open-Meteo high-resolution ECMWF ensemble modeling for authoritative temperature precision.",
    hi: "मौसम ऐप तापमान की सटीक गणना के लिए ओपन-मेटियो ईसीएमडब्ल्यूएफ (ECMWF) मॉडल का उपयोग करता है।"
  }
];

export default function WeatherLoadingScreen({
  cityName = 'Local Station',
  state = '',
  weatherCode,
  isDay,
  language = 'en',
  overlay = false
}) {
  const [insightIndex, setInsightIndex] = useState(0);
  const [telemetryStep, setTelemetryStep] = useState(1);

  // Determine day/night if not supplied
  const resolvedIsDay = useMemo(() => {
    if (isDay !== undefined && isDay !== null) return Boolean(isDay);
    const h = new Date().getHours();
    return h >= 6 && h < 19;
  }, [isDay]);

  // Determine weather condition
  const resolvedCondition = useMemo(() => {
    if (weatherCode !== undefined && weatherCode !== null) {
      return getConditionFromCode(weatherCode, resolvedIsDay).type;
    }
    // Check cached code from localStorage
    try {
      const cached = localStorage.getItem('mausam_last_weather_code');
      if (cached !== null) {
        return getConditionFromCode(Number(cached), resolvedIsDay).type;
      }
    } catch (e) {}

    // Default to day/night clear
    return resolvedIsDay ? 'clear_day' : 'clear_night';
  }, [weatherCode, resolvedIsDay]);

  // Rotate trivia insights every 3.5s
  useEffect(() => {
    const interval = setInterval(() => {
      setInsightIndex((prev) => (prev + 1) % MET_INSIGHTS.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  // Cycle telemetry connection steps
  useEffect(() => {
    const t1 = setTimeout(() => setTelemetryStep(2), 600);
    const t2 = setTimeout(() => setTelemetryStep(3), 1400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const insight = MET_INSIGHTS[insightIndex];

  return (
    <div
      className={`${
        overlay
          ? 'fixed inset-0 z-50 backdrop-blur-md bg-slate-900/60'
          : 'min-h-screen bg-gradient-to-b from-slate-50 via-sky-50/40 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950'
      } text-slate-900 dark:text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 select-none transition-colors overflow-hidden`}
    >
      {/* Background Doppler Radar Ring Sweep */}
      <div className="relative flex items-center justify-center mb-4">
        {/* Concentric Radar Rings */}
        <div className="absolute w-56 h-56 sm:w-64 sm:h-64 rounded-full border border-sky-400/20 dark:border-sky-500/20 animate-radar-ping-1 pointer-events-none" />
        <div className="absolute w-44 h-44 sm:w-52 sm:h-52 rounded-full border border-emerald-400/25 dark:border-emerald-500/20 animate-radar-ping-2 pointer-events-none" />
        <div className="absolute w-32 h-32 sm:w-40 sm:h-40 rounded-full border border-sky-500/30 dark:border-sky-400/25 animate-radar-ping-3 pointer-events-none" />

        {/* Rotating Radar Sweep Beam */}
        <div className="absolute w-52 h-52 sm:w-60 sm:h-60 rounded-full overflow-hidden pointer-events-none opacity-40 dark:opacity-50">
          <div
            className="w-full h-full animate-radar-sweep"
            style={{
              background: 'conic-gradient(from 0deg, transparent 0deg, transparent 270deg, rgba(16, 185, 129, 0.45) 360deg)'
            }}
          />
        </div>

        {/* Centerpiece Weather-Reactive Animated Visual */}
        <div className="relative z-10 p-3 sm:p-4 rounded-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/60 dark:border-slate-800 shadow-2xl flex items-center justify-center">
          <WeatherVisual
            conditionType={resolvedCondition}
            isDay={resolvedIsDay}
            mode="loading"
          />

          {/* Floating Miniature IMD Emblem Tag */}
          <div className="absolute -bottom-2 -right-1 bg-white dark:bg-slate-900 rounded-full p-1 border border-slate-200 dark:border-slate-700 shadow-md flex items-center gap-1">
            <img
              src="/imd-logo.png"
              alt="IMD"
              className="w-6 h-6 object-contain"
            />
          </div>
        </div>
      </div>

      {/* Synchronizing Station Headline */}
      <div className="text-center space-y-2 max-w-sm sm:max-w-md mt-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100/80 dark:bg-sky-950/70 text-sky-800 dark:text-sky-300 text-xs font-bold tracking-wide border border-sky-200/60 dark:border-sky-800 shadow-sm">
          <Radio className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 animate-pulse" />
          <span>{cityName}{state ? `, ${state}` : ''}</span>
        </div>

        <h2 className="text-lg sm:text-xl font-black tracking-tight text-slate-900 dark:text-white">
          {language === 'hi' ? 'मौसम पूर्वानुमान कैलिब्रेट हो रहा है...' : 'Calibrating Weather Telemetry...'}
        </h2>

        {/* Live Telemetry Progress Stepper */}
        <div className="flex items-center justify-center gap-3 pt-2 text-[11px] font-semibold text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${telemetryStep >= 1 ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`} />
            <span className={telemetryStep >= 1 ? 'text-slate-900 dark:text-white font-bold' : ''}>
              <Satellite className="w-3 h-3 inline mr-0.5" /> INSAT-3DR
            </span>
          </div>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${telemetryStep >= 2 ? 'bg-sky-500' : 'bg-slate-400'}`} />
            <span className={telemetryStep >= 2 ? 'text-slate-900 dark:text-white font-bold' : ''}>
              Open-Meteo NWP
            </span>
          </div>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${telemetryStep >= 3 ? 'bg-amber-500' : 'bg-slate-400'}`} />
            <span className={telemetryStep >= 3 ? 'text-slate-900 dark:text-white font-bold' : ''}>
              CAMS Pollen
            </span>
          </div>
        </div>
      </div>

      {/* Rotating Meteorological Facts & Insights Card */}
      <div className="mt-6 max-w-sm sm:max-w-md w-full">
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/60 dark:border-slate-800 shadow-sm transition-all duration-500">
          <div className="flex items-start gap-2.5">
            <div className="p-1.5 rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div className="space-y-1">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-sky-700 dark:text-sky-400">
                {language === 'hi' ? 'मौसम विज्ञान तथ्य' : 'Meteorological Insight'}
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed transition-opacity duration-300">
                {language === 'hi' ? insight.hi : insight.en}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Official Government Provenance Footer */}
      <div className="mt-6 text-[11px] text-slate-500 dark:text-slate-500 flex items-center gap-1.5 font-medium">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
        <span>Official India Meteorological Department (IMD) Standards</span>
      </div>
    </div>
  );
}

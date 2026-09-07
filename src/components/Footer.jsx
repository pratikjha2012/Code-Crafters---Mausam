import React from 'react';
import { useWeather } from '../context/WeatherContext';
import { PhoneCall, Shield, Globe, ExternalLink, Heart } from 'lucide-react';

export default function Footer() {
  const { language } = useWeather();

  return (
    <footer className="mt-12 border-t border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/95 backdrop-blur-md text-slate-600 dark:text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        
        {/* Top Helpline Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 text-slate-800 dark:text-slate-300 font-semibold">
            <PhoneCall className="w-4 h-4 text-emerald-500" />
            <span>National Emergency & Weather Helplines:</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
            <span className="bg-white dark:bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800">NDMA Disaster: <strong className="text-slate-900 dark:text-white">1070</strong></span>
            <span className="bg-white dark:bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800">National Emergency: <strong className="text-slate-900 dark:text-white">112</strong></span>
            <span className="bg-white dark:bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800">Kisan Call Centre: <strong className="text-slate-900 dark:text-white">1800-180-1551</strong></span>
          </div>
        </div>

        {/* Middle Disclaimer & MoES info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <img 
                src="/imd-logo.png" 
                alt="India Meteorological Department Emblem" 
                className="w-10 h-10 object-contain drop-shadow-sm" 
              />
              <div className="font-bold text-slate-900 dark:text-slate-200 text-sm">
                {language === 'hi' ? 'मौसम विज्ञान विभाग (IMD)' : 'India Meteorological Department (IMD)'}
              </div>
            </div>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-[11px]">
              Ministry of Earth Sciences, Government of India. Providing customized meteorological intelligence for public health, safety, agriculture, and smart automated decision systems.
            </p>
          </div>

          <div className="space-y-2">
            <div className="font-bold text-slate-200 text-sm">Data Telemetry & Sources</div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Combines high-resolution numerical weather prediction (NWP) models, INCOIS marine buoys, CPCB air quality stations, and Open-Meteo live satellite feeds with offline curated edge-case demo scenarios.
            </p>
          </div>

          <div className="space-y-2">
            <div className="font-bold text-slate-200 text-sm">Deployment & Architecture</div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Engineered with React 18, Vite, Tailwind CSS, and optimized for global edge hosting on Firebase.
            </p>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="border-t border-slate-800/80 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} Ministry of Earth Sciences (MoES) • Smart Automation Division. All Rights Reserved.
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Official Prototype for 'Mausam' Next-Gen Homepage</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

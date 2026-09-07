import React from 'react';
import { useWeather } from '../context/WeatherContext';
import { 
  AlertTriangle, 
  ShieldCheck, 
  Radio, 
  Info, 
  AlertOctagon, 
  CloudRain, 
  Eye, 
  Activity,
  ExternalLink
} from 'lucide-react';

export default function AlertsPage() {
  const { weather, language, selectedCity } = useWeather();

  if (!weather) return null;
  const { alerts, current, aqi } = weather;

  const hasAlerts = alerts && alerts.length > 0;

  return (
    <div className="space-y-5 pb-20">
      
      {/* IMD Official Advisory Banner */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">
            <Radio className="w-4 h-4 animate-pulse" />
            <span>Official IMD Meteorological Bulletin</span>
          </div>
          <span className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
            {selectedCity.name}
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
          {language === 'hi' ? 'मौसम चेतावनी एवं बुलेटिन' : 'Weather Warnings & Advisories'}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Real-time alerts derived strictly from live NWP telemetry and observation stations. Zero simulated notices.
        </p>
      </div>

      {/* Real Live Alerts List */}
      {hasAlerts ? (
        <div className="space-y-3">
          {alerts.map((al) => {
            const isCritical = al.type === 'critical';
            return (
              <div
                key={al.id}
                className={`p-5 rounded-3xl border shadow-sm transition-all ${
                  isCritical
                    ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-950 dark:text-rose-100'
                    : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-100'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className={`p-2.5 rounded-2xl shrink-0 ${
                    isCritical 
                      ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' 
                      : 'bg-amber-500 text-white shadow-lg shadow-amber-500/20'
                  }`}>
                    <AlertTriangle className="w-6 h-6 animate-pulse" />
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm sm:text-base font-black">
                        {al.title}
                      </h3>
                      <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        isCritical 
                          ? 'bg-rose-200 dark:bg-rose-900 text-rose-800 dark:text-rose-200' 
                          : 'bg-amber-200 dark:bg-amber-900 text-amber-800 dark:text-amber-200'
                      }`}>
                        {isCritical ? 'Red Alert' : 'Yellow Advisory'}
                      </span>
                    </div>

                    <p className="text-xs opacity-90 leading-relaxed pt-0.5">
                      {al.desc}
                    </p>

                    <div className="pt-3 flex items-center gap-2 text-[11px] font-semibold opacity-75">
                      <span>Authority: India Meteorological Department (IMD)</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Calm / All-Clear State */
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3 shadow-sm">
          <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {language === 'hi' ? 'कोई सक्रिय मौसम चेतावनी नहीं है' : 'No Active Weather Warnings'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
            Atmospheric parameters in <strong>{selectedCity.name}</strong> are currently within normal baseline thresholds. No severe weather hazards reported.
          </p>
          <div className="pt-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              IMD Status: GREEN (Clear)
            </span>
          </div>
        </div>
      )}

      {/* IMD 4-Color Warning Scale Guide */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          IMD Official Warning Color Code Matrix
        </h4>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200">
            <div className="font-extrabold flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              GREEN
            </div>
            <p className="text-[11px] opacity-80 mt-1">No advisory needed. Normal weather.</p>
          </div>

          <div className="p-3 rounded-2xl bg-yellow-50 dark:bg-yellow-950/40 border border-yellow-200 dark:border-yellow-800 text-yellow-900 dark:text-yellow-200">
            <div className="font-extrabold flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
              YELLOW
            </div>
            <p className="text-[11px] opacity-80 mt-1">Be Updated. Weather change expected.</p>
          </div>

          <div className="p-3 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 text-orange-900 dark:text-orange-200">
            <div className="font-extrabold flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
              ORANGE
            </div>
            <p className="text-[11px] opacity-80 mt-1">Be Prepared. Significant disruptions possible.</p>
          </div>

          <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-950 dark:text-rose-200">
            <div className="font-extrabold flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              RED
            </div>
            <p className="text-[11px] opacity-80 mt-1">Take Action. Severe hazardous weather.</p>
          </div>
        </div>
      </div>

    </div>
  );
}

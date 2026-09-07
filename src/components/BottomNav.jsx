import React from 'react';
import { useWeather } from '../context/WeatherContext';
import { 
  Home, 
  CalendarDays, 
  Map, 
  AlertTriangle, 
  MoreHorizontal 
} from 'lucide-react';

export default function BottomNav({ currentTab, onTabChange }) {
  const { weather, language } = useWeather();

  const activeAlertCount = weather?.alerts?.length || 0;

  const tabs = [
    {
      id: 'home',
      label: language === 'hi' ? 'होम' : 'Home',
      icon: Home,
    },
    {
      id: 'forecast',
      label: language === 'hi' ? 'पूर्वानुमान' : 'Forecast',
      icon: CalendarDays,
    },
    {
      id: 'map',
      label: language === 'hi' ? 'नक्शा' : 'Map',
      icon: Map,
    },
    {
      id: 'alerts',
      label: language === 'hi' ? 'अलर्ट' : 'Alerts',
      icon: AlertTriangle,
      badge: activeAlertCount > 0 ? activeAlertCount : null,
      badgeColor: 'bg-red-500 text-white',
    },
    {
      id: 'more',
      label: language === 'hi' ? 'सेटिंग्स' : 'More',
      icon: MoreHorizontal,
    },
  ];

  return (
    <nav 
      aria-label="Mobile Bottom Navigation" 
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800/90 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] transition-colors duration-300"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 8px)' }}
    >
      <div className="max-w-md mx-auto px-3 py-2 flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center justify-center min-w-[56px] py-1 px-2 rounded-2xl transition-all duration-200 ${
                isActive
                  ? 'text-sky-600 dark:text-sky-400 font-bold scale-105'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <div className="relative p-1">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
                {tab.badge && (
                  <span className={`absolute -top-1 -right-2 text-[10px] font-black px-1.5 py-0.2 rounded-full ring-2 ring-white dark:ring-slate-950 ${tab.badgeColor} animate-pulse`}>
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] tracking-tight mt-0.5">
                {tab.label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 dark:bg-sky-400 mt-0.5 shadow-sm" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

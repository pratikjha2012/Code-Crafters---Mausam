import React from 'react';
import { useWeather, PERSONAS } from '../context/WeatherContext';
import { useUser } from '../context/UserContext';
import OverviewHero from '../components/OverviewHero';
import WeatherMap from '../components/WeatherMap';
import { 
  Sparkles, 
  ArrowRight, 
  Heart, 
  Clock, 
  ShieldAlert, 
  Activity, 
  Flame, 
  Waves, 
  Sprout, 
  Car, 
  Plane, 
  ShieldCheck, 
  CalendarDays,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export default function HomePage({ onNavigate }) {
  const { weather, language } = useWeather();
  const { user, setIsProfileModalOpen } = useUser();

  if (!weather) return null;
  const { current, aqi } = weather;

  // Personalized Advisory computation based on user allergies and current weather
  const getPersonalizedInsights = () => {
    const alerts = [];
    if (user.allergies.includes('asthma') && aqi.usAqi > 150) {
      alerts.push({
        type: 'critical',
        icon: '🫁',
        title: 'Asthma Trigger Alert',
        text: `AQI is currently ${aqi.usAqi} (${aqi.category}). Avoid outdoor physical strain; carry prescribed bronchodilator/inhaler.`
      });
    }
    if (user.allergies.includes('pollen') && aqi.pollenGrass > 30) {
      alerts.push({
        type: 'warning',
        icon: '🌸',
        title: 'Elevated Pollen Concentration',
        text: `Grass pollen is high (${aqi.pollenGrass} grains/m³). Wear wraparound sunglasses and rinse face upon returning indoors.`
      });
    }
    if (user.allergies.includes('dust') && aqi.pm25 > 60) {
      alerts.push({
        type: 'warning',
        icon: '😷',
        title: 'High PM2.5 Fine Particulate Count',
        text: `PM2.5 is ${aqi.pm25} µg/m³. N95 respirators are strongly recommended on outdoor roads.`
      });
    }
    if (user.allergies.includes('uv_sensitive') && current.uvIndex >= 6) {
      alerts.push({
        type: 'info',
        icon: '☀️',
        title: 'UV Radiation Protection Advisory',
        text: `Solar UV Index is ${current.uvIndex}. Reapply SPF 50+ sunscreen and wear a wide-brim hat.`
      });
    }
    if (alerts.length === 0) {
      alerts.push({
        type: 'success',
        icon: '✅',
        title: 'All Conditions Clear for Your Profile',
        text: `Atmospheric metrics are currently favorable for your registered health criteria.`
      });
    }
    return alerts;
  };

  const personalAlerts = getPersonalizedInsights();

  // Gateway cards mapping
  const gateways = [
    { id: 'health', title: 'Health & Allergies', hindi: 'स्वास्थ्य एवं एलर्जी', icon: Activity, color: 'from-emerald-600 to-teal-700', desc: 'AQI gauge, pollen radar & asthma safety' },
    { id: 'fitness', title: 'Fitness & Running', hindi: 'फिटनेस एवं दौड़', icon: Flame, color: 'from-amber-500 to-orange-600', desc: 'Best running hours, hydration & heat stress' },
    { id: 'beach', title: 'Beach & Marine', hindi: 'तटीय व समुद्र', icon: Waves, color: 'from-cyan-500 to-blue-600', desc: 'Tide schedule, wave height & INCOIS flags' },
    { id: 'agri', title: 'Kisan Agromet', hindi: 'कृषि एवं किसान', icon: Sprout, color: 'from-lime-600 to-green-700', desc: 'Soil moisture, spray window & frost alerts' },
    { id: 'commute', title: 'Highway Commuter', hindi: 'ट्रैफिक व कोहरा', icon: Car, color: 'from-sky-600 to-slate-700', desc: 'Road visibility, fog lights & transit delays' },
    { id: 'travel', title: 'Travel & Aviation', hindi: 'यात्री व विमानन', icon: Plane, color: 'from-purple-500 to-indigo-700', desc: 'Multi-city weather & dynamic packing lists' },
    { id: 'family', title: 'Family & Schools', hindi: 'परिवार व बच्चे', icon: ShieldCheck, color: 'from-pink-500 to-rose-600', desc: 'School commute, sudden rain & play safety' },
    { id: 'events', title: 'Events & Weddings', hindi: 'आयोजन व विवाह', icon: CalendarDays, color: 'from-violet-600 to-purple-800', desc: 'Guest comfort index, canopy wind limits' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Personalized Citizen Briefing Card */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-sky-950/40 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-700 flex items-center justify-center text-white font-extrabold text-lg shadow-lg shadow-sky-500/20">
              {user.name.charAt(0).toUpperCase() || 'P'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-white">
                  {language === 'hi' ? `नमस्ते, ${user.name}` : `Welcome back, ${user.name}`}
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-950 text-sky-400 border border-sky-800 uppercase tracking-wider">
                  Personalized
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Targeting your primary interest: <strong className="text-sky-300 capitalize">{user.primaryInterest}</strong> • Commute: <strong className="text-slate-300">{user.commuteTime}</strong> • Workout: <strong className="text-slate-300">{user.workoutTime}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsProfileModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-sky-400 border border-slate-700 transition"
          >
            Edit Health & Sensitivities
          </button>
        </div>

        {/* Dynamic Proactive Allergy / Health Warnings based on user profile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {personalAlerts.map((al, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-2xl border flex items-start gap-3 text-xs ${
                al.type === 'critical' ? 'bg-rose-950/40 border-rose-700 text-rose-200' :
                al.type === 'warning' ? 'bg-amber-950/40 border-amber-700 text-amber-200' :
                al.type === 'info' ? 'bg-sky-950/40 border-sky-700 text-sky-200' :
                'bg-emerald-950/40 border-emerald-700 text-emerald-200'
              }`}
            >
              <span className="text-lg mt-0.5 shrink-0">{al.icon}</span>
              <div>
                <div className="font-bold text-xs">{al.title}</div>
                <p className="text-[11px] mt-0.5 opacity-90 leading-relaxed">{al.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Meteorological Card */}
      <OverviewHero />

      {/* Interactive Google Maps Station Radar */}
      <WeatherMap />

      {/* Dedicated Persona Portals Navigation Gateways */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between px-1">
          <div>
            <h3 className="text-lg font-black text-white">
              {language === 'hi' ? 'समर्पित मौसम हब' : 'Specialized Meteorological Hubs'}
            </h3>
            <p className="text-xs text-slate-400">
              Explore deeply tailored, interactive dedicated web pages for each activity
            </p>
          </div>
          <span className="text-xs text-sky-400 font-semibold hidden sm:inline">
            8 Dedicated Portals Available
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {gateways.map((g) => {
            const Icon = g.icon;
            const isFavorite = user.primaryInterest === g.id;
            return (
              <div
                key={g.id}
                onClick={() => onNavigate(g.id)}
                className="group relative p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-sky-500/60 shadow-xl transition-all duration-200 cursor-pointer flex flex-col justify-between hover:translate-y-[-2px]"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-3 rounded-2xl bg-gradient-to-br ${g.color} text-white shadow-md group-hover:scale-110 transition-transform`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    {isFavorite && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-950 text-sky-300 border border-sky-800">
                        Your Focus
                      </span>
                    )}
                  </div>

                  <h4 className="font-bold text-sm text-white group-hover:text-sky-300 transition-colors">
                    {language === 'hi' ? g.hindi : g.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {g.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-sky-400 transition-colors">
                  <span>Open Dedicated Hub</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

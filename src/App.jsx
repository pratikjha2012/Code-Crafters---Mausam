import React, { useState } from 'react';
import { WeatherProvider, useWeather } from './context/WeatherContext';
import Navbar from './components/Navbar';
import OverviewHero from './components/OverviewHero';
import PersonaSelector from './components/PersonaSelector';
import HealthModule from './components/personas/HealthModule';
import FitnessModule from './components/personas/FitnessModule';
import BeachModule from './components/personas/BeachModule';
import TravelModule from './components/personas/TravelModule';
import FamilyModule from './components/personas/FamilyModule';
import AgriModule from './components/personas/AgriModule';
import CommuteModule from './components/personas/CommuteModule';
import EventModule from './components/personas/EventModule';
import WeatherMap from './components/WeatherMap';
import Footer from './components/Footer';
import { Smartphone, Monitor, ChevronUp, Map, Eye, EyeOff } from 'lucide-react';

function DashboardContent() {
  const { activePersona, isMobilePreview, setIsMobilePreview } = useWeather();
  const [showMap, setShowMap] = useState(true);

  const renderPersonaModules = () => {
    if (activePersona === 'health') return <HealthModule />;
    if (activePersona === 'fitness') return <FitnessModule />;
    if (activePersona === 'beach') return <BeachModule />;
    if (activePersona === 'travel') return <TravelModule />;
    if (activePersona === 'family') return <FamilyModule />;
    if (activePersona === 'agri') return <AgriModule />;
    if (activePersona === 'commute') return <CommuteModule />;
    if (activePersona === 'events') return <EventModule />;

    // 'all' - Show all 8 persona modules in logical priority order
    return (
      <div className="space-y-8">
        <section id="mod-health" className="scroll-mt-24">
          <HealthModule />
        </section>
        <section id="mod-fitness" className="scroll-mt-24">
          <FitnessModule />
        </section>
        <section id="mod-commute" className="scroll-mt-24">
          <CommuteModule />
        </section>
        <section id="mod-family" className="scroll-mt-24">
          <FamilyModule />
        </section>
        <section id="mod-beach" className="scroll-mt-24">
          <BeachModule />
        </section>
        <section id="mod-agri" className="scroll-mt-24">
          <AgriModule />
        </section>
        <section id="mod-travel" className="scroll-mt-24">
          <TravelModule />
        </section>
        <section id="mod-events" className="scroll-mt-24">
          <EventModule />
        </section>
      </div>
    );
  };

  const coreContent = (
    <div className="space-y-6">
      <OverviewHero />

      {/* Map Toggle & Geospatial Station Radar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-2">
          <button
            onClick={() => setShowMap(!showMap)}
            className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 transition"
          >
            <Map className="w-3.5 h-3.5" />
            <span>{showMap ? 'Hide Station Radar Map' : 'Show Interactive Station Radar Map'}</span>
          </button>
          <span className="text-[11px] text-slate-500">Google Maps Satellite Telemetry</span>
        </div>

        {showMap && <WeatherMap />}
      </div>

      <PersonaSelector />
      {renderPersonaModules()}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {isMobilePreview ? (
          /* Realistic Smartphone App Bezel Preview */
          <div className="flex flex-col items-center justify-center my-4">
            <div className="flex items-center gap-3 mb-4 text-xs text-slate-400 bg-slate-900 px-4 py-2 rounded-full border border-slate-800">
              <Smartphone className="w-4 h-4 text-sky-400" />
              <span>Previewing as: <strong>'Mausam' Mobile Application (iOS / Android)</strong></span>
              <button 
                onClick={() => setIsMobilePreview(false)}
                className="text-sky-400 font-bold hover:underline ml-2"
              >
                Switch to Full Desktop
              </button>
            </div>

            {/* Phone Frame Device */}
            <div className="w-full max-w-[420px] bg-slate-900 border-[10px] border-slate-800 rounded-[50px] shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden ring-1 ring-slate-700">
              {/* Dynamic Island / Speaker Notch */}
              <div className="bg-slate-900 pt-3 pb-2 px-6 flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400">09:41</span>
                <div className="w-24 h-4 bg-black rounded-full mx-auto" />
                <div className="flex items-center gap-1 text-[11px] text-slate-400">
                  <span>5G</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Scrollable Mobile App Body */}
              <div className="max-h-[750px] overflow-y-auto p-4 space-y-6 scrollbar-none bg-slate-950">
                {coreContent}
              </div>

              {/* Bottom Home Bar */}
              <div className="bg-slate-900 py-3 flex justify-center">
                <div className="w-32 h-1 bg-slate-600 rounded-full" />
              </div>
            </div>
          </div>
        ) : (
          /* Expansive Responsive Dashboard View */
          coreContent
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <WeatherProvider>
      <DashboardContent />
    </WeatherProvider>
  );
}

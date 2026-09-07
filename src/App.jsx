import React, { useState } from 'react';
import { WeatherProvider, useWeather } from './context/WeatherContext';
import { UserProvider, useUser } from './context/UserContext';
import Navbar from './components/Navbar';
import OnboardingModal from './components/OnboardingModal';
import UserProfileModal from './components/UserProfileModal';
import WeatherChatbot from './components/WeatherChatbot';
import Footer from './components/Footer';

// Dedicated Page Views
import HomePage from './pages/HomePage';
import HealthPage from './pages/HealthPage';
import FitnessPage from './pages/FitnessPage';
import BeachPage from './pages/BeachPage';
import AgriPage from './pages/AgriPage';
import CommutePage from './pages/CommutePage';
import TravelPage from './pages/TravelPage';
import FamilyPage from './pages/FamilyPage';
import EventPage from './pages/EventPage';

import { Smartphone, Monitor } from 'lucide-react';

function DashboardApp() {
  const { isMobilePreview, setIsMobilePreview } = useWeather();
  const [currentPage, setCurrentPage] = useState('home');

  const navigateTo = (pageId) => {
    setCurrentPage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderActivePage = () => {
    switch (currentPage) {
      case 'health':
        return <HealthPage onBack={() => navigateTo('home')} />;
      case 'fitness':
        return <FitnessPage onBack={() => navigateTo('home')} />;
      case 'beach':
        return <BeachPage onBack={() => navigateTo('home')} />;
      case 'agri':
        return <AgriPage onBack={() => navigateTo('home')} />;
      case 'commute':
        return <CommutePage onBack={() => navigateTo('home')} />;
      case 'travel':
        return <TravelPage onBack={() => navigateTo('home')} />;
      case 'family':
        return <FamilyPage onBack={() => navigateTo('home')} />;
      case 'events':
        return <EventPage onBack={() => navigateTo('home')} />;
      case 'home':
      default:
        return <HomePage onNavigate={navigateTo} />;
    }
  };

  const pageContent = (
    <div className="w-full">
      {renderActivePage()}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar currentPage={currentPage} onNavigate={navigateTo} />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {isMobilePreview ? (
          /* Realistic Smartphone App Bezel Preview */
          <div className="flex flex-col items-center justify-center my-4">
            <div className="flex items-center gap-3 mb-4 text-xs text-slate-400 bg-slate-900 px-4 py-2 rounded-full border border-slate-800">
              <Smartphone className="w-4 h-4 text-sky-400" />
              <span>Previewing: <strong>'Mausam' Mobile App Viewport</strong></span>
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
                {pageContent}
              </div>

              {/* Bottom Home Bar */}
              <div className="bg-slate-900 py-3 flex justify-center">
                <div className="w-32 h-1 bg-slate-600 rounded-full" />
              </div>
            </div>
          </div>
        ) : (
          /* Expansive Responsive Desktop View */
          pageContent
        )}
      </main>

      {/* Floating Multilingual Weather Chatbot (Mausam AI Mitra) */}
      <WeatherChatbot />

      {/* Onboarding Wizard (For first-time personalization & allergies) */}
      <OnboardingModal />

      {/* Profile & Sensitivity Editor Modal */}
      <UserProfileModal />

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <UserProvider>
      <WeatherProvider>
        <DashboardApp />
      </WeatherProvider>
    </UserProvider>
  );
}

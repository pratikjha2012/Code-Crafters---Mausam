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

import { Smartphone, Monitor, Radio, RefreshCw, AlertTriangle } from 'lucide-react';

function DashboardApp() {
  const { isMobilePreview, setIsMobilePreview, weather, loading, error, refreshData, selectedCity } = useWeather();
  const [currentPage, setCurrentPage] = useState('home');

  const navigateTo = (pageId) => {
    setCurrentPage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Loading Screen: Connecting to Live Telemetry
  if (loading && !weather) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center space-y-5 p-6 select-none">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-sky-500/20 border-t-sky-400 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Radio className="w-6 h-6 text-sky-400 animate-pulse" />
          </div>
        </div>
        <div className="text-center space-y-2 max-w-sm">
          <h2 className="text-xl font-bold tracking-tight bg-gradient-to-r from-sky-400 via-white to-blue-200 bg-clip-text text-transparent">
            भारत मौसम विज्ञान विभाग • MAUSAM
          </h2>
          <p className="text-xs text-slate-400 flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Connecting to live NWP satellite station telemetry ({selectedCity?.name || 'Local'})...</span>
          </p>
        </div>
      </div>
    );
  }

  // Error Recovery Screen: If API fetch fails
  if (error && !weather) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center space-y-5 p-6">
        <div className="p-4 rounded-2xl bg-red-950/50 border border-red-800/60 text-red-300">
          <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-red-400" />
          <h3 className="font-bold text-center text-sm">Station Telemetry Sync Issue</h3>
          <p className="text-xs text-slate-400 text-center mt-1">{error}</p>
        </div>
        <button
          onClick={refreshData}
          className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs flex items-center gap-2 shadow-lg transition"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry Live Connection</span>
        </button>
      </div>
    );
  }

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

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Mausam ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center space-y-4">
          <div className="p-4 rounded-full bg-red-950/80 border border-red-700 text-red-400">
            <AlertTriangle className="w-10 h-10 animate-bounce" />
          </div>
          <h2 className="text-xl font-bold text-white">भारत मौसम विज्ञान विभाग • MAUSAM</h2>
          <p className="text-xs text-slate-400 max-w-md">
            The application encountered a display refresh requirement while connecting to live telemetry.
          </p>
          <button
            onClick={() => {
              try { localStorage.clear(); } catch (e) {}
              window.location.reload();
            }}
            className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs shadow-lg transition flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset Cache & Reload Live Telemetry</span>
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <UserProvider>
        <WeatherProvider>
          <DashboardApp />
        </WeatherProvider>
      </UserProvider>
    </ErrorBoundary>
  );
}

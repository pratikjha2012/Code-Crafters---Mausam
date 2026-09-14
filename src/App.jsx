import React, { useState } from 'react';
import { WeatherProvider, useWeather } from './context/WeatherContext';
import { UserProvider, useUser } from './context/UserContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import OnboardingModal from './components/OnboardingModal';
import UserProfileModal from './components/UserProfileModal';
import WeatherChatbot from './components/WeatherChatbot';
import Footer from './components/Footer';

// Page Views for Core Tabs
import HomePage from './pages/HomePage';
import ForecastPage from './pages/ForecastPage';
import SavedPage from './pages/SavedPage';
import ProfilePage from './pages/ProfilePage';
import AlertsPage from './pages/AlertsPage';
import MorePage from './pages/MorePage';
import WeatherMap from './components/WeatherMap';

// Dedicated Specialized Hubs (Progressive Disclosure)
import HealthPage from './pages/HealthPage';
import FitnessPage from './pages/FitnessPage';
import BeachPage from './pages/BeachPage';
import AgriPage from './pages/AgriPage';
import CommutePage from './pages/CommutePage';
import TravelPage from './pages/TravelPage';
import FamilyPage from './pages/FamilyPage';
import EventPage from './pages/EventPage';

import { 
  CloudSun, 
  RefreshCw, 
  AlertTriangle, 
  Smartphone, 
  Monitor,
  Cloud
} from 'lucide-react';

import WeatherLoadingScreen from './components/WeatherLoadingScreen';
import WeatherVisual from './components/WeatherVisual';

function DashboardApp() {
  const { weather, loading, error, refreshData, selectedCity, language } = useWeather();
  const [activeTab, setActiveTab] = useState('home');
  const [isPhoneFramePreview, setIsPhoneFramePreview] = useState(false);

  const navigateTo = (pageId) => {
    setActiveTab(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Dynamic Weather-Reactive Loading Experience
  if (loading && !weather) {
    return (
      <WeatherLoadingScreen
        cityName={selectedCity?.name}
        state={selectedCity?.state}
        weatherCode={weather?.current?.weatherCode}
        language={language}
      />
    );
  }

  // Error Recovery Screen: If live API fails
  if (error && !weather) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col items-center justify-center space-y-5 p-6">
        <div className="p-5 rounded-3xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 max-w-md text-center shadow-lg">
          <AlertTriangle className="w-10 h-10 mx-auto mb-2 text-red-500 animate-bounce" />
          <h3 className="font-bold text-sm">Station Telemetry Sync Issue</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{error}</p>
        </div>
        <button
          onClick={refreshData}
          className="px-5 py-2.5 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry Live Connection</span>
        </button>
      </div>
    );
  }

  // Render the current view according to active tab / hub
  const renderCurrentView = () => {
    switch (activeTab) {
      // 5 Core Wireframe Tabs
      case 'home':
        return <HomePage onNavigate={navigateTo} />;
      case 'forecast':
        return <ForecastPage />;
      case 'map':
        return (
          <div className="pb-20">
            <WeatherMap />
          </div>
        );
      case 'saved':
        return <SavedPage onNavigate={navigateTo} />;
      case 'profile':
        return <ProfilePage onNavigate={navigateTo} />;

      // Severe Alerts View
      case 'alerts':
        return <AlertsPage />;
      case 'more':
        return <MorePage onNavigate={navigateTo} />;

      // Specialized Persona Portals (Progressive Disclosure)
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

      default:
        return <HomePage onNavigate={navigateTo} />;
    }
  };

  const activeContent = renderCurrentView();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* Top Navbar: MAUSAM [Location ▾] 🔔 Profile ◉ */}
      <Navbar currentPage={activeTab} onNavigate={navigateTo} />

      {/* Station Switching / Telemetry Sync Banner */}
      {loading && weather && (
        <div className="sticky top-16 z-40 flex justify-center px-4 py-1.5 pointer-events-none">
          <div className="px-4 py-1.5 rounded-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-sky-400/50 shadow-xl flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-100">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
            <WeatherVisual mode="compact" conditionType="clear" className="w-4 h-4 inline-block shrink-0" />
            <span>{language === 'hi' ? `${selectedCity?.name || 'स्टेशन'} डेटा कैलिब्रेट हो रहा है...` : `Syncing ${selectedCity?.name || 'Station'} Telemetry...`}</span>
          </div>
        </div>
      )}

      {/* Main Content Area: Mobile-First Layout (Optimized for 360x800, 390x844, 412x915) */}
      <main className="flex-1 w-full max-w-md sm:max-w-2xl md:max-w-4xl lg:max-w-5xl mx-auto px-3.5 sm:px-6 py-4">
        
        {/* Desktop Phone Frame Toggle (for mobile evaluation) */}
        <div className="hidden lg:flex justify-end mb-3">
          <button
            type="button"
            onClick={() => setIsPhoneFramePreview(!isPhoneFramePreview)}
            className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition"
          >
            {isPhoneFramePreview ? (
              <>
                <Monitor className="w-3.5 h-3.5" />
                <span>Switch to Expanded Desktop View</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-sky-500" />
                <span>Simulate Smartphone Screen (390×844)</span>
              </>
            )}
          </button>
        </div>

        {isPhoneFramePreview ? (
          /* Phone Frame Device Container */
          <div className="flex justify-center my-2">
            <div className="w-[390px] bg-white dark:bg-slate-900 border-[10px] border-slate-300 dark:border-slate-800 rounded-[50px] shadow-2xl overflow-hidden ring-1 ring-slate-400/30 dark:ring-slate-700">
              {/* Dynamic Island Notch */}
              <div className="bg-slate-100 dark:bg-slate-900 pt-3 pb-2 px-6 flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">09:41</span>
                <div className="w-24 h-4 bg-slate-900 dark:black rounded-full" />
                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">5G 100%</span>
              </div>

              {/* Scrollable Screen Content */}
              <div className="max-h-[760px] overflow-y-auto p-4 scrollbar-none bg-slate-50 dark:bg-slate-950">
                {activeContent}
              </div>

              {/* Home indicator bar */}
              <div className="bg-slate-100 dark:bg-slate-900 py-2.5 flex justify-center">
                <div className="w-32 h-1 bg-slate-400 dark:bg-slate-600 rounded-full" />
              </div>
            </div>
          </div>
        ) : (
          /* Native Responsive Layout */
          activeContent
        )}

      </main>

      {/* Mobile-First 5-Tab Bottom Navigation: [Home] [Forecast] [Map] [Saved] [Profile] */}
      <BottomNav 
        currentTab={['home', 'forecast', 'map', 'saved', 'profile'].includes(activeTab) ? activeTab : 'home'} 
        onTabChange={navigateTo} 
      />

      {/* Floating AI Mausam Assistant (Voice-First) */}
      <WeatherChatbot />

      {/* First-Time Onboarding Modal ("Make Mausam yours") */}
      <OnboardingModal />

      {/* Profile Modal */}
      <UserProfileModal />

      {/* Footer */}
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
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col items-center justify-center p-6 text-center space-y-4">
          <div className="p-4 rounded-full bg-red-100 dark:bg-red-950/80 border border-red-300 dark:border-red-700 text-red-500">
            <AlertTriangle className="w-10 h-10 animate-bounce" />
          </div>
          <h2 className="text-xl font-bold">भारत मौसम विज्ञान विभाग • MAUSAM</h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md">
            The application encountered a display refresh requirement while connecting to live telemetry.
          </p>
          {this.state.error && (
            <div className="max-w-md p-3 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-left text-[11px] font-mono text-red-600 dark:text-red-400 break-all">
              {this.state.error.message || String(this.state.error)}
            </div>
          )}
          <button
            onClick={() => {
              try { localStorage.removeItem('mausam_last_weather_code'); } catch (e) {}
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
      <ThemeProvider>
        <UserProvider>
          <WeatherProvider>
            <DashboardApp />
          </WeatherProvider>
        </UserProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

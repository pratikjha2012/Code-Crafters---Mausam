import React, { useState } from 'react';

export default function WeatherLoadingScreen({
  cityName = '',
  overlay = false
}) {
  const [pulseCount, setPulseCount] = useState(0);
  const [isPressed, setIsPressed] = useState(false);

  const handleInteraction = () => {
    setPulseCount((prev) => prev + 1);
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 300);
  };

  return (
    <div
      onClick={handleInteraction}
      className={`${
        overlay
          ? 'fixed inset-0 z-50 backdrop-blur-xl bg-slate-950/75'
          : 'min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-[#071328] dark:from-slate-950 dark:via-[#071328] dark:to-slate-950'
      } text-white flex flex-col items-center justify-center p-6 select-none transition-colors duration-500 cursor-pointer overflow-hidden`}
    >
      {/* Subtle Ambient Radial Backlight */}
      <div className="absolute w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-sky-500/15 dark:bg-sky-400/10 blur-3xl pointer-events-none animate-pulse-slow" />

      {/* Main Centered Content */}
      <div className="relative z-10 flex flex-col items-center justify-center space-y-6">
        
        {/* Interactive Logo Container */}
        <div className="relative flex items-center justify-center group">
          
          {/* Ambient Breathing Halo */}
          <div
            className={`absolute w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-tr from-sky-500/20 via-blue-500/20 to-indigo-500/15 blur-xl transition-transform duration-500 pointer-events-none ${
              isPressed ? 'scale-125 opacity-90' : 'animate-pulse-slow'
            }`}
          />

          {/* Interactive Ripple on Tap */}
          {pulseCount > 0 && (
            <div
              key={pulseCount}
              className="absolute w-28 h-28 sm:w-32 sm:h-32 rounded-full border border-sky-400/60 pointer-events-none animate-rain-ripple"
            />
          )}

          {/* Centered App Logo */}
          <div
            className={`relative w-24 h-24 sm:w-28 sm:h-28 p-3.5 rounded-3xl bg-white/10 dark:bg-slate-900/60 backdrop-blur-2xl border border-white/20 dark:border-sky-500/30 shadow-2xl flex items-center justify-center transition-all duration-300 ${
              isPressed ? 'scale-90 shadow-sky-500/30' : 'hover:scale-105 shadow-xl'
            }`}
          >
            <img
              src="/imd-logo.png"
              alt="MAUSAM App Logo"
              className="w-full h-full object-contain drop-shadow-md transition-transform duration-300"
            />
          </div>
        </div>

        {/* Minimal Typography */}
        <div className="text-center space-y-2.5">
          <h1 className="text-2xl sm:text-3xl font-black tracking-[0.25em] uppercase bg-gradient-to-r from-sky-200 via-white to-sky-300 bg-clip-text text-transparent">
            MAUSAM
          </h1>

          {/* Clean Progress Line */}
          <div className="w-32 sm:w-40 h-1 bg-white/10 rounded-full mx-auto overflow-hidden relative">
            <div className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full animate-cloud-drift" />
          </div>

          {cityName && (
            <p className="text-[11px] font-medium text-sky-200/60 tracking-wider transition-opacity">
              {cityName}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

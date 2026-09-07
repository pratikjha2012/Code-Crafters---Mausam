import React, { useEffect, useRef, useState } from 'react';
import { useWeather } from '../context/WeatherContext';
import { INDIAN_CITIES } from '../services/weatherApi';
import { MapPin, Layers, Radio, Sparkles, Navigation2, Maximize2, Minimize2, CloudRain } from 'lucide-react';

const GOOGLE_MAPS_API_KEY = 'AIzaSyBmiRmzT33tYV3ktxqBhuT4c7veWHKjz6Q';

export default function WeatherMap() {
  const { selectedCity, setSelectedCity, language, dataMode } = useWeather();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mapLayer, setMapLayer] = useState('temperature'); // 'temperature' | 'radar' | 'aqi'
  const [isExpanded, setIsExpanded] = useState(false);

  // Load Google Maps Script
  useEffect(() => {
    if (window.google && window.google.maps) {
      setIsLoaded(true);
      return;
    }

    const scriptId = 'google-maps-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=geometry`;
      script.async = true;
      script.defer = true;
      script.onload = () => setIsLoaded(true);
      document.head.appendChild(script);
    } else {
      setIsLoaded(true);
    }
  }, []);

  // Initialize Map
  useEffect(() => {
    if (!isLoaded || !mapRef.current || mapInstanceRef.current) return;

    // Dark sleek map styling
    const darkMapStyle = [
      { elementType: 'geometry', stylers: [{ color: '#0f172a' }] },
      { elementType: 'labels.text.stroke', stylers: [{ color: '#0f172a' }] },
      { elementType: 'labels.text.fill', stylers: [{ color: '#94a3b8' }] },
      {
        featureType: 'administrative.locality',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#e2e8f0' }]
      },
      {
        featureType: 'poi',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{ color: '#1e293b' }]
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: '#030712' }]
      },
      {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#38bdf8' }]
      }
    ];

    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: selectedCity.lat || 22.5937, lng: selectedCity.lon || 78.9629 },
      zoom: 5,
      styles: darkMapStyle,
      disableDefaultUI: true,
      zoomControl: true,
      mapTypeControl: false,
    });

    mapInstanceRef.current = map;
  }, [isLoaded]);

  // Update Center when selectedCity changes
  useEffect(() => {
    if (mapInstanceRef.current && selectedCity) {
      mapInstanceRef.current.panTo({ lat: selectedCity.lat, lng: selectedCity.lon });
    }
  }, [selectedCity]);

  // Render City Weather Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !isLoaded) return;

    // Clear old markers
    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];

    INDIAN_CITIES.forEach((city) => {
      const isCurrent = city.name === selectedCity.name;

      const marker = new window.google.maps.Marker({
        position: { lat: city.lat, lng: city.lon },
        map: mapInstanceRef.current,
        title: `${city.name} (${city.state})`,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: isCurrent ? 9 : 6,
          fillColor: isCurrent ? '#38bdf8' : (city.isCoastal ? '#06b6d4' : '#64748b'),
          fillOpacity: 0.9,
          strokeColor: '#ffffff',
          strokeWeight: isCurrent ? 2.5 : 1.5,
        }
      });

      // Marker Click -> Select Station
      marker.addListener('click', () => {
        setSelectedCity(city);
      });

      markersRef.current.push(marker);
    });
  }, [isLoaded, selectedCity]);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
      {/* Map Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-sky-950 text-sky-400 border border-sky-800/80">
            <Radio className="w-4 h-4 animate-pulse text-sky-400" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              {language === 'hi' ? 'आईएमडी लाइव डॉपलर एवं स्टेशन रडार मैप' : 'IMD Doppler & Station Geospatial Map'}
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-sky-950 text-sky-300 border border-sky-700">
                Google Maps API
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Interactive satellite station mapping • Click any station node to switch telemetry
            </p>
          </div>
        </div>

        {/* Layer Selector & Expand */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setMapLayer('temperature')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                mapLayer === 'temperature' ? 'bg-sky-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Stations
            </button>
            <button
              onClick={() => setMapLayer('radar')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
                mapLayer === 'radar' ? 'bg-sky-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <CloudRain className="w-3 h-3" />
              <span>Precip Radar</span>
            </button>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition"
            title={isExpanded ? 'Collapse Map' : 'Expand Map'}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Map Canvas Container */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-inner">
        <div
          ref={mapRef}
          className={`w-full transition-all duration-300 ${isExpanded ? 'h-[520px]' : 'h-[320px]'}`}
        />

        {/* Loading overlay if maps API is initializing */}
        {!isLoaded && (
          <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center gap-2 text-slate-400 text-xs">
            <Radio className="w-6 h-6 text-sky-400 animate-spin-slow" />
            <span>Connecting Google Maps Doppler Telemetry...</span>
          </div>
        )}

        {/* Floating Station Overlay Card on Map */}
        <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-xs bg-slate-950/90 backdrop-blur-md p-3 rounded-2xl border border-slate-800 shadow-xl text-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-sky-400" />
              {selectedCity.name}
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800 font-semibold">
              Active Station
            </span>
          </div>
          <div className="text-[11px] text-slate-400 flex items-center justify-between">
            <span>Lat: {selectedCity.lat.toFixed(2)}°, Lon: {selectedCity.lon.toFixed(2)}°</span>
            <span className="text-slate-300 font-medium">{selectedCity.agroRegion}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

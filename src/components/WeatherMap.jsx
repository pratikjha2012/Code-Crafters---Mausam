import React, { useEffect, useRef, useState } from 'react';
import { useWeather } from '../context/WeatherContext';
import { INDIAN_CITIES } from '../services/weatherApi';
import { 
  MapPin, 
  Layers, 
  Radio, 
  Sparkles, 
  Navigation2, 
  Maximize2, 
  Minimize2, 
  CloudRain,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';

const GOOGLE_MAPS_API_KEY = 'AIzaSyBmiRmzT33tYV3ktxqBhuT4c7veWHKjz6Q';

export default function WeatherMap() {
  const { selectedCity, setSelectedCity, language } = useWeather();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const radarOverlayRef = useRef(null);

  const [isLoaded, setIsLoaded] = useState(false);
  const [mapLayer, setMapLayer] = useState('radar'); // default to 'radar'
  const [isExpanded, setIsExpanded] = useState(false);

  // RainViewer Live Radar State
  const [radarData, setRadarData] = useState(null);
  const [allFrames, setAllFrames] = useState([]);
  const [currentFrameIdx, setCurrentFrameIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [radarOpacity, setRadarOpacity] = useState(0.8);

  // Fetch RainViewer public weather radar frames
  useEffect(() => {
    async function loadRainViewerData() {
      try {
        const res = await fetch('https://api.rainviewer.com/public/weather-maps.json');
        if (res.ok) {
          const data = await res.json();
          setRadarData(data);
          const past = data.radar?.past || [];
          const nowcast = data.radar?.nowcast || [];
          const combined = [...past, ...nowcast];
          setAllFrames(combined);
          if (past.length > 0) {
            setCurrentFrameIdx(past.length - 1); // latest live past frame
          }
        }
      } catch (err) {
        console.warn('RainViewer radar fetch error:', err);
      }
    }
    loadRainViewerData();
  }, []);

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

  // Update Radar Overlay Layer when frame, opacity or layer changes
  useEffect(() => {
    if (!mapInstanceRef.current || !isLoaded || !window.google?.maps) return;

    if (mapLayer !== 'radar' || allFrames.length === 0 || !radarData?.host) {
      mapInstanceRef.current.overlayMapTypes.clear();
      radarOverlayRef.current = null;
      return;
    }

    const frame = allFrames[currentFrameIdx];
    if (!frame) return;

    const radarLayer = new window.google.maps.ImageMapType({
      getTileUrl: (coord, zoom) => {
        return `${radarData.host}${frame.path}/256/${zoom}/${coord.x}/${coord.y}/2/1_1.png`;
      },
      tileSize: new window.google.maps.Size(256, 256),
      opacity: radarOpacity,
      name: 'RainViewer'
    });

    mapInstanceRef.current.overlayMapTypes.setAt(0, radarLayer);
    radarOverlayRef.current = radarLayer;
  }, [mapLayer, currentFrameIdx, allFrames, radarData, radarOpacity, isLoaded]);

  // Radar Animation Loop
  useEffect(() => {
    if (!isPlaying || allFrames.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentFrameIdx((prev) => (prev + 1) % allFrames.length);
    }, 650);

    return () => clearInterval(interval);
  }, [isPlaying, allFrames]);

  // Format frame timestamp
  const formatFrameTime = (timestamp) => {
    if (!timestamp) return 'Live Telemetry';
    const d = new Date(timestamp * 1000);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Render Active Location Marker
  useEffect(() => {
    if (!mapInstanceRef.current || !isLoaded || !selectedCity) return;

    // Clear old markers
    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];

    const marker = new window.google.maps.Marker({
      position: { lat: selectedCity.lat, lng: selectedCity.lon },
      map: mapInstanceRef.current,
      title: `${selectedCity.name}${selectedCity.state ? ', ' + selectedCity.state : ''}`,
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 9,
        fillColor: '#38bdf8',
        fillOpacity: 0.95,
        strokeColor: '#ffffff',
        strokeWeight: 2.5,
      }
    });

    markersRef.current.push(marker);
  }, [isLoaded, selectedCity]);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
      {/* Map Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-sky-950 text-sky-400 border border-sky-800/80">
            <CloudRain className="w-4 h-4 text-sky-400" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">
              {language === 'hi' ? 'लाइव डॉपलर वेदर रडार' : 'Live Doppler Weather Radar'}
            </h3>
          </div>
        </div>

        {/* Live Indicator & Expand */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Doppler Stream</span>
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
          className={`w-full transition-all duration-300 ${isExpanded ? 'h-[520px]' : 'h-[340px]'}`}
        />

        {/* Loading overlay if maps API is initializing */}
        {!isLoaded && (
          <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center gap-2 text-slate-400 text-xs">
            <Radio className="w-6 h-6 text-sky-400 animate-spin-slow" />
            <span>Connecting Google Maps Doppler Telemetry...</span>
          </div>
        )}

        {/* Floating Station Overlay Card on Map */}
        <div className="absolute top-3 left-3 bg-slate-950/90 backdrop-blur-md px-3 py-2 rounded-2xl border border-slate-800 shadow-xl text-xs space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-sky-400" />
              {selectedCity.name}
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800 font-semibold">
              Active Station
            </span>
          </div>
        </div>

        {/* Floating Live Indicator Badge */}
        {mapLayer === 'radar' && (
          <div className="absolute top-3 right-3 bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-800 shadow-xl text-[11px] font-bold text-slate-200 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span>LIVE Doppler Radar</span>
          </div>
        )}
      </div>

      {/* RainViewer Live Radar Playback Controller (when radar layer is active) */}
      {mapLayer === 'radar' && allFrames.length > 0 && (
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Play/Pause & Reset */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold flex items-center gap-1.5 shadow transition"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>{isPlaying ? 'Pause' : 'Play Loop'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsPlaying(false);
                  const pastLen = radarData?.radar?.past?.length || 0;
                  if (pastLen > 0) setCurrentFrameIdx(pastLen - 1);
                }}
                className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition flex items-center gap-1"
                title="Jump to latest frame"
              >
                <RotateCcw className="w-3 h-3" />
                <span className="text-[11px]">Latest</span>
              </button>
            </div>

            {/* Active Time Badge */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-[11px]">Radar Timestamp:</span>
              <span className="px-2.5 py-1 rounded-lg bg-sky-950/80 text-sky-300 font-mono font-bold text-xs border border-sky-800">
                {formatFrameTime(allFrames[currentFrameIdx]?.time)}
              </span>
            </div>

            {/* Opacity Control */}
            <div className="flex items-center gap-2 text-slate-400 text-[11px]">
              <span>Opacity:</span>
              <input
                type="range"
                min="0.2"
                max="1"
                step="0.05"
                value={radarOpacity}
                onChange={(e) => setRadarOpacity(parseFloat(e.target.value))}
                className="w-16 accent-sky-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Timeline Scrubber */}
          <div className="space-y-1">
            <input
              type="range"
              min="0"
              max={allFrames.length - 1}
              value={currentFrameIdx}
              onChange={(e) => {
                setIsPlaying(false);
                setCurrentFrameIdx(parseInt(e.target.value, 10));
              }}
              className="w-full accent-sky-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>{formatFrameTime(allFrames[0]?.time)}</span>
              <span className="text-emerald-400 font-bold">LIVE RADAR</span>
              <span>{formatFrameTime(allFrames[allFrames.length - 1]?.time)}</span>
            </div>
          </div>

          {/* Radar Intensity Legend */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-900 text-[10px] text-slate-400">
            <span className="font-semibold uppercase tracking-wider">Precipitation Rate:</span>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                <span>Light</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span>Moderate</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <span>Heavy</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span>Violent / Storm</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                <span>Hail</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

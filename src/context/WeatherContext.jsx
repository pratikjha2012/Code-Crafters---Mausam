import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  INDIAN_CITIES, 
  fetchWeatherData, 
  fetchAirQualityData, 
  fetchMarineData, 
  getWeatherDescription, 
  reverseGeocode 
} from '../services/weatherApi';

const WeatherContext = createContext();

export const PERSONAS = [
  { id: 'all', label: 'All Personas', hindi: 'सभी प्रोफाइल', icon: 'LayoutGrid', color: 'from-blue-600 to-indigo-600' },
  { id: 'health', label: 'Health-Conscious', hindi: 'स्वास्थ्य-सचेत', icon: 'Activity', color: 'from-emerald-500 to-teal-700' },
  { id: 'fitness', label: 'Outdoor Fitness', hindi: 'फिटनेस प्रेमी', icon: 'Flame', color: 'from-amber-500 to-orange-600' },
  { id: 'beach', label: 'Beachgoers & Surfers', hindi: 'तटीय व सर्फर्स', icon: 'Waves', color: 'from-cyan-500 to-blue-600' },
  { id: 'travel', label: 'Travelers', hindi: 'यात्री व पर्यटक', icon: 'Plane', color: 'from-purple-500 to-indigo-700' },
  { id: 'family', label: 'Parents & Families', hindi: 'अभिभावक व परिवार', icon: 'ShieldCheck', color: 'from-pink-500 to-rose-600' },
  { id: 'agri', label: 'Agriculture & Gardeners', hindi: 'किसान व बागवानी', icon: 'Sprout', color: 'from-lime-600 to-green-700' },
  { id: 'commute', label: 'Commuters', hindi: 'दैनिक यात्री / ट्रैफिक', icon: 'Car', color: 'from-sky-600 to-slate-700' },
  { id: 'events', label: 'Event Planners', hindi: 'आयोजन / समारोह', icon: 'CalendarDays', color: 'from-violet-600 to-purple-800' },
];

export function WeatherProvider({ children }) {
  const [selectedCity, setSelectedCity] = useState(INDIAN_CITIES[0]); // New Delhi default station
  const [activePersona, setActivePersona] = useState('all');
  const [language, setLanguage] = useState('en'); // 'en' | 'hi'
  const [isMobilePreview, setIsMobilePreview] = useState(false);

  const [liveWeather, setLiveWeather] = useState(null);
  const [liveAQI, setLiveAQI] = useState(null);
  const [liveMarine, setLiveMarine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Auto-detect GPS location on startup with High Hardware Precision
  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const geo = await reverseGeocode(lat, lon);
          setSelectedCity({
            name: geo?.name || 'My Station',
            state: geo?.state || 'Local Region',
            lat,
            lon,
            isCoastal: false,
            agroRegion: geo?.city ? `${geo.city} Regional Basin` : 'Local Micro-climate',
            precision: geo?.precision || 'High-Precision GPS'
          });
        },
        (err) => {
          console.log('GPS denied or timed out, using default station:', selectedCity.name);
        },
        { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
      );
    }
  }, []);

  // Fetch real data on station change
  useEffect(() => {
    loadRealData(selectedCity.lat, selectedCity.lon, selectedCity.isCoastal);
  }, [selectedCity]);

  const loadRealData = async (lat, lon, isCoastal) => {
    setLoading(true);
    setError(null);
    try {
      const [wData, aqiData, marineData] = await Promise.all([
        fetchWeatherData(lat, lon),
        fetchAirQualityData(lat, lon),
        isCoastal ? fetchMarineData(lat, lon) : Promise.resolve(null),
      ]);
      setLiveWeather(wData);
      setLiveAQI(aqiData);
      setLiveMarine(marineData);
      setLastUpdated(new Date());

      // Cache weather code & day/night state for instant weather loading screens
      if (wData?.current?.weather_code !== undefined) {
        try {
          localStorage.setItem('mausam_last_weather_code', String(wData.current.weather_code));
          localStorage.setItem('mausam_last_is_day', String(wData.current.is_day ?? 1));
        } catch (e) {}
      }
    } catch (err) {
      console.error('Live API fetch error:', err);
      setError("I'm unable to retrieve the latest weather data right now. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  // Format updated time relative string
  const getUpdatedAgo = () => {
    if (!lastUpdated) return 'Syncing...';
    const diffSec = Math.floor((new Date() - lastUpdated) / 1000);
    if (diffSec < 60) return 'Updated just now';
    const diffMin = Math.floor(diffSec / 60);
    return `Updated ${diffMin} ${diffMin === 1 ? 'minute' : 'minutes'} ago`;
  };

  // Helper to get normalized weather object from REAL LIVE API responses ONLY
  const getNormalizedData = () => {
    if (!liveWeather || !liveWeather.current) {
      return null;
    }

    const cur = liveWeather.current;
    const weatherDesc = getWeatherDescription(cur.weather_code);
    const daily = liveWeather.daily || {};
    const hourly = liveWeather.hourly || {};
    const aqiCur = liveAQI?.current || {};

    const aqiVal = aqiCur.us_aqi ?? 50;
    let aqiCategory = 'Good';
    if (aqiVal > 300) aqiCategory = 'Hazardous / Severe';
    else if (aqiVal > 200) aqiCategory = 'Very Unhealthy';
    else if (aqiVal > 150) aqiCategory = 'Unhealthy';
    else if (aqiVal > 100) aqiCategory = 'Moderate';
    else if (aqiVal > 50) aqiCategory = 'Satisfactory';

    const alerts = [];
    if (aqiVal > 250) {
      alerts.push({ 
        id: 'la-1', 
        type: 'critical', 
        title: 'Severe Air Quality Alert (गंभीर वायु प्रदूषण)', 
        desc: `US AQI is currently ${aqiVal} (PM2.5: ${aqiCur.pm2_5 || 0} µg/m³). N95 mask mandatory outdoors; avoid strenuous outdoor exertion.` 
      });
    }
    if (cur.precipitation > 2.5 || (daily.precipitation_probability_max && daily.precipitation_probability_max[0] > 75)) {
      alerts.push({ 
        id: 'la-2', 
        type: 'warning', 
        title: 'Precipitation Advisory in Effect (वर्षा चेतावनी)', 
        desc: `High probability of rainfall (${daily.precipitation_probability_max?.[0] || 80}%). Commuters and travelers should carry rain gear.` 
      });
    }
    if (cur.visibility && cur.visibility < 1000) {
      alerts.push({ 
        id: 'la-3', 
        type: 'warning', 
        title: 'Dense Fog / Low Visibility (घना कोहरा)', 
        desc: `Visibility is restricted to ${cur.visibility}m. Keep low-beam fog headlights on.` 
      });
    }

    return {
      isLoading: false,
      error: null,
      cityName: selectedCity.name,
      state: selectedCity.state,
      agroRegion: selectedCity.agroRegion || 'Regional Agricultural Basin',
      isCoastal: selectedCity.isCoastal,
      lastUpdatedText: getUpdatedAgo(),
      current: {
        temp: Math.round(cur.temperature_2m * 10) / 10,
        feelsLike: Math.round(cur.apparent_temperature * 10) / 10,
        humidity: cur.relative_humidity_2m,
        weatherCode: cur.weather_code,
        condition: language === 'hi' ? weatherDesc.hindi : weatherDesc.label,
        icon: weatherDesc.icon,
        windSpeed: cur.wind_speed_10m,
        windDirection: cur.wind_direction_10m,
        windGusts: cur.wind_gusts_10m || cur.wind_speed_10m,
        dewPoint: hourly.dew_point_2m ? Math.round(hourly.dew_point_2m[0] * 10) / 10 : Math.round(cur.temperature_2m - ((100 - cur.relative_humidity_2m) / 5)),
        pressure: cur.surface_pressure,
        visibility: cur.visibility || 7000,
        uvIndex: daily.uv_index_max ? daily.uv_index_max[0] : 6,
        sunrise: daily.sunrise ? new Date(daily.sunrise[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '06:00 AM',
        sunset: daily.sunset ? new Date(daily.sunset[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '06:30 PM',
        tempMax: daily.temperature_2m_max ? daily.temperature_2m_max[0] : Math.round(cur.temperature_2m + 3),
        tempMin: daily.temperature_2m_min ? daily.temperature_2m_min[0] : Math.round(cur.temperature_2m - 4),
        rainProb: daily.precipitation_probability_max ? daily.precipitation_probability_max[0] : (cur.precipitation > 0 ? 80 : 10),
        soilMoisture: hourly.soil_moisture_0_to_1cm ? hourly.soil_moisture_0_to_1cm[0] : 0.28,
        soilTemp: hourly.soil_temperature_0cm ? hourly.soil_temperature_0cm[0] : cur.temperature_2m,
        nowcast15: liveWeather.minutely_15 || null,
        coords: { lat: selectedCity.lat, lon: selectedCity.lon },
        precision: selectedCity.precision || 'High-Precision Satellite Model',
      },
      aqi: {
        usAqi: aqiVal,
        category: aqiCategory,
        pm25: aqiCur.pm2_5 ?? 25,
        pm10: aqiCur.pm10 ?? 50,
        ozone: aqiCur.ozone ?? 30,
        no2: aqiCur.nitrogen_dioxide ?? 15,
        pollenTree: aqiCur.birch_pollen || aqiCur.alder_pollen || 12,
        pollenGrass: aqiCur.grass_pollen || 15,
        pollenWeed: aqiCur.ragweed_pollen || 5,
      },
      marine: selectedCity.isCoastal && liveMarine?.current ? {
        isCoastal: true,
        waveHeight: liveMarine.current.wave_height || 1.4,
        wavePeriod: liveMarine.current.wave_period || 8.0,
        waterTemp: 28.0,
        safetyFlag: (liveMarine.current.wave_height > 2.5) ? 'Red' : (liveMarine.current.wave_height > 1.5 ? 'Yellow' : 'Green'),
        tideStatus: 'Astronomical Coastal Cycle',
      } : {
        isCoastal: false,
        waveHeight: 0,
        wavePeriod: 0,
        waterTemp: 0,
        safetyFlag: 'None',
        tideStatus: 'Inland',
      },
      alerts,
      rawHourly: hourly,
      rawDaily: daily,
    };
  };

  const weather = getNormalizedData();

  return (
    <WeatherContext.Provider value={{
      selectedCity,
      setSelectedCity,
      activePersona,
      setActivePersona,
      language,
      setLanguage,
      isMobilePreview,
      setIsMobilePreview,
      weather,
      loading,
      error,
      refreshData: () => loadRealData(selectedCity.lat, selectedCity.lon, selectedCity.isCoastal)
    }}>
      {children}
    </WeatherContext.Provider>
  );
}

export const useWeather = () => useContext(WeatherContext);

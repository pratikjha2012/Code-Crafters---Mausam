import React, { createContext, useContext, useState, useEffect } from 'react';
import { INDIAN_CITIES, fetchWeatherData, fetchAirQualityData, fetchMarineData, getWeatherDescription, reverseGeocode } from '../services/weatherApi';
import { DEMO_SCENARIOS } from '../data/demoScenarios';

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
  const [dataMode, setDataMode] = useState('real'); // Real live weather is now DEFAULT!
  const [activeScenarioId, setActiveScenarioId] = useState('pleasant');
  const [selectedCity, setSelectedCity] = useState(INDIAN_CITIES[0]); // New Delhi default
  const [activePersona, setActivePersona] = useState('all');
  const [language, setLanguage] = useState('en'); // 'en' | 'hi'
  const [isMobilePreview, setIsMobilePreview] = useState(false);

  const [liveWeather, setLiveWeather] = useState(null);
  const [liveAQI, setLiveAQI] = useState(null);
  const [liveMarine, setLiveMarine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Auto-detect GPS location on startup
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
            agroRegion: 'Local Micro-climate'
          });
        },
        () => {
          // If permission denied, seamlessly use default city
        },
        { timeout: 6000 }
      );
    }
  }, []);

  // Fetch real data when in 'real' mode or city changes
  useEffect(() => {
    if (dataMode === 'real') {
      loadRealData(selectedCity.lat, selectedCity.lon, selectedCity.isCoastal);
    }
  }, [dataMode, selectedCity]);

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
    } catch (err) {
      console.error(err);
      setError('Live satellite feed temporarily unavailable. Displaying cached demo scenario.');
      // Auto-fallback safely
      setDataMode('demo');
    } finally {
      setLoading(false);
    }
  };

  // Helper to get normalized weather object regardless of mode
  const getNormalizedData = () => {
    if (dataMode === 'demo') {
      const scenario = DEMO_SCENARIOS[activeScenarioId] || DEMO_SCENARIOS.delhi_smog;
      const weatherDesc = getWeatherDescription(scenario.weather.weatherCode);
      return {
        isDemo: true,
        cityName: scenario.cityName,
        state: scenario.state,
        agroRegion: scenario.agroRegion,
        isCoastal: scenario.isCoastal,
        current: {
          temp: scenario.weather.temperature,
          feelsLike: scenario.weather.apparentTemperature,
          humidity: scenario.weather.relativeHumidity,
          weatherCode: scenario.weather.weatherCode,
          condition: language === 'hi' ? weatherDesc.hindi : weatherDesc.label,
          icon: weatherDesc.icon,
          windSpeed: scenario.weather.windSpeed,
          windDirection: scenario.weather.windDirection,
          pressure: scenario.weather.surfacePressure,
          visibility: scenario.weather.visibility,
          uvIndex: scenario.weather.uvIndex,
          sunrise: scenario.weather.sunrise,
          sunset: scenario.weather.sunset,
          tempMax: scenario.weather.tempMax,
          tempMin: scenario.weather.tempMin,
          rainProb: scenario.weather.rainProbability,
          soilMoisture: scenario.weather.soilMoisture,
          soilTemp: scenario.weather.soilTemp,
        },
        aqi: scenario.aqi,
        marine: scenario.marine,
        alerts: scenario.alerts,
        scenarioDetails: scenario,
      };
    }

    // Process Live Data
    if (!liveWeather) {
      const fallback = DEMO_SCENARIOS.pleasant;
      return {
        isDemo: false,
        cityName: selectedCity.name,
        state: selectedCity.state,
        agroRegion: selectedCity.agroRegion,
        isCoastal: selectedCity.isCoastal,
        current: {
          temp: fallback.weather.temperature,
          feelsLike: fallback.weather.apparentTemperature,
          humidity: fallback.weather.relativeHumidity,
          weatherCode: fallback.weather.weatherCode,
          condition: 'Loading Telemetry...',
          icon: 'Sun',
          windSpeed: fallback.weather.windSpeed,
          windDirection: fallback.weather.windDirection,
          pressure: fallback.weather.surfacePressure,
          visibility: fallback.weather.visibility,
          uvIndex: fallback.weather.uvIndex,
          sunrise: fallback.weather.sunrise,
          sunset: fallback.weather.sunset,
          tempMax: fallback.weather.tempMax,
          tempMin: fallback.weather.tempMin,
          rainProb: fallback.weather.rainProbability,
          soilMoisture: fallback.weather.soilMoisture,
          soilTemp: fallback.weather.soilTemp,
        },
        aqi: fallback.aqi,
        marine: fallback.marine,
        alerts: [{ id: 'init-1', type: 'info', title: 'Connecting to Satellite', desc: 'Acquiring real-time telemetry from IMD / Open-Meteo satellites...' }],
      };
    }
    const cur = liveWeather.current;
    const weatherDesc = getWeatherDescription(cur.weather_code);
    const daily = liveWeather.daily || {};
    const hourly = liveWeather.hourly || {};
    const aqiCur = liveAQI?.current || {};

    const aqiVal = aqiCur.us_aqi || 65;
    let aqiCategory = 'Good';
    if (aqiVal > 300) aqiCategory = 'Hazardous / Severe';
    else if (aqiVal > 200) aqiCategory = 'Very Unhealthy';
    else if (aqiVal > 150) aqiCategory = 'Unhealthy';
    else if (aqiVal > 100) aqiCategory = 'Moderate / Sensitive';
    else if (aqiVal > 50) aqiCategory = 'Satisfactory';

    const alerts = [];
    if (aqiVal > 250) {
      alerts.push({ id: 'la-1', type: 'critical', title: 'Severe Air Quality Alert', desc: `US AQI is currently ${aqiVal}. Sensitive groups and children must avoid outdoor exposure.` });
    }
    if (cur.precipitation > 2.5 || (daily.precipitation_probability_max && daily.precipitation_probability_max[0] > 75)) {
      alerts.push({ id: 'la-2', type: 'warning', title: 'Rain Advisory in Effect', desc: 'Precipitation expected over the region. Commuters should allow extra travel time.' });
    }
    if (cur.visibility && cur.visibility < 1000) {
      alerts.push({ id: 'la-3', type: 'warning', title: 'Dense Fog / Low Visibility', desc: `Visibility is reduced to ${cur.visibility}m. Drive with caution.` });
    }

    return {
      isDemo: false,
      cityName: selectedCity.name,
      state: selectedCity.state,
      agroRegion: selectedCity.agroRegion || 'Regional Agricultural Basin',
      isCoastal: selectedCity.isCoastal,
      current: {
        temp: Math.round(cur.temperature_2m * 10) / 10,
        feelsLike: Math.round(cur.apparent_temperature * 10) / 10,
        humidity: cur.relative_humidity_2m,
        weatherCode: cur.weather_code,
        condition: language === 'hi' ? weatherDesc.hindi : weatherDesc.label,
        icon: weatherDesc.icon,
        windSpeed: cur.wind_speed_10m,
        windDirection: cur.wind_direction_10m,
        pressure: cur.surface_pressure,
        visibility: cur.visibility || 7000,
        uvIndex: daily.uv_index_max ? daily.uv_index_max[0] : 6,
        sunrise: daily.sunrise ? new Date(daily.sunrise[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '06:00 AM',
        sunset: daily.sunset ? new Date(daily.sunset[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '06:30 PM',
        tempMax: daily.temperature_2m_max ? daily.temperature_2m_max[0] : 30,
        tempMin: daily.temperature_2m_min ? daily.temperature_2m_min[0] : 20,
        rainProb: daily.precipitation_probability_max ? daily.precipitation_probability_max[0] : 20,
        soilMoisture: hourly.soil_moisture_0_to_1cm ? hourly.soil_moisture_0_to_1cm[0] : 0.30,
        soilTemp: hourly.soil_temperature_0cm ? hourly.soil_temperature_0cm[0] : 22,
      },
      aqi: {
        usAqi: aqiVal,
        category: aqiCategory,
        pm25: aqiCur.pm2_5 || 25,
        pm10: aqiCur.pm10 || 55,
        ozone: aqiCur.ozone || 30,
        no2: aqiCur.nitrogen_dioxide || 15,
        pollenTree: aqiCur.birch_pollen || aqiCur.alder_pollen || 18,
        pollenGrass: aqiCur.grass_pollen || 24,
        pollenWeed: aqiCur.ragweed_pollen || 10,
      },
      marine: selectedCity.isCoastal && liveMarine?.current ? {
        isCoastal: true,
        waveHeight: liveMarine.current.wave_height || 1.2,
        wavePeriod: liveMarine.current.wave_period || 8.0,
        waterTemp: 28.0,
        safetyFlag: (liveMarine.current.wave_height > 2.5) ? 'Red' : (liveMarine.current.wave_height > 1.5 ? 'Yellow' : 'Green'),
        tideStatus: 'Normal Tidal Cycle',
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
      dataMode,
      setDataMode,
      activeScenarioId,
      setActiveScenarioId,
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
      refreshData: () => {
        if (dataMode === 'real') loadRealData(selectedCity.lat, selectedCity.lon, selectedCity.isCoastal);
      }
    }}>
      {children}
    </WeatherContext.Provider>
  );
}

export const useWeather = () => useContext(WeatherContext);

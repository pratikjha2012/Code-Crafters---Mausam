// High-Precision Weather API Service (Multi-Provider: Open-Meteo Precision Temperature + WeatherAPI Alerts)

const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY || '361d9ce5509d4544b88132551260809';

export const INDIAN_CITIES = [
  { name: 'New Delhi', state: 'Delhi', lat: 28.6139, lon: 77.2090, isCoastal: false, agroRegion: 'Indo-Gangetic Plain' },
  { name: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lon: 72.8777, isCoastal: true, agroRegion: 'Konkan Coast' },
  { name: 'Bengaluru', state: 'Karnataka', lat: 12.9716, lon: 77.5946, isCoastal: false, agroRegion: 'South Deccan' },
  { name: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lon: 80.2707, isCoastal: true, agroRegion: 'Coromandel Coast' },
  { name: 'Kolkata', state: 'West Bengal', lat: 22.5726, lon: 88.3639, isCoastal: false, agroRegion: 'Lower Gangetic Plain' },
  { name: 'Panaji (Goa)', state: 'Goa', lat: 15.4909, lon: 73.8278, isCoastal: true, agroRegion: 'West Coast' },
  { name: 'Shimla', state: 'Himachal Pradesh', lat: 31.1048, lon: 77.1734, isCoastal: false, agroRegion: 'Western Himalayan' },
  { name: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lon: 75.7873, isCoastal: false, agroRegion: 'Arid Western' },
  { name: 'Hyderabad', state: 'Telangana', lat: 17.3850, lon: 78.4867, isCoastal: false, agroRegion: 'Central Deccan' },
  { name: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lon: 72.5714, isCoastal: false, agroRegion: 'Gujarat Plains' },
  { name: 'Kochi', state: 'Kerala', lat: 9.9312, lon: 76.2673, isCoastal: true, agroRegion: 'Malabar Coast' },
  { name: 'Puri', state: 'Odisha', lat: 19.8135, lon: 85.8312, isCoastal: true, agroRegion: 'East Coast' },
  { name: 'Varanasi', state: 'Uttar Pradesh', lat: 25.3176, lon: 82.9739, isCoastal: false, agroRegion: 'Middle Gangetic Plain' },
  { name: 'Guwahati', state: 'Assam', lat: 26.1445, lon: 91.7362, isCoastal: false, agroRegion: 'Brahmaputra Valley' },
  { name: 'Srinagar', state: 'Jammu & Kashmir', lat: 34.0837, lon: 74.7973, isCoastal: false, agroRegion: 'Kashmir Valley' },
];

export const WMO_CODES = {
  0: { label: 'Clear Sky', hindi: 'साफ आसमान', icon: 'Sun', severity: 'low' },
  1: { label: 'Mainly Clear', hindi: 'मुख्यतः साफ', icon: 'SunDim', severity: 'low' },
  2: { label: 'Partly Cloudy', hindi: 'आंशिक बादल', icon: 'CloudSun', severity: 'low' },
  3: { label: 'Overcast', hindi: 'घने बादल', icon: 'Cloud', severity: 'low' },
  45: { label: 'Foggy', hindi: 'कोहरा', icon: 'CloudFog', severity: 'medium' },
  48: { label: 'Depositing Rime Fog', hindi: 'घना जमाव कोहरा', icon: 'CloudFog', severity: 'high' },
  51: { label: 'Light Drizzle', hindi: 'हल्की बूंदाबांदी', icon: 'CloudDrizzle', severity: 'low' },
  53: { label: 'Moderate Drizzle', hindi: 'मध्यम बूंदाबांदी', icon: 'CloudDrizzle', severity: 'medium' },
  55: { label: 'Dense Drizzle', hindi: 'घनी बूंदाबांदी', icon: 'CloudDrizzle', severity: 'medium' },
  61: { label: 'Slight Rain', hindi: 'हल्की बारिश', icon: 'CloudRain', severity: 'low' },
  63: { label: 'Moderate Rain', hindi: 'मध्यम बारिश', icon: 'CloudRain', severity: 'medium' },
  65: { label: 'Heavy Rain', hindi: 'भारी बारिश', icon: 'CloudRainWind', severity: 'high' },
  71: { label: 'Slight Snowfall', hindi: 'हल्की बर्फबारी', icon: 'Snowflake', severity: 'medium' },
  73: { label: 'Moderate Snowfall', hindi: 'मध्यम बर्फबारी', icon: 'Snowflake', severity: 'high' },
  75: { label: 'Heavy Snowfall', hindi: 'भारी बर्फबारी', icon: 'Snowflake', severity: 'severe' },
  80: { label: 'Slight Rain Showers', hindi: 'हल्की बौछारें', icon: 'CloudRain', severity: 'medium' },
  81: { label: 'Moderate Rain Showers', hindi: 'मध्यम बौछारें', icon: 'CloudRain', severity: 'medium' },
  82: { label: 'Violent Rain Showers', hindi: 'तेज मूसलाधार बौछारें', icon: 'CloudRainWind', severity: 'severe' },
  95: { label: 'Thunderstorm', hindi: 'आंधी-तूफान', icon: 'CloudLightning', severity: 'high' },
  96: { label: 'Thunderstorm with Slight Hail', hindi: 'ओलावृष्टि सहित आंधी', icon: 'CloudHail', severity: 'severe' },
  99: { label: 'Thunderstorm with Heavy Hail', hindi: 'भारी ओलावृष्टि सहित आंधी', icon: 'CloudHail', severity: 'severe' }
};

export function weatherApiCodeToWmo(code, text = '') {
  if (code === 1000) return 0; // Sunny / Clear
  if (code === 1003) return 2; // Partly cloudy
  if (code === 1006 || code === 1009) return 3; // Cloudy / Overcast
  if (code === 1030 || code === 1135 || code === 1147) return 45; // Mist / Fog
  if (code === 1063 || code === 1150 || code === 1153 || code === 1180 || code === 1183) return 61; // Light rain / drizzle
  if (code === 1186 || code === 1189) return 63; // Moderate rain
  if (code === 1192 || code === 1195) return 65; // Heavy rain
  if (code === 1240 || code === 1243 || code === 1246) return 81; // Rain shower
  if (code === 1087 || code === 1273 || code === 1276) return 95; // Thunderstorm
  if (code === 1279 || code === 1282) return 96; // Thunderstorm with hail
  if (code === 1066 || code === 1114 || code === 1210 || code === 1213) return 71; // Snow
  if (code === 1117 || code === 1219 || code === 1225) return 75; // Heavy snow
  return 2;
}

export const getWeatherDescription = (code) => {
  return WMO_CODES[code] || { label: 'Partly Cloudy', hindi: 'आंशिक बादल', icon: 'CloudSun', severity: 'low' };
};

// 1. High-Precision Hyper-Local Weather
// RULE: Temperature data (current, feels-like, hourly, min/max) is sourced directly from Open-Meteo high-resolution ECMWF/GFS ensemble for maximum local precision.
// WeatherAPI provides official government meteorological warnings, flood alerts, and astronomical lunar cycles.
export async function fetchWeatherData(lat, lon) {
  const openMeteoUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m,wind_gusts_10m,surface_pressure&minutely_15=precipitation,temperature_2m,weather_code&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,visibility,wind_speed_10m,wind_gusts_10m,uv_index,dew_point_2m,soil_temperature_0cm,soil_moisture_0_to_1cm,soil_moisture_1_to_3cm&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max&models=best_match&timezone=auto`;

  let openMeteoData = null;
  let weatherApiData = null;

  const promises = [
    fetch(openMeteoUrl).then(r => r.ok ? r.json() : null).catch(() => null)
  ];

  if (WEATHER_API_KEY) {
    const wUrl = `https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${lat},${lon}&days=7&aqi=yes&alerts=yes`;
    promises.push(fetch(wUrl).then(r => r.ok ? r.json() : null).catch(() => null));
  }

  const [omResult, waResult] = await Promise.all(promises);
  openMeteoData = omResult;
  weatherApiData = waResult;

  if (!openMeteoData && !weatherApiData) {
    throw new Error('Unable to retrieve weather data from live providers.');
  }

  // If only WeatherAPI succeeded, fall back gracefully
  if (!openMeteoData) {
    const cur = weatherApiData.current;
    const fDays = weatherApiData.forecast?.forecastday || [];
    return {
      source: 'WeatherAPI.com Fallback',
      current: {
        temperature_2m: cur.temp_c,
        apparent_temperature: cur.feelslike_c,
        relative_humidity_2m: cur.humidity,
        weather_code: weatherApiCodeToWmo(cur.condition?.code, cur.condition?.text),
        precipitation: cur.precip_mm,
        rain: cur.precip_mm,
        wind_speed_10m: cur.wind_kph,
        wind_direction_10m: cur.wind_degree,
        surface_pressure: cur.pressure_mb,
        visibility: cur.vis_km * 1000
      },
      hourly: {
        time: fDays[0]?.hour?.map(h => h.time) || [],
        temperature_2m: fDays[0]?.hour?.map(h => h.temp_c) || [],
        precipitation_probability: fDays[0]?.hour?.map(h => h.chance_of_rain || 0) || []
      },
      daily: {
        time: fDays.map(d => d.date),
        temperature_2m_max: fDays.map(d => d.day.maxtemp_c),
        temperature_2m_min: fDays.map(d => d.day.mintemp_c),
        sunrise: fDays.map(d => d.astro.sunrise),
        sunset: fDays.map(d => d.astro.sunset)
      },
      alerts: (weatherApiData.alerts?.alert || []).map((a, i) => ({
        id: a.identifier || `wapi-${i}`,
        type: a.severity?.toLowerCase() === 'severe' ? 'critical' : 'warning',
        title: a.headline || a.event,
        desc: a.desc || a.headline
      }))
    };
  }

  // Combine: Open-Meteo for temperatures + WeatherAPI for alerts & moon phase
  const merged = { ...openMeteoData };

  // Overlay official weather & flood alerts from WeatherAPI if available
  const officialAlerts = [];
  if (weatherApiData?.alerts?.alert && weatherApiData.alerts.alert.length > 0) {
    weatherApiData.alerts.alert.forEach((a, idx) => {
      officialAlerts.push({
        id: a.identifier || `wapi-${idx}`,
        type: a.severity?.toLowerCase() === 'severe' ? 'critical' : 'warning',
        title: a.headline || a.event,
        desc: a.desc || a.headline,
        instruction: a.instruction || '',
        effective: a.effective,
        expires: a.expires
      });
    });
  }

  merged.alerts = officialAlerts;
  merged.moonPhase = weatherApiData?.forecast?.forecastday?.[0]?.astro?.moon_phase || 'Waning Crescent';
  merged.source = 'Open-Meteo High-Resolution Multi-Model Ensemble';

  return merged;
}

// 2. High-Precision Air Quality & Botanical Pollens (Open-Meteo CAMS / Copernicus)
export async function fetchAirQualityData(lat, lon) {
  try {
    const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,european_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,dust,alder_pollen,birch_pollen,grass_pollen,mugwort_pollen,olive_pollen,ragweed_pollen&hourly=us_aqi,pm2_5,pm10&timezone=auto`;
    const res = await fetch(url);
    if (res.ok) {
      return await res.json();
    }
  } catch (error) {
    console.error('Air Quality API error:', error);
  }

  return null;
}

// 3. Marine and Coastal Swell
export async function fetchMarineData(lat, lon) {
  try {
    const url = `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}&current=wave_height,wave_direction,wave_period,wind_wave_height,wind_wave_period,swell_wave_height,swell_wave_period&hourly=wave_height,wave_period&timezone=auto`;
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.warn('Marine data not available for inland coordinates:', error);
    return null;
  }
}

// 4. Hyper-Local Reverse Geocoding
export async function reverseGeocode(lat, lon) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`,
      { headers: { 'User-Agent': 'MausamPrecisionWeather/2.0' } }
    );
    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      const neighborhood = addr.suburb || addr.neighbourhood || addr.residential || addr.road || '';
      const city = addr.city || addr.town || addr.municipality || addr.state_district || 'Local Station';
      const state = addr.state || 'India';
      const postcode = addr.postcode ? `(${addr.postcode})` : '';

      const name = neighborhood ? `${neighborhood}, ${city}` : city;
      return {
        name,
        city,
        state: `${state} ${postcode}`.trim(),
        postcode: addr.postcode || '',
        formatted: data.display_name,
        precision: 'High-Precision GPS'
      };
    }
  } catch (err) {
    console.warn('Nominatim fallback, trying BigDataCloud...', err);
  }

  try {
    const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
    if (res.ok) {
      const data = await res.json();
      return {
        name: data.locality || data.city || 'My Location',
        city: data.city || data.locality || 'Local City',
        state: data.principalSubdivision || 'India',
        precision: 'Network Geolocation'
      };
    }
  } catch (err) {}

  return { name: 'My Station', state: 'GPS Coordinates', precision: 'Coordinates' };
}

// 5. Intelligent Multi-Tier Location Search
export async function searchLocation(query) {
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=8&language=en&format=json`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    return data.results || [];
  } catch (error) {
    console.error('Geocoding error:', error);
    return [];
  }
}

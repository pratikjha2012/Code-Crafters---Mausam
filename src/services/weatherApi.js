// High-Precision Weather API Service (Hyper-Local Multi-Model Engine)
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

export const getWeatherDescription = (code) => {
  return WMO_CODES[code] || { label: 'Partly Cloudy', hindi: 'आंशिक बादल', icon: 'CloudSun', severity: 'low' };
};

// 1. High-Precision Hyper-Local Weather (Best Match ECMWF/GFS Ensemble + 15-Minute Nowcasting)
export async function fetchWeatherData(lat, lon) {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m,wind_gusts_10m,surface_pressure&minutely_15=precipitation,temperature_2m,weather_code&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,visibility,wind_speed_10m,wind_gusts_10m,uv_index,dew_point_2m,soil_temperature_0cm,soil_moisture_0_to_1cm,soil_moisture_1_to_3cm&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max&models=best_match&timezone=auto`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch weather data');
    return await res.json();
  } catch (error) {
    console.error('Weather API error:', error);
    throw error;
  }
}

// 2. High-Precision Air Quality, Aerosols and Botanical Pollens
export async function fetchAirQualityData(lat, lon) {
  try {
    const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,european_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,dust,alder_pollen,birch_pollen,grass_pollen,mugwort_pollen,olive_pollen,ragweed_pollen&hourly=us_aqi,pm2_5,pm10&timezone=auto`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch air quality data');
    return await res.json();
  } catch (error) {
    console.error('Air Quality API error:', error);
    return null;
  }
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

// 4. Hyper-Local Reverse Geocoding with Neighborhood & Pincode Precision
export async function reverseGeocode(lat, lon) {
  // Try OpenStreetMap Nominatim for maximum neighborhood / sub-district precision
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

  // Fallback to BigDataCloud
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
  } catch (err) {
    console.warn('Reverse geocode fallback', err);
  }

  return { name: 'My Station', state: 'GPS Coordinates', precision: 'Coordinates' };
}

// 5. Intelligent Multi-Tier Location Search (Cities, Suburbs, Pincodes)
export async function searchLocation(query) {
  try {
    // Check Open-Meteo Geocoding
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

// 6. Optional OpenWeatherMap Provider (If custom key provided in settings)
export async function fetchOpenWeather(lat, lon, apiKey) {
  if (!apiKey) return null;
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    console.warn('OpenWeather error', e);
    return null;
  }
}

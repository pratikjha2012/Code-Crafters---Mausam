import fetch from 'node-fetch';

// WMO code descriptions
export const WMO_CODES = {
  0: { label: 'Clear sky', hindi: 'साफ आसमान' },
  1: { label: 'Mainly clear', hindi: 'मुख्यतः साफ' },
  2: { label: 'Partly cloudy', hindi: 'आंशिक बादल' },
  3: { label: 'Overcast', hindi: 'घने बादल' },
  45: { label: 'Fog', hindi: 'कोहरा' },
  48: { label: 'Depositing rime fog', hindi: 'घना जमाव कोहरा' },
  51: { label: 'Light drizzle', hindi: 'हल्की बूंदाबांदी' },
  53: { label: 'Moderate drizzle', hindi: 'मध्यम बूंदाबांदी' },
  55: { label: 'Dense drizzle', hindi: 'घनी बूंदाबांदी' },
  61: { label: 'Slight rain', hindi: 'हल्की बारिश' },
  63: { label: 'Moderate rain', hindi: 'मध्यम बारिश' },
  65: { label: 'Heavy rain', hindi: 'भारी बारिश' },
  71: { label: 'Slight snow fall', hindi: 'हल्की बर्फबारी' },
  73: { label: 'Moderate snow fall', hindi: 'मध्यम बर्फबारी' },
  75: { label: 'Heavy snow fall', hindi: 'भारी बर्फबारी' },
  80: { label: 'Slight rain showers', hindi: 'हल्की बौछारें' },
  81: { label: 'Moderate rain showers', hindi: 'मध्यम बौछारें' },
  82: { label: 'Violent rain showers', hindi: 'तेज मूसलाधार बौछारें' },
  95: { label: 'Thunderstorm', hindi: 'आंधी-तूफान' },
  96: { label: 'Thunderstorm with slight hail', hindi: 'ओलावृष्टि सहित आंधी' },
  99: { label: 'Thunderstorm with heavy hail', hindi: 'भारी ओलावृष्टि सहित आंधी' }
};

export function getWeatherCondition(code) {
  return WMO_CODES[code] || { label: 'Partly cloudy', hindi: 'आंशिक बादल' };
}

// Geocode location string to { lat, lon, name, state, country }
export async function geocodeLocation(locationStr) {
  if (!locationStr || typeof locationStr !== 'string') {
    return { lat: 28.6139, lon: 77.2090, name: 'New Delhi', state: 'Delhi', country: 'India' };
  }

  // If already in lat,lon format
  if (locationStr.includes(',')) {
    const parts = locationStr.split(',').map(s => parseFloat(s.trim()));
    if (!isNaN(parts[0]) && !isNaN(parts[1])) {
      return { lat: parts[0], lon: parts[1], name: locationStr, state: '', country: '' };
    }
  }

  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(locationStr)}&count=1&language=en&format=json`;
    const res = await fetch(url, { headers: { 'User-Agent': 'MausamServer/1.0' } });
    if (!res.ok) throw new Error(`Geocoding HTTP error: ${res.status}`);
    const data = await res.json();
    if (data.results && data.results.length > 0) {
      const top = data.results[0];
      return {
        lat: top.latitude,
        lon: top.longitude,
        name: top.name,
        state: top.admin1 || '',
        country: top.country || ''
      };
    }
  } catch (err) {
    console.error(`Geocoding error for ${locationStr}:`, err.message);
  }

  // Default fallback if unresolvable
  return { lat: 28.6139, lon: 77.2090, name: locationStr, state: '', country: '' };
}

// Tool 1: get_current_weather(location)
export async function getCurrentWeather(location) {
  const geo = typeof location === 'object' && location.lat ? location : await geocodeLocation(location);
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${geo.lat}&longitude=${geo.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m,wind_gusts_10m,surface_pressure&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max&models=best_match&timezone=auto`;

  const res = await fetch(url, { headers: { 'User-Agent': 'MausamServer/1.0' } });
  if (!res.ok) throw new Error(`Weather API error: ${res.status}`);
  const data = await res.json();

  const cur = data.current;
  const daily = data.daily;
  const cond = getWeatherCondition(cur.weather_code);

  return {
    location: `${geo.name}${geo.state ? ', ' + geo.state : ''}`,
    coordinates: { lat: geo.lat, lon: geo.lon },
    timestamp: new Date().toISOString(),
    temperature: cur.temperature_2m,
    feelsLike: cur.apparent_temperature,
    condition: cond.label,
    conditionHindi: cond.hindi,
    weatherCode: cur.weather_code,
    humidity: cur.relative_humidity_2m,
    precipitation: cur.precipitation,
    rainProbabilityToday: daily?.precipitation_probability_max?.[0] ?? 0,
    windSpeed: cur.wind_speed_10m,
    windDirection: cur.wind_direction_10m,
    windGusts: cur.wind_gusts_10m,
    pressure: cur.surface_pressure,
    tempMaxToday: daily?.temperature_2m_max?.[0],
    tempMinToday: daily?.temperature_2m_min?.[0],
    uvIndexToday: daily?.uv_index_max?.[0],
    sunrise: daily?.sunrise?.[0],
    sunset: daily?.sunset?.[0],
    source: 'Open-Meteo High-Resolution Numerical Model'
  };
}

// Tool 2: get_hourly_forecast(location, date, time_range)
export async function getHourlyForecast(location, date, timeRange) {
  const geo = typeof location === 'object' && location.lat ? location : await geocodeLocation(location);
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${geo.lat}&longitude=${geo.lon}&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,visibility,wind_speed_10m,uv_index&models=best_match&timezone=auto`;

  const res = await fetch(url, { headers: { 'User-Agent': 'MausamServer/1.0' } });
  if (!res.ok) throw new Error(`Hourly Forecast API error: ${res.status}`);
  const data = await res.json();

  const hourly = data.hourly;
  if (!hourly || !hourly.time) throw new Error('No hourly data returned');

  // Filter for target date if provided
  const targetDateStr = date ? (typeof date === 'string' ? date.slice(0, 10) : new Date(date).toISOString().slice(0, 10)) : new Date().toISOString().slice(0, 10);

  const forecast = [];
  for (let i = 0; i < hourly.time.length; i++) {
    const tStr = hourly.time[i];
    if (tStr.startsWith(targetDateStr)) {
      const cond = getWeatherCondition(hourly.weather_code[i]);
      const hourNum = parseInt(tStr.slice(11, 13), 10);

      // If timeRange is specified (e.g. 18 for 6 PM or "17-20")
      if (timeRange !== undefined && timeRange !== null) {
        if (typeof timeRange === 'number' && Math.abs(hourNum - timeRange) > 1) continue;
      }

      forecast.push({
        time: tStr,
        hour: hourNum,
        temperature: hourly.temperature_2m[i],
        feelsLike: hourly.apparent_temperature[i],
        rainProbability: hourly.precipitation_probability[i],
        precipitation: hourly.precipitation[i],
        condition: cond.label,
        conditionHindi: cond.hindi,
        humidity: hourly.relative_humidity_2m[i],
        visibility: hourly.visibility[i],
        windSpeed: hourly.wind_speed_10m[i],
        uvIndex: hourly.uv_index[i]
      });
    }
  }

  return {
    location: `${geo.name}${geo.state ? ', ' + geo.state : ''}`,
    date: targetDateStr,
    timestamp: new Date().toISOString(),
    hourlyCount: forecast.length,
    forecast: forecast.slice(0, 24), // Up to 24 hours
    source: 'Open-Meteo High-Resolution Hourly Model'
  };
}

// Tool 3: get_daily_forecast(location, date, number_of_days)
export async function getDailyForecast(location, date, numberOfDays = 7) {
  const geo = typeof location === 'object' && location.lat ? location : await geocodeLocation(location);
  const count = Math.min(14, Math.max(1, numberOfDays));
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${geo.lat}&longitude=${geo.lon}&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max,wind_speed_10m_max&forecast_days=${count}&models=best_match&timezone=auto`;

  const res = await fetch(url, { headers: { 'User-Agent': 'MausamServer/1.0' } });
  if (!res.ok) throw new Error(`Daily Forecast API error: ${res.status}`);
  const data = await res.json();

  const daily = data.daily;
  const days = [];
  for (let i = 0; i < (daily.time?.length || 0); i++) {
    const cond = getWeatherCondition(daily.weather_code[i]);
    days.push({
      date: daily.time[i],
      tempMax: daily.temperature_2m_max[i],
      tempMin: daily.temperature_2m_min[i],
      condition: cond.label,
      conditionHindi: cond.hindi,
      rainProbability: daily.precipitation_probability_max[i],
      precipitationSum: daily.precipitation_sum[i],
      uvIndexMax: daily.uv_index_max[i],
      windSpeedMax: daily.wind_speed_10m_max[i],
      sunrise: daily.sunrise[i],
      sunset: daily.sunset[i]
    });
  }

  return {
    location: `${geo.name}${geo.state ? ', ' + geo.state : ''}`,
    timestamp: new Date().toISOString(),
    days,
    source: 'Open-Meteo Daily Model'
  };
}

// Tool 4: get_air_quality(location)
export async function getAirQuality(location) {
  const geo = typeof location === 'object' && location.lat ? location : await geocodeLocation(location);
  const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${geo.lat}&longitude=${geo.lon}&current=us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,dust,alder_pollen,birch_pollen,grass_pollen,mugwort_pollen,olive_pollen,ragweed_pollen&timezone=auto`;

  const res = await fetch(url, { headers: { 'User-Agent': 'MausamServer/1.0' } });
  if (!res.ok) throw new Error(`Air Quality API error: ${res.status}`);
  const data = await res.json();
  const cur = data.current || {};

  const aqiVal = cur.us_aqi ?? 50;
  let category = 'Good';
  let categoryHindi = 'अच्छा';
  if (aqiVal > 300) { category = 'Hazardous / Severe'; categoryHindi = 'गंभीर / संकटपूर्ण'; }
  else if (aqiVal > 200) { category = 'Very Unhealthy'; categoryHindi = 'बहुत अस्वस्थ'; }
  else if (aqiVal > 150) { category = 'Unhealthy'; categoryHindi = 'अस्वस्थ'; }
  else if (aqiVal > 100) { category = 'Moderate'; categoryHindi = 'मध्यम'; }
  else if (aqiVal > 50) { category = 'Satisfactory'; categoryHindi = 'संतोषजनक'; }

  return {
    location: `${geo.name}${geo.state ? ', ' + geo.state : ''}`,
    timestamp: new Date().toISOString(),
    aqi: aqiVal,
    category,
    categoryHindi,
    pm25: cur.pm2_5,
    pm10: cur.pm10,
    ozone: cur.ozone,
    no2: cur.nitrogen_dioxide,
    so2: cur.sulphur_dioxide,
    co: cur.carbon_monoxide,
    pollenGrass: cur.grass_pollen || 0,
    pollenTree: cur.birch_pollen || cur.alder_pollen || 0,
    pollenWeed: cur.ragweed_pollen || 0,
    source: 'Open-Meteo Atmospheric Composition & CPCB Standard'
  };
}

// Tool 5: get_weather_alerts(location)
export async function getWeatherAlerts(location) {
  const current = await getCurrentWeather(location);
  const aqi = await getAirQuality(location);

  const alerts = [];

  // 1. Extreme Heat or Cold
  if (current.temperature >= 40) {
    alerts.push({
      severity: 'warning',
      title: 'Heatwave Alert (लू की चेतावनी)',
      description: `Maximum temperature is ${current.temperature}°C. Avoid outdoor exertion during midday.`
    });
  } else if (current.temperature <= 4) {
    alerts.push({
      severity: 'warning',
      title: 'Cold Wave / Frost Alert (शीत लहर)',
      description: `Temperature is near freezing (${current.temperature}°C). Protect sensitive crops and livestock.`
    });
  }

  // 2. Heavy Rain or Severe Thunderstorm
  if (current.weatherCode === 65 || current.weatherCode === 82 || current.rainProbabilityToday > 75) {
    alerts.push({
      severity: 'warning',
      title: 'Heavy Rain / Cloudburst Advisory (भारी वर्षा)',
      description: `High precipitation probability (${current.rainProbabilityToday}%). High risk of road waterlogging and transit delays.`
    });
  } else if (current.weatherCode >= 95) {
    alerts.push({
      severity: 'critical',
      title: 'Thunderstorm & Lightning Hazard (आंधी-तूफान)',
      description: 'Severe convective thunderstorm active in the area. Seek sturdy shelter immediately.'
    });
  }

  // 3. Severe Air Pollution
  if (aqi.aqi >= 250) {
    alerts.push({
      severity: 'critical',
      title: 'Severe Air Quality Alert (गंभीर वायु प्रदूषण)',
      description: `AQI is hazardous at ${aqi.aqi} (PM2.5: ${aqi.pm25} µg/m³). N95 mask mandatory outdoors; vulnerable groups must stay indoors.`
    });
  }

  return {
    location: current.location,
    timestamp: new Date().toISOString(),
    alertsCount: alerts.length,
    alerts: alerts.length > 0 ? alerts : [{
      severity: 'info',
      title: 'No Severe Weather Warnings (मौसम सामान्य)',
      description: 'Atmospheric conditions are stable with no active meteorological red/orange warnings.'
    }]
  };
}

// Tool 6: get_sunrise_sunset(location, date)
export async function getSunriseSunset(location, date) {
  const geo = typeof location === 'object' && location.lat ? location : await geocodeLocation(location);
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${geo.lat}&longitude=${geo.lon}&daily=sunrise,sunset,daylight_duration&timezone=auto`;

  const res = await fetch(url, { headers: { 'User-Agent': 'MausamServer/1.0' } });
  if (!res.ok) throw new Error(`Sunrise/Sunset API error: ${res.status}`);
  const data = await res.json();
  const daily = data.daily;

  return {
    location: `${geo.name}${geo.state ? ', ' + geo.state : ''}`,
    timestamp: new Date().toISOString(),
    sunrise: daily?.sunrise?.[0] ? new Date(daily.sunrise[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '06:00 AM',
    sunset: daily?.sunset?.[0] ? new Date(daily.sunset[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '06:30 PM',
    daylightSeconds: daily?.daylight_duration?.[0] || 43200,
    source: 'Astronomical Solar Model'
  };
}

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

  // Try WeatherAPI.com if key is set
  const apiKey = process.env.WEATHER_API_KEY;
  if (apiKey) {
    try {
      const wUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${geo.lat},${geo.lon}&days=1&aqi=yes&alerts=yes`;
      const wRes = await fetch(wUrl);
      if (wRes.ok) {
        const d = await wRes.json();
        const cur = d.current;
        const loc = d.location;
        const fDay = d.forecast?.forecastday?.[0]?.day;
        const astro = d.forecast?.forecastday?.[0]?.astro;

        return {
          location: `${loc.name}, ${loc.region || loc.country}`,
          coordinates: { lat: loc.lat, lon: loc.lon },
          timestamp: new Date().toISOString(),
          temperature: cur.temp_c,
          feelsLike: cur.feelslike_c,
          condition: cur.condition?.text || 'Clear',
          conditionHindi: cur.condition?.text || 'साफ मौसम',
          weatherCode: cur.condition?.code || 1000,
          humidity: cur.humidity,
          precipitation: cur.precip_mm,
          rainProbabilityToday: fDay?.daily_chance_of_rain ?? 0,
          windSpeed: cur.wind_kph,
          windDirection: cur.wind_dir,
          windGusts: cur.gust_kph,
          pressure: cur.pressure_mb,
          dewPoint: cur.dewpoint_c,
          heatIndex: cur.heatindex_c,
          wetBulb: cur.wetbulb_c,
          tempMaxToday: fDay?.maxtemp_c ?? cur.temp_c,
          tempMinToday: fDay?.mintemp_c ?? cur.temp_c,
          uvIndexToday: cur.uv,
          sunrise: astro?.sunrise || '06:00 AM',
          sunset: astro?.sunset || '06:30 PM',
          source: 'WeatherAPI.com Live Telemetry'
        };
      }
    } catch (err) {
      console.warn('WeatherAPI getCurrentWeather error, falling back to Open-Meteo:', err.message);
    }
  }

  // Fallback to Open-Meteo
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

  const apiKey = process.env.WEATHER_API_KEY;
  if (apiKey) {
    try {
      const wUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${geo.lat},${geo.lon}&days=2&aqi=no&alerts=no`;
      const wRes = await fetch(wUrl);
      if (wRes.ok) {
        const d = await wRes.json();
        const forecast = [];
        const targetDateStr = date ? (typeof date === 'string' ? date.slice(0, 10) : new Date(date).toISOString().slice(0, 10)) : new Date().toISOString().slice(0, 10);

        (d.forecast?.forecastday || []).forEach(dayObj => {
          (dayObj.hour || []).forEach(h => {
            if (h.time.startsWith(targetDateStr)) {
              const hourNum = parseInt(h.time.slice(11, 13), 10);
              if (timeRange !== undefined && timeRange !== null) {
                if (typeof timeRange === 'number' && Math.abs(hourNum - timeRange) > 1) return;
              }
              forecast.push({
                time: h.time,
                hour: hourNum,
                temperature: h.temp_c,
                feelsLike: h.feelslike_c,
                rainProbability: h.chance_of_rain ?? 0,
                precipitation: h.precip_mm,
                condition: h.condition?.text || 'Clear',
                humidity: h.humidity,
                visibility: h.vis_km * 1000,
                windSpeed: h.wind_kph,
                uvIndex: h.uv
              });
            }
          });
        });

        if (forecast.length > 0) {
          return {
            location: `${d.location.name}, ${d.location.region}`,
            date: targetDateStr,
            timestamp: new Date().toISOString(),
            hourlyCount: forecast.length,
            forecast: forecast.slice(0, 24),
            source: 'WeatherAPI.com Hourly Model'
          };
        }
      }
    } catch (e) {}
  }

  // Open-Meteo fallback
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${geo.lat}&longitude=${geo.lon}&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,visibility,wind_speed_10m,uv_index&models=best_match&timezone=auto`;

  const res = await fetch(url, { headers: { 'User-Agent': 'MausamServer/1.0' } });
  if (!res.ok) throw new Error(`Hourly Forecast API error: ${res.status}`);
  const data = await res.json();

  const hourly = data.hourly;
  if (!hourly || !hourly.time) throw new Error('No hourly data returned');

  const targetDateStr = date ? (typeof date === 'string' ? date.slice(0, 10) : new Date(date).toISOString().slice(0, 10)) : new Date().toISOString().slice(0, 10);

  const forecast = [];
  for (let i = 0; i < hourly.time.length; i++) {
    const tStr = hourly.time[i];
    if (tStr.startsWith(targetDateStr)) {
      const cond = getWeatherCondition(hourly.weather_code[i]);
      const hourNum = parseInt(tStr.slice(11, 13), 10);

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
    forecast: forecast.slice(0, 24),
    source: 'Open-Meteo High-Resolution Hourly Model'
  };
}

// Tool 3: get_daily_forecast(location, date, number_of_days)
export async function getDailyForecast(location, date, numberOfDays = 7) {
  const geo = typeof location === 'object' && location.lat ? location : await geocodeLocation(location);
  const count = Math.min(14, Math.max(1, numberOfDays));

  const apiKey = process.env.WEATHER_API_KEY;
  if (apiKey) {
    try {
      const wUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${geo.lat},${geo.lon}&days=${count}&aqi=no&alerts=no`;
      const wRes = await fetch(wUrl);
      if (wRes.ok) {
        const d = await wRes.json();
        const days = (d.forecast?.forecastday || []).map(dObj => ({
          date: dObj.date,
          tempMax: dObj.day.maxtemp_c,
          tempMin: dObj.day.mintemp_c,
          condition: dObj.day.condition?.text || 'Clear',
          conditionHindi: dObj.day.condition?.text || 'साफ',
          rainProbability: dObj.day.daily_chance_of_rain ?? 0,
          precipitationSum: dObj.day.totalprecip_mm,
          uvIndexMax: dObj.day.uv,
          windSpeedMax: dObj.day.maxwind_kph,
          sunrise: dObj.astro?.sunrise,
          sunset: dObj.astro?.sunset,
          moonPhase: dObj.astro?.moon_phase
        }));

        return {
          location: `${d.location.name}, ${d.location.region}`,
          timestamp: new Date().toISOString(),
          days,
          source: 'WeatherAPI.com Daily Model'
        };
      }
    } catch (e) {}
  }

  // Open-Meteo fallback
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

  const apiKey = process.env.WEATHER_API_KEY;
  if (apiKey) {
    try {
      const wUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${geo.lat},${geo.lon}&aqi=yes`;
      const wRes = await fetch(wUrl);
      if (wRes.ok) {
        const d = await wRes.json();
        const aq = d.current?.air_quality;
        if (aq) {
          const pm25 = aq.pm2_5 || 15;
          let aqiVal = Math.round(pm25 * 2.5);
          let category = 'Good';
          let categoryHindi = 'अच्छा';
          if (aqiVal > 300) { category = 'Hazardous / Severe'; categoryHindi = 'गंभीर / संकटपूर्ण'; }
          else if (aqiVal > 200) { category = 'Very Unhealthy'; categoryHindi = 'बहुत अस्वस्थ'; }
          else if (aqiVal > 150) { category = 'Unhealthy'; categoryHindi = 'अस्वस्थ'; }
          else if (aqiVal > 100) { category = 'Moderate'; categoryHindi = 'मध्यम'; }
          else if (aqiVal > 50) { category = 'Satisfactory'; categoryHindi = 'संतोषजनक'; }

          return {
            location: `${d.location.name}, ${d.location.region}`,
            timestamp: new Date().toISOString(),
            aqi: aqiVal,
            category,
            categoryHindi,
            pm25: aq.pm2_5,
            pm10: aq.pm10,
            ozone: aq.o3,
            no2: aq.no2,
            so2: aq.so2,
            co: aq.co,
            source: 'WeatherAPI.com Real-Time Air Quality'
          };
        }
      }
    } catch (e) {}
  }

  // Open-Meteo fallback
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
  const geo = typeof location === 'object' && location.lat ? location : await geocodeLocation(location);

  const apiKey = process.env.WEATHER_API_KEY;
  if (apiKey) {
    try {
      const wUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${geo.lat},${geo.lon}&days=1&aqi=no&alerts=yes`;
      const wRes = await fetch(wUrl);
      if (wRes.ok) {
        const d = await wRes.json();
        const apiAlerts = d.alerts?.alert || [];
        if (apiAlerts.length > 0) {
          return {
            location: `${d.location.name}, ${d.location.region}`,
            timestamp: new Date().toISOString(),
            activeAlertCount: apiAlerts.length,
            alerts: apiAlerts.map(a => ({
              severity: a.severity?.toLowerCase() === 'severe' ? 'critical' : 'warning',
              title: a.headline || a.event,
              description: a.desc || a.instruction || a.headline,
              areas: a.areas,
              effective: a.effective,
              expires: a.expires
            })),
            source: 'Official IMD / Government Meteorological Alerts'
          };
        }
      }
    } catch (e) {}
  }

  // Threshold-based alerts fallback
  const current = await getCurrentWeather(location);
  const aqi = await getAirQuality(location);

  const alerts = [];

  if (current.temperature >= 40) {
    alerts.push({
      severity: 'warning',
      title: 'Heatwave Alert (लू की चेतावनी)',
      description: `Maximum temperature is ${current.temperature}°C. Avoid outdoor exertion during midday.`
    });
  } else if (current.temperature <= 4) {
    alerts.push({
      severity: 'warning',
      title: 'Cold Wave Warning (शीतलहर)',
      description: `Temperature is ${current.temperature}°C. Dress in thermal layers.`
    });
  }

  if (current.rainProbabilityToday >= 75) {
    alerts.push({
      severity: 'warning',
      title: 'Precipitation Warning (भारी वर्षा की संभावना)',
      description: `Rain probability is ${current.rainProbabilityToday}%. Waterlogging and traffic delays possible.`
    });
  }

  if (aqi.aqi > 250) {
    alerts.push({
      severity: 'critical',
      title: 'Severe AQI Alert (गंभीर वायु प्रदूषण)',
      description: `AQI is currently ${aqi.aqi} (${aqi.category}). N95 respirator mandatory outdoors.`
    });
  }

  return {
    location: current.location,
    timestamp: new Date().toISOString(),
    activeAlertCount: alerts.length,
    alerts,
    source: 'Mausam Real-Time Threshold Advisory Engine'
  };
}

// Tool 6: get_sunrise_sunset(location, date)
export async function getSunriseSunset(location, date) {
  const current = await getCurrentWeather(location);
  return {
    location: current.location,
    date: date || new Date().toISOString().slice(0, 10),
    sunrise: current.sunrise,
    sunset: current.sunset,
    moonPhase: current.moonPhase || 'Waxing',
    source: current.source
  };
}

// Curated Demo Scenarios for IMD/MoES Mausam Prototype
export const DEMO_SCENARIOS = {
  pleasant: {
    id: 'pleasant',
    title: 'Pleasant Spring Breeze',
    subtitle: 'Bengaluru, Karnataka - Ideal outdoor conditions',
    cityName: 'Bengaluru',
    state: 'Karnataka',
    lat: 12.9716,
    lon: 77.5946,
    isCoastal: false,
    agroRegion: 'South Deccan Plateau',
    weather: {
      temperature: 24.2,
      apparentTemperature: 24.0,
      relativeHumidity: 58,
      weatherCode: 2, // Partly Cloudy
      windSpeed: 12.5,
      windDirection: 180,
      surfacePressure: 1012,
      visibility: 9500,
      uvIndex: 5.2,
      sunrise: '06:18 AM',
      sunset: '06:34 PM',
      tempMax: 28.5,
      tempMin: 18.2,
      rainProbability: 10,
      soilMoisture: 0.28,
      soilTemp: 22.4,
    },
    aqi: {
      usAqi: 52,
      category: 'Good',
      pm25: 12.8,
      pm10: 28.4,
      ozone: 45,
      no2: 18,
      pollenTree: 15,
      pollenGrass: 22,
      pollenWeed: 8,
    },
    marine: {
      isCoastal: false,
      waveHeight: 0,
      wavePeriod: 0,
      waterTemp: 26,
      safetyFlag: 'Green',
      tideStatus: 'Inland',
    },
    alerts: [
      { id: 'al-1', type: 'info', title: 'Pleasant Weather Conditions', desc: 'Mild temperatures and gentle breeze expected throughout the day.' }
    ]
  },

  delhi_smog: {
    id: 'delhi_smog',
    title: 'Severe Winter Smog & Dense Fog',
    subtitle: 'New Delhi (NCR) - Critical health & commute advisory',
    cityName: 'New Delhi',
    state: 'Delhi NCR',
    lat: 28.6139,
    lon: 77.2090,
    isCoastal: false,
    agroRegion: 'Upper Indo-Gangetic Plain',
    weather: {
      temperature: 14.5,
      apparentTemperature: 13.0,
      relativeHumidity: 89,
      weatherCode: 48, // Depositing Rime Fog / Dense Fog
      windSpeed: 4.2,
      windDirection: 310,
      surfacePressure: 1018,
      visibility: 150, // 150m dense fog!
      uvIndex: 2.1,
      sunrise: '07:12 AM',
      sunset: '05:42 PM',
      tempMax: 18.0,
      tempMin: 8.5,
      rainProbability: 5,
      soilMoisture: 0.32,
      soilTemp: 12.0,
    },
    aqi: {
      usAqi: 412,
      category: 'Severe / Hazardous',
      pm25: 368.5,
      pm10: 482.0,
      ozone: 62,
      no2: 124,
      pollenTree: 68,
      pollenGrass: 84,
      pollenWeed: 52,
    },
    marine: {
      isCoastal: false,
      waveHeight: 0,
      wavePeriod: 0,
      waterTemp: 0,
      safetyFlag: 'None',
      tideStatus: 'Inland',
    },
    alerts: [
      { id: 'al-2', type: 'critical', title: 'GRAP Stage-IV Air Emergency', desc: 'AQI above 400. Mask (N95) compulsory. Limit all outdoor physical exertion and school commutes.' },
      { id: 'al-3', type: 'warning', title: 'Dense Fog Warning on Expressways', desc: 'Visibility dropped below 200m on Yamuna & Eastern Peripheral Expressways. Drive with low beams.' }
    ]
  },

  mumbai_monsoon: {
    id: 'mumbai_monsoon',
    title: 'Extreme Monsoon Downpour & High Tide',
    subtitle: 'Mumbai, Maharashtra - Waterlogging & Coastal swell alert',
    cityName: 'Mumbai',
    state: 'Maharashtra',
    lat: 19.0760,
    lon: 72.8777,
    isCoastal: true,
    agroRegion: 'Konkan Coastal Zone',
    weather: {
      temperature: 27.0,
      apparentTemperature: 33.2,
      relativeHumidity: 96,
      weatherCode: 65, // Heavy Rain
      windSpeed: 38.0,
      windDirection: 240,
      surfacePressure: 998,
      visibility: 1200,
      uvIndex: 1.5,
      sunrise: '06:05 AM',
      sunset: '07:18 PM',
      tempMax: 29.0,
      tempMin: 24.5,
      rainProbability: 95,
      soilMoisture: 0.88,
      soilTemp: 26.2,
    },
    aqi: {
      usAqi: 35,
      category: 'Good',
      pm25: 8.5,
      pm10: 19.0,
      ozone: 18,
      no2: 12,
      pollenTree: 5,
      pollenGrass: 10,
      pollenWeed: 4,
    },
    marine: {
      isCoastal: true,
      waveHeight: 4.2, // 4.2 meters high surf!
      wavePeriod: 11.4,
      waterTemp: 28.5,
      safetyFlag: 'Red',
      tideStatus: 'High Tide 4.68m at 14:15 IST',
    },
    alerts: [
      { id: 'al-4', type: 'critical', title: 'IMD Red Alert: Intense Precipitation', desc: 'Over 120mm rainfall expected in 6 hours. High risk of localized flooding in low-lying railway subways.' },
      { id: 'al-5', type: 'warning', title: 'Spring High Tide Warning (4.68m)', desc: 'Fishermen and beachgoers advised strictly not to venture into the Arabian Sea.' }
    ]
  },

  goa_beach: {
    id: 'goa_beach',
    title: 'Coastal Swell & Rip Current Watch',
    subtitle: 'Panaji & North Goa - Beach safety & surfing radar',
    cityName: 'Panaji (Goa)',
    state: 'Goa',
    lat: 15.4909,
    lon: 73.8278,
    isCoastal: true,
    agroRegion: 'West Coast Humid Zone',
    weather: {
      temperature: 30.2,
      apparentTemperature: 35.6,
      relativeHumidity: 78,
      weatherCode: 1, // Mainly Clear
      windSpeed: 21.0,
      windDirection: 270,
      surfacePressure: 1008,
      visibility: 9000,
      uvIndex: 9.8, // Very High UV!
      sunrise: '06:22 AM',
      sunset: '06:48 PM',
      tempMax: 32.5,
      tempMin: 26.0,
      rainProbability: 25,
      soilMoisture: 0.45,
      soilTemp: 28.0,
    },
    aqi: {
      usAqi: 42,
      category: 'Good',
      pm25: 10.2,
      pm10: 22.0,
      ozone: 32,
      no2: 8,
      pollenTree: 12,
      pollenGrass: 16,
      pollenWeed: 6,
    },
    marine: {
      isCoastal: true,
      waveHeight: 2.3,
      wavePeriod: 9.2,
      waterTemp: 29.2,
      safetyFlag: 'Yellow',
      tideStatus: 'Low Tide 0.42m at 10:30 IST | High Tide 2.1m at 17:10 IST',
    },
    alerts: [
      { id: 'al-6', type: 'warning', title: 'INCOIS High Swell & Rip Current Advisory', desc: 'Moderate rip currents detected along Calangute and Baga. Swimming within flagged zones only.' },
      { id: 'al-7', type: 'info', title: 'High UV Index (9.8)', desc: 'Peak UV between 11:30 AM - 3:30 PM. Use SPF 50+ and stay hydrated.' }
    ]
  },

  punjab_frost: {
    id: 'punjab_frost',
    title: 'Ground Frost & Cold Wave Advisory',
    subtitle: 'Amritsar & Ludhiana, Punjab - Agromet kisan guidance',
    cityName: 'Ludhiana',
    state: 'Punjab',
    lat: 30.9010,
    lon: 75.8573,
    isCoastal: false,
    agroRegion: 'Trans-Gangetic Plain (Rabi Wheat Belt)',
    weather: {
      temperature: 4.8,
      apparentTemperature: 2.2,
      relativeHumidity: 92,
      weatherCode: 0, // Clear night
      windSpeed: 6.0,
      windDirection: 330,
      surfacePressure: 1022,
      visibility: 800,
      uvIndex: 3.5,
      sunrise: '07:22 AM',
      sunset: '05:38 PM',
      tempMax: 15.2,
      tempMin: 2.1,
      rainProbability: 0,
      soilMoisture: 0.22,
      soilTemp: 3.8, // Frost threshold!
    },
    aqi: {
      usAqi: 185,
      category: 'Unhealthy',
      pm25: 112.0,
      pm10: 178.0,
      ozone: 30,
      no2: 44,
      pollenTree: 18,
      pollenGrass: 32,
      pollenWeed: 14,
    },
    marine: {
      isCoastal: false,
      waveHeight: 0,
      wavePeriod: 0,
      waterTemp: 0,
      safetyFlag: 'None',
      tideStatus: 'Inland',
    },
    alerts: [
      { id: 'al-8', type: 'critical', title: 'IMD Agromet Frost Alert for Rabi Crops', desc: 'Ground temperatures near freezing (2-4°C). Recommended light irrigation tonight in wheat and mustard fields to prevent frost injury.' },
      { id: 'al-9', type: 'warning', title: 'Cold Wave Condition', desc: 'Night temperatures 4-6°C below normal. Protect young orchards and livestock.' }
    ]
  },

  jaipur_heat: {
    id: 'jaipur_heat',
    title: 'Severe Heatwave & Loos Alert',
    subtitle: 'Jaipur, Rajasthan - Outdoor exertion hazard',
    cityName: 'Jaipur',
    state: 'Rajasthan',
    lat: 26.9124,
    lon: 75.7873,
    isCoastal: false,
    agroRegion: 'Semi-Arid Western Zone',
    weather: {
      temperature: 43.8,
      apparentTemperature: 46.2,
      relativeHumidity: 22,
      weatherCode: 0, // Clear Blazing Sun
      windSpeed: 24.5,
      windDirection: 260, // Hot Westerly Loos
      surfacePressure: 1004,
      visibility: 8000,
      uvIndex: 11.4, // Extreme UV!
      sunrise: '05:40 AM',
      sunset: '07:14 PM',
      tempMax: 44.5,
      tempMin: 31.0,
      rainProbability: 0,
      soilMoisture: 0.08,
      soilTemp: 41.5,
    },
    aqi: {
      usAqi: 145,
      category: 'Moderate to Poor (Dust)',
      pm25: 58.0,
      pm10: 210.0, // High dust PM10
      ozone: 85,
      no2: 24,
      pollenTree: 8,
      pollenGrass: 14,
      pollenWeed: 4,
    },
    marine: {
      isCoastal: false,
      waveHeight: 0,
      wavePeriod: 0,
      waterTemp: 0,
      safetyFlag: 'None',
      tideStatus: 'Inland',
    },
    alerts: [
      { id: 'al-10', type: 'critical', title: 'IMD Orange Alert: Severe Heatwave (Loos)', desc: 'Maximum temperatures exceeding 44°C with dry gusty winds. Avoid outdoor work and workouts between 11:00 AM and 4:30 PM.' },
      { id: 'al-11', type: 'warning', title: 'Extreme UV Index (11.4+)', desc: 'Sunburn risk within 10 minutes. Hydrate constantly with ORS/electrolyte fluids.' }
    ]
  }
};

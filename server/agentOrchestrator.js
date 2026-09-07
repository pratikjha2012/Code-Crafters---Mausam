import { 
  getCurrentWeather, 
  getHourlyForecast, 
  getDailyForecast, 
  getAirQuality, 
  getWeatherAlerts, 
  getSunriseSunset 
} from './weatherTools.js';

const UNRELATED_REJECTION_MESSAGE = "I'm Mausam Assistant. I can help with weather forecasts, weather alerts, air quality, and other weather-related information. Please ask me something about the weather.";

// Keywords that indicate legitimate weather or meteorological interest
const WEATHER_KEYWORDS = [
  'weather', 'temperature', 'temp', 'rain', 'rainy', 'raining', 'forecast', 'precipitation',
  'snow', 'snowfall', 'wind', 'windy', 'breeze', 'storm', 'thunderstorm', 'lightning',
  'cloud', 'cloudy', 'sunny', 'sunshine', 'sun', 'uv', 'ultraviolet', 'humidity', 'humid',
  'fog', 'foggy', 'smog', 'mist', 'haze', 'visibility', 'aqi', 'air quality', 'pollution',
  'pm2.5', 'pm10', 'pollen', 'allergy', 'asthma', 'heat', 'heatwave', 'cold', 'coldwave',
  'frost', 'chill', 'sunrise', 'sunset', 'dawn', 'dusk', 'umbrella', 'jacket', 'coat',
  'running', 'jogging', 'workout', 'outdoor', 'commute', 'traffic', 'flight', 'cyclone',
  'barish', 'mausam', 'tapman', 'hawa', 'kohra', 'garmi', 'sardi', 'pala', 'fasal',
  'chata', 'aandhi', 'toofan', 'dhoop', 'aaj', 'kal', 'parson', 'samay', 'ghante',
  // Hindi script keywords
  'मौसम', 'बारिश', 'तापमान', 'हवा', 'कोहरा', 'गर्मी', 'सर्दी', 'छाता', 'तूफान', 'धूप', 'आज', 'कल', 'वायु', 'प्रदूषण'
];

// Keywords that indicate non-weather / unrelated queries
const UNRELATED_KEYWORDS = [
  'python', 'javascript', 'code', 'coding', 'program', 'function', 'class', 'html', 'css',
  'joke', 'riddle', 'story', 'song', 'poem', 'movie', 'actor', 'cricket', 'match', 'football',
  'score', 'quantum', 'physics', 'math', 'algebra', 'calculus', 'history', 'war', 'president',
  'prime minister', 'election', 'politics', 'recipe', 'cook', 'food', 'bitcoin', 'crypto', 'stock'
];

// Helper: Determine if query is weather-related
export function isWeatherQuery(query) {
  const q = query.toLowerCase().trim();

  // Explicit check for known unrelated words
  for (const word of UNRELATED_KEYWORDS) {
    // Only if word appears as a distinct token
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    if (regex.test(q)) {
      // Unless it explicitly combines with weather (e.g. "python script to fetch weather")
      if (!q.includes('weather') && !q.includes('mausam')) {
        return false;
      }
    }
  }

  // Check if any weather keyword matches
  for (const kw of WEATHER_KEYWORDS) {
    if (q.includes(kw)) return true;
  }

  // Quick greetings or conversational fillers in weather context
  if (['hi', 'hello', 'hey', 'namaste', 'नमस्ते', 'help'].includes(q)) {
    return true;
  }

  // If query is very short or unclear, treat as potential weather question
  return false;
}

// Helper: Detect language (English vs Hindi or other)
export function detectLanguage(text) {
  if (/[\u0900-\u097F]/.test(text)) return 'hi';
  const hindiWords = ['kya', 'hogi', 'aaj', 'kal', 'hoga', 'mausam', 'barish', 'kitna', 'batao', 'chahiye'];
  const lower = text.toLowerCase();
  for (const w of hindiWords) {
    if (new RegExp(`\\b${w}\\b`).test(lower)) return 'hi';
  }
  return 'en';
}

// Conversation context store (keyed by sessionId or ephemeral)
const conversationMemory = new Map();

export function getSessionContext(sessionId) {
  if (!sessionId) return { location: 'New Delhi', date: null, time: null, topic: 'current', language: 'en' };
  if (!conversationMemory.has(sessionId)) {
    conversationMemory.set(sessionId, {
      location: 'New Delhi',
      date: null,
      time: null,
      topic: 'current',
      language: 'en',
      history: []
    });
  }
  return conversationMemory.get(sessionId);
}

export function updateSessionContext(sessionId, updates) {
  if (!sessionId) return;
  const ctx = getSessionContext(sessionId);
  Object.assign(ctx, updates);
  conversationMemory.set(sessionId, ctx);
}

// Extract location, date, time and parameters from query
export function extractQueryEntities(query, sessionContext) {
  const q = query.toLowerCase();
  let location = sessionContext?.location || 'New Delhi';
  let date = new Date().toISOString().slice(0, 10);
  let hour = null;
  let topic = 'current';

  // Extract common Indian & international cities
  const cityMatches = [
    'new delhi', 'delhi', 'mumbai', 'bengaluru', 'bangalore', 'chennai', 'kolkata',
    'hyderabad', 'pune', 'jaipur', 'ahmedabad', 'lucknow', 'kanpur', 'patna', 'shimla',
    'srinagar', 'goa', 'panaji', 'kochi', 'cochin', 'varanasi', 'guwahati', 'chandigarh',
    'bhopal', 'indore', 'london', 'new york', 'dubai', 'tokyo', 'paris', 'singapore'
  ];

  for (const city of cityMatches) {
    if (q.includes(city)) {
      location = city.charAt(0).toUpperCase() + city.slice(1);
      if (city === 'bangalore') location = 'Bengaluru';
      if (city === 'delhi') location = 'New Delhi';
      break;
    }
  }

  // Date resolution
  const now = new Date();
  if (q.includes('tomorrow') || q.includes('kal') || q.includes('कल')) {
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    date = tomorrow.toISOString().slice(0, 10);
    topic = 'tomorrow';
  } else if (q.includes('day after tomorrow') || q.includes('parson') || q.includes('परसों')) {
    const dayAfter = new Date(now.getTime() + 48 * 60 * 60 * 1000);
    date = dayAfter.toISOString().slice(0, 10);
    topic = 'forecast';
  } else if (q.includes('7 day') || q.includes('week') || q.includes('सप्ताह')) {
    topic = '7-day';
  }

  // Time / Hour extraction (e.g. "6 pm", "7:00 am", "18:00", "शाम 6 बजे")
  const hourMatch = q.match(/(\d{1,2})\s*(pm|am| बजे)/i);
  if (hourMatch) {
    let h = parseInt(hourMatch[1], 10);
    const meridiem = (hourMatch[2] || '').toLowerCase();
    if (meridiem.includes('pm') && h < 12) h += 12;
    if (meridiem.includes('am') && h === 12) h = 0;
    hour = h;
  }

  // Topic determination
  if (q.includes('rain') || q.includes('barish') || q.includes('umbrella') || q.includes('बारिश') || q.includes('छाता')) {
    topic = 'rain';
  } else if (q.includes('aqi') || q.includes('air') || q.includes('smog') || q.includes('pollen') || q.includes('asthma') || q.includes('हवा')) {
    topic = 'aqi';
  } else if (q.includes('alert') || q.includes('warning') || q.includes('danger') || q.includes('चेतावनी')) {
    topic = 'alerts';
  } else if (q.includes('sun') || q.includes('sunrise') || q.includes('sunset') || q.includes('सूर्योदय') || q.includes('सूर्यास्त')) {
    topic = 'sun';
  } else if (q.includes('run') || q.includes('jog') || q.includes('workout') || q.includes('outdoor') || q.includes('दौड़')) {
    topic = 'activity';
  } else if (q.includes('wind') || q.includes('हवा')) {
    topic = 'wind';
  }

  return { location, date, hour, topic };
}

// Generate 2-4 contextually relevant follow-up suggestion chips
export function generateFollowUps(topic, location, lang) {
  const isHi = lang === 'hi';
  switch (topic) {
    case 'rain':
      return isHi 
        ? [`🌡️ ${location} का आज का तापमान`, `💨 हवा की गति`, `⚠️ कोई मौसम चेतावनी?`, `🌅 सूर्यास्त का समय`]
        : [`🌡️ Today's temperature in ${location}`, `💨 Wind conditions`, `⚠️ Any severe alerts?`, `🌅 Sunset time`];
    case 'aqi':
      return isHi
        ? [`🫁 क्या दमा मरीजों के लिए बाहर जाना सुरक्षित है?`, `🌧️ आज बारिश होगी?`, `☀️ यूवी इंडेक्स कितना है?`]
        : [`🫁 Is it safe for asthma/allergies?`, `🌧️ Will it rain today?`, `☀️ What is the UV Index?`];
    case 'activity':
      return isHi
        ? [`💧 कितना पानी पीना चाहिए?`, `☀️ यूवी इंडेक्स`, `🌧️ शाम को बारिश होगी?`]
        : [`💧 Hydration recommendation`, `☀️ Solar UV index`, `🌧️ Evening rain probability`];
    default:
      return isHi
        ? [`🌧️ आज बारिश होगी क्या?`, `🫁 ${location} का एक्यूआई (AQI)`, `📅 7-दिन का पूर्वानुमान`, `🌅 सूर्योदय और सूर्यास्त`]
        : [`🌧️ Will it rain today?`, `🫁 Air Quality in ${location}`, `📅 7-Day Forecast`, `🌅 Sunrise & Sunset`];
  }
}

// Main AI Agent Execution Function
export async function executeWeatherAgent({ message, sessionId, userLocation, preferredLanguage }) {
  // 1. Weather Intent Classification Guardrail
  if (!isWeatherQuery(message)) {
    return {
      text: UNRELATED_REJECTION_MESSAGE,
      toolCalls: [],
      followUps: [
        '🌧️ Will it rain today?',
        '🌡️ Today\'s temperature',
        '⚠️ Active weather alerts',
        '📅 7-day forecast'
      ],
      language: 'en',
      source: 'Mausam Guardrail'
    };
  }

  // 2. Language & Context Setup
  const detectedLang = preferredLanguage || detectLanguage(message);
  const isHi = detectedLang === 'hi';
  const session = getSessionContext(sessionId);

  // If client provided a real GPS userLocation, seed it as default
  if (userLocation && !session.hasManualOverride) {
    session.location = userLocation;
  }

  // 3. Extract entities and resolve multi-turn conversational context
  const { location, date, hour, topic } = extractQueryEntities(message, session);

  // Update session context
  updateSessionContext(sessionId, {
    location,
    date,
    time: hour,
    topic,
    language: detectedLang
  });

  // 4. Tool-based Execution against REAL Live Meteorological APIs
  let resultText = '';
  const executedTools = [];

  try {
    if (topic === 'rain') {
      if (hour !== null) {
        // Hourly rain check
        executedTools.push({ tool: 'get_hourly_forecast', location, date, hour });
        const data = await getHourlyForecast(location, date, hour);
        const target = data.forecast?.[0];
        if (target) {
          resultText = isHi
            ? `${data.location} में ${date} को ${hour}:00 बजे वर्षा की संभावना ${target.rainProbability}% है। तापमान लगभग ${target.temperature}°C और मौसम ${target.conditionHindi} रहेगा। ${target.rainProbability >= 50 ? 'छाता या रेनकोट साथ रखना आवश्यक है।' : 'बारिश की संभावना कम है।'}`
            : `In ${data.location} at ${hour}:00 on ${date}, the rain probability is ${target.rainProbability}%. Expected temperature is ${target.temperature}°C with ${target.condition.toLowerCase()}. ${target.rainProbability >= 50 ? 'Carrying an umbrella is recommended.' : 'Rain probability is low.'}`;
        } else {
          const cur = await getCurrentWeather(location);
          resultText = isHi
            ? `${cur.location} में आज वर्षा की संभावना लगभग ${cur.rainProbabilityToday}% है। स्थिति: ${cur.conditionHindi}।`
            : `In ${cur.location}, the maximum rain probability today is ${cur.rainProbabilityToday}%. Current condition: ${cur.condition}.`;
        }
      } else {
        // Daily / Today rain check
        executedTools.push({ tool: 'get_current_weather', location });
        const cur = await getCurrentWeather(location);
        resultText = isHi
          ? `${cur.location} में आज वर्षा की अधिकतम संभावना ${cur.rainProbabilityToday}% है। वर्तमान मौसम ${cur.conditionHindi} है और तापमान ${cur.temperature}°C (महसूस: ${cur.feelsLike}°C) है। ${cur.rainProbabilityToday >= 50 ? '🌧️ आज बारिश की संभावना काफी अधिक है, बाहर जाते समय छाता अवश्य साथ रखें।' : '☀️ आज भारी बारिश की संभावना कम है।'}`
          : `In ${cur.location}, the rain probability today is ${cur.rainProbabilityToday}%. The current condition is ${cur.condition.toLowerCase()} with a temperature of ${cur.temperature}°C (feels like ${cur.feelsLike}°C). ${cur.rainProbabilityToday >= 50 ? '🌧️ Rain is likely; an umbrella or raincoat is advised.' : '☀️ Low chance of precipitation today.'}`;
      }
    } else if (topic === 'aqi') {
      executedTools.push({ tool: 'get_air_quality', location });
      const aqiData = await getAirQuality(location);
      resultText = isHi
        ? `${aqiData.location} में वर्तमान वायु गुणवत्ता सूचकांक (AQI) ${aqiData.aqi} (${aqiData.categoryHindi}) है। मुख्य प्रदूषक PM2.5 स्तर ${aqiData.pm25} µg/m³ और PM10 ${aqiData.pm10} µg/m³ है। घास का पराग स्तर ${aqiData.pollenGrass} grains/m³ है। ${aqiData.aqi > 150 ? '⚠️ संवेदनशील समूहों और दमा के मरीजों को बाहरी शारीरिक गतिविधियों से बचना चाहिए और N95 मास्क पहनना चाहिए।' : '✅ वायु गुणवत्ता अनुकूल है।'}`
        : `The Air Quality Index (AQI) in ${aqiData.location} is currently ${aqiData.aqi} (${aqiData.category}). PM2.5 is at ${aqiData.pm25} µg/m³, PM10 at ${aqiData.pm10} µg/m³, and grass pollen at ${aqiData.pollenGrass} grains/m³. ${aqiData.aqi > 150 ? '⚠️ Vulnerable individuals and asthmatics should avoid strenuous outdoor exertion and wear an N95 mask.' : '✅ Air quality is within safe limits for outdoor activities.'}`;
    } else if (topic === 'alerts') {
      executedTools.push({ tool: 'get_weather_alerts', location });
      const alertData = await getWeatherAlerts(location);
      const topAlert = alertData.alerts[0];
      resultText = isHi
        ? `${alertData.location} के लिए मौसम चेतावनी स्थिति: ${topAlert.title} — ${topAlert.description}`
        : `Active weather advisory for ${alertData.location}: ${topAlert.title} — ${topAlert.description}`;
    } else if (topic === 'sun') {
      executedTools.push({ tool: 'get_sunrise_sunset', location });
      const sunData = await getSunriseSunset(location, date);
      resultText = isHi
        ? `${sunData.location} में आज सूर्योदय का समय ${sunData.sunrise} और सूर्यास्त का समय ${sunData.sunset} है।`
        : `In ${sunData.location}, sunrise is at ${sunData.sunrise} and sunset is at ${sunData.sunset}.`;
    } else if (topic === '7-day') {
      executedTools.push({ tool: 'get_daily_forecast', location, numberOfDays: 7 });
      const f = await getDailyForecast(location, date, 7);
      const daysSummary = f.days.slice(0, 4).map(d => `${d.date.slice(5)}: ${d.tempMax}°C/${d.tempMin}°C (${isHi ? d.conditionHindi : d.condition})`).join(' | ');
      resultText = isHi
        ? `${f.location} के लिए 7-दिवसीय मौसम दृष्टिकोण: ${daysSummary}। अधिकतम वर्षा की संभावना आगामी दिनों में दर्ज की जाएगी।`
        : `7-day outlook for ${f.location}: ${daysSummary}. Complete day-by-day telemetry is active.`;
    } else {
      // General current weather
      executedTools.push({ tool: 'get_current_weather', location });
      const cur = await getCurrentWeather(location);
      resultText = isHi
        ? `${cur.location} में वर्तमान मौसम ${cur.conditionHindi} है। तापमान ${cur.temperature}°C (महसूस: ${cur.feelsLike}°C) है। आर्द्रता ${cur.humidity}%, हवा की गति ${cur.windSpeed} km/h और आज वर्षा की संभावना ${cur.rainProbabilityToday}% है।`
        : `Currently in ${cur.location}, the weather is ${cur.condition.toLowerCase()}. The temperature is ${cur.temperature}°C (feels like ${cur.feelsLike}°C) with ${cur.humidity}% humidity, wind at ${cur.windSpeed} km/h, and a rain probability of ${cur.rainProbabilityToday}%.`;
    }
  } catch (err) {
    console.error('Tool execution failed:', err);
    resultText = isHi
      ? "मैं इस समय नवीनतम मौसम डेटा प्राप्त करने में असमर्थ हूँ। कृपया कुछ क्षण बाद पुनः प्रयास करें।"
      : "I'm unable to retrieve the latest weather data right now. Please try again in a moment.";
  }

  // 5. Follow-up Suggestions
  const followUps = generateFollowUps(topic, location, detectedLang);

  return {
    text: resultText,
    location,
    date,
    topic,
    toolCalls: executedTools,
    followUps,
    language: detectedLang,
    source: 'Real Live NWP Telemetry'
  };
}

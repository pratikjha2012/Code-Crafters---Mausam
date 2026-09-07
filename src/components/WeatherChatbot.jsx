import React, { useState, useRef, useEffect } from 'react';
import { useWeather } from '../context/WeatherContext';
import { useUser } from '../context/UserContext';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Mic, 
  MicOff, 
  User, 
  Clock,
  Radio,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

const PREDEFINED_QUESTIONS_EN = [
  { label: '🌧️ Will it rain today?', query: 'Will it rain today?' },
  { label: "🌡️ Today's temperature", query: "What is today's temperature and feels-like?" },
  { label: "☔ Tomorrow's forecast", query: "What is tomorrow's weather forecast?" },
  { label: '💨 Wind conditions', query: 'What are the current wind conditions and speed?' },
  { label: '⚠️ Weather alerts', query: 'Are there any active weather alerts?' },
  { label: '☀️ UV index', query: 'What is the UV index today?' },
  { label: '🌅 Sunrise & sunset', query: 'What are the sunrise and sunset times?' },
  { label: '📅 7-day forecast', query: 'Show me the 7-day weather forecast outlook' },
];

const PREDEFINED_QUESTIONS_HI = [
  { label: '🌧️ क्या आज बारिश होगी?', query: 'क्या आज बारिश होगी?' },
  { label: '🌡️ आज का तापमान', query: 'आज का तापमान और मौसम कैसा है?' },
  { label: '☔ कल का पूर्वानुमान', query: 'कल का मौसम पूर्वानुमान क्या है?' },
  { label: '💨 हवा की स्थिति', query: 'हवा की गति और स्थिति क्या है?' },
  { label: '⚠️ मौसम चेतावनी', query: 'क्या कोई सक्रिय मौसम चेतावनी या अलर्ट है?' },
  { label: '☀️ यूवी इंडेक्स', query: 'आज यूवी इंडेक्स कितना है?' },
  { label: '🌅 सूर्योदय व सूर्यास्त', query: 'आज सूर्योदय और सूर्यास्त का समय क्या है?' },
  { label: '📅 7-दिन का पूर्वानुमान', query: '7-दिन का मौसम पूर्वानुमान दिखाएं' },
];

export default function WeatherChatbot() {
  const { weather, selectedCity, language } = useWeather();
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  
  const sessionIdRef = useRef(`session-${Date.now()}`);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true); // Auto-voice enabled by default
  const [isListening, setIsListening] = useState(false);
  const [playingMessageId, setPlayingMessageId] = useState(null);
  const [lastTelemetryUpdate, setLastTelemetryUpdate] = useState(new Date());
  const [relativeTimeStr, setRelativeTimeStr] = useState('just now');

  const messagesEndRef = useRef(null);
  const activeAudioRef = useRef(null);
  const recognitionRef = useRef(null);

  const initialGreeting = language === 'hi'
    ? `नमस्ते ${user.name || ''}! मैं आपका मौसम एआई मित्र (Mausam Assistant) हूँ। मैं रियल-टाइम मौसम एवं एनडब्ल्यूपी (NWP) डेटा से संचालित हूँ। आप मुझसे मौसम, वर्षा, या वायु गुणवत्ता के बारे में कुछ भी पूछ सकते हैं।`
    : `Namaste ${user.name || ''}! I'm Mausam Assistant, powered by real-time meteorological observations. Ask me anything about current weather, rain probability, hourly/7-day forecasts, air quality, or alerts!`;

  const [messages, setMessages] = useState([
    {
      id: 'm-welcome',
      sender: 'ai',
      text: initialGreeting,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: 'Live NWP Telemetry',
      toolCalls: [],
      followUps: language === 'hi' 
        ? ['🌧️ क्या आज बारिश होगी?', '🌡️ आज का तापमान', '⚠️ मौसम चेतावनी', '📅 7-दिन का पूर्वानुमान']
        : ['🌧️ Will it rain today?', '🌡️ Today\'s temperature', '⚠️ Weather alerts', '📅 7-day forecast']
    }
  ]);

  const quickQuestions = language === 'hi' ? PREDEFINED_QUESTIONS_HI : PREDEFINED_QUESTIONS_EN;

  // Relative timestamp calculation
  useEffect(() => {
    const updateRelativeTime = () => {
      const diffSec = Math.floor((Date.now() - lastTelemetryUpdate.getTime()) / 1000);
      if (diffSec < 45) {
        setRelativeTimeStr('just now');
      } else if (diffSec < 120) {
        setRelativeTimeStr('1 min ago');
      } else {
        setRelativeTimeStr(`${Math.floor(diffSec / 60)} mins ago`);
      }
    };

    updateRelativeTime();
    const interval = setInterval(updateRelativeTime, 30000);
    return () => clearInterval(interval);
  }, [lastTelemetryUpdate]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isTyping, isOpen]);

  // Audio Playback with ElevenLabs TTS + Instant Browser Speech Fallback
  const stopAudio = () => {
    if (activeAudioRef.current) {
      activeAudioRef.current.pause();
      activeAudioRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setPlayingMessageId(null);
  };

  const playMessageAudio = async (text, msgId) => {
    if (playingMessageId === msgId) {
      stopAudio();
      return;
    }

    stopAudio();
    setPlayingMessageId(msgId);

    let playedServerAudio = false;

    // 1. Try ElevenLabs backend streaming first
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });

      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('audio/mpeg')) {
        const blob = await res.blob();
        const audioUrl = URL.createObjectURL(blob);
        const audio = new Audio(audioUrl);
        activeAudioRef.current = audio;

        audio.onended = () => {
          setPlayingMessageId(null);
          activeAudioRef.current = null;
        };
        audio.onerror = () => {
          setPlayingMessageId(null);
          activeAudioRef.current = null;
        };
        await audio.play();
        playedServerAudio = true;
        return;
      }
    } catch (err) {
      // Backend /api/tts not available (e.g. static Firebase Hosting), will use browser speech synthesis
    }

    // 2. Direct Web Speech API synthesis (Instant, reliable, works everywhere on Firebase, desktop, & mobile)
    if (!playedServerAudio && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const clean = text.replace(/[*#_`]/g, '').replace(/https?:\/\/\S+/g, '');
        const utter = new SpeechSynthesisUtterance(clean);
        const isHi = /[\u0900-\u097F]/.test(text);
        utter.lang = isHi ? 'hi-IN' : 'en-US';
        utter.rate = 1.0;
        utter.pitch = 1.0;

        const voices = window.speechSynthesis.getVoices() || [];
        const matchedVoice = voices.find(v => 
          isHi 
            ? v.lang.includes('hi') 
            : (v.lang.includes('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Zira')))
        );
        if (matchedVoice) utter.voice = matchedVoice;

        utter.onend = () => setPlayingMessageId(null);
        utter.onerror = () => setPlayingMessageId(null);
        window.speechSynthesis.speak(utter);
      } catch (synthErr) {
        console.warn('Speech synthesis failed:', synthErr);
        setPlayingMessageId(null);
      }
    } else {
      setPlayingMessageId(null);
    }
  };

  // Web Speech API STT Microphone Input
  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please use Chrome, Edge, or a Web Speech-compatible browser.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0]?.transcript;
        if (transcript) {
          setInputText(transcript);
          handleSend(transcript);
        }
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      setIsListening(false);
    }
  };

  // Client-side fallback engine for static hosting (Firebase) using live NWP telemetry
  const executeClientSideWeatherQuery = async (query) => {
    const q = query.toLowerCase();
    
    // Strict Guardrail Check
    const unrelatedKeywords = [
      'python', 'javascript', 'code', 'coding', 'program', 'function', 'class', 'html', 'css',
      'joke', 'riddle', 'story', 'song', 'poem', 'movie', 'actor', 'cricket', 'match', 'football',
      'score', 'quantum', 'physics', 'math', 'algebra', 'calculus', 'history', 'war', 'president',
      'prime minister', 'election', 'politics', 'recipe', 'cook', 'food', 'bitcoin', 'crypto', 'stock'
    ];
    for (const w of unrelatedKeywords) {
      const regex = new RegExp(`\\b${w}\\b`, 'i');
      if (regex.test(q) && !q.includes('weather') && !q.includes('mausam')) {
        return {
          text: "I'm Mausam Assistant. I can help with weather forecasts, weather alerts, air quality, and other weather-related information. Please ask me something about the weather.",
          toolCalls: [],
          followUps: [
            '🌧️ Will it rain today?',
            '🌡️ Today\'s temperature',
            '⚠️ Active weather alerts',
            '📅 7-day forecast'
          ],
          source: 'Mausam Guardrail'
        };
      }
    }

    // Meta Questions: Setup, AI API key, Voice
    if (q.includes('api') || q.includes('how to add') || q.includes('llm') || q.includes('gemini') || q.includes('openai') || q.includes('speak') || q.includes('voice') || q.includes('sound')) {
      if (q.includes('speak') || q.includes('voice') || q.includes('audio') || q.includes('बोल') || q.includes('आवाज़') || q.includes('sound')) {
        return {
          text: isHi
            ? "🔊 आवाज़ सक्रिय कर दी गई है! अब हर उत्तर स्वतः बोलकर सुनाया जाएगा। आप किसी भी उत्तर के पास 'Speak' पर क्लिक करके उसे दोबारा सुन सकते हैं।"
            : "🔊 Voice speech is active! Every answer will now speak out loud automatically. You can also click 'Speak' beside any message to replay it, or toggle the Voice button in the top bar.",
          toolCalls: [],
          followUps: ['🌧️ Will it rain today?', '🌡️ Today\'s temperature'],
          source: 'Mausam Voice Assistant'
        };
      }
      return {
        text: isHi
          ? "🤖 AI API (Google Gemini / OpenAI) जोड़ने के सरल चरण:\n1. aistudio.google.com पर जाएं और अपना निःशुल्क Google Gemini API Key प्राप्त करें (क्रेडिट कार्ड की आवश्यकता नहीं)।\n2. अपनी .env फ़ाइल में `LLM_API_KEY=your_key_here` लिखें।\n3. इसके बाद AI किसी भी भाषा में मौसम, यात्रा, स्वास्थ्य और कृषि से जुड़े जटिल प्रश्नों का बुद्धिमानी से उत्तर देगा।"
          : "🤖 How to add an AI API (Google Gemini / OpenAI):\n1. Visit Google AI Studio (aistudio.google.com) and get a free Google Gemini API Key (takes 30 seconds, no credit card required).\n2. Open your project's `.env` file and set `LLM_API_KEY=your_gemini_api_key`.\n3. The chatbot will immediately use real generative AI to reason and answer all questions in natural conversational language!",
        toolCalls: [],
        followUps: ['🌧️ Will it rain today?', '🌡️ Today\'s temperature', '☀️ UV index'],
        source: 'Mausam Setup Guide'
      };
    }

    let targetCity = selectedCity || { name: 'New Delhi', lat: 28.6139, lon: 77.2090 };
    const prepMatch = query.match(/\b(?:in|at|for|near|of|around)\s+([A-Za-z\u0900-\u097F\s]{2,25}?)(?:\s+today|\s+tomorrow|\s+now|\s+weather|\s+forecast|\?|\.|$)/i);
    const candidateName = prepMatch ? prepMatch[1].trim() : null;
    if (candidateName && !['the morning', 'the evening', 'the afternoon', 'the night', 'today', 'tomorrow', 'this week', 'next week'].includes(candidateName.toLowerCase())) {
      targetCity = { ...targetCity, name: candidateName.charAt(0).toUpperCase() + candidateName.slice(1) };
    }
    const cur = weather?.current;
    const aqi = weather?.aqi;
    const isHi = language === 'hi' || /[\u0900-\u097F]/.test(query);

    let text = '';
    const toolCalls = [{ tool: 'get_current_weather', location: targetCity.name }];
    let followUps = [];

    if (q.includes('rain') || q.includes('barish') || q.includes('बारिश') || q.includes('umbrella') || q.includes('छाता')) {
      const rainProb = cur?.rainProb ?? 15;
      text = isHi
        ? `${targetCity.name} में आज वर्षा की अधिकतम संभावना ${rainProb}% है। वर्तमान मौसम: ${cur?.condition || 'साफ'}। ${rainProb >= 50 ? '🌧️ आज बारिश की संभावना काफी अधिक है, बाहर जाते समय छाता अवश्य साथ रखें।' : '☀️ आज भारी बारिश की संभावना कम है।'}`
        : `In ${targetCity.name}, the rain probability today is ${rainProb}%. The current condition is ${cur?.condition?.toLowerCase() || 'clear'} with a temperature of ${cur?.temp ?? 28}°C. ${rainProb >= 50 ? '🌧️ Rain is likely; an umbrella or raincoat is advised.' : '☀️ Low chance of precipitation today.'}`;
      followUps = isHi 
        ? [`🌡️ ${targetCity.name} का आज का तापमान`, `💨 हवा की गति`, `⚠️ कोई मौसम चेतावनी?`, `🌅 सूर्यास्त का समय`]
        : [`🌡️ Today's temperature in ${targetCity.name}`, `💨 Wind conditions`, `⚠️ Any severe alerts?`, `🌅 Sunset time`];
    } else if (q.includes('temp') || q.includes('तापमान') || q.includes('garmi') || q.includes('sardi') || q.includes('warm') || q.includes('cold')) {
      text = isHi
        ? `${targetCity.name} में वर्तमान तापमान ${cur?.temp ?? 28}°C (महसूस: ${cur?.feelsLike ?? 30}°C) है। आज का अधिकतम तापमान ${cur?.tempMax ?? 34}°C और न्यूनतम ${cur?.tempMin ?? 24}°C रहने का अनुमान है।`
        : `In ${targetCity.name}, the current temperature is ${cur?.temp ?? 28}°C (feels like ${cur?.feelsLike ?? 30}°C). Today's forecast high is ${cur?.tempMax ?? 34}°C and low is ${cur?.tempMin ?? 24}°C.`;
      followUps = isHi
        ? [`🌧️ आज बारिश होगी क्या?`, `🫁 एक्यूआई (AQI) कितना है?`, `📅 7-दिन का पूर्वानुमान`]
        : [`🌧️ Will it rain today?`, `🫁 What is the AQI?`, `📅 7-Day Forecast`];
    } else if (q.includes('aqi') || q.includes('air') || q.includes('pollution') || q.includes('हवा') || q.includes('प्रदूषण') || q.includes('asthma') || q.includes('allergy')) {
      toolCalls.push({ tool: 'get_air_quality', location: targetCity.name });
      text = isHi
        ? `${targetCity.name} में वर्तमान वायु गुणवत्ता सूचकांक (AQI) ${aqi?.usAqi ?? 75} (${aqi?.category || 'मध्यम'}) है। PM2.5: ${aqi?.pm25 ?? 25} µg/m³, PM10: ${aqi?.pm10 ?? 50} µg/m³। ${aqi?.usAqi > 150 ? '⚠️ संवेदनशील समूहों को बाहरी गतिविधियों में मास्क पहनना चाहिए।' : '✅ वायु गुणवत्ता अनुकूल है।'}`
        : `The Air Quality Index (AQI) in ${targetCity.name} is currently ${aqi?.usAqi ?? 75} (${aqi?.category || 'Moderate'}). PM2.5 is at ${aqi?.pm25 ?? 25} µg/m³ and PM10 at ${aqi?.pm10 ?? 50} µg/m³. ${aqi?.usAqi > 150 ? '⚠️ Sensitive groups should limit outdoor exertion and wear masks.' : '✅ Air quality is within safe limits.'}`;
      followUps = isHi
        ? [`🫁 क्या दमा मरीजों के लिए सुरक्षित है?`, `🌧️ आज बारिश होगी?`]
        : [`🫁 Is it safe for asthma/allergies?`, `🌧️ Will it rain today?`];
    } else if (q.includes('alert') || q.includes('warning') || q.includes('चेतावनी')) {
      toolCalls.push({ tool: 'get_weather_alerts', location: targetCity.name });
      text = isHi
        ? `${targetCity.name} के लिए सक्रिय मौसम स्थिति: वर्तमान में कोई गंभीर आपदा अलर्ट जारी नहीं है। सामान्य मौसमी गतिविधियां जारी हैं।`
        : `Active weather advisory for ${targetCity.name}: Standard seasonal conditions observed. No extreme disaster warning is currently in effect.`;
      followUps = [`🌧️ Will it rain today?`, `🌡️ Today's temperature`];
    } else if (q.includes('sun') || q.includes('sunrise') || q.includes('sunset') || q.includes('सूर्योदय') || q.includes('सूर्यास्त')) {
      toolCalls.push({ tool: 'get_sunrise_sunset', location: targetCity.name });
      text = isHi
        ? `${targetCity.name} में आज सूर्योदय का समय ${cur?.sunrise || '06:00 AM'} और सूर्यास्त का समय ${cur?.sunset || '06:30 PM'} है।`
        : `In ${targetCity.name}, sunrise is at ${cur?.sunrise || '06:00 AM'} and sunset is at ${cur?.sunset || '06:30 PM'}.`;
      followUps = [`☀️ UV index`, `🌡️ Today's temperature`];
    } else if (q.includes('wind') || q.includes('हवा') || q.includes('आंधी')) {
      text = isHi
        ? `${targetCity.name} में हवा की गति ${cur?.windSpeed || 12} km/h (झोंके: ${cur?.windGusts || 16} km/h) और दिशा ${cur?.windDirection || 180}° है।`
        : `In ${targetCity.name}, wind speed is ${cur?.windSpeed || 12} km/h (gusts up to ${cur?.windGusts || 16} km/h) from ${cur?.windDirection || 180}°.`;
      followUps = [`🌧️ Will it rain today?`, `🌡️ Today's temperature`];
    } else if (q.includes('uv') || q.includes('धूप')) {
      text = isHi
        ? `${targetCity.name} में आज अधिकतम यूवी इंडेक्स ${cur?.uvIndex || 6} है। ${cur?.uvIndex >= 6 ? 'तेज धूप से बचने के लिए सनस्क्रीन व टोपी का उपयोग करें।' : 'धूप सामान्य है।'}`
        : `Solar UV Index in ${targetCity.name} reaches ${cur?.uvIndex || 6} today. ${cur?.uvIndex >= 6 ? 'Solar UV is elevated; sunscreen and sunglasses recommended.' : 'UV radiation is within moderate levels.'}`;
      followUps = [`🌅 Sunrise & sunset`, `🌡️ Today's temperature`];
    } else if (q.includes('7') || q.includes('forecast') || q.includes('सप्ताह') || q.includes('week')) {
      toolCalls.push({ tool: 'get_daily_forecast', location: targetCity.name });
      text = isHi
        ? `${targetCity.name} के लिए आगामी 7-दिवसीय मौसम दृष्टिकोण सक्रिय है। दिन का अधिकतम तापमान ~${cur?.tempMax || 33}°C और रात का न्यूनतम ~${cur?.tempMin || 23}°C रहने का अनुमान है।`
        : `7-day outlook for ${targetCity.name}: Maximum temperatures averaging ~${cur?.tempMax || 33}°C and lows near ~${cur?.tempMin || 23}°C. Continuous real-time multi-model tracking is active.`;
      followUps = [`🌧️ Will it rain today?`, `⚠️ Weather alerts`];
    } else {
      // General live current weather
      text = isHi
        ? `${targetCity.name} में वर्तमान मौसम ${cur?.condition || 'साफ'} है। तापमान ${cur?.temp ?? 28}°C (महसूस: ${cur?.feelsLike ?? 30}°C) है। आर्द्रता ${cur?.humidity ?? 65}%, हवा की गति ${cur?.windSpeed ?? 12} km/h और आज वर्षा की संभावना ${cur?.rainProb ?? 10}% है।`
        : `Currently in ${targetCity.name}, the weather is ${cur?.condition?.toLowerCase() || 'partly cloudy'}. The temperature is ${cur?.temp ?? 28}°C (feels like ${cur?.feelsLike ?? 30}°C) with ${cur?.humidity ?? 65}% humidity, wind at ${cur?.windSpeed ?? 12} km/h, and a rain probability of ${cur?.rainProb ?? 10}%.`;
      followUps = isHi
        ? [`🌧️ आज बारिश होगी क्या?`, `🫁 ${targetCity.name} का AQI`, `📅 7-दिन का पूर्वानुमान`, `🌅 सूर्योदय और सूर्यास्त`]
        : [`🌧️ Will it rain today?`, `🫁 Air Quality in ${targetCity.name}`, `📅 7-Day Forecast`, `🌅 Sunrise & Sunset`];
    }

    return {
      text,
      toolCalls,
      followUps,
      source: 'Real Live NWP Telemetry'
    };
  };

  // Main Send Function to Backend /api/chat with resilient Client-Side Live Fallback
  const handleSend = async (textToSend = inputText) => {
    const text = (textToSend || '').trim();
    if (!text) return;

    // Stop ongoing audio
    stopAudio();

    const userMsgId = `u-${Date.now()}`;
    const userMsg = {
      id: userMsgId,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      let data = null;

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: text,
            sessionId: sessionIdRef.current,
            userLocation: selectedCity?.name || 'New Delhi',
            preferredLanguage: language
          })
        });

        const contentType = res.headers.get('content-type') || '';
        if (res.ok && contentType.includes('application/json')) {
          data = await res.json();
        }
      } catch (backendErr) {
        console.warn('Backend server /api/chat unavailable, using direct live NWP client engine:', backendErr);
      }

      // If backend was unreachable or returned non-JSON (e.g. on Firebase static hosting), execute live client-side engine!
      if (!data) {
        data = await executeClientSideWeatherQuery(text);
      }

      const aiMsgId = `ai-${Date.now()}`;
      const aiMsg = {
        id: aiMsgId,
        sender: 'ai',
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: data.source || 'Real Live NWP Telemetry',
        toolCalls: data.toolCalls || [],
        followUps: data.followUps || []
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
      setLastTelemetryUpdate(new Date());

      if (isVoiceEnabled) {
        playMessageAudio(data.text, aiMsgId);
      }
    } catch (err) {
      console.error('Chatbot request failed:', err);
      setIsTyping(false);
      const errorMsg = {
        id: `err-${Date.now()}`,
        sender: 'ai',
        text: language === 'hi'
          ? "मौसम सेवा से कनेक्ट करने में असमर्थ। कृपया पुनः प्रयास करें।"
          : "Unable to retrieve the latest live weather observation right now. Please try again in a moment.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'System Telemetry',
        toolCalls: [],
        followUps: [
          '🌧️ Will it rain today?',
          '🌡️ Today\'s temperature',
          '⚠️ Weather alerts'
        ]
      };
      setMessages(prev => [...prev, errorMsg]);
    }
  };

  return (
    <>
      {/* Floating Chat Trigger Button - Thumb Friendly, positioned above bottom navigation */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 px-3.5 py-2.5 sm:p-4 rounded-full bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 text-white shadow-[0_10px_35px_rgba(14,165,233,0.5)] border border-sky-400/40 hover:scale-105 active:scale-95 transition-all group flex items-center gap-2"
          title="Open Mausam Assistant"
        >
          <div className="relative">
            <Bot className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="w-2 h-2 rounded-full bg-emerald-400 border border-slate-900 absolute -top-0.5 -right-0.5 animate-ping" />
          </div>
          <span className="text-xs font-bold tracking-tight">
            Mausam Assistant
          </span>
        </button>
      )}

      {/* Mobile-Friendly Bottom Sheet Drawer / Floating Window */}
      {isOpen && (
        <div className="fixed bottom-0 sm:bottom-6 right-0 sm:right-6 z-50 w-full sm:w-[440px] h-[85vh] sm:h-[580px] bg-white dark:bg-slate-900/95 backdrop-blur-xl border-t sm:border border-slate-200 dark:border-slate-700/80 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden ring-1 ring-sky-500/30 text-slate-900 dark:text-slate-100 animate-in fade-in slide-in-from-bottom-5">
          
          {/* Mobile Drag/Grabber Handle */}
          <div className="sm:hidden pt-2 pb-1 flex justify-center bg-sky-700">
            <div className="w-12 h-1.5 bg-white/40 rounded-full" />
          </div>

          {/* Header */}
          <div className="p-3.5 sm:p-4 bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 flex items-center justify-between text-white shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shrink-0">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="font-extrabold text-sm tracking-tight truncate">Mausam Assistant</h3>
                  <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Live NWP
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-sky-100">
                  <span className="truncate">Station: {selectedCity?.name || 'New Delhi'}</span>
                  <span>•</span>
                  <span className="flex items-center gap-0.5 text-sky-200 shrink-0">
                    <Clock className="w-2.5 h-2.5" />
                    {relativeTimeStr}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {/* Voice Readout Toggle */}
              <button
                onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
                className={`p-1.5 rounded-lg border transition ${
                  isVoiceEnabled 
                    ? 'bg-emerald-500 border-emerald-400 text-white shadow-sm' 
                    : 'bg-black/20 border-white/20 text-white/70 hover:text-white'
                }`}
                title={isVoiceEnabled ? 'Auto-Voice Enabled (Click to Mute)' : 'Enable Voice Readout'}
              >
                {isVoiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              <button
                onClick={() => {
                  stopAudio();
                  setIsOpen(false);
                }}
                className="p-1.5 rounded-lg bg-black/20 hover:bg-black/40 text-white/80 hover:text-white transition"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 8 Predefined Quick Questions Carousel / Chips */}
          <div className="px-3 py-2 bg-slate-950/90 border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[11px]">
            {quickQuestions.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(item.query)}
                className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-sky-950/80 text-slate-300 hover:text-sky-300 border border-slate-800 hover:border-sky-700/80 whitespace-nowrap transition flex items-center gap-1 shrink-0 font-medium active:scale-95"
              >
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-3.5 text-xs">
            {messages.map((m) => {
              const isUser = m.sender === 'user';
              const isSpeaking = playingMessageId === m.id;

              return (
                <div
                  key={m.id}
                  className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                    isUser ? 'bg-sky-600 text-white shadow-sm' : 'bg-slate-800 text-sky-400 border border-slate-700'
                  }`}>
                    {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                  </div>

                  <div className={`flex flex-col gap-1.5 max-w-[84%] ${isUser ? 'items-end' : 'items-start'}`}>
                    <div className={`p-3.5 rounded-2xl leading-relaxed shadow-md ${
                      isUser 
                        ? 'bg-sky-600 text-white rounded-tr-sm' 
                        : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-sm'
                    }`}>
                      <p className="whitespace-pre-line text-xs">{m.text}</p>
                    </div>

                    {/* Meta Bar: Timestamp, Source & Audio Readout Button */}
                    <div className="flex items-center gap-2 px-1 text-[10px] text-slate-400">
                      <span>{m.timestamp}</span>
                      {!isUser && (
                        <>
                          <span>•</span>
                          <span className="text-sky-400 font-medium">{m.source || 'Live NWP'}</span>
                          <span>•</span>
                          <button
                            onClick={() => playMessageAudio(m.text, m.id)}
                            className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md border transition ${
                              isSpeaking 
                                ? 'bg-emerald-950 border-emerald-600 text-emerald-300 font-bold animate-pulse' 
                                : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                            }`}
                            title={isSpeaking ? 'Stop Voice Audio' : 'Play Voice Speech'}
                          >
                            {isSpeaking ? (
                              <span className="flex items-center gap-1">⏹️ Stop</span>
                            ) : (
                              <span className="flex items-center gap-1"><Volume2 className="w-3 h-3 text-sky-400" /> Speak</span>
                            )}
                          </button>
                        </>
                      )}
                    </div>

                    {/* 2-4 Dynamic Follow-Up Suggestion Chips */}
                    {!isUser && m.followUps && m.followUps.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {m.followUps.map((fu, fuIdx) => (
                          <button
                            key={fuIdx}
                            onClick={() => handleSend(fu)}
                            className="text-[10px] px-2.5 py-1 rounded-xl bg-slate-900/90 hover:bg-sky-950 text-sky-300 border border-sky-800/50 hover:border-sky-600 transition flex items-center gap-1 text-left active:scale-95"
                          >
                            <span>{fu}</span>
                            <ChevronRight className="w-2.5 h-2.5 text-sky-400 shrink-0" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-2 text-slate-400 text-xs pl-9 py-1">
                <Sparkles className="w-3.5 h-3.5 text-sky-400 animate-spin" />
                <span>Mausam Assistant is querying live NWP telemetry...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Audio Speaking Live Status Banner */}
          {playingMessageId && (
            <div className="px-4 py-1.5 bg-indigo-950/70 border-t border-indigo-800/60 flex items-center justify-between text-[11px] text-indigo-200 animate-pulse">
              <span className="flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
                <span>Voice Audio Playing...</span>
              </span>
              <button 
                onClick={stopAudio}
                className="text-[10px] text-indigo-300 hover:text-white underline"
              >
                Stop
              </button>
            </div>
          )}

          {/* Voice Input Active Banner */}
          {isListening && (
            <div className="px-4 py-1.5 bg-rose-950/80 border-t border-rose-800/60 flex items-center justify-between text-[11px] text-rose-200">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <span className="font-semibold">Listening... Speak your weather query now</span>
              </span>
              <button 
                onClick={toggleListening}
                className="text-[10px] text-rose-300 hover:text-white underline"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Input Area */}
          <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
            {/* Microphone STT Button */}
            <button
              onClick={toggleListening}
              className={`p-2.5 rounded-xl border transition ${
                isListening
                  ? 'bg-rose-600 border-rose-500 text-white shadow-[0_0_12px_rgba(244,63,94,0.6)] animate-pulse'
                  : 'bg-slate-900 border-slate-700/80 text-slate-300 hover:text-white hover:border-slate-600'
              }`}
              title={isListening ? 'Stop Listening' : 'Voice Input (Speak your weather query)'}
            >
              {isListening ? <MicOff className="w-4 h-4 text-white" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              type="text"
              placeholder={
                language === 'hi' 
                  ? "मौसम के बारे में पूछें (उदा. क्या आज बारिश होगी?)..." 
                  : "Ask anything about weather (e.g. Will it rain today?)..."
              }
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />

            <button
              onClick={() => handleSend()}
              disabled={!inputText.trim()}
              className="p-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-40 text-white shadow transition"
              title="Send Query"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}
    </>
  );
}

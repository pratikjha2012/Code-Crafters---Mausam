import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { 
  getCurrentWeather, 
  getHourlyForecast, 
  getDailyForecast, 
  getAirQuality, 
  getWeatherAlerts, 
  getSunriseSunset 
} from './weatherTools.js';
import { executeWeatherAgent } from './agentOrchestrator.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Request logging (without leaking credentials)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// 1. Healthcheck & Config Status
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'Mausam Live AI Weather Backend',
    timestamp: new Date().toISOString(),
    config: {
      hasWeatherKey: Boolean(process.env.WEATHER_API_KEY),
      hasLlmKey: Boolean(process.env.LLM_API_KEY),
      hasElevenLabsKey: Boolean(process.env.ELEVENLABS_API_KEY),
      elevenLabsVoiceId: process.env.ELEVENLABS_VOICE_ID || 'EXAVITQu4vr4xnSDxMaL'
    }
  });
});

// 2. Chat Orchestrator Endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, sessionId, userLocation, preferredLanguage } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Valid "message" string is required.' });
    }

    const agentResult = await executeWeatherAgent({
      message: message.trim(),
      sessionId: sessionId || 'default-session',
      userLocation: userLocation || 'New Delhi',
      preferredLanguage: preferredLanguage || null
    });

    res.json(agentResult);
  } catch (error) {
    console.error('Chat endpoint error:', error);
    res.status(500).json({
      text: "I'm unable to retrieve the latest weather data right now. Please try again in a moment.",
      error: error.message
    });
  }
});

// 3. Current Weather Endpoint
app.get('/api/weather/current', async (req, res) => {
  try {
    const { location, lat, lon } = req.query;
    const target = (lat && lon) ? { lat: parseFloat(lat), lon: parseFloat(lon), name: location || 'Station' } : (location || 'New Delhi');
    const data = await getCurrentWeather(target);
    res.json(data);
  } catch (err) {
    console.error('Current weather error:', err);
    res.status(500).json({ error: 'Failed to retrieve live current weather data.' });
  }
});

// 4. Forecasts (Hourly & Daily) Endpoint
app.get('/api/weather/forecast', async (req, res) => {
  try {
    const { location, lat, lon, days } = req.query;
    const target = (lat && lon) ? { lat: parseFloat(lat), lon: parseFloat(lon), name: location || 'Station' } : (location || 'New Delhi');
    const [hourly, daily] = await Promise.all([
      getHourlyForecast(target),
      getDailyForecast(target, null, days ? parseInt(days, 10) : 7)
    ]);
    res.json({ hourly, daily });
  } catch (err) {
    console.error('Forecast error:', err);
    res.status(500).json({ error: 'Failed to retrieve live forecast data.' });
  }
});

// 5. Air Quality Endpoint
app.get('/api/weather/air-quality', async (req, res) => {
  try {
    const { location, lat, lon } = req.query;
    const target = (lat && lon) ? { lat: parseFloat(lat), lon: parseFloat(lon), name: location || 'Station' } : (location || 'New Delhi');
    const data = await getAirQuality(target);
    res.json(data);
  } catch (err) {
    console.error('Air quality error:', err);
    res.status(500).json({ error: 'Failed to retrieve live air quality data.' });
  }
});

// 6. Weather Alerts Endpoint
app.get('/api/weather/alerts', async (req, res) => {
  try {
    const { location, lat, lon } = req.query;
    const target = (lat && lon) ? { lat: parseFloat(lat), lon: parseFloat(lon), name: location || 'Station' } : (location || 'New Delhi');
    const data = await getWeatherAlerts(target);
    res.json(data);
  } catch (err) {
    console.error('Weather alerts error:', err);
    res.status(500).json({ error: 'Failed to retrieve live weather alerts.' });
  }
});

// 7. ElevenLabs Text-to-Speech Streaming Endpoint
app.post('/api/tts', async (req, res) => {
  const { text, voiceId } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Text is required for TTS.' });
  }

  const apiKey = process.env.ELEVENLABS_API_KEY;
  const targetVoice = voiceId || process.env.ELEVENLABS_VOICE_ID || 'EXAVITQu4vr4xnSDxMaL'; // Sarah premade default

  // If no ElevenLabs API key is configured yet, inform the client to use browser speech synthesis
  if (!apiKey || apiKey.trim() === '') {
    return res.status(200).json({
      useClientFallback: true,
      reason: 'ELEVENLABS_API_KEY not configured in backend .env',
      text
    });
  }

  try {
    const cleanText = text.replace(/[*#_`]/g, '').slice(0, 500); // 500 char safe limit per turn
    const elevenUrl = `https://api.elevenlabs.io/v1/text-to-speech/${targetVoice}?optimize_streaming_latency=2`;

    const elevenRes = await fetch(elevenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
        'Accept': 'audio/mpeg'
      },
      body: JSON.stringify({
        text: cleanText,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.8
        }
      })
    });

    if (!elevenRes.ok) {
      const errText = await elevenRes.text();
      console.error('ElevenLabs API response error:', errText);
      return res.status(200).json({
        useClientFallback: true,
        reason: 'ElevenLabs API returned error: ' + elevenRes.status,
        text
      });
    }

    // Pipe audio stream directly to client with audio headers
    res.setHeader('Content-Type', 'audio/mpeg');
    elevenRes.body.pipe(res);
  } catch (err) {
    console.error('TTS endpoint error:', err);
    res.status(200).json({
      useClientFallback: true,
      reason: err.message,
      text
    });
  }
});

app.listen(PORT, () => {
  console.log(`========================================================`);
  console.log(`🌦️  Mausam Live AI Weather Backend running on port ${PORT}`);
  console.log(`📡  Live Numerical Tools: Active`);
  console.log(`🔑  ElevenLabs TTS: ${process.env.ELEVENLABS_API_KEY ? 'Configured' : 'Client Speech Fallback Active'}`);
  console.log(`========================================================`);
});

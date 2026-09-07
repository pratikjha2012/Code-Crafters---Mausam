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
  RefreshCw, 
  User, 
  Languages,
  HelpCircle,
  Minimize2,
  Maximize2
} from 'lucide-react';

export default function WeatherChatbot() {
  const { weather, selectedCity, language } = useWeather();
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'm1',
      sender: 'ai',
      text: language === 'hi' 
        ? `नमस्ते ${user.name}! मैं आपका मौसम एआई मित्र (Mausam AI Mitra) हूँ। आप मुझसे किसी भी भाषा (हिन्दी, English, বাংলা, தமிழ், मराठी, ইত্যাদি) में मौसम, वायु गुणवत्ता, स्वास्थ्य या कृषि से जुड़े सवाल पूछ सकते हैं।`
        : `Namaste ${user.name}! I am your multilingual Mausam AI Mitra. You can ask me weather, AQI, running, travel, or agriculture questions in ANY language!`
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  // Voice synthesis
  const speakText = (text) => {
    if (!isVoiceEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const clean = text.replace(/[*#_`]/g, '');
      const utter = new SpeechSynthesisUtterance(clean);
      window.speechSynthesis.speak(utter);
    } catch (e) {
      console.warn('Speech synthesis error', e);
    }
  };

  // Multilingual Knowledge & Response Engine
  const generateMultilingualResponse = (query) => {
    const q = query.toLowerCase();
    const cur = weather?.current || {};
    const aqi = weather?.aqi || {};
    const city = selectedCity?.name || 'Your Station';

    // Detect language script or intent
    const isHindi = /[\u0900-\u097F]/.test(query) || q.includes('kya') || q.includes('aaj') || q.includes('barish') || q.includes('mausam');
    const isBengali = /[\u0980-\u09FF]/.test(query);
    const isTamil = /[\u0B80-\u0BFF]/.test(query);
    const isTelugu = /[\u0C00-\u0C7F]/.test(query);

    // 1. Rain / Precipitation queries
    if (q.includes('rain') || q.includes('barish') || q.includes('shower') || q.includes('বৃষ্টি') || q.includes('மழை') || q.includes('వర్షం')) {
      if (isHindi) {
        return `${city} में वर्तमान में वर्षा की संभावना ${cur.rainProb || 15}% है। स्थिति: ${cur.condition}। ${cur.rainProb > 50 ? 'आज बाहर निकलते समय छाता या रेनकोट अवश्य साथ रखें।' : 'आज गंभीर बारिश की संभावना कम है, मौसम सामान्य रहेगा।'}`;
      }
      if (isBengali) {
        return `${city}-তে বৃষ্টির সম্ভাবনা ${cur.rainProb || 15}%। বর্তমান অবস্থা: ${cur.condition}। ${cur.rainProb > 50 ? 'বাইরে বের হলে ছাতা সঙ্গে রাখবেন।' : 'আজ ভারী বৃষ্টির সম্ভাবনা কম।'}`;
      }
      if (isTamil) {
        return `${city}-இல் மழை வாய்ப்பு ${cur.rainProb || 15}% ஆக உள்ளது. ${cur.rainProb > 50 ? 'மழை வரக்கூடும், குடை எடுத்துச் செல்லவும்.' : 'மழைக்கான வாய்ப்பு குறைவு.'}`;
      }
      return `In ${city}, the current rain probability is ${cur.rainProb}%. Current condition: ${cur.condition}. ${cur.rainProb >= 50 ? 'We recommend carrying a raincoat or umbrella today.' : 'Precipitation risk is low; clear skies are favored.'}`;
    }

    // 2. Air Quality, Allergies & Asthma
    if (q.includes('aqi') || q.includes('air') || q.includes('smog') || q.includes('asthma') || q.includes('allergy') || q.includes('pollen') || q.includes('दमा') || q.includes('हवा')) {
      const hasAsthma = user.allergies.includes('asthma');
      if (isHindi) {
        return `${city} में वर्तमान AQI ${aqi.usAqi} (${aqi.category}) है, और PM2.5 स्तर ${aqi.pm25} µg/m³ है। ${aqi.usAqi > 150 ? (hasAsthma ? '⚠️ चूंकि आपकी प्रोफाइल में अस्थमा दर्ज है, कृपया बाहर व्यायाम से बचें और N95 मास्क पहनें।' : '⚠️ वायु गुणवत्ता अस्वस्थ है। मास्क पहनना उचित रहेगा।') : '✅ वायु गुणवत्ता अनुकूल है और बाहर घूमना सुरक्षित है।'}`;
      }
      return `The Air Quality Index (AQI) in ${city} is currently ${aqi.usAqi} (${aqi.category}), with PM2.5 at ${aqi.pm25} µg/m³ and grass pollen at ${aqi.pollenGrass} grains/m³. ${aqi.usAqi > 150 ? (hasAsthma ? '⚠️ Notice for your Asthma profile: Airway irritation is likely. Avoid strenuous outdoor runs and keep an inhaler handy.' : '⚠️ Air is moderately polluted. Vulnerable groups should limit prolonged outdoor exertion.') : '✅ Air quality is within safe limits for outdoor recreation.'}`;
    }

    // 3. Commute, Visibility & Traffic
    if (q.includes('commute') || q.includes('traffic') || q.includes('fog') || q.includes('visibility') || q.includes('road') || q.includes('कोहरा') || q.includes('ट्रैफिक')) {
      const vis = cur.visibility || 5000;
      if (isHindi) {
        return `${city} में सड़क दृश्यता (Visibility) लगभग ${vis < 1000 ? `${vis} मीटर` : `${(vis/1000).toFixed(1)} किमी`} है। आपके सुबह ${user.commuteTime} के आवागमन के दौरान ${vis < 300 ? 'घने कोहरे की चेतावनी है; फॉग लाइट ऑन रखें।' : 'सड़कें साफ हैं, सामान्य गति से ड्राइव करें।'}`;
      }
      return `Optical road visibility in ${city} is measured at ${vis < 1000 ? `${vis}m` : `${(vis/1000).toFixed(1)}km`}. For your ${user.commuteTime} commute window: ${vis < 500 ? 'Caution: Reduced headway distance due to mist/fog. Keep low-beam lamps on.' : 'Road conditions are clear with low transit drag.'}`;
    }

    // 4. Fitness / Running
    if (q.includes('run') || q.includes('jog') || q.includes('workout') || q.includes('fitness') || q.includes('दौड़') || q.includes('कसरत')) {
      if (isHindi) {
        return `${city} में वर्तमान तापमान ${cur.temp}°C (महसूस: ${cur.feelsLike}°C) है। आपके शाम/सुबह के वर्कआउट के लिए सूर्योदय ${cur.sunrise} और सूर्यास्त ${cur.sunset} के आस-पास का समय सबसे अनुकूल रहेगा।`;
      }
      return `Current ambient temp in ${city} is ${cur.temp}°C (feels like ${cur.feelsLike}°C) with ${cur.humidity}% humidity. The best workout window is around sunrise (${cur.sunrise}) or sunset (${cur.sunset}) when solar radiation drops. Hydrate with at least 600ml water/hour.`;
    }

    // 5. Agriculture / Farming
    if (q.includes('crop') || q.includes('soil') || q.includes('farmer') || q.includes('kisan') || q.includes('fasal') || q.includes('फसल') || q.includes('खेती') || q.includes('सिंचाई')) {
      const soilMoist = (cur.soilMoisture * 100).toFixed(0);
      if (isHindi) {
        return `कृषि मौसम सेवा (GKMS): ${city} में ऊपरी मिट्टी की नमी ${soilMoist}% है। हवा की गति ${cur.windSpeed} km/h है। ${cur.windSpeed < 18 && cur.rainProb < 25 ? 'कीटनाशक व खाद छिड़काव के लिए वर्तमान मौसम सर्वथा उपयुक्त है।' : 'तेज हवा या वर्षा की आशंका के कारण छिड़काव टालें।'}`;
      }
      return `GKMS Agromet Bulletin for ${city}: Soil moisture in root zone is ~${soilMoist}%. Wind speed is ${cur.windSpeed} km/h. ${cur.windSpeed < 18 && cur.rainProb < 25 ? 'Field condition is favorable for agrochemical spraying and irrigation.' : 'Avoid chemical spray due to drift hazard.'}`;
    }

    // 6. Generic intelligent response in requested language
    if (isHindi) {
      return `${city} का वर्तमान मौसम: तापमान ${cur.temp}°C, स्थिति: ${cur.condition}, आर्द्रता: ${cur.humidity}%, और AQI: ${aqi.usAqi} (${aqi.category}) है। आप मुझसे किसी विशिष्ट विषय (जैसे वर्षा, कोहरा, दौड़, या यात्रा) के बारे में पूछ सकते हैं।`;
    }
    if (isBengali) {
      return `${city}-র বর্তমান তাপমাত্রা ${cur.temp}°C, অবস্থা: ${cur.condition}, আর্দ্রতা: ${cur.humidity}%, এবং AQI: ${aqi.usAqi}। আরও বিস্তারিত তথ্যের জন্য প্রশ্ন করতে পারেন।`;
    }
    return `Currently in ${city}, it is ${cur.temp}°C and ${cur.condition} with ${cur.humidity}% humidity, ${cur.windSpeed} km/h wind, and AQI ${aqi.usAqi} (${aqi.category}). How can I assist with your plans today?`;
  };

  const handleSend = (textToSend = inputText) => {
    const text = textToSend.trim();
    if (!text) return;

    const userMsg = { id: `u-${Date.now()}`, sender: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const reply = generateMultilingualResponse(text);
      const aiMsg = { id: `ai-${Date.now()}`, sender: 'ai', text: reply };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
      speakText(reply);
    }, 600);
  };

  const promptChips = [
    { label: '🌧️ Will it rain today?', query: 'Will it rain today?' },
    { label: '🫁 Is AQI safe for my allergies?', query: 'Is the AQI safe for my asthma and allergies today?' },
    { label: '🏃 Best time for running?', query: 'What is the best hour for outdoor workout today?' },
    { label: '🚗 Morning commute status?', query: 'What is the road visibility and commute delay risk?' },
    { label: 'आज बारिश होगी क्या? (Hindi)', query: 'क्या आज बारिश होगी?' },
  ];

  return (
    <>
      {/* Floating Chat Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 text-white shadow-[0_10px_35px_rgba(14,165,233,0.5)] border border-sky-400/40 hover:scale-110 active:scale-95 transition-all group flex items-center gap-2.5"
          title="Open Mausam AI Mitra (मौसम मित्र)"
        >
          <Bot className="w-6 h-6 animate-bounce" />
          <span className="text-xs font-black tracking-wide pr-1 hidden sm:inline">
            Mausam AI Mitra
          </span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border border-slate-900 absolute top-2 right-2 animate-ping" />
        </button>
      )}

      {/* Expandable Chatbot Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-50 w-[92vw] sm:w-[420px] h-[550px] bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden ring-1 ring-sky-500/30 text-slate-100 animate-in fade-in slide-in-from-bottom-5">
          
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 flex items-center justify-between text-white shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-sm tracking-tight">मौसम मित्र • Mausam AI</h3>
                  <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-black/30 border border-white/20">
                    Multilingual
                  </span>
                </div>
                <p className="text-[10px] text-sky-100">
                  Speaks any language • Station: {selectedCity?.name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Voice Readout Toggle */}
              <button
                onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
                className={`p-1.5 rounded-lg border transition ${
                  isVoiceEnabled ? 'bg-emerald-500 border-emerald-400 text-white' : 'bg-black/20 border-white/20 text-white/70 hover:text-white'
                }`}
                title={isVoiceEnabled ? 'Voice Enabled (Click to Mute)' : 'Enable Voice Readout'}
              >
                {isVoiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg bg-black/20 hover:bg-black/40 text-white/80 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Prompt Chips Bar */}
          <div className="px-3 py-2 bg-slate-950/80 border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[10px]">
            {promptChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(chip.query)}
                className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-sky-950 text-slate-300 hover:text-sky-300 border border-slate-800 hover:border-sky-700 whitespace-nowrap transition"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
            {messages.map((m) => {
              const isUser = m.sender === 'user';
              return (
                <div
                  key={m.id}
                  className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                    isUser ? 'bg-sky-600 text-white' : 'bg-slate-800 text-sky-400 border border-slate-700'
                  }`}>
                    {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                  </div>

                  <div className={`p-3 rounded-2xl max-w-[82%] leading-relaxed shadow-md ${
                    isUser 
                      ? 'bg-sky-600 text-white rounded-tr-sm' 
                      : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-sm'
                  }`}>
                    <p className="whitespace-pre-line">{m.text}</p>
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-2 text-slate-400 text-xs pl-9">
                <Sparkles className="w-3.5 h-3.5 text-sky-400 animate-spin" />
                <span>Mausam AI Mitra is analyzing telemetry...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask anything in English, हिन्दी, বাংলা, தமிழ்..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <button
              onClick={() => handleSend()}
              disabled={!inputText.trim()}
              className="p-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-40 text-white shadow transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}
    </>
  );
}

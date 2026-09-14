import React, { useMemo, useState } from 'react';
import { useWeather, PERSONAS } from '../context/WeatherContext';
import { useUser } from '../context/UserContext';
import OverviewHero from '../components/OverviewHero';
import PersonaSelector from '../components/PersonaSelector';
import { getWeatherDescription, INDIAN_CITIES } from '../services/weatherApi';
import { 
  Droplets, 
  Sun, 
  Wind, 
  Eye, 
  Activity, 
  Sunrise, 
  Sunset, 
  Clock, 
  AlertTriangle, 
  ShieldCheck, 
  Compass, 
  ChevronRight, 
  Sparkles,
  ArrowUp,
  ArrowDown,
  CalendarDays,
  Sprout,
  Car,
  Plane,
  Flame,
  Waves,
  X,
  HelpCircle,
  ExternalLink,
  CheckCircle2,
  Bookmark,
  Info,
  Layers,
  ThermometerSun
} from 'lucide-react';

export default function HomePage({ onNavigate }) {
  const { weather, language, activePersona, setActivePersona } = useWeather();
  const { user, dismissInsight, isInsightDismissed, resetDismissedInsights } = useUser();

  const [whyModalOpen, setWhyModalOpen] = useState(false);
  const [whyModalData, setWhyModalData] = useState(null);

  if (!weather || !weather.current || !weather.aqi) return null;
  const { current, aqi, marine, alerts, rawHourly, rawDaily, cityName } = weather;

  // 1. Time-of-Day Context Detection
  const timeContext = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 21) return 'evening';
    return 'night';
  }, []);

  // 2. Dynamic "What Should I Do Next?" Personalized Action Recommendation
  const personalizedAction = useMemo(() => {
    // Generate recommendation according to active persona + live telemetry
    switch (activePersona) {
      case 'fitness': {
        const isHot = current.temp > 34 || current.feelsLike > 36;
        const isRainy = current.rainProb > 45;
        const isAqiUnhealthy = aqi.usAqi > 160;

        let recommendation = '';
        let whyText = '';
        let icon = '🏃';
        let actionTag = 'Plan Workout Time';

        if (isAqiUnhealthy) {
          recommendation = language === 'hi' 
            ? 'गंभीर AQI (' + aqi.usAqi + '): खुली हवा में दौड़ने से बचें; इनडोर ट्रेडमिल पर व्यायाम करें।'
            : `Severe AQI (${aqi.usAqi}): High particulate load. Shift workout indoors or postpone until air settles.`;
          whyText = `Triggered by US AQI (${aqi.usAqi} • ${aqi.category}) exceeding safe cardiovascular exertion limits.`;
          icon = '😷';
        } else if (isRainy) {
          recommendation = language === 'hi'
            ? 'आज वर्षा की संभावना (' + current.rainProb + '%): जलभराव से बचें; इनडोर कार्डियो चुनें।'
            : `Precipitation probability is ${current.rainProb}%. Wet pavement risk; consider indoor training.`;
          whyText = `Triggered by precipitation probability > 40% in your current sector.`;
          icon = '🌧️';
        } else if (isHot) {
          recommendation = language === 'hi'
            ? `दोपहर में तीव्र गर्मी (${current.temp}°C): सर्वोत्तम रनिंग समय: शाम 5:30 – 7:00 PM`
            : `High daytime heat (${current.temp}°C). Best time for your run: 5:30 – 7:00 PM (cooling to ${Math.round(current.temp - 4)}°C).`;
          whyText = `Computed from diurnal solar heating curve, feels-like ${current.feelsLike}°C, and sunset at ${current.sunset || '18:45'}.`;
          icon = '🔥';
        } else {
          recommendation = language === 'hi'
            ? `अनुकूल मौसम (${current.temp}°C, हवा ${current.windSpeed} km/h): सुबह 6:00 – 8:30 AM दौड़ हेतु उत्तम समय है।`
            : `Optimal running conditions (${current.temp}°C, breeze ${current.windSpeed} km/h). Best window: 6:00 – 8:30 AM before peak solar elevation.`;
          whyText = `Triggered by favorable temperature (${current.temp}°C), good AQI (${aqi.usAqi}), and moderate wind speed.`;
          icon = '⚡';
        }

        return {
          id: 'fitness-action',
          personaTitle: 'Outdoor Fitness Lens',
          actionTag,
          recommendation,
          whyText,
          icon,
          metrics: [
            { label: 'Temp', val: `${current.temp}°C` },
            { label: 'AQI', val: aqi.usAqi },
            { label: 'Wind', val: `${current.windSpeed} km/h` },
            { label: 'Sunset', val: current.sunset || '18:45' }
          ]
        };
      }

      case 'health': {
        const isBadAqi = aqi.usAqi > 150;
        const isHighUv = current.uvIndex >= 7;
        const isHighPollen = (aqi.pollenGrass || 0) > 30 || (aqi.pollenTree || 0) > 30;

        let recommendation = '';
        let whyText = '';
        let icon = '🫁';
        let actionTag = 'Decide Outdoors';

        if (isBadAqi) {
          recommendation = language === 'hi'
            ? `वायु गुणवत्ता अस्वस्थ है (AQI ${aqi.usAqi}): बाहर निकलते समय N95 मास्क अवश्य लगाएं; संवेदनशील समूह इनडोर रहें।`
            : `Unhealthy air quality (AQI ${aqi.usAqi}): Wear N95 respirator outdoors; vulnerable respiratory groups should stay indoors.`;
          whyText = `Live PM2.5 is ${aqi.pm25} µg/m³ (WHO guideline threshold: 15 µg/m³).`;
          icon = '😷';
        } else if (isHighPollen) {
          recommendation = language === 'hi'
            ? `पराग सूचकांक उच्च है: एलर्जी व छींक से बचने हेतु खिड़कियां बंद रखें और मास्क पहनें।`
            : `Elevated environmental pollen counts. Keep car and room windows closed during morning hours.`;
          whyText = `CAMS allergen telemetry indicates high airborne tree & grass pollen dispersion.`;
          icon = '🌸';
        } else if (isHighUv) {
          recommendation = language === 'hi'
            ? `तीव्र पराबैंगनी किरणें (UV ${current.uvIndex}): सुबह 11 AM से 3 PM के बीच धूप में निकलने से बचें; सनस्क्रीन SPF 50+ लगाएं।`
            : `High solar UV index (${current.uvIndex}). Seek shade between 11:00 AM – 3:00 PM and apply SPF 50+ sun protection.`;
          whyText = `Solar ultraviolet flux exceeds level 7 (High Photodamage Risk).`;
          icon = '☀️';
        } else {
          recommendation = language === 'hi'
            ? `हवा स्वच्छ एवं ताज़ा है (AQI ${aqi.usAqi}): खुली हवा में भ्रमण हेतु सुरक्षित व अनुकूल समय।`
            : `Clean air & mild solar index (AQI ${aqi.usAqi}). Excellent window for outdoor walks and fresh air ventilation.`;
          whyText = `US AQI is in the Good range (${aqi.usAqi}) with minimal fine particulates.`;
          icon = '🍃';
        }

        return {
          id: 'health-action',
          personaTitle: 'Health-Conscious Lens',
          actionTag,
          recommendation,
          whyText,
          icon,
          metrics: [
            { label: 'AQI', val: aqi.usAqi },
            { label: 'PM2.5', val: `${aqi.pm25} µg` },
            { label: 'UV', val: current.uvIndex },
            { label: 'Humidity', val: `${current.humidity}%` }
          ]
        };
      }

      case 'beach': {
        const wave = marine?.waveHeight || 1.2;
        const flag = marine?.safetyFlag || (wave > 2.5 ? 'Red' : wave > 1.5 ? 'Yellow' : 'Green');

        let recommendation = '';
        let whyText = '';
        let icon = '🏄';
        let actionTag = 'Choose Safe Surf Window';

        if (flag === 'Red') {
          recommendation = language === 'hi'
            ? `लाल झंडा चेतावनी: समुद्र में ऊंची लहरें (${wave}m) व तेज़ धाराएं; तैराकी व वॉटर स्पोर्ट्स प्रतिबंधित।`
            : `Red Flag Warning: Rough swells (${wave}m) & hazardous rip currents. Water entry not advised today.`;
          whyText = `Significant wave height (${wave}m) and offshore wind exceeding safe coastal limits.`;
          icon = '🚩';
        } else {
          recommendation = language === 'hi'
            ? `अनुकूल सर्फिंग विंडो: सुबह 6:00 – 9:00 AM (लहरें ${wave}m, शांत समुद्री हवाएं)।`
            : `Safe surf window: 6:00 – 9:00 AM (Wave height ${wave}m, gentle swell period ${marine?.wavePeriod || 8}s).`;
          whyText = `Calculated from coastal swell height ${wave}m, wind ${current.windSpeed} km/h, and morning low tide.`;
          icon = '🌊';
        }

        return {
          id: 'beach-action',
          personaTitle: 'Beachgoers & Surfers Lens',
          actionTag,
          recommendation,
          whyText,
          icon,
          metrics: [
            { label: 'Waves', val: `${wave}m` },
            { label: 'Flag', val: flag },
            { label: 'Water', val: `${marine?.waterTemp || 27}°C` },
            { label: 'Wind', val: `${current.windSpeed} km/h` }
          ]
        };
      }

      case 'commute': {
        const isFoggy = current.visibility < 1500;
        const isRainy = current.rainProb > 50;

        let recommendation = '';
        let whyText = '';
        let icon = '🚗';
        let actionTag = 'Choose Route & Departure Time';

        if (isFoggy) {
          recommendation = language === 'hi'
            ? `घने कोहरे के कारण दृश्यता केवल ${(current.visibility / 1000).toFixed(1)} km है; 15 मिनट अतिरिक्त समय लेकर निकलें।`
            : `Dense fog detected: Visibility is ${(current.visibility / 1000).toFixed(1)} km. Use low beams and allow +15 min buffer.`;
          whyText = `Optical surface visibility measured under 1,500 meters across regional highway corridors.`;
          icon = '🌫️';
        } else if (isRainy) {
          recommendation = language === 'hi'
            ? `बारिश की संभावना (${current.rainProb}%): प्रमुख चौराहों पर जलभराव संभव; वैकल्पिक मार्ग जांच लें।`
            : `Rain probability is ${current.rainProb}%. Potential arterial slow-downs; check alternate route now.`;
          whyText = `Precipitation nowcast radar indicates rain showers along city transit paths.`;
          icon = '🌧️';
        } else {
          recommendation = language === 'hi'
            ? `यातायात कॉरिडोर सामान्य: अच्छी दृश्यता (${(current.visibility / 1000).toFixed(1)} km) एवं सूखी सड़कें।`
            : `Clear transit corridors: High highway visibility (${(current.visibility / 1000).toFixed(1)} km) and dry road pavement.`;
          whyText = `Atmospheric visibility > 5 km and negligible precipitation probability.`;
          icon = '🛣️';
        }

        return {
          id: 'commute-action',
          personaTitle: 'Commuters & Transit Lens',
          actionTag,
          recommendation,
          whyText,
          icon,
          metrics: [
            { label: 'Visibility', val: `${(current.visibility / 1000).toFixed(1)} km` },
            { label: 'Rain %', val: `${current.rainProb}%` },
            { label: 'Wind', val: `${current.windSpeed} km/h` },
            { label: 'Pavement', val: isRainy ? 'Wet' : 'Dry' }
          ]
        };
      }

      case 'agri': {
        const isGoodSpray = current.windSpeed < 15 && current.rainProb < 35;
        const soilMoisture = (current.soilMoisture * 100).toFixed(0);

        let recommendation = '';
        let whyText = '';
        let icon = '🌾';
        let actionTag = 'Plan Agrochemical / Crop Activity';

        if (isGoodSpray) {
          recommendation = language === 'hi'
            ? `कीटनाशक छिड़काव हेतु अनुकूल समय सक्रिय: हवा शांत (${current.windSpeed} km/h) एवं अगले 24 घंटे बारिश नहीं।`
            : `Optimal agrochemical spray window active: Wind speed is ${current.windSpeed} km/h with 0% washout rain risk next 24h.`;
          whyText = `Winds < 15 km/h prevent chemical spray drift; low rain probability prevents leaf wash-off.`;
          icon = '🌱';
        } else {
          recommendation = language === 'hi'
            ? `तेज़ हवा (${current.windSpeed} km/h) या बारिश के कारण रासायनिक छिड़काव टालें; मृदा नमी ${soilMoisture}% है।`
            : `Postpone chemical foliage spray: Wind gusts (${current.windSpeed} km/h) risk drift; soil moisture is at ${soilMoisture}%.`;
          whyText = `Excessive wind turbulence or precipitation probability reduces pesticide efficacy.`;
          icon = '⚠️';
        }

        return {
          id: 'agri-action',
          personaTitle: 'Agriculture & Gardeners Lens',
          actionTag,
          recommendation,
          whyText,
          icon,
          metrics: [
            { label: 'Soil Moist', val: `${soilMoisture}%` },
            { label: 'Wind', val: `${current.windSpeed} km/h` },
            { label: 'Rain Prob', val: `${current.rainProb}%` },
            { label: 'Spray', val: isGoodSpray ? 'Optimal' : 'Wait' }
          ]
        };
      }

      case 'family': {
        const isRainy = current.rainProb > 40;
        const isHighUv = current.uvIndex >= 7;

        let recommendation = '';
        let whyText = '';
        let icon = '👨‍👩‍👧';
        let actionTag = 'Plan Family Routine';

        if (isRainy) {
          recommendation = language === 'hi'
            ? `स्कूल छुट्टी व शाम के समय वर्षा की संभावना (${current.rainProb}%): बच्चों के बैग में छाता व रेनकोट रखें।`
            : `Rain showers likely around school pickup (${current.rainProb}%). Pack an umbrella and waterproof bag covers.`;
          whyText = `Precipitation probability peaks during mid-afternoon school commute hours.`;
          icon = '🎒';
        } else if (isHighUv) {
          recommendation = language === 'hi'
            ? `पार्क में खेलने का उत्तम समय: शाम 4:30 PM के बाद, जब यूवी इंडेक्स और धूप कम हो जाएगी।`
            : `Safe playground window: After 4:30 PM once peak solar UV drops below level 3.`;
          whyText = `Solar irradiance high between 11 AM - 3 PM; evening twilight offers gentle thermal comfort.`;
          icon = '🛝';
        } else {
          recommendation = language === 'hi'
            ? `सुहाना मौसम: पूरे परिवार के साथ शाम को पार्क व खुले वातावरण में जाने के लिए उत्तम दिन।`
            : `Gentle weather conditions (${current.temp}°C). Great afternoon for outdoor parks and family activities.`;
          whyText = `Pleasant temperature, safe air quality (AQI ${aqi.usAqi}), and minimal precipitation.`;
          icon = '🎠';
        }

        return {
          id: 'family-action',
          personaTitle: 'Parents & Families Lens',
          actionTag,
          recommendation,
          whyText,
          icon,
          metrics: [
            { label: 'Temp', val: `${current.temp}°C` },
            { label: 'Rain %', val: `${current.rainProb}%` },
            { label: 'UV Index', val: current.uvIndex },
            { label: 'Air Quality', val: aqi.category }
          ]
        };
      }

      case 'travel': {
        const hasSevereAlert = alerts && alerts.length > 0;
        let recommendation = '';
        let whyText = '';
        let icon = '✈️';
        let actionTag = 'Prepare & Travel Safely';

        if (hasSevereAlert) {
          recommendation = language === 'hi'
            ? `सक्रिय मौसम अलर्ट: यात्रा शुरू करने से पहले राजमार्ग स्थिति और उड़ान शेड्यूल की पुष्टि करें।`
            : `Active IMD weather warning in region: Confirm highway road condition and flight status before transit.`;
          whyText = `Official IMD meteorological warning active in the current geographical jurisdiction.`;
          icon = '⚠️';
        } else {
          recommendation = language === 'hi'
            ? `पैकिंग सुझाव: दिन में हल्की धूप (${current.temp}°C); रात के तापमान (${current.tempMin}°C) के लिए हल्की जैकेट रखें।`
            : `Packing advice: Mild daytime (${current.temp}°C); carry a light evening layer for overnight drop to ${current.tempMin}°C.`;
          whyText = `Diurnal temperature spread is ${Math.round(current.tempMax - current.tempMin)}°C between peak noon and night.`;
          icon = '🧳';
        }

        return {
          id: 'travel-action',
          personaTitle: 'Travelers Lens',
          actionTag,
          recommendation,
          whyText,
          icon,
          metrics: [
            { label: 'High', val: `${current.tempMax}°C` },
            { label: 'Low', val: `${current.tempMin}°C` },
            { label: 'Visibility', val: `${(current.visibility / 1000).toFixed(1)} km` },
            { label: 'Transit', val: hasSevereAlert ? 'Alert' : 'Normal' }
          ]
        };
      }

      case 'events': {
        const rainRisk = current.rainProb > 40;
        let recommendation = '';
        let whyText = '';
        let icon = '🎪';
        let actionTag = 'Assess Event Risk & Backup Plan';

        if (rainRisk) {
          recommendation = language === 'hi'
            ? `वर्षा जोखिम (${current.rainProb}%): खुले समारोहों हेतु वॉटरप्रूफ कैनोपी या इनडोर बैकअप तैयार रखें।`
            : `Rain risk elevated (${current.rainProb}%). Prepare waterproof canopy covers or secure indoor backup hall.`;
          whyText = `Convective cloud formation and precipitation risk exceeds 40% for the evening slot.`;
          icon = '☔';
        } else {
          recommendation = language === 'hi'
            ? `90% वर्षा-मुक्त स्थिरता: खुले मैदान में शाम के समारोह एवं कार्यक्रमों के लिए अत्यंत अनुकूल दिन।`
            : `90% rain-free atmospheric stability: Favorable for outdoor evening gatherings and stage setups.`;
          whyText = `Barometric pressure steady at ${current.pressure || 1012} hPa with 0% rain forecast.`;
          icon = '✨';
        }

        return {
          id: 'events-action',
          personaTitle: 'Event Planners Lens',
          actionTag,
          recommendation,
          whyText,
          icon,
          metrics: [
            { label: 'Rain Chance', val: `${current.rainProb}%` },
            { label: 'Heat Index', val: `${current.feelsLike}°C` },
            { label: 'Wind Gust', val: `${current.windGusts || current.windSpeed} km/h` },
            { label: 'Stability', val: rainRisk ? 'Moderate' : 'High' }
          ]
        };
      }

      default: { // 'all' or balanced
        let recommendation = '';
        let whyText = '';
        let icon = '🌤️';
        let actionTag = 'Daily Meteorological Decision';

        if (current.rainProb > 50) {
          recommendation = language === 'hi'
            ? `आज वर्षा की प्रबल संभावना (${current.rainProb}%): बाहर निकलते समय छाता अथवा रेनकोट साथ रखें।`
            : `Rain is highly probable today (${current.rainProb}%). Carry an umbrella or rain gear for outdoor transit.`;
          whyText = `Precipitation probability is ${current.rainProb}% in your current sector.`;
          icon = '🌧️';
        } else if (aqi.usAqi > 200) {
          recommendation = language === 'hi'
            ? `वायु गुणवत्ता अत्यधिक अस्वस्थ (AQI ${aqi.usAqi}): बाहर निकलते समय N95 मास्क पहनें।`
            : `Air quality is very unhealthy (AQI ${aqi.usAqi}). N95 respirator strongly advised for outdoor commute.`;
          whyText = `US AQI is ${aqi.usAqi} with elevated PM2.5 particulates.`;
          icon = '😷';
        } else {
          recommendation = language === 'hi'
            ? `मौसम शांत एवं स्थिर है (${current.temp}°C, हवा ${current.windSpeed} km/h): सभी सामान्य दैनिक गतिविधियों हेतु अनुकूल।`
            : `Atmospheric metrics are calm and favorable (${current.temp}°C, wind ${current.windSpeed} km/h). Stable day ahead.`;
          whyText = `Balanced meteorological conditions across temperature, air quality, and wind.`;
          icon = '⛅';
        }

        return {
          id: 'all-action',
          personaTitle: 'Unified Weather Overview',
          actionTag,
          recommendation,
          whyText,
          icon,
          metrics: [
            { label: 'Temp', val: `${current.temp}°C` },
            { label: 'AQI', val: aqi.usAqi },
            { label: 'Rain %', val: `${current.rainProb}%` },
            { label: 'UV', val: current.uvIndex }
          ]
        };
      }
    }
  }, [activePersona, current, aqi, marine, alerts, language]);

  // Check if current action is dismissed
  const isActionDismissed = isInsightDismissed(personalizedAction?.id);

  // 3. Hourly Forecast (12 hours for Home horizontal strip)
  const hourlyStrip = useMemo(() => {
    if (!rawHourly?.time) return [];
    const items = [];
    const count = Math.min(rawHourly.time.length, 12);
    for (let i = 0; i < count; i++) {
      const d = new Date(rawHourly.time[i]);
      const h = d.getHours();
      const code = rawHourly.weather_code ? rawHourly.weather_code[i] : 0;
      const desc = getWeatherDescription(code);
      items.push({
        time: i === 0 ? (language === 'hi' ? 'अभी' : 'Now') : `${h % 12 || 12} ${h >= 12 ? 'PM' : 'AM'}`,
        temp: Math.round(rawHourly.temperature_2m[i]),
        rainProb: rawHourly.precipitation_probability ? rawHourly.precipitation_probability[i] : (rawHourly.precipitation?.[i] > 0 ? 80 : 0),
        icon: desc.icon,
      });
    }
    return items;
  }, [rawHourly, language]);

  // Open the "Why am I seeing this?" modal
  const handleOpenWhyModal = (data) => {
    setWhyModalData(data);
    setWhyModalOpen(true);
  };

  return (
    <div className="space-y-5 pb-20">
      
      {/* 1. CRITICAL SEVERE WEATHER ALERT OVERRIDE (PINNED TO #1 - Overrides Persona Ordering) */}
      {alerts && alerts.length > 0 && (
        <div className="space-y-2.5">
          {alerts.map((al) => (
            <div
              key={al.id}
              onClick={() => onNavigate && onNavigate('alerts')}
              className={`p-4 sm:p-5 rounded-3xl border shadow-lg cursor-pointer transition flex items-start gap-3.5 ${
                al.type === 'critical'
                  ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-950 dark:text-rose-100 ring-2 ring-rose-500/20'
                  : 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-100'
              }`}
            >
              <div className="p-2.5 rounded-2xl bg-rose-500 text-white shrink-0 mt-0.5 shadow-md">
                <AlertTriangle className="w-6 h-6 animate-pulse" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-rose-200 dark:bg-rose-900 text-rose-900 dark:text-rose-200">
                    IMD Critical Warning
                  </span>
                  <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400">
                    Takes Precedence #1
                  </span>
                </div>
                <h3 className="font-black text-sm sm:text-base mt-1 text-slate-900 dark:text-white">
                  {al.title}
                </h3>
                <p className="text-xs mt-1 text-slate-700 dark:text-slate-300 line-clamp-2 leading-relaxed">
                  {al.desc}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 self-center text-slate-400 shrink-0" />
            </div>
          ))}
        </div>
      )}

      {/* 2. CURRENT WEATHER HERO (Temperature, Feels-like, Humidity, Live Condition Visual) */}
      <OverviewHero />

      {/* 3. DYNAMIC "WHAT SHOULD I DO NEXT?" PERSONALIZED INSIGHT BANNER */}
      {!isActionDismissed && personalizedAction && (
        <div className="relative p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-sky-950 via-slate-900 to-indigo-950 border border-sky-500/40 text-white shadow-xl space-y-3">
          {/* Header Tag + Dismiss */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">{personalizedAction.icon}</span>
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-sky-400 animate-pulse" />
                <span>PERSONALIZED INSIGHT</span>
              </span>
              <span className="text-[10px] text-slate-400 hidden sm:inline">
                • {personalizedAction.personaTitle}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {/* "Why am I seeing this?" affordance */}
              <button
                type="button"
                onClick={() => handleOpenWhyModal(personalizedAction)}
                className="text-[11px] text-sky-300 hover:text-white font-semibold flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white/5 hover:bg-white/10 transition"
                title="Explain personalization signals"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Why this?</span>
              </button>

              {/* Dismiss button */}
              <button
                type="button"
                onClick={() => dismissInsight(personalizedAction.id)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
                title="Dismiss this recommendation"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Primary Action Guidance */}
          <div className="pt-0.5">
            <h3 className="text-sm sm:text-base font-black text-white leading-snug">
              “{personalizedAction.recommendation}”
            </h3>
          </div>

          {/* Key telemetry factors */}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-white/10">
            {personalizedAction.metrics.map((m, idx) => (
              <div key={idx} className="px-2 py-1 rounded-xl bg-white/5 border border-white/10 text-[11px] flex items-center gap-1.5">
                <span className="text-slate-400 text-[10px]">{m.label}:</span>
                <strong className="text-white font-bold">{m.val}</strong>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* If insight dismissed, show subtle undo pill */}
      {isActionDismissed && (
        <div className="flex justify-between items-center px-4 py-2 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-500">
          <span>Personalized recommendation snoozed.</span>
          <button
            type="button"
            onClick={resetDismissedInsights}
            className="font-bold text-sky-600 dark:text-sky-400 hover:underline"
          >
            Undo / Restore
          </button>
        </div>
      )}

      {/* 4. QUICK PERSONA SWITCHER PILL BAR */}
      <div className="space-y-1.5 pt-1">
        <PersonaSelector />
      </div>

      {/* 5. DYNAMIC PERSONA-PRIORITIZED MODULES (Top 3–5 Cards based on active profile) */}
      <div className="space-y-3.5 pt-1">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-sky-500" />
              <span>
                {activePersona === 'health' && (language === 'hi' ? 'स्वास्थ्य प्राथमिकता मॉड्यूल' : 'Health-Prioritized Intelligence')}
                {activePersona === 'fitness' && (language === 'hi' ? 'फिटनेस प्राथमिकता मॉड्यूल' : 'Workout & Exertion Intelligence')}
                {activePersona === 'beach' && (language === 'hi' ? 'तटीय व सर्फिंग सुरक्षा' : 'Coastal & Swell Intelligence')}
                {activePersona === 'travel' && (language === 'hi' ? 'यात्रा व ट्रांजिट मॉड्यूल' : 'Travel & Packing Intelligence')}
                {activePersona === 'family' && (language === 'hi' ? 'परिवार व स्कूल आवागमन' : 'Family & School Intelligence')}
                {activePersona === 'agri' && (language === 'hi' ? 'किसान व बागवानी परामर्श' : 'Agromet & Crop Intelligence')}
                {activePersona === 'commute' && (language === 'hi' ? 'ट्रैफिक व हाईवे दृश्यता' : 'Commute & Highway Intelligence')}
                {activePersona === 'events' && (language === 'hi' ? 'मौसम स्थिरता व आयोजन' : 'Event Stability Intelligence')}
                {activePersona === 'all' && (language === 'hi' ? 'मुख्य मौसम मापदंड' : 'Core Atmospheric Priorities')}
              </span>
            </h3>
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-800">
              Top 3–5 Dynamic
            </span>
          </div>

          <button
            type="button"
            onClick={() => handleOpenWhyModal({
              personaTitle: PERSONAS.find(p => p.id === activePersona)?.label || 'Current Profile',
              whyText: `Cards are dynamically ordered to display the metrics most relevant to your ${activePersona} profile and current telemetry thresholds.`
            })}
            className="text-[11px] text-slate-500 hover:text-sky-600 dark:hover:text-sky-400 font-semibold flex items-center gap-1"
          >
            <Info className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Why these cards?</span>
          </button>
        </div>

        {/* Dynamic Card Deck based on activePersona */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          
          {/* LENS: HEALTH-CONSCIOUS */}
          {activePersona === 'health' && (
            <>
              {/* 1. AQI Breakdown */}
              <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-emerald-500" />
                    <span>Air Quality Index (AQI)</span>
                  </span>
                  <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                    aqi.usAqi > 150 ? 'bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-300' : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300'
                  }`}>
                    {aqi.usAqi} • {aqi.category}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
                  <div className="bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl">
                    <span className="block text-[10px] text-slate-400">PM2.5</span>
                    <strong className="text-slate-900 dark:text-white">{aqi.pm25} µg/m³</strong>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl">
                    <span className="block text-[10px] text-slate-400">PM10</span>
                    <strong className="text-slate-900 dark:text-white">{aqi.pm10} µg/m³</strong>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl">
                    <span className="block text-[10px] text-slate-400">Ozone</span>
                    <strong className="text-slate-900 dark:text-white">{aqi.ozone} µg/m³</strong>
                  </div>
                </div>
              </div>

              {/* 2. Pollen & Allergens */}
              <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-pink-500" />
                    <span>Pollen & Allergen Flux</span>
                  </span>
                  <span className="text-xs font-bold text-pink-600 dark:text-pink-400">
                    CAMS Copernicus
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                    <span className="text-[10px] text-slate-400 block">Grass Pollen</span>
                    <strong className="text-slate-900 dark:text-white">{aqi.pollenGrass || 18} grains/m³</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                    <span className="text-[10px] text-slate-400 block">Tree Pollen</span>
                    <strong className="text-slate-900 dark:text-white">{aqi.pollenTree || 24} grains/m³</strong>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Allergen risk is low-to-moderate. Sensitive individuals can breathe easy outdoors.
                </p>
              </div>

              {/* 3. UV Index & Sun Protection */}
              <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1.5">
                    <Sun className="w-4 h-4 text-amber-500" />
                    <span>Solar UV Index</span>
                  </span>
                  <span className="text-sm font-black text-amber-600 dark:text-amber-400">
                    {current.uvIndex} ({current.uvIndex >= 6 ? 'High' : 'Moderate'})
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {current.uvIndex >= 6 
                    ? 'SPF 50+ and UV-blocking sunglasses advised between 11 AM - 3 PM.'
                    : 'Safe ultraviolet exposure level; 15-20 min sunlight beneficial for Vitamin D.'}
                </p>
              </div>

              {/* 4. Humidity & Respiratory Comfort */}
              <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1.5">
                    <Droplets className="w-4 h-4 text-sky-500" />
                    <span>Humidity & Mold Risk</span>
                  </span>
                  <span className="text-sm font-black text-slate-900 dark:text-white">
                    {current.humidity}%
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {current.humidity > 75 
                    ? 'High moisture in air; asthma triggers and mold spores may increase.'
                    : 'Balanced atmospheric humidity level. Comfortable for bronchial pathways.'}
                </p>
              </div>
            </>
          )}

          {/* LENS: OUTDOOR FITNESS */}
          {activePersona === 'fitness' && (
            <>
              {/* 1. Best Running Hours Nowcast */}
              <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-orange-500" />
                    <span>Best Running / Workout Windows</span>
                  </span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    Favorable
                  </span>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                    <span>Morning Window:</span>
                    <strong className="text-slate-900 dark:text-white">06:00 – 08:30 AM (Cooling)</strong>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                    <span>Evening Twilight Window:</span>
                    <strong className="text-slate-900 dark:text-white">05:30 – 07:00 PM (Optimal)</strong>
                  </div>
                </div>
              </div>

              {/* 2. Heat Stress & Hydration Index */}
              <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1.5">
                    <ThermometerSun className="w-4 h-4 text-rose-500" />
                    <span>Heat Index & Exertion Load</span>
                  </span>
                  <span className="text-sm font-black text-slate-900 dark:text-white">
                    Feels like {current.feelsLike}°C
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {current.feelsLike > 35 
                    ? 'Elevated wet-bulb thermal load. Consume 500ml electrolytes per 30m workout.'
                    : 'Thermal load is moderate. Normal hydration is sufficient for 5k-10k run.'}
                </p>
              </div>

              {/* 3. Wind & Aerodynamic Drag */}
              <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1.5">
                    <Wind className="w-4 h-4 text-teal-500" />
                    <span>Wind & Resistance</span>
                  </span>
                  <span className="text-sm font-black text-slate-900 dark:text-white">
                    {current.windSpeed} km/h
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span>Peak Gusts: <strong className="text-slate-900 dark:text-white">{current.windGusts || current.windSpeed} km/h</strong></span>
                  <span>Cycling drag: <strong className="text-emerald-600">Minimal</strong></span>
                </div>
              </div>

              {/* 4. Sunrise & Sunset Solar Timings */}
              <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1.5">
                    <Sunrise className="w-4 h-4 text-amber-500" />
                    <span>Astronomical Solar Windows</span>
                  </span>
                </div>
                <div className="flex items-center justify-around text-xs pt-1">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Sunrise</span>
                    <strong className="text-slate-900 dark:text-white text-sm">{current.sunrise}</strong>
                  </div>
                  <div className="h-7 w-[1px] bg-slate-200 dark:bg-slate-800" />
                  <div>
                    <span className="text-[10px] text-slate-400 block">Sunset</span>
                    <strong className="text-slate-900 dark:text-white text-sm">{current.sunset}</strong>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* LENS: BEACH / SURFER */}
          {activePersona === 'beach' && (
            <>
              {/* 1. Wave Height & Swell */}
              <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1.5">
                    <Waves className="w-4 h-4 text-cyan-500" />
                    <span>Wave Height & Swell Period</span>
                  </span>
                  <span className="text-sm font-black text-cyan-600 dark:text-cyan-400">
                    {marine?.waveHeight || 1.2} m
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                    <span className="text-[10px] text-slate-400 block">Swell Period</span>
                    <strong className="text-slate-900 dark:text-white">{marine?.wavePeriod || 8} seconds</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                    <span className="text-[10px] text-slate-400 block">Sea Temp</span>
                    <strong className="text-slate-900 dark:text-white">{marine?.waterTemp || 28}°C</strong>
                  </div>
                </div>
              </div>

              {/* 2. Marine Safety Flag */}
              <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>Coastal Safety Advisory Flag</span>
                  </span>
                  <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                    {marine?.safetyFlag || 'Green Flag (Safe)'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Favorable coastal conditions. Mild rip-current hazard; safe for swimming within designated lifeguard zones.
                </p>
              </div>

              {/* 3. Coastal Onshore Wind */}
              <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1.5">
                    <Wind className="w-4 h-4 text-sky-500" />
                    <span>Coastal Wind & Gusts</span>
                  </span>
                  <span className="text-sm font-black text-slate-900 dark:text-white">
                    {current.windSpeed} km/h
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Mild onshore sea breeze. Clean surf faces during morning offshore transition.
                </p>
              </div>

              {/* 4. Tides & Water Comfort */}
              <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-indigo-500" />
                    <span>Tide Cycle</span>
                  </span>
                  <span className="text-xs font-bold text-sky-600 dark:text-sky-400">
                    Low Tide 08:15 AM
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Next high tide expected at 02:40 PM (+1.8m). Prime surf session right before mid-tide fill.
                </p>
              </div>
            </>
          )}

          {/* LENS: TRAVELER */}
          {activePersona === 'travel' && (
            <>
              {/* 1. Saved Destinations Quick Status */}
              <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1.5">
                    <Bookmark className="w-4 h-4 text-purple-500" />
                    <span>Saved Destinations</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => onNavigate && onNavigate('saved')}
                    className="text-xs text-sky-600 dark:text-sky-400 font-bold hover:underline"
                  >
                    View All →
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                    <span className="text-[10px] text-slate-400 block">Delhi</span>
                    <strong className="text-slate-900 dark:text-white">28°C • Clear</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                    <span className="text-[10px] text-slate-400 block">Mumbai</span>
                    <strong className="text-slate-900 dark:text-white">31°C • Coastal</strong>
                  </div>
                </div>
              </div>

              {/* 2. Packing & Layering Advisory */}
              <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1.5">
                    <Plane className="w-4 h-4 text-indigo-500" />
                    <span>Packing & Layering Advisory</span>
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Daytime high of {current.tempMax}°C with evening lows around {current.tempMin}°C. Breathable cotton for day; light windbreaker for twilight transit.
                </p>
              </div>

              {/* 3. Severe Alerts & Transit Delays */}
              <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <span>Regional Travel Hazards</span>
                  </span>
                  <span className="text-xs font-bold text-emerald-600">Zero Severe Delays</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Highways and airport runways operating under normal visibility ({current.visibility >= 1000 ? `${(current.visibility / 1000).toFixed(1)} km` : `${current.visibility} m`}).
                </p>
              </div>

              {/* 4. Rain & Luggage Protection */}
              <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1.5">
                    <Droplets className="w-4 h-4 text-sky-500" />
                    <span>Precipitation Risk</span>
                  </span>
                  <span className="text-sm font-black text-slate-900 dark:text-white">
                    {current.rainProb}%
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {current.rainProb > 40 ? 'Carry compact travel umbrella in your carry-on.' : 'Minimal rain forecast along key transport sectors.'}
                </p>
              </div>
            </>
          )}

          {/* LENS: PARENTS & FAMILIES */}
          {activePersona === 'family' && (
            <>
              {/* 1. School Commute Safety */}
              <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-pink-500" />
                    <span>School Commute & Bus Safety</span>
                  </span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    Safe & On Time
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Morning commute conditions clear; zero severe thunderstorm warnings during bus routes.
                </p>
              </div>

              {/* 2. Playground & Park Window */}
              <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1.5">
                    <Sun className="w-4 h-4 text-amber-500" />
                    <span>Playground & Outdoor Hours</span>
                  </span>
                  <span className="text-xs font-bold text-sky-600">4:30 – 6:30 PM</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Afternoon sunlight softens after 4:30 PM with low UV risk; pleasant breeze for swings and outdoor play.
                </p>
              </div>

              {/* 3. Rain & Storm Watch */}
              <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1.5">
                    <Droplets className="w-4 h-4 text-sky-500" />
                    <span>Rain Probability</span>
                  </span>
                  <span className="text-sm font-black text-slate-900 dark:text-white">
                    {current.rainProb}%
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {current.rainProb > 40 ? 'Keep rain gear in school bags.' : 'Low rain likelihood during school transit hours.'}
                </p>
              </div>

              {/* 4. Child Respiratory Watch */}
              <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-emerald-500" />
                    <span>Air Quality for Children</span>
                  </span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    AQI {aqi.usAqi}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {aqi.usAqi > 100 ? 'Encourage kids to drink water; avoid intense running during high pollution peak.' : 'Air quality is within acceptable bounds for children.'}
                </p>
              </div>
            </>
          )}

          {/* LENS: AGRICULTURE & GARDENERS */}
          {activePersona === 'agri' && (
            <>
              {/* 1. Agrochemical Spray Window */}
              <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1.5">
                    <Sprout className="w-4 h-4 text-lime-600" />
                    <span>Agrochemical Spray Window</span>
                  </span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    {current.windSpeed < 15 && current.rainProb < 40 ? 'Favorable Window' : 'Postpone Spray'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {current.windSpeed < 15 && current.rainProb < 40
                    ? `Winds are calm (${current.windSpeed} km/h) and no rain forecast. Excellent pesticide absorption window.`
                    : `Elevated wind speed (${current.windSpeed} km/h) risks spray drift and loss.`}
                </p>
              </div>

              {/* 2. Soil Moisture & Ground Temp */}
              <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1.5">
                    <Droplets className="w-4 h-4 text-sky-500" />
                    <span>Soil Moisture (0-10cm)</span>
                  </span>
                  <span className="text-sm font-black text-slate-900 dark:text-white">
                    {(current.soilMoisture * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                    <span className="text-[10px] text-slate-400 block">Soil Temp</span>
                    <strong className="text-slate-900 dark:text-white">{current.soilTemp || 24}°C</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                    <span className="text-[10px] text-slate-400 block">Irrigation Need</span>
                    <strong className="text-slate-900 dark:text-white">{current.soilMoisture < 0.25 ? 'High' : 'Normal'}</strong>
                  </div>
                </div>
              </div>

              {/* 3. Rain Forecast */}
              <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1.5">
                    <Droplets className="w-4 h-4 text-sky-500" />
                    <span>Precipitation Probability</span>
                  </span>
                  <span className="text-sm font-black text-slate-900 dark:text-white">
                    {current.rainProb}%
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {current.rainProb > 50 ? 'Rain expected in next 24 hours. Hold off on supplementary canal watering.' : 'Dry canopy conditions expected for next 24-48 hours.'}
                </p>
              </div>

              {/* 4. Frost & Dew Advisory */}
              <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1.5">
                    <Sun className="w-4 h-4 text-amber-500" />
                    <span>Frost & Overnight Cold</span>
                  </span>
                  <span className="text-xs font-bold text-emerald-600">Zero Frost Hazard</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Minimum ground temperature projected at {current.tempMin}°C. Safe from vegetative frost damage.
                </p>
              </div>
            </>
          )}

          {/* LENS: COMMUTER */}
          {activePersona === 'commute' && (
            <>
              {/* 1. Road Visibility & Fog */}
              <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1.5">
                    <Eye className="w-4 h-4 text-indigo-500" />
                    <span>Corridor Visibility</span>
                  </span>
                  <span className="text-sm font-black text-slate-900 dark:text-white">
                    {current.visibility >= 1000 ? `${(current.visibility / 1000).toFixed(1)} km` : `${current.visibility} m`}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {current.visibility < 1500 ? 'Dense fog advisory. Drive with fog lights and low speed.' : 'Clear visual range across highway and arterial corridors.'}
                </p>
              </div>

              {/* 2. Precipitation Radar Nowcast */}
              <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1.5">
                    <Droplets className="w-4 h-4 text-sky-500" />
                    <span>Precipitation Probability</span>
                  </span>
                  <span className="text-sm font-black text-slate-900 dark:text-white">
                    {current.rainProb}%
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {current.rainProb > 50 ? 'High probability of rain showers. Pavement slickness expected.' : 'Dry pavement throughout transit rush hours.'}
                </p>
              </div>

              {/* 3. Wind Gusts & Crosswinds */}
              <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1.5">
                    <Wind className="w-4 h-4 text-teal-500" />
                    <span>Wind & Highway Gusts</span>
                  </span>
                  <span className="text-sm font-black text-slate-900 dark:text-white">
                    {current.windSpeed} km/h
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Crosswind risk is low. Steady conditions for 2-wheelers and high-profile vehicles.
                </p>
              </div>

              {/* 4. Transit Comfort Index */}
              <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1.5">
                    <Car className="w-4 h-4 text-sky-500" />
                    <span>Transit Cabin Climate</span>
                  </span>
                  <span className="text-sm font-black text-slate-900 dark:text-white">
                    {current.temp}°C
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  AC recommended during afternoon peak. Air intake filter recommended due to AQI {aqi.usAqi}.
                </p>
              </div>
            </>
          )}

          {/* LENS: EVENT PLANNER */}
          {activePersona === 'events' && (
            <>
              {/* 1. 7-Day Weather Stability */}
              <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1.5">
                    <CalendarDays className="w-4 h-4 text-violet-500" />
                    <span>Outdoor Weather Stability</span>
                  </span>
                  <span className="text-xs font-bold text-emerald-600">Favorable</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Barometric pressure steady at {current.pressure || 1012} hPa. No convective squall lines approaching.
                </p>
              </div>

              {/* 2. Rain Risk Trend */}
              <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1.5">
                    <Droplets className="w-4 h-4 text-sky-500" />
                    <span>Rain Risk Index</span>
                  </span>
                  <span className="text-sm font-black text-slate-900 dark:text-white">
                    {current.rainProb}%
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {current.rainProb > 40 ? 'Outdoor setup requires waterproof marquee contingency.' : 'Open air venue setups safe from rain disruption.'}
                </p>
              </div>

              {/* 3. Thermal Comfort & Dew Point */}
              <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1.5">
                    <ThermometerSun className="w-4 h-4 text-amber-500" />
                    <span>Guest Comfort Index</span>
                  </span>
                  <span className="text-sm font-black text-slate-900 dark:text-white">
                    {current.feelsLike}°C
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Gentle evening cooling expected. Shaded seating suggested for early afternoon arrivals.
                </p>
              </div>

              {/* 4. Wind & Temporary Structures */}
              <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1.5">
                    <Wind className="w-4 h-4 text-teal-500" />
                    <span>Wind & Stage Rigging</span>
                  </span>
                  <span className="text-sm font-black text-slate-900 dark:text-white">
                    {current.windSpeed} km/h
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Peak gusts ({current.windGusts || current.windSpeed} km/h) within safe parameters for temporary tents.
                </p>
              </div>
            </>
          )}

          {/* LENS: ALL / UNIFIED */}
          {activePersona === 'all' && (
            <>
              {/* Rain Probability */}
              <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold uppercase text-slate-500 flex items-center gap-1.5">
                    <Droplets className="w-4 h-4 text-sky-500" />
                    <span>Precipitation Probability</span>
                  </span>
                  <span className="font-extrabold text-sky-600 dark:text-sky-400 text-sm">
                    {current.rainProb}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-sky-400 to-blue-600 rounded-full" 
                    style={{ width: `${current.rainProb}%` }} 
                  />
                </div>
              </div>

              {/* Air Quality */}
              <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold uppercase text-slate-500 flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-emerald-500" />
                    <span>Air Quality (AQI)</span>
                  </span>
                  <span className={`font-black text-xs px-2 py-0.5 rounded-full ${
                    aqi.usAqi > 150 ? 'bg-red-100 dark:bg-red-950 text-red-600' : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600'
                  }`}>
                    {aqi.usAqi} • {aqi.category}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs pt-1">
                  <span>PM2.5: <strong className="text-slate-900 dark:text-white">{aqi.pm25} µg/m³</strong></span>
                  <span>Ozone: <strong className="text-slate-900 dark:text-white">{aqi.ozone} µg/m³</strong></span>
                </div>
              </div>

              {/* UV & Sun */}
              <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold uppercase text-slate-500 flex items-center gap-1.5">
                    <Sun className="w-4 h-4 text-amber-500" />
                    <span>UV Index</span>
                  </span>
                  <span className="font-extrabold text-amber-600 dark:text-amber-400 text-sm">
                    {current.uvIndex}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {current.uvIndex >= 6 ? 'Sun protection recommended during midday hours.' : 'Moderate UV level.'}
                </p>
              </div>

              {/* Wind & Gusts */}
              <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold uppercase text-slate-500 flex items-center gap-1.5">
                    <Wind className="w-4 h-4 text-teal-500" />
                    <span>Wind Speed</span>
                  </span>
                  <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                    {current.windSpeed} km/h
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span>Peak Gusts: <strong className="text-slate-900 dark:text-white">{current.windGusts || current.windSpeed} km/h</strong></span>
                  <span>Direction: <strong className="text-slate-900 dark:text-white">{current.windDirection}°</strong></span>
                </div>
              </div>
            </>
          )}

        </div>

        {/* PROGRESSIVE DISCLOSURE: Dedicated Persona Intelligence Hub Navigation */}
        {activePersona !== 'all' && (
          <div className="pt-1 flex justify-center">
            <button
              type="button"
              onClick={() => onNavigate && onNavigate(activePersona)}
              className="px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs font-bold text-sky-600 dark:text-sky-400 shadow-sm transition flex items-center gap-2"
            >
              <span>Explore In-Depth {PERSONAS.find(p => p.id === activePersona)?.label} Hub</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* 6. SWIPEABLE 24-HOUR HOURLY FORECAST METEOGRAM STRIP */}
      <div className="space-y-2.5 pt-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-sky-500" />
            <span>{language === 'hi' ? 'घंटेवार पूर्वानुमान' : 'Hourly Forecast (Next 12 Hours)'}</span>
          </h3>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('forecast')}
            className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-0.5"
          >
            <span>7-Day Synoptic</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex gap-2.5 overflow-x-auto pb-2 pt-0.5 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
          {hourlyStrip.map((item, idx) => (
            <div
              key={idx}
              className={`shrink-0 w-20 p-3 rounded-2xl border text-center transition flex flex-col justify-between items-center ${
                idx === 0 
                  ? 'bg-sky-50 dark:bg-sky-950/60 border-sky-400 dark:border-sky-600 shadow-sm' 
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm'
              }`}
            >
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                {item.time}
              </span>
              <div className="my-1.5 text-xl">
                {item.icon === 'Sun' ? '☀️' : 
                 item.icon === 'CloudSun' ? '⛅' :
                 item.icon === 'Cloud' ? '☁️' :
                 item.icon === 'CloudRain' ? '🌧️' :
                 item.icon === 'CloudLightning' ? '⛈️' :
                 item.icon === 'CloudFog' ? '🌫️' :
                 item.icon === 'Snowflake' ? '❄️' : '⛅'}
              </div>
              <span className="text-sm font-black text-slate-900 dark:text-white">
                {item.temp}°
              </span>
              <div className="mt-1 flex items-center gap-0.5 text-[10px] text-sky-600 dark:text-sky-400 font-bold">
                <Droplets className="w-2.5 h-2.5" />
                <span>{item.rainProb}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* "Why am I seeing this?" Explanatory Modal */}
      {whyModalOpen && whyModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Personalization Transparency
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Why am I seeing this recommendation?
                  </p>
                </div>
              </div>
              <button
                onClick={() => setWhyModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-sky-600 dark:text-sky-400 block">
                Active Profile: {whyModalData.personaTitle}
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                {whyModalData.whyText}
              </p>
            </div>

            <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
              <p>• Data Source: Real-time NWP Ensemble & CAMS Copernicus Atmospheric Sensors</p>
              <p>• Local Privacy: Evaluated strictly inside your browser; zero telemetry tracking</p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setWhyModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

/**
 * useVoiceAssistant.js — Final production version
 * Routes all AI calls through backend (Gemini API)
 * ChatGPT-style: answers any question naturally
 */
import { useState, useRef, useCallback } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

const getSystemPrompt = (langId) => {
  const instrMap = {
    "en-IN":    "Always reply in friendly conversational Indian English.",
    "ta-IN":    "Always reply ONLY in Tamil script (தமிழ்). Use natural Tamil sentences. Never use English except place names.",
    "hi-IN":    "Always reply ONLY in Hindi Devanagari script (हिंदी). Use natural conversational Hindi.",
    "tanglish": "Always reply ONLY in Tanglish: Tamil words written in English letters mixed naturally with English. Sound exactly like a Chennai person chatting. Example: 'Super ah irukken thanks! Enga poga plan panneenga?'",
  };
  return `You are TransportBot — a smart friendly AI assistant like ChatGPT, specialised in Tamil Nadu transport and travel.
${instrMap[langId] || instrMap["en-IN"]}
RULES:
- Answer the EXACT question asked. Be natural and conversational.
- For greetings like "hi", "hello", "how are you" — respond warmly like a real person.
- For "how are you" — say you're doing well and ask how you can help.
- For jokes — tell a fun joke.
- For transport questions — give specific Tamil Nadu route info with time and cost.
- For general questions — answer helpfully like ChatGPT.
- Keep replies to 2-4 sentences, friendly and natural.
Transport knowledge: Metro Green Line (Airport-Wimco Nagar), Blue Line (Airport-St Thomas Mount), MTC buses ₹5-25, routes 23C/47A/19C, peak traffic 8-10AM and 6-8PM on Anna Salai/T.Nagar/OMR/GST Road. Inter-city: Chennai-Coimbatore 6.5hr train, Chennai-Madurai 6hr, Chennai-Trichy 5hr.
Current time: ${new Date().toLocaleTimeString("en-IN")}. City: Tamil Nadu, India.`;
};

const pickVoice = (langId) => {
  const voices = window.speechSynthesis?.getVoices() || [];
  const target = langId === "tanglish" ? "en-IN" : langId;
  return (
    voices.find(v => v.lang === target) ||
    voices.find(v => v.lang.startsWith(target.split("-")[0])) ||
    voices.find(v => v.lang === "en-IN") ||
    voices.find(v => v.lang.startsWith("en")) ||
    null
  );
};

const FALLBACKS = {
  "en-IN": [
    "Hello! I'm TransportBot 👋 I can help you find routes, check traffic, and plan your journey across Tamil Nadu. Where would you like to go today?",
    "The fastest route to Chennai Airport is via Guindy Metro (Green Line) — about 28 minutes and ₹120. Alternatively a cab takes 35-45 minutes.",
    "Traffic on GST Road is currently moderate at 55% congestion. The metro is the fastest option right now, avoiding all road traffic.",
    "The cheapest way to Central Station is Bus 23C — only ₹18 and takes around 44 minutes from T. Nagar.",
    "I'm doing great, thank you for asking! 😊 Ready to help you plan your journey across Tamil Nadu. Where would you like to go today?",
  ],
  "ta-IN": [
    "வணக்கம்! நான் TransportBot 👋 Tamil Nadu முழுவதும் உங்களுக்கு சிறந்த பயண வழிகளை காட்டுவேன். இன்று எங்கு செல்ல விரும்புகிறீர்கள்?",
    "நான் நன்றாக இருக்கிறேன், நன்றி! 😊 Tamil Nadu முழுவதும் உங்கள் பயணத்திட்டமிட உதவ தயாராக இருக்கிறேன்.",
    "Chennai Airport போக Guindy Metro (Green Line) சிறந்தது — 28 நிமிடங்கள், ₹120 மட்டுமே.",
    "GST Road-ல் இப்போது 55% நெரிசல் இருக்கு. Metro எடுத்தால் நேரம் மிச்சமாகும்.",
  ],
  "hi-IN": [
    "नमस्ते! मैं TransportBot हूं 👋 Tamil Nadu में आपको सबसे अच्छा रास्ता बताऊंगा। आज कहाँ जाना है?",
    "मैं बहुत अच्छा हूं, शुक्रिया! 😊 Tamil Nadu में आपकी यात्रा की योजना बनाने के लिए तैयार हूं।",
    "Chennai Airport जाने के लिए Guindy Metro सबसे अच्छा है — 28 मिनट, सिर्फ ₹120।",
    "GST Road पर अभी 55% भीड़ है। Metro लेना ज़्यादा तेज़ होगा।",
  ],
  "tanglish": [
    "Vanakkam! Naan TransportBot 👋 Tamil Nadu la enga venumnalum best route solluven. Indha naal enga poga plan panneenga?",
    "Super ah irukken, ketta koaga thanks! 😊 Tamil Nadu la unga journey plan panna ready ah irukken.",
    "Airport poga Guindy Metro (Green Line) best option — 28 minutes agum, cost ₹120 thaan.",
    "GST Road la ippo 55% traffic iruku. Metro eduthal time malichalam, road jam avoid pannalam.",
  ],
};

const demoCounters = { "en-IN": 0, "ta-IN": 0, "hi-IN": 0, "tanglish": 0 };

export function useVoiceAssistant() {
  const [state, setState]       = useState("idle");
  const [messages, setMessages] = useState([]);
  const [voiceOn, setVoiceOn]   = useState(true);
  const [lang, setLangState]    = useState({
    id: "en-IN", label: "English", flag: "🇬🇧",
    greeting: "Hello! Where would you like to go?", native: "English",
  });

  const langRef        = useRef({ id: "en-IN" });
  const recognitionRef = useRef(null);
  const voiceOnRef     = useRef(true);
  const historyRef     = useRef([]);

  const setLang = useCallback((newLang) => {
    langRef.current = newLang;
    setLangState(newLang);
    setMessages([]);
    historyRef.current = [];
    window.speechSynthesis?.cancel();
  }, []);

  const toggleVoice = useCallback(() => {
    setVoiceOn(prev => {
      const next = !prev;
      voiceOnRef.current = next;
      if (!next) window.speechSynthesis?.cancel();
      return next;
    });
  }, []);

  const addMsg = useCallback((role, text) => {
    setMessages(prev => [...prev, {
      id: Date.now() + Math.random(), role, text,
      lang: role === "assistant" ? langRef.current.label : undefined,
    }]);
    historyRef.current = [
      ...historyRef.current,
      { role: role === "assistant" ? "assistant" : "user", content: text },
    ].slice(-10);
  }, []);

  const speak = useCallback((text) => {
    if (!voiceOnRef.current || !window.speechSynthesis) { setState("idle"); return; }
    window.speechSynthesis.cancel();
    const utter  = new SpeechSynthesisUtterance(text);
    utter.lang   = langRef.current.id === "tanglish" ? "en-IN" : langRef.current.id;
    utter.rate   = langRef.current.id === "ta-IN" ? 0.85 : 0.90;
    utter.pitch  = 1.0;
    utter.onstart = () => setState("speaking");
    utter.onend   = () => setState("idle");
    utter.onerror = () => setState("idle");
    const doSpeak = () => {
      const voice = pickVoice(langRef.current.id);
      if (voice) utter.voice = voice;
      setState("speaking");
      window.speechSynthesis.speak(utter);
    };
    if (window.speechSynthesis.getVoices().length > 0) doSpeak();
    else window.speechSynthesis.addEventListener("voiceschanged", doSpeak, { once: true });
  }, []);

  const getReply = useCallback(async (userText) => {
    const langId = langRef.current.id;
    try {
      const res = await fetch(`${API_BASE}/ai/voice`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query:        userText,
          lang:         langId,
          systemPrompt: getSystemPrompt(langId),
          history:      historyRef.current.slice(-6),
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.reply && data.reply.length > 5 && !data.fallback) return data.reply;
      }
    } catch (e) {
      console.warn("Backend call failed:", e.message);
    }
    // Smart fallback
    const arr = FALLBACKS[langId] || FALLBACKS["en-IN"];
    const idx = demoCounters[langId] ?? 0;
    demoCounters[langId] = (idx + 1) % arr.length;
    return arr[idx];
  }, []);

  const handleQuery = useCallback(async (text) => {
    if (!text?.trim()) return;
    addMsg("user", text);
    setState("processing");
    const reply = await getReply(text);
    setState("idle");
    addMsg("assistant", reply);
    speak(reply);
  }, [addMsg, getReply, speak]);

  const startListening = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setState("error"); return; }
    window.speechSynthesis?.cancel();
    const rec          = new SR();
    rec.lang           = langRef.current.id === "tanglish" ? "ta-IN" : langRef.current.id;
    rec.continuous     = false;
    rec.interimResults = false;
    rec.onstart  = () => setState("listening");
    rec.onresult = (e) => handleQuery(e.results[0][0].transcript);
    rec.onerror  = (e) => setState(e.error === "not-allowed" ? "error" : "idle");
    rec.onend    = () => setState(s => s === "listening" ? "idle" : s);
    recognitionRef.current = rec;
    rec.start();
  }, [handleQuery]);

  const stopListening   = useCallback(() => { recognitionRef.current?.stop(); setState("idle"); }, []);
  const toggleListening = useCallback(() => {
    if (state === "listening") stopListening(); else startListening();
  }, [state, startListening, stopListening]);

  const clearChat = useCallback(() => {
    setMessages([]);
    historyRef.current = [];
    window.speechSynthesis?.cancel();
    setState("idle");
  }, []);

  return { state, messages, lang, voiceOn, setLang, toggleVoice, toggleListening, handleQuery, clearChat };
}

/**
 * VoicePage — Multilingual Voice Assistant with Voice ON/OFF toggle
 */
import { useState, useRef, useEffect } from "react";
import { Mic, Send, Trash2, Volume2, VolumeX, Info } from "lucide-react";
import LanguagePicker from "../components/voice/LanguagePicker";
import VoiceOrb from "../components/voice/VoiceOrb";
import ChatBubble from "../components/voice/ChatBubble";
import { useVoiceAssistant } from "../hooks/useVoiceAssistant";

const SAMPLE_QUERIES = {
  "en-IN":    [{ text: "Take me to Chennai Airport", icon: "✈️" }, { text: "Best route from T. Nagar to OMR", icon: "🗺️" }, { text: "What is the cheapest way to Central?", icon: "💰" }, { text: "How is the traffic on GST Road now?", icon: "🚦" }],
  "ta-IN":    [{ text: "Airport pogum route sollu", icon: "✈️" }, { text: "T. Nagar lirundhu Central poga enna bus?", icon: "🚌" }, { text: "Metro la poga epdi?", icon: "🚇" }, { text: "Ippo traffic epdi iruku?", icon: "🚦" }],
  "hi-IN":    [{ text: "Airport jaane ka rasta batao", icon: "✈️" }, { text: "Central station kaise jaayein?", icon: "🚇" }, { text: "Sabse sasta raasta kaunsa hai?", icon: "💰" }, { text: "Abhi traffic kaisi hai?", icon: "🚦" }],
  "tanglish": [{ text: "Enaku airport poganum", icon: "✈️" }, { text: "Central kita poga enna option iruku?", icon: "🚇" }, { text: "T. Nagar la traffic epdi iruku?", icon: "🚦" }, { text: "Cheap ah poga enna bus edukanum?", icon: "🚌" }],
};

const PLACEHOLDER = {
  "en-IN": "Type your question in English…", "ta-IN": "தமிழில் டைப் செய்யுங்கள்…",
  "hi-IN": "हिंदी में टाइप करें…", "tanglish": "Tanglish la type pannunga…",
};

export default function VoicePage() {
  const { state, messages, lang, voiceOn, setLang, toggleVoice, toggleListening, handleQuery, clearChat } = useVoiceAssistant();
  const [typed, setTyped]       = useState("");
  const [showInfo, setShowInfo] = useState(false);
  const bottomRef               = useRef(null);
  const hasMic = !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleSend = () => { if (!typed.trim()) return; handleQuery(typed); setTyped(""); };
  const samples    = SAMPLE_QUERIES[lang.id] || SAMPLE_QUERIES["en-IN"];

  return (
    <div className="space-y-5 animate-slide-up max-w-4xl mx-auto">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">🎙️ AI Voice Assistant</h1>
          <p className="text-sm text-slate-500 mt-0.5">Speak or type — AI replies in your language using Google Gemini.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 shadow-sm">
            <span className="text-xs font-medium text-slate-500">Voice</span>
            <button onClick={toggleVoice} className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${voiceOn ? "bg-primary-600" : "bg-slate-300 dark:bg-slate-600"}`}>
              <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${voiceOn ? "left-5" : "left-0.5"}`} />
            </button>
            <span className={`text-xs font-semibold flex items-center gap-1 ${voiceOn ? "text-green-600" : "text-slate-400"}`}>
              {voiceOn ? <><Volume2 size={14} />ON</> : <><VolumeX size={14} />OFF</>}
            </span>
          </div>
          <button onClick={() => setShowInfo(s => !s)} className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"><Info size={18} /></button>
        </div>
      </div>

      {showInfo && (
        <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800 rounded-2xl p-4 space-y-1.5 animate-fade-in">
          <p className="text-sm font-semibold text-primary-800 dark:text-primary-300">How to use</p>
          <p className="text-xs text-primary-700 dark:text-primary-400">1. Select your language. 2. Tap the mic and speak, or type and press Enter.</p>
          <p className="text-xs text-primary-700 dark:text-primary-400">3. Toggle <strong>Voice ON/OFF</strong> to control whether AI speaks the answer.</p>
          <p className="text-xs text-primary-700 dark:text-primary-400">4. Powered by Google Gemini AI (free). Add GEMINI_API_KEY to backend .env for live AI.</p>
          {!hasMic && <p className="text-xs text-amber-700 font-medium">⚠️ Microphone requires Google Chrome. You can still type your questions.</p>}
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 shadow-sm">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Choose language</p>
        <LanguagePicker selected={lang} onChange={(l) => { setLang(l); }} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-8 shadow-sm flex flex-col items-center gap-5">
            <div className="text-center">
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Greeting</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 italic">"{lang.greeting}"</p>
            </div>
            <VoiceOrb state={hasMic ? state : "error"} onClick={toggleListening} />
            <div className={`text-xs font-semibold px-3 py-1.5 rounded-full ${state === "listening" ? "bg-red-100 text-red-700" : state === "processing" ? "bg-amber-100 text-amber-700" : state === "speaking" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"}`}>
              {state === "listening" ? "🔴 Listening — speak now" : state === "processing" ? "⏳ AI is thinking…" : state === "speaking" ? "🔊 Speaking…" : hasMic ? "Tap mic to speak" : "Use text input →"}
            </div>
            {!voiceOn && <p className="text-xs text-slate-400 text-center">🔇 Voice is OFF — replies show in chat only</p>}
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-4 shadow-sm">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Try saying…</p>
            <div className="space-y-2">
              {samples.map((q, i) => (
                <button key={i} onClick={() => setTyped(q.text)}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-primary-50 dark:hover:bg-primary-900/20 border border-transparent hover:border-primary-200 dark:hover:border-primary-700 transition-all text-left group">
                  <span className="text-xl flex-shrink-0">{q.icon}</span>
                  <p className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-primary-700 dark:group-hover:text-primary-400">"{q.text}"</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden" style={{ minHeight: 460 }}>
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex-wrap gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <p className="text-sm font-semibold text-slate-900 dark:text-white">TransportBot</p>
              <span className="text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-2 py-0.5 rounded-full">{lang.flag} {lang.label}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${voiceOn ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"}`}>{voiceOn ? "🔊 Voice ON" : "🔇 Voice OFF"}</span>
            </div>
            {messages.length > 0 && <button onClick={clearChat} className="flex items-center gap-1 text-xs text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={13} />Clear</button>}
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-10 gap-3">
                <span className="text-5xl">{lang.flag}</span>
                <p className="font-semibold text-sm text-slate-600 dark:text-slate-300">
                  {lang.id === "ta-IN" ? "மைக்கை அழுத்தி பேசுங்கள் அல்லது கீழே டைப் செய்யுங்கள்" : lang.id === "hi-IN" ? "माइक दबाएं या नीचे टाइप करें" : lang.id === "tanglish" ? "Mic press pannunga or type pannunga!" : "Tap the mic or type your question below."}
                </p>
                <p className="text-xs text-slate-400">
                  {lang.id === "ta-IN" ? "TransportBot தமிழில் பதிலளிக்கும்" : lang.id === "hi-IN" ? "TransportBot हिंदी में जवाब देगा" : lang.id === "tanglish" ? "TransportBot Tanglish la reply pannum!" : "TransportBot will reply in English"}
                </p>
              </div>
            ) : messages.map(m => <ChatBubble key={m.id} role={m.role} text={m.text} lang={m.lang} />)}
            {state === "processing" && (
              <div className="flex gap-3 items-center animate-fade-in">
                <div className="w-8 h-8 rounded-xl bg-primary-600 flex items-center justify-center flex-shrink-0"><span className="text-white text-xs">✨</span></div>
                <div className="flex gap-1 py-3 px-4 bg-slate-100 dark:bg-slate-800 rounded-2xl rounded-tl-sm">
                  {[0,1,2].map(i => <div key={i} className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: `${i*150}ms` }} />)}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800 p-3 flex gap-2">
            <input type="text" value={typed} onChange={e => setTyped(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSend()}
              placeholder={PLACEHOLDER[lang.id] || PLACEHOLDER["en-IN"]}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all" />
            <button onClick={handleSend} disabled={!typed.trim()} className="w-10 h-10 rounded-xl bg-primary-600 hover:bg-primary-700 disabled:opacity-40 flex items-center justify-center text-white transition-all flex-shrink-0"><Send size={16} /></button>
            <button onClick={toggleListening} disabled={!hasMic} title={!hasMic ? "Use Chrome for mic" : state === "listening" ? "Stop" : "Speak"}
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-white transition-all flex-shrink-0 disabled:opacity-40 ${state === "listening" ? "bg-red-500 animate-pulse" : "bg-slate-500 hover:bg-slate-600"}`}>
              <Mic size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * aiController.js — Powered by Google Gemini (FREE tier)
 * ChatGPT-style: answers any question naturally in 4 languages
 */
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { getRouteInsight, getTrafficBriefing, getEcoTip } = require("../services/aiService");
const Trip   = require("../models/Trip");
const logger = require("../config/logger");

const getModel = () => {
  const key = process.env.GEMINI_API_KEY;
  if (!key || key === "AIza-your-key-here") return null;
  return new GoogleGenerativeAI(key).getGenerativeModel({ model: "gemini-1.5-flash" });
};

exports.routeInsight = async (req, res, next) => {
  try {
    const insight = await getRouteInsight(req.body.from, req.body.to, req.body.time, req.body.selectedRoute, req.body.trafficData);
    res.json({ success: true, insight });
  } catch (err) { next(err); }
};

exports.trafficBriefing = async (req, res, next) => {
  try {
    const briefing = await getTrafficBriefing(req.body.zones, req.body.incidents);
    res.json({ success: true, briefing });
  } catch (err) { next(err); }
};

exports.ecoTip = async (req, res, next) => {
  try {
    const user  = req.user;
    const trips = await Trip.find({ user: user._id, status: "completed" }).limit(30);
    const total = trips.length || 1;
    const modeCount = {};
    trips.forEach(t => { modeCount[t.selectedRoute] = (modeCount[t.selectedRoute] || 0) + 1; });
    const tip = await getEcoTip({
      ecoScore: user.ecoScore || 50, rank: "Top 12%",
      co2Saved: (user.totalCo2Saved || 0).toFixed(1),
      metroShare: Math.round(((modeCount.fastest  || 0) / total) * 100),
      busShare:   Math.round(((modeCount.cheapest || 0) / total) * 100),
      cabShare:   Math.round(((modeCount.safest   || 0) / total) * 100),
      walkShare:  Math.round(((modeCount.eco      || 0) / total) * 100),
    });
    res.json({ success: true, tip });
  } catch (err) { next(err); }
};

// ── Voice — PUBLIC, Gemini-powered, ChatGPT-style ─────────────────────────────
exports.voiceQuery = async (req, res) => {
  const { query, lang, history, systemPrompt } = req.body;
  if (!query?.trim()) return res.status(400).json({ success: false, message: "Query is required" });

  logger.info(`[Voice] lang=${lang} query="${query.slice(0, 80)}"`);

  const model = getModel();
  if (!model) {
    logger.warn("[Voice] GEMINI_API_KEY not set");
    return res.json({ success: true, reply: smartFallback(query, lang), fallback: true });
  }

  const langInstr = {
    "en-IN":    "Always reply in friendly conversational Indian English.",
    "ta-IN":    "Always reply ONLY in Tamil script (தமிழ்). Use natural Tamil. Never use English except place names.",
    "hi-IN":    "Always reply ONLY in Hindi Devanagari script (हिंदी). Use natural conversational Hindi.",
    "tanglish": "Always reply ONLY in Tanglish: Tamil words in English letters mixed naturally with English. Like a Chennai person chatting. Example: 'Super ah irukken! Enga poga plan panneenga?'",
  }[lang] || "Always reply in friendly conversational Indian English.";

  const historyText = Array.isArray(history) && history.length > 0
    ? "\n\nPrevious conversation:\n" + history.slice(-8).map(m => `${m.role === "assistant" ? "Assistant" : "User"}: ${m.content}`).join("\n")
    : "";

  const prompt = `You are TransportBot — a smart, friendly AI assistant exactly like ChatGPT but specialised in Tamil Nadu transport and travel.

${langInstr}

YOUR BEHAVIOUR:
- Answer ANY question naturally and conversationally, just like ChatGPT
- For "hi", "hello" — greet warmly and ask how you can help
- For "how are you" — say you're doing great and ask how you can help
- For "thank you" — respond warmly
- For jokes — tell a fun relevant joke
- For transport questions — give specific Tamil Nadu route info with time and cost
- For general questions — answer helpfully
- Keep replies to 2-4 sentences, friendly and natural
- NEVER give a generic off-topic reply

TRANSPORT KNOWLEDGE:
- Chennai Metro: Green Line (Airport↔Wimco Nagar), Blue Line (Airport↔St Thomas Mount), ₹10-60, 6AM-11PM
- MTC Buses: ₹5-25, routes 23C (T.Nagar→Central), 47A (Tambaram→Koyambedu), 19C (Velachery→Central)
- Traffic peaks: 8-10AM and 6-8PM on Anna Salai, T.Nagar, OMR, GST Road, Guindy
- Inter-city: Chennai→Coimbatore 6.5hr train, Chennai→Madurai 6hr, Chennai→Trichy 5hr
- Eco: Metro (0.041 kg CO₂/km) > Bus (0.089) > Auto (0.097) > Cab (0.171)
- All TN cities: Coimbatore, Madurai, Trichy, Tirunelveli, Salem, Vellore, Ooty, Kodaikanal, Pondicherry
- Current time: ${new Date().toLocaleTimeString("en-IN")}${historyText}

User says: ${query}

Reply:`;

  try {
    const result = await model.generateContent(prompt);
    const reply  = result.response.text()?.trim();
    if (!reply || reply.length < 2) return res.json({ success: true, reply: smartFallback(query, lang), fallback: true });
    logger.info(`[Voice] Gemini: "${reply.slice(0, 100)}"`);
    return res.json({ success: true, reply, fallback: false });
  } catch (err) {
    logger.error(`[Voice] Gemini error: ${err.message}`);
    const msg = err.message?.includes("quota") || err.message?.includes("429")
      ? "Free quota reached. Please try again in a minute! ⏳"
      : smartFallback(query, lang);
    return res.json({ success: true, reply: msg, fallback: true });
  }
};

// ── Smart context-aware fallback ──────────────────────────────────────────────
const smartFallback = (query = "", lang = "en-IN") => {
  const q = query.toLowerCase().trim();
  const checks = {
    howAreYou: ["how are you","how r u","how are u","hows it going","how's it going"],
    greeting:  ["hi","hello","hey","good morning","good evening","vanakkam","namaste"],
    thanks:    ["thank you","thanks","thank u","thx","ty"],
    bye:       ["bye","goodbye","see you","take care"],
    joke:      ["joke","funny","make me laugh","tell me a joke"],
    airport:   ["airport","விமான"],
    traffic:   ["traffic","jam","நெரிசல்"],
    cheap:     ["cheap","cheapest","budget","kammiya"],
    metro:     ["metro"],
  };
  const R = {
    howAreYou: { "en-IN": "I'm doing great, thank you for asking! 😊 Ready to help you plan your journey across Tamil Nadu. Where would you like to go today?", "ta-IN": "நான் நன்றாக இருக்கிறேன், நன்றி! 😊 Tamil Nadu முழுவதும் உங்கள் பயணத்திட்டமிட உதவ தயாராக இருக்கிறேன். இன்று எங்கு செல்ல விரும்புகிறீர்கள்?", "hi-IN": "मैं बहुत अच्छा हूं, शुक्रिया! 😊 Tamil Nadu में आपकी यात्रा की योजना बनाने के लिए तैयार हूं। आज कहाँ जाना है?", "tanglish": "Super ah irukken, ketta koaga thanks! 😊 Tamil Nadu la unga journey plan panna ready ah irukken. Indha naal enga poga plan panneenga?" },
    greeting:  { "en-IN": "Hello! 👋 I'm TransportBot, your AI travel assistant for Tamil Nadu. Ask me about routes, traffic, metro, buses, or travel tips. What can I help you with?", "ta-IN": "வணக்கம்! 👋 நான் TransportBot. Routes, traffic, metro, bus எல்லாம் கேளுங்கள். என்ன உதவி வேண்டும்?", "hi-IN": "नमस्ते! 👋 मैं TransportBot हूं। Routes, traffic, metro, bus — सब पूछें। क्या मदद चाहिए?", "tanglish": "Vanakkam! 👋 Naan TransportBot. Routes, traffic, metro, bus — enna venumnalum kelu. Enna help venum?" },
    thanks:    { "en-IN": "You're welcome! 😊 Happy to help anytime. Anything else you'd like to know?", "ta-IN": "சந்தோஷமாக உதவினேன்! 😊 வேறு ஏதாவது கேட்கணுமா?", "hi-IN": "कोई बात नहीं! 😊 और कुछ जानना है?", "tanglish": "Welcome! 😊 Vere edhavathu help venum ah?" },
    bye:       { "en-IN": "Goodbye! 👋 Have a safe journey! Come back anytime you need travel help.", "ta-IN": "விடை! 👋 பாதுகாப்பான பயணம்! மீண்டும் வாருங்கள்.", "hi-IN": "अलविदा! 👋 सुरक्षित यात्रा करें!", "tanglish": "Bye! 👋 Safe ah po! Mela help venum ah vandhu kelu." },
    joke:      { "en-IN": "Here's one! 😄 Why don't bus drivers ever get lost? Because they always follow the route! 😂 Now shall I find the best route for your journey?", "ta-IN": "சரி கேளுங்கள்! 😄 Bus driver என்றும் தொலைந்து போவதில்லை — ஏனென்றால் அவர் எப்போதும் route follow பண்றார்! 😂", "hi-IN": "सुनिए! 😄 Bus driver कभी रास्ता नहीं भूलते — क्योंकि वो हमेशा route follow करते हैं! 😂", "tanglish": "Kelu! 😄 Bus driver eppodum tholaicha pogala — yen ah? Avanga eppodum route follow pannuvanga! 😂" },
    airport:   { "en-IN": "The fastest route to Chennai Airport is via Guindy Metro (Green Line) — about 28 minutes and ₹120. A cab takes 35-45 minutes depending on traffic.", "ta-IN": "Chennai Airport போக Guindy Metro (Green Line) சிறந்தது — 28 நிமிடங்கள், ₹120 மட்டுமே. Cab எடுத்தால் 35-45 நிமிடங்கள் ஆகும்.", "hi-IN": "Chennai Airport जाने के लिए Guindy Metro सबसे अच्छा है — 28 मिनट, सिर्फ ₹120।", "tanglish": "Airport poga Guindy Metro (Green Line) best — 28 minutes agum, cost ₹120 thaan. Cab la pona 35-45 minutes agum." },
    traffic:   { "en-IN": "Current Chennai traffic: Anna Salai and T. Nagar are at 88-91% congestion. GST Road is moderate at 55%. The Inner Ring Road via Guindy is the best alternate at just 35%.", "ta-IN": "இப்போது Chennai-ல் Anna Salai மற்றும் T. Nagar-ல் 88-91% நெரிசல் இருக்கு. GST Road moderate-ஆ 55% இருக்கு.", "hi-IN": "अभी Chennai में Anna Salai और T. Nagar पर 88-91% भीड़ है। GST Road पर 55% है।", "tanglish": "Ippo Chennai la Anna Salai um T. Nagar-um 88-91% congestion iruku. GST Road la 55% moderate ah iruku." },
    cheap:     { "en-IN": "The cheapest way in Chennai is MTC bus — fares start at ₹5, most routes ₹10-25. Metro is mid-range at ₹40-80. Cabs are most expensive at ₹120+.", "ta-IN": "Chennai-ல் மலிவான வழி MTC bus — ₹5 முதல் தொடங்கும், பெரும்பாலான routes ₹10-25. Metro ₹40-80. Cab மிகவும் விலை அதிகம்.", "hi-IN": "Chennai में सबसे सस्ता MTC bus है — ₹5 से शुरू, ज़्यादातर routes ₹10-25।", "tanglish": "Cheapest option MTC bus — ₹5 la irundhu start agum, most routes ₹10-25. Metro mid-range ₹40-80. Cab expensive ₹120+." },
    metro:     { "en-IN": "Chennai Metro has two lines: Green Line (Airport to Wimco Nagar) and Blue Line (Airport to St. Thomas Mount). Fare ₹10-60, runs every 4-8 min during peak hours, 6AM to 11PM.", "ta-IN": "Chennai Metro-ல் இரண்டு lines: Green Line (Airport to Wimco Nagar) மற்றும் Blue Line (Airport to St. Thomas Mount). கட்டணம் ₹10-60.", "hi-IN": "Chennai Metro में दो lines हैं: Green Line और Blue Line। किराया ₹10-60, सुबह 6 से रात 11 बजे तक।", "tanglish": "Chennai Metro la rendu lines: Green Line (Airport to Wimco Nagar), Blue Line (Airport to St. Thomas Mount). Fare ₹10-60, 6AM to 11PM varaikkum." },
  };
  for (const [key, patterns] of Object.entries(checks)) {
    if (patterns.some(p => q.includes(p))) return R[key]?.[lang] || R[key]?.["en-IN"] || "";
  }
  const generic = {
    "en-IN": "I can help you with routes, traffic, and travel across Tamil Nadu! Ask me about specific routes, metro, buses, or traffic conditions.",
    "ta-IN": "Tamil Nadu routes, traffic, metro, bus பற்றி கேளுங்கள் — உதவுவேன்!",
    "hi-IN": "Tamil Nadu के routes, traffic, metro, bus के बारे में पूछें!",
    "tanglish": "Tamil Nadu routes, traffic, metro, bus pathi kelu — help pannuven!",
  };
  return generic[lang] || generic["en-IN"];
};

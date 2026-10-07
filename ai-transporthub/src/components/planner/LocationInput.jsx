/**
 * LocationInput.jsx — Smart location search for all Tamil Nadu
 * Local database (80+ locations) + live Nominatim search fallback
 */
import { useState, useRef, useEffect, useCallback } from "react";
import { MapPin, X, Loader2 } from "lucide-react";

const TN_LOCATIONS = [
  "Chennai Central Railway Station","Chennai Airport (MAA)","Chennai Egmore Railway Station",
  "T. Nagar Bus Terminus, Chennai","Koyambedu Bus Terminus, Chennai","Tambaram Bus Stand, Chennai",
  "Anna Nagar Tower, Chennai","Adyar Signal, Chennai","Guindy Metro Station, Chennai",
  "Velachery Metro Station, Chennai","Vadapalani Metro Station, Chennai","Sholinganallur Junction, Chennai",
  "OMR (Old Mahabalipuram Road), Chennai","ECR (East Coast Road), Chennai","Marina Beach, Chennai",
  "Besant Nagar Beach, Chennai","Spencer Plaza, Chennai","Express Avenue Mall, Chennai",
  "Phoenix MarketCity, Velachery","IIT Madras, Chennai","Anna University, Chennai",
  "Porur Junction, Chennai","Tidel Park, Chennai","Pallavaram, Chennai",
  "Coimbatore Railway Station","Coimbatore Airport (CJB)","Gandhipuram Bus Stand, Coimbatore",
  "Ukkadam Bus Stand, Coimbatore","RS Puram, Coimbatore","Peelamedu, Coimbatore",
  "Avinashi Road, Coimbatore","Singanallur, Coimbatore",
  "Madurai Railway Station","Madurai Airport","Madurai Meenakshi Amman Temple",
  "Periyar Bus Stand, Madurai","Mattuthavani Bus Stand, Madurai","KK Nagar, Madurai",
  "Tiruppur Bus Stand","Tiruppur Railway Station","Avinashi, Tiruppur","Palladam, Tiruppur",
  "Salem Railway Station","Salem Airport","Salem New Bus Stand","Suramangalam, Salem",
  "Trichy Railway Station","Trichy Airport (TRZ)","Central Bus Stand, Trichy",
  "Srirangam Temple, Trichy","Rockfort Temple, Trichy","Chathiram Bus Stand, Trichy",
  "Tirunelveli Railway Station","Tirunelveli Bus Stand","Palayamkottai, Tirunelveli",
  "Vellore Railway Station","Vellore Fort","CMC Hospital, Vellore","Katpadi Junction, Vellore",
  "Thanjavur Railway Station","Thanjavur Big Temple","Thanjavur Bus Stand",
  "Erode Railway Station","Erode Bus Stand","Bhavani, Erode","Gobichettipalayam, Erode",
  "Tiruvannamalai Bus Stand","Arunachaleswarar Temple, Tiruvannamalai",
  "Kanyakumari Railway Station","Kanyakumari Beach","Vivekananda Rock Memorial, Kanyakumari",
  "Ooty Railway Station","Ooty Bus Stand","Doddabetta Peak, Ooty","Botanical Garden, Ooty",
  "Coonoor, Nilgiris","Kodaikanal Bus Stand","Kodaikanal Lake",
  "Puducherry Railway Station","Puducherry Bus Stand","Promenade Beach, Puducherry","Auroville, Puducherry",
  "Kumbakonam Railway Station","Kumbakonam Temple","Chidambaram Nataraja Temple",
  "Karur Railway Station","Namakkal Bus Stand","Dharmapuri Bus Stand",
  "Krishnagiri Bus Stand","Hosur Bus Stand","Ranipet Bus Stand",
  "Sivakasi","Kovilpatti Bus Stand","Rajapalayam Bus Stand","Virudhunagar Bus Stand",
  "Dindigul Railway Station","Pollachi Bus Stand","Mettupalayam Railway Station",
];

let nominatimTimer = null;
const searchNominatim = (query) => new Promise(resolve => {
  clearTimeout(nominatimTimer);
  nominatimTimer = setTimeout(async () => {
    try {
      const enc = encodeURIComponent(`${query}, Tamil Nadu, India`);
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${enc}&format=json&limit=5`, { headers: { "Accept-Language": "en" } });
      const data = await res.json();
      resolve(data.map(d => d.display_name.split(",").slice(0, 3).join(", ")).filter((v, i, a) => a.indexOf(v) === i));
    } catch { resolve([]); }
  }, 400);
});

export default function LocationInput({ label, value, onChange, placeholder, iconColor = "text-slate-400" }) {
  const [query, setQuery]      = useState(value || "");
  const [suggestions, setSugs] = useState([]);
  const [open, setOpen]        = useState(false);
  const [searching, setSearch] = useState(false);
  const containerRef           = useRef(null);

  useEffect(() => {
    const h = e => { if (!containerRef.current?.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const handleChange = useCallback(async (e) => {
    const q = e.target.value;
    setQuery(q); onChange("");
    if (q.length < 2) { setSugs([]); setOpen(false); return; }
    const local = TN_LOCATIONS.filter(l => l.toLowerCase().includes(q.toLowerCase())).slice(0, 6);
    if (local.length > 0) { setSugs(local); setOpen(true); }
    setSearch(true);
    const live = await searchNominatim(q);
    setSearch(false);
    const merged = [...local, ...live.filter(l => !local.some(loc => loc.toLowerCase().includes(l.split(",")[0].toLowerCase())))].slice(0, 8);
    setSugs(merged); setOpen(merged.length > 0);
  }, [onChange]);

  const select = (loc) => { setQuery(loc); onChange(loc); setOpen(false); };
  const clear  = ()    => { setQuery(""); onChange(""); setSugs([]); setOpen(false); };

  return (
    <div ref={containerRef} className="relative">
      {label && <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">{label}</label>}
      <div className="relative">
        <MapPin size={15} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${iconColor} pointer-events-none`} />
        <input type="text" value={query} onChange={handleChange}
          onFocus={() => query.length >= 2 && suggestions.length > 0 && setOpen(true)}
          placeholder={placeholder} className="input-field pl-9 pr-9 text-sm" />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {searching && <Loader2 size={13} className="text-slate-300 animate-spin" />}
          {query && <button onClick={clear} className="text-slate-300 hover:text-slate-500 transition-colors"><X size={14} /></button>}
        </div>
      </div>
      {open && suggestions.length > 0 && (
        <div className="absolute z-50 mt-1 w-full bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-xl overflow-hidden animate-fade-in max-h-64 overflow-y-auto">
          {suggestions.map((loc, i) => (
            <button key={i} onClick={() => select(loc)}
              className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-sm text-left hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-700 transition-colors border-b border-slate-50 dark:border-slate-700/50 last:border-0">
              <MapPin size={13} className="text-slate-400 flex-shrink-0" />
              <span className="truncate text-slate-700 dark:text-slate-300">{loc}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

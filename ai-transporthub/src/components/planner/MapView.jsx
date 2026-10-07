/**
 * MapView.jsx — Interactive Leaflet map for any location in Tamil Nadu / India
 * Uses OpenStreetMap Nominatim geocoding — FREE, no API key needed
 */
import { useEffect, useRef, useState } from "react";
import { MapPin, Navigation, Loader2, AlertCircle } from "lucide-react";

const ROUTE_COLORS = {
  fastest: "#2563eb", cheapest: "#d97706", eco: "#16a34a", safest: "#7c3aed",
};

const geocode = async (query) => {
  if (!query?.trim()) return null;
  try {
    const encoded = encodeURIComponent(`${query}, Tamil Nadu, India`);
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&limit=1`,
      { headers: { "Accept-Language": "en" } }
    );
    const data = await res.json();
    if (data?.[0]) return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon), label: data[0].display_name.split(",").slice(0, 2).join(", ") };
    return null;
  } catch { return null; }
};

export default function MapView({ from, to, selectedRoute }) {
  const mapRef     = useRef(null);
  const mapInstRef = useRef(null);
  const layersRef  = useRef([]);
  const [status, setStatus] = useState("idle");
  const [errMsg, setErrMsg] = useState("");
  const color = ROUTE_COLORS[selectedRoute] || "#2563eb";

  const clearLayers = () => {
    layersRef.current.forEach(l => { try { mapInstRef.current?.removeLayer(l); } catch {} });
    layersRef.current = [];
  };

  useEffect(() => {
    import("leaflet").then(L => {
      if (mapInstRef.current) return;
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl:       "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl:     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });
      const map = L.map(mapRef.current, { center: [11.1271, 78.6569], zoom: 7, zoomControl: true, scrollWheelZoom: true });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>', maxZoom: 19,
      }).addTo(map);
      mapInstRef.current = map;
    });
    return () => { if (mapInstRef.current) { mapInstRef.current.remove(); mapInstRef.current = null; } };
  }, []);

  useEffect(() => {
    if (!from || !to) {
      if (mapInstRef.current) { clearLayers(); mapInstRef.current.setView([11.1271, 78.6569], 7); setStatus("idle"); }
      return;
    }
    let cancelled = false;
    const draw = async () => {
      setStatus("loading"); setErrMsg("");
      const [fc, tc] = await Promise.all([geocode(from), geocode(to)]);
      if (cancelled) return;
      if (!fc || !tc) { setStatus("error"); setErrMsg(!fc ? `Could not find "${from}"` : `Could not find "${to}"`); return; }
      const L = (await import("leaflet")).default || (await import("leaflet"));
      if (cancelled || !mapInstRef.current) return;
      clearLayers();
      const mkIcon = (fillColor, label) => L.divIcon({
        className: "", iconAnchor: [16, 40], popupAnchor: [0, -40],
        html: `<div style="display:flex;flex-direction:column;align-items:center"><div style="background:${fillColor};color:white;font-size:11px;font-weight:700;padding:3px 8px;border-radius:20px;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,0.25);margin-bottom:2px;max-width:160px;overflow:hidden;text-overflow:ellipsis">${label}</div><svg width="28" height="40" viewBox="0 0 28 40"><path d="M14 0C6.27 0 0 6.27 0 14c0 9.33 14 26 14 26S28 23.33 28 14C28 6.27 21.73 0 14 0z" fill="${fillColor}" stroke="white" stroke-width="2"/><circle cx="14" cy="14" r="6" fill="white"/></svg></div>`,
      });
      const fm = L.marker([fc.lat, fc.lng], { icon: mkIcon("#22c55e", from.split(",")[0]) }).addTo(mapInstRef.current).bindPopup(`<b>🟢 Start</b><br>${fc.label}`);
      const tm = L.marker([tc.lat, tc.lng], { icon: mkIcon(color, to.split(",")[0]) }).addTo(mapInstRef.current).bindPopup(`<b>📍 Destination</b><br>${tc.label}`);
      const line = L.polyline([[fc.lat, fc.lng], [tc.lat, tc.lng]], { color, weight: 5, opacity: 0.8, dashArray: "12 8", lineCap: "round" }).addTo(mapInstRef.current);
      const distKm = Math.round(mapInstRef.current.distance([fc.lat, fc.lng], [tc.lat, tc.lng]) / 100) / 10;
      const midIcon = L.divIcon({ className: "", iconAnchor: [30, 14], html: `<div style="background:white;border:2px solid ${color};color:${color};font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px;box-shadow:0 2px 8px rgba(0,0,0,0.15);white-space:nowrap">~${distKm} km</div>` });
      const mid = L.marker([(fc.lat + tc.lat) / 2, (fc.lng + tc.lng) / 2], { icon: midIcon, interactive: false }).addTo(mapInstRef.current);
      layersRef.current = [fm, tm, line, mid];
      mapInstRef.current.fitBounds(L.latLngBounds([fc.lat, fc.lng], [tc.lat, tc.lng]), { padding: [60, 60], maxZoom: 14 });
      setStatus("ready");
    };
    draw();
    return () => { cancelled = true; };
  }, [from, to, selectedRoute, color]);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-primary-600" />
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Route Map</h3>
          {status === "loading" && <div className="flex items-center gap-1.5 text-xs text-slate-400"><Loader2 size={12} className="animate-spin" />Locating…</div>}
          {status === "ready"   && <span className="text-xs text-green-600 font-medium flex items-center gap-1"><Navigation size={12} />Route found</span>}
        </div>
        {selectedRoute && (
          <div className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: color + "20", color }}>
            <div className="w-2 h-2 rounded-full" style={{ background: color }} />
            {selectedRoute.charAt(0).toUpperCase() + selectedRoute.slice(1)} route
          </div>
        )}
      </div>
      {status === "error" && (
        <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 dark:bg-amber-900/20 border-b border-amber-100">
          <AlertCircle size={14} className="text-amber-600" />
          <p className="text-xs text-amber-700">{errMsg} — try adding city name, e.g. "Madurai Railway Station"</p>
        </div>
      )}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css" />
      <div ref={mapRef} style={{ height: 400 }} className="w-full" />
      {status === "idle" && (
        <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 text-center">
          <p className="text-xs text-slate-400">Enter start and destination above — the map works for any location in Tamil Nadu</p>
        </div>
      )}
    </div>
  );
}

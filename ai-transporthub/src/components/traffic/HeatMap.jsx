/**
 * HeatMap — interactive Leaflet map with colour-coded congestion zones
 * Each circle marker represents a Chennai traffic zone, colour = intensity
 * In production: replace with a real Leaflet.heat plugin or Google Maps heatmap layer
 */
import { useEffect, useRef } from "react";
import { HEATMAP_POINTS } from "../../utils/mockData";

// Colour ramp: green → amber → red based on 0–1 intensity
const intensityColor = i => {
  if (i >= 0.8) return { fill: "#ef4444", stroke: "#b91c1c" };
  if (i >= 0.6) return { fill: "#f97316", stroke: "#c2410c" };
  if (i >= 0.4) return { fill: "#eab308", stroke: "#a16207" };
  return { fill: "#22c55e", stroke: "#15803d" };
};

export default function HeatMap() {
  const mapRef   = useRef(null);
  const mapInst  = useRef(null);

  useEffect(() => {
    // Dynamically import Leaflet to avoid SSR issues
    import("leaflet").then(L => {
      if (mapInst.current) return; // already initialised

      // Fix default marker icon paths broken by Vite
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl:       "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl:     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current, {
        center: [13.044, 80.232],
        zoom: 11,
        zoomControl: true,
        scrollWheelZoom: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 18,
      }).addTo(map);

      // Draw congestion circles
      HEATMAP_POINTS.forEach(pt => {
        const { fill, stroke } = intensityColor(pt.intensity);
        const pct = Math.round(pt.intensity * 100);
        const level = pct >= 80 ? "Heavy" : pct >= 60 ? "Moderate" : pct >= 40 ? "Slow" : "Clear";

        const circle = L.circle([pt.lat, pt.lng], {
          radius:      900 + pt.intensity * 600,
          color:       stroke,
          fillColor:   fill,
          fillOpacity: 0.45,
          weight:      1.5,
        }).addTo(map);

        circle.bindPopup(`
          <div style="font-family:Inter,sans-serif;min-width:140px">
            <p style="font-weight:700;font-size:13px;margin:0 0 4px">${pt.zone}</p>
            <p style="font-size:11px;color:#475569;margin:0">Congestion: <strong style="color:${fill}">${pct}% — ${level}</strong></p>
          </div>
        `);
      });

      mapInst.current = map;
    });

    return () => {
      if (mapInst.current) { mapInst.current.remove(); mapInst.current = null; }
    };
  }, []);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
      <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Live congestion heatmap</h3>
          <p className="text-xs text-slate-400 mt-0.5">Tap a zone to see congestion level · Chennai Metropolitan Area</p>
        </div>
        {/* Legend */}
        <div className="hidden sm:flex items-center gap-3 text-xs text-slate-500">
          {[
            { color: "#22c55e", label: "Clear" },
            { color: "#eab308", label: "Slow" },
            { color: "#f97316", label: "Moderate" },
            { color: "#ef4444", label: "Heavy" },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
              {label}
            </div>
          ))}
        </div>
      </div>

      <div ref={mapRef} style={{ height: 360 }} className="w-full" />
    </div>
  );
}

/**
 * WeatherWidget — current weather + travel advisory banner
 */
import { Wind, Droplets, AlertTriangle } from "lucide-react";
import { WEATHER_DATA } from "../../utils/mockData";

export default function WeatherWidget() {
  const w = WEATHER_DATA;
  return (
    <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-5 text-white shadow-lg">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-primary-200 text-xs font-medium uppercase tracking-wider mb-1">Chennai, TN</p>
          <div className="flex items-end gap-2">
            <span className="text-5xl font-bold">{w.temp}°</span>
            <span className="text-primary-200 mb-1">{w.condition}</span>
          </div>
        </div>
        <span className="text-5xl">{w.icon}</span>
      </div>

      <div className="flex gap-4 mb-4">
        <div className="flex items-center gap-1.5">
          <Droplets size={14} className="text-primary-300" />
          <span className="text-sm text-primary-100">{w.humidity}% humidity</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Wind size={14} className="text-primary-300" />
          <span className="text-sm text-primary-100">{w.wind} km/h wind</span>
        </div>
      </div>

      <div className="flex items-start gap-2 bg-white/15 rounded-xl px-3 py-2.5">
        <AlertTriangle size={14} className="text-yellow-300 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-white/90 leading-relaxed">{w.advisory}</p>
      </div>
    </div>
  );
}

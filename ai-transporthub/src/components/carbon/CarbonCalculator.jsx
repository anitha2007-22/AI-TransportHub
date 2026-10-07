/**
 * CarbonCalculator — interactive trip carbon estimator
 * User picks transport mode + distance → instant CO₂, cost, and fuel savings
 */
import { useState } from "react";
import { Calculator, Leaf, IndianRupee, Fuel } from "lucide-react";
import { EMISSION_FACTORS } from "../../utils/mockData";

const MODES = [
  { id: "car",          label: "Car",     icon: "🚗", costPerKm: 6.5  },
  { id: "cab",          label: "Cab",     icon: "🚕", costPerKm: 14.0 },
  { id: "bus",          label: "Bus",     icon: "🚌", costPerKm: 0.9  },
  { id: "metro",        label: "Metro",   icon: "🚇", costPerKm: 2.1  },
  { id: "autoRickshaw", label: "Auto",    icon: "🛺", costPerKm: 7.0  },
  { id: "bike",         label: "Bike",    icon: "🏍️", costPerKm: 2.8  },
  { id: "cycle",        label: "Cycle",   icon: "🚲", costPerKm: 0.0  },
  { id: "walk",         label: "Walk",    icon: "🚶", costPerKm: 0.0  },
];

const CAR_COST_PER_KM = 6.5; // petrol cost baseline for savings comparison

export default function CarbonCalculator() {
  const [km, setKm]         = useState(10);
  const [mode, setMode]     = useState("metro");
  const [trips, setTrips]   = useState(1);

  const factor = EMISSION_FACTORS[mode] ?? 0;
  const modeInfo = MODES.find(m => m.id === mode);
  const totalKm  = km * trips;

  const co2Emitted  = +(factor * totalKm).toFixed(2);
  const carCo2      = +(EMISSION_FACTORS.car * totalKm).toFixed(2);
  const co2Saved    = +(Math.max(0, carCo2 - co2Emitted)).toFixed(2);
  const modeCost    = +(modeInfo.costPerKm * totalKm).toFixed(0);
  const carCost     = +(CAR_COST_PER_KM * totalKm).toFixed(0);
  const moneySaved  = Math.max(0, carCost - modeCost);
  const fuelSaved   = +(co2Saved / 2.3).toFixed(2); // ~2.3 kg CO₂ per litre petrol

  const ecoPercent = carCo2 > 0 ? Math.round((co2Saved / carCo2) * 100) : 0;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 shadow-sm space-y-5">
      <div className="flex items-center gap-2">
        <Calculator size={17} className="text-green-600" />
        <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Carbon Calculator</h3>
      </div>

      {/* Mode picker */}
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Transport mode</p>
        <div className="grid grid-cols-4 gap-2">
          {MODES.map(m => (
            <button key={m.id} onClick={() => setMode(m.id)}
              className={`flex flex-col items-center gap-1 py-2.5 rounded-xl border-2 transition-all text-xs font-medium ${
                mode === m.id
                  ? "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                  : "border-slate-100 dark:border-slate-700 text-slate-500 hover:border-slate-200 dark:hover:border-slate-600"
              }`}>
              <span className="text-lg">{m.icon}</span>
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="font-semibold text-slate-500 uppercase tracking-wider">Distance</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{km} km</span>
          </div>
          <input type="range" min={1} max={100} value={km} onChange={e => setKm(+e.target.value)}
            className="w-full accent-green-600" />
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="font-semibold text-slate-500 uppercase tracking-wider">Trips / day</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{trips}</span>
          </div>
          <input type="range" min={1} max={10} value={trips} onChange={e => setTrips(+e.target.value)}
            className="w-full accent-green-600" />
        </div>
      </div>

      {/* Results grid */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: Leaf,        color: "text-green-600 bg-green-50 dark:bg-green-900/20",     label: "CO₂ emitted",  value: `${co2Emitted} kg`,   sub: `vs ${carCo2} kg by car` },
          { icon: Leaf,        color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20", label: "CO₂ saved",   value: `${co2Saved} kg`,     sub: `${ecoPercent}% less than car` },
          { icon: IndianRupee, color: "text-primary-600 bg-primary-50 dark:bg-primary-900/20", label: "Trip cost",   value: `₹${modeCost}`,      sub: `Car would cost ₹${carCost}` },
          { icon: Fuel,        color: "text-amber-600 bg-amber-50 dark:bg-amber-900/20",      label: "Fuel saved",  value: `${fuelSaved} L`,     sub: `Money saved: ₹${moneySaved}` },
        ].map(({ icon: Icon, color, label, value, sub }) => (
          <div key={label} className={`rounded-xl p-3 ${color.split(" ").slice(1).join(" ")}`}>
            <Icon size={14} className={color.split(" ")[0] + " mb-1"} />
            <p className="text-lg font-black text-slate-900 dark:text-white leading-none">{value}</p>
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-0.5">{label}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      {/* Eco tip */}
      {co2Saved > 0 && (
        <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 rounded-xl px-3 py-2.5">
          <span className="text-base">🌱</span>
          <p className="text-xs text-green-700 dark:text-green-400">
            Switching from car to <strong>{modeInfo.label}</strong> for this trip saves <strong>{co2Saved} kg CO₂</strong> — equivalent to {(co2Saved / 10.8).toFixed(2)} trees planted.
          </p>
        </div>
      )}
    </div>
  );
}

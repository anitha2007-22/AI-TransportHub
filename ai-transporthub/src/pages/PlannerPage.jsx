/**
 * PlannerPage — Phase 2: AI Journey Planner
 * Full layout: form + route cards + map + comparison table + AI insight
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, BookmarkPlus, Share2, ArrowLeft } from "lucide-react";
import JourneyForm from "../components/planner/JourneyForm";
import RouteCard from "../components/planner/RouteCard";
import RouteComparison from "../components/planner/RouteComparison";
import MapView from "../components/planner/MapView";
import AIRouteInsight from "../components/planner/AIRouteInsight";
import { generateRoutes } from "../utils/mockData";
import toast from "react-hot-toast";

export default function PlannerPage() {
  const [results, setResults]       = useState(null);
  const [selectedId, setSelectedId] = useState("fastest");
  const [searching, setSearching]   = useState(false);
  const [tripInfo, setTripInfo]     = useState(null);

  const handleSearch = async params => {
    setSearching(true);
    setResults(null);
    // Simulate AI route calculation delay
    await new Promise(r => setTimeout(r, 1400));
    const routes = generateRoutes(params.from, params.to, params.time);
    setResults(routes);
    setSelectedId("fastest");
    setTripInfo(params);
    setSearching(false);
  };

  const selectedRoute = results?.find(r => r.id === selectedId);

  const saveRoute = () => toast.success("Route saved to favourites!");
  const shareRoute = () => {
    navigator.clipboard?.writeText(`AI TransportHub route: ${tripInfo?.from} → ${tripInfo?.to}`);
    toast.success("Route link copied!");
  };

  return (
    <div className="space-y-5 animate-slide-up">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">AI Journey Planner</h1>
          <p className="text-sm text-slate-500 mt-0.5">Enter your trip details — AI compares every route in real time.</p>
        </div>
        {results && (
          <div className="flex gap-2">
            <button onClick={saveRoute} className="btn-secondary flex items-center gap-1.5 text-sm py-2">
              <BookmarkPlus size={15} /> Save
            </button>
            <button onClick={shareRoute} className="btn-secondary flex items-center gap-1.5 text-sm py-2">
              <Share2 size={15} /> Share
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Left column: form + results */}
        <div className="lg:col-span-2 space-y-4">
          <JourneyForm onSearch={handleSearch} />

          {/* Loading state */}
          {searching && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center mx-auto">
                <Sparkles size={22} className="text-primary-600 animate-pulse" />
              </div>
              <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm">AI is calculating routes…</p>
              <p className="text-xs text-slate-400">Analysing traffic, weather, cost & carbon for your trip</p>
              <div className="space-y-2 text-left mt-2">
                {["Fetching live traffic data", "Checking weather forecast", "Comparing 4 route types", "Scoring with AI model"].map((s, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary-200 dark:bg-primary-800 relative overflow-hidden flex-shrink-0">
                      <div className="absolute inset-0 bg-primary-500 animate-pulse" style={{ animationDelay: `${i * 200}ms` }} />
                    </div>
                    <span className="text-xs text-slate-500">{s}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Route cards */}
          <AnimatePresence>
            {results && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <div className="flex items-center gap-2">
                  <Sparkles size={14} className="text-primary-600" />
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    {results.length} routes found · AI scored & ranked
                  </p>
                </div>
                {results.map(route => (
                  <RouteCard
                    key={route.id}
                    route={route}
                    selected={selectedId === route.id}
                    onSelect={setSelectedId}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right column: map + comparison + AI insight */}
        <div className="lg:col-span-3 space-y-4">
          <MapView
            from={tripInfo?.from}
            to={tripInfo?.to}
            selectedRoute={selectedId}
          />

          {results && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="space-y-4"
            >
              <AIRouteInsight
                from={tripInfo?.from}
                to={tripInfo?.to}
                time={tripInfo?.time}
                selectedRoute={selectedRoute}
              />
              <RouteComparison
                routes={results}
                selectedId={selectedId}
                onSelect={setSelectedId}
              />

              {/* Tip banner */}
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-2xl p-4 flex items-start gap-3">
                <span className="text-xl flex-shrink-0">🌱</span>
                <div>
                  <p className="text-sm font-semibold text-green-800 dark:text-green-300">Eco tip</p>
                  <p className="text-xs text-green-700 dark:text-green-400 mt-0.5">
                    Choosing the Eco Route over a cab for this trip saves <strong>2.0 kg CO₂</strong> — equivalent to planting one tree.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {!results && !searching && (
            <div className="h-full min-h-[200px] flex flex-col items-center justify-center text-center px-4 py-10 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
              <span className="text-4xl mb-3">🗺️</span>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Enter a start and end point to see AI-ranked route options.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

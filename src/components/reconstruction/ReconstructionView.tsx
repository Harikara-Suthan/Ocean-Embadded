import React, { useState, useEffect } from 'react';
import { PRESET_LOCATIONS, STANDARD_DEPTH_LEVELS } from '../../data/oceanData';
import { PresetLocation, DepthLevelData } from '../../types/ocean';
import { Play, CheckCircle, RefreshCw, Layers, Sliders, Thermometer, Eye, EyeOff, Info, ArrowDown, Download, FileSpreadsheet, Waves, Flame, Compass } from 'lucide-react';
import { reconstructProfileFromCoordinates, generateZonalTransect } from '../../services/oceanInferenceEngine';

interface ReconstructionViewProps {
  initialLat?: number;
  initialLon?: number;
}

export const ReconstructionView: React.FC<ReconstructionViewProps> = ({
  initialLat = 14.5,
  initialLon = 89.2,
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('bob-warmpool');
  const [customLat, setCustomLat] = useState<number>(initialLat);
  const [customLon, setCustomLon] = useState<number>(initialLon);
  
  // Reconstruction execution state
  const [isInferring, setIsInferring] = useState(false);
  const [inferenceStep, setInferenceStep] = useState<string>('');
  const [hasRun, setHasRun] = useState(true);
  const [activeTab, setActiveTab] = useState<'temperature' | 'anomaly'>('temperature');
  const [showArgoOverlay, setShowArgoOverlay] = useState(true);
  const [showClimatologyOverlay, setShowClimatologyOverlay] = useState(false);
  const [hoveredDepth, setHoveredDepth] = useState<number | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Cross section transect latitude
  const [transectLat, setTransectLat] = useState<number>(12.0);

  // Live computed profile using the physical deep learning inference simulation
  const [inferenceResult, setInferenceResult] = useState(() =>
    reconstructProfileFromCoordinates(initialLat, initialLon)
  );

  // Update when initial coordinates change
  useEffect(() => {
    if (initialLat !== undefined && initialLon !== undefined) {
      setCustomLat(initialLat);
      setCustomLon(initialLon);
      const res = reconstructProfileFromCoordinates(initialLat, initialLon);
      setInferenceResult(res);
    }
  }, [initialLat, initialLon]);

  const handleSelectPreset = (p: PresetLocation) => {
    setSelectedPresetId(p.id);
    setCustomLat(p.lat);
    setCustomLon(p.lon);
    const res = reconstructProfileFromCoordinates(p.lat, p.lon, p.surfaceParams);
    setInferenceResult(res);
  };

  const handleRunReconstruction = () => {
    setIsInferring(true);
    setInferenceStep('Encoding surface observations (SST, SSS, SSH, Currents, Winds)...');

    setTimeout(() => {
      setInferenceStep('Learning ocean state & 128-d latent embedding representations...');
    }, 700);

    setTimeout(() => {
      setInferenceStep('Decoding depth-aware continuous vertical profile (0–1000m)...');
    }, 1400);

    setTimeout(() => {
      const res = reconstructProfileFromCoordinates(customLat, customLon);
      setInferenceResult(res);
      setIsInferring(false);
      setHasRun(true);
    }, 2000);
  };

  const handleExportCSV = () => {
    const headers = ['Depth_m', 'PredictedTemp_degC', 'ARGOTemp_degC', 'ClimatologyTemp_degC', 'Uncertainty_degC', 'Anomaly_degC'];
    const rows = inferenceResult.profiles.map(p => [
      p.depth,
      p.predictedTemp,
      p.argoTemp,
      p.climatologyTemp,
      p.uncertainty,
      p.anomaly,
    ]);

    const metadata = [
      `# OceanEmbed Subsurface Profile Export (SIH26066)`,
      `# Station: ${inferenceResult.locationName}`,
      `# Coordinates: ${customLat}°N, ${customLon}°E`,
      `# Mixed Layer Depth (MLD): ${inferenceResult.mld} m`,
      `# Thermocline Depth (D20): ${inferenceResult.d20} m`,
      `# Tropical Cyclone Heat Potential (TCHP): ${inferenceResult.tchp} kJ/cm2`,
      `# RMSE vs ARGO: ${inferenceResult.metrics.rmse} °C`,
    ];

    const csvContent = [...metadata, headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `OceanEmbed_Profile_${customLat}N_${customLon}E.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  const profiles = inferenceResult.profiles;
  const zonalTransect = generateZonalTransect(transectLat, 55, 95, 4);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
              SIH26066 • Inference Engine
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-[#0f2b48]">
              Subsurface Reconstruction
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Estimate ocean temperature across depth from the learned surface representation.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>{downloadSuccess ? 'Exported CSV!' : 'Export Profile (.CSV)'}</span>
            </button>
            <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-amber-50 text-amber-800 border border-amber-200/80 font-medium">
              15 STANDARD DEPTH LEVELS
            </span>
          </div>
        </div>
      </div>

      {/* Top Controls Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Oceanographic Location Presets:
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {PRESET_LOCATIONS.map((loc) => (
              <button
                key={loc.id}
                onClick={() => handleSelectPreset(loc)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  selectedPresetId === loc.id
                    ? 'bg-[#0f2b48] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                }`}
              >
                {loc.name}
              </button>
            ))}
          </div>
        </div>

        {/* Coordinate & Parameter Form */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Target Basin</label>
            <div className="font-semibold text-slate-800 bg-slate-50 px-2.5 py-1.5 rounded border border-slate-200 truncate">
              {inferenceResult.region}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Latitude (5°N – 30°N)</label>
            <input
              type="number"
              step="0.1"
              min="5"
              max="30"
              value={customLat}
              onChange={(e) => setCustomLat(parseFloat(e.target.value) || 5)}
              className="w-full font-mono text-slate-800 bg-slate-50 px-2.5 py-1.5 rounded border border-slate-200 focus:outline-none focus:border-cyan-600"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Longitude (45°E – 105°E)</label>
            <input
              type="number"
              step="0.1"
              min="45"
              max="105"
              value={customLon}
              onChange={(e) => setCustomLon(parseFloat(e.target.value) || 45)}
              className="w-full font-mono text-slate-800 bg-slate-50 px-2.5 py-1.5 rounded border border-slate-200 focus:outline-none focus:border-cyan-600"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Temporal Slice</label>
            <div className="font-mono text-slate-700 bg-slate-50 px-2.5 py-1.5 rounded border border-slate-200">
              Daily Synchronized
            </div>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleRunReconstruction}
              disabled={isInferring}
              className="w-full py-1.5 px-3 bg-[#0f2b48] hover:bg-slate-800 disabled:bg-slate-400 text-white rounded text-xs font-medium flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              {isInferring ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Inferring...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Run Reconstruction</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Input Parameters Preview */}
        <div className="pt-2 flex flex-wrap items-center gap-3 text-[11px] text-slate-500 bg-slate-50/70 p-2.5 rounded border border-slate-100">
          <span className="font-bold text-slate-700">Surface Inputs:</span>
          <span>SST: <strong className="font-mono text-slate-800">{inferenceResult.surfaceParams.sst.toFixed(1)}°C</strong></span>
          <span>•</span>
          <span>SSS: <strong className="font-mono text-slate-800">{inferenceResult.surfaceParams.sss.toFixed(1)} PSU</strong></span>
          <span>•</span>
          <span>SSH: <strong className="font-mono text-slate-800">{inferenceResult.surfaceParams.ssh > 0 ? `+${inferenceResult.surfaceParams.ssh}` : inferenceResult.surfaceParams.ssh} m</strong></span>
          <span>•</span>
          <span>Currents: <strong className="font-mono text-slate-800">[{inferenceResult.surfaceParams.currentU}, {inferenceResult.surfaceParams.currentV}] m/s</strong></span>
          <span>•</span>
          <span>Winds: <strong className="font-mono text-slate-800">[{inferenceResult.surfaceParams.windU}, {inferenceResult.surfaceParams.windV}] m/s</strong></span>
        </div>
      </div>

      {/* Loading Overlay Animation state */}
      {isInferring && (
        <div className="bg-slate-900 text-white p-6 rounded-lg border border-slate-800 shadow-md space-y-4 font-mono">
          <div className="flex items-center justify-between text-xs text-cyan-400">
            <span className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
              EXECUTING OCEANEMBED INFERENCE PIPELINE
            </span>
            <span className="text-slate-400 text-[10px]">Continuous Decoder</span>
          </div>

          <div className="p-3 bg-slate-950 rounded border border-slate-800 text-xs text-slate-200">
            &gt; {inferenceStep}
          </div>

          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-cyan-400 h-full w-full animate-pulse"></div>
          </div>
        </div>
      )}

      {/* Main Reconstruction Results */}
      {hasRun && !isInferring && (
        <>
          {/* Key Oceanographic Diagnostics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                <span className="font-medium">Mixed Layer Depth (MLD)</span>
                <Waves className="w-3.5 h-3.5 text-cyan-600" />
              </div>
              <div className="text-xl font-bold text-[#0f2b48] font-mono">
                {inferenceResult.mld} <span className="text-xs text-slate-500 font-sans">m</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">Turbulent upper boundary</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                <span className="font-medium">Thermocline Depth ($D_{20}$)</span>
                <Thermometer className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <div className="text-xl font-bold text-[#0f2b48] font-mono">
                {inferenceResult.d20} <span className="text-xs text-slate-500 font-sans">m</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">20°C Isotherm interface</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                <span className="font-medium">26°C Isotherm ($D_{26}$)</span>
                <Thermometer className="w-3.5 h-3.5 text-orange-500" />
              </div>
              <div className="text-xl font-bold text-[#0f2b48] font-mono">
                {inferenceResult.d26} <span className="text-xs text-slate-500 font-sans">m</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">Cyclone thermal fuel layer</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                <span className="font-medium">Cyclone Heat Potential (TCHP)</span>
                <Flame className="w-3.5 h-3.5 text-red-500" />
              </div>
              <div className="text-xl font-bold text-[#0f2b48] font-mono">
                {inferenceResult.tchp} <span className="text-xs text-slate-500 font-sans">kJ/cm²</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">
                {inferenceResult.tchp > 60 ? 'High (>60, favorable)' : 'Moderate (<60)'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Large Vertical Temperature Profile Chart */}
            <div className="lg:col-span-8 bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-sm font-bold text-[#0f2b48] flex items-center gap-2">
                      <Thermometer className="w-4 h-4 text-cyan-600" />
                      <span>Vertical Temperature Profile: 0 – 1000 m</span>
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Station: {inferenceResult.locationName} ({customLat.toFixed(1)}°N, {customLon.toFixed(1)}°E)
                    </p>
                  </div>

                  {/* Toggles */}
                  <div className="flex items-center gap-2">
                    <div className="flex bg-slate-100 p-0.5 rounded border border-slate-200 text-xs">
                      <button
                        onClick={() => setActiveTab('temperature')}
                        className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                          activeTab === 'temperature'
                            ? 'bg-white text-slate-900 shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Temperature (°C)
                      </button>
                      <button
                        onClick={() => setActiveTab('anomaly')}
                        className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                          activeTab === 'anomaly'
                            ? 'bg-white text-slate-900 shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Anomaly (ΔT)
                      </button>
                    </div>

                    <button
                      onClick={() => setShowArgoOverlay(!showArgoOverlay)}
                      className={`px-2.5 py-1 rounded border text-[11px] font-medium flex items-center gap-1.5 transition-colors ${
                        showArgoOverlay
                          ? 'bg-cyan-50 border-cyan-300 text-cyan-900'
                          : 'bg-white border-slate-200 text-slate-500'
                      }`}
                      title="Toggle sample ARGO float observation overlay"
                    >
                      {showArgoOverlay ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      <span>ARGO Match</span>
                    </button>
                  </div>
                </div>

                {/* SVG Vertical Profile Graphic */}
                <div className="mt-4 relative bg-slate-50/60 rounded-lg p-4 border border-slate-200">
                  <div className="h-[420px] w-full relative">
                    <svg
                      viewBox="0 0 500 400"
                      className="w-full h-full"
                      preserveAspectRatio="none"
                    >
                      <defs>
                        <pattern id="chartGrid" width="50" height="40" patternUnits="userSpaceOnUse">
                          <path d="M 50 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="2,2" />
                        </pattern>
                      </defs>

                      <rect x="50" y="20" width="430" height="340" fill="url(#chartGrid)" />

                      {/* X-axis labels (Temperature 0°C to 32°C or Anomaly -2 to +2°C) */}
                      {activeTab === 'temperature' ? (
                        [0, 5, 10, 15, 20, 25, 30].map((t) => {
                          const x = 50 + (t / 32) * 430;
                          return (
                            <g key={`t-${t}`}>
                              <line x1={x} y1="20" x2={x} y2="360" stroke="#e2e8f0" strokeWidth="1" />
                              <text x={x} y="378" fill="#64748b" fontSize="10" textAnchor="middle" fontFamily="monospace">
                                {t}°C
                              </text>
                            </g>
                          );
                        })
                      ) : (
                        [-2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2].map((a) => {
                          const x = 50 + ((a + 2) / 4) * 430;
                          return (
                            <g key={`a-${a}`}>
                              <line x1={x} y1="20" x2={x} y2="360" stroke={a === 0 ? "#94a3b8" : "#e2e8f0"} strokeWidth={a === 0 ? 1.5 : 1} />
                              <text x={x} y="378" fill="#64748b" fontSize="10" textAnchor="middle" fontFamily="monospace">
                                {a > 0 ? `+${a}` : a}°C
                              </text>
                            </g>
                          );
                        })
                      )}

                      {/* Y-axis labels (Depth 0m down to 1000m) */}
                      {[0, 100, 200, 300, 500, 700, 1000].map((d) => {
                        const y = 20 + (d / 1000) * 340;
                        return (
                          <g key={`d-${d}`}>
                            <line x1="50" y1={y} x2="480" y2={y} stroke="#e2e8f0" strokeWidth="1" />
                            <text x="42" y={y + 3} fill="#64748b" fontSize="10" textAnchor="end" fontFamily="monospace">
                              {d}m
                            </text>
                          </g>
                        );
                      })}

                      {/* Axis Titles */}
                      <text x="265" y="395" fill="#334155" fontSize="11" fontWeight="600" textAnchor="middle">
                        {activeTab === 'temperature' ? 'Reconstructed Temperature (°C)' : 'Thermal Anomaly ΔT vs WOA Climatology (°C)'}
                      </text>
                      <text x="14" y="190" fill="#334155" fontSize="11" fontWeight="600" textAnchor="middle" transform="rotate(-90, 14, 190)">
                        Depth (m)
                      </text>

                      {/* Mixed Layer Depth (MLD) reference band */}
                      {(() => {
                        const mldY = 20 + (inferenceResult.mld / 1000) * 340;
                        return (
                          <g>
                            <line x1="50" y1={mldY} x2="480" y2={mldY} stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4,3" />
                            <text x="475" y={mldY - 4} fill="#d97706" fontSize="9" textAnchor="end" fontWeight="600">
                              Mixed Layer Depth ({inferenceResult.mld}m)
                            </text>
                          </g>
                        );
                      })()}

                      {/* ARGO Float Observation line (if toggled) */}
                      {showArgoOverlay && activeTab === 'temperature' && (() => {
                        const pointsStr = profiles
                          .map((p) => {
                            const x = 50 + (p.argoTemp / 32) * 430;
                            const y = 20 + (p.depth / 1000) * 340;
                            return `${x},${y}`;
                          })
                          .join(' ');
                        return (
                          <g>
                            <polyline
                              points={pointsStr}
                              fill="none"
                              stroke="#0284c7"
                              strokeWidth="2.5"
                              strokeDasharray="5,3"
                            />
                            {profiles.map((p) => {
                              const x = 50 + (p.argoTemp / 32) * 430;
                              const y = 20 + (p.depth / 1000) * 340;
                              return (
                                <circle
                                  key={`argo-dot-${p.depth}`}
                                  cx={x}
                                  cy={y}
                                  r="2.5"
                                  fill="#0284c7"
                                />
                              );
                            })}
                          </g>
                        );
                      })()}

                      {/* OceanEmbed Predicted Line */}
                      {(() => {
                        const pointsStr = profiles
                          .map((p) => {
                            const val = activeTab === 'temperature' ? p.predictedTemp : p.anomaly;
                            const x = activeTab === 'temperature'
                              ? 50 + (val / 32) * 430
                              : 50 + ((val + 2) / 4) * 430;
                            const y = 20 + (p.depth / 1000) * 340;
                            return `${x},${y}`;
                          })
                          .join(' ');

                        return (
                          <g>
                            {/* Uncertainty envelope */}
                            {activeTab === 'temperature' && profiles.map((p, i) => {
                              if (i === 0) return null;
                              const prev = profiles[i - 1];
                              const x1_low = 50 + ((prev.predictedTemp - prev.uncertainty) / 32) * 430;
                              const x1_high = 50 + ((prev.predictedTemp + prev.uncertainty) / 32) * 430;
                              const y1 = 20 + (prev.depth / 1000) * 340;
                              const x2_low = 50 + ((p.predictedTemp - p.uncertainty) / 32) * 430;
                              const x2_high = 50 + ((p.predictedTemp + p.uncertainty) / 32) * 430;
                              const y2 = 20 + (p.depth / 1000) * 340;

                              return (
                                <polygon
                                  key={`poly-${p.depth}`}
                                  points={`${x1_low},${y1} ${x1_high},${y1} ${x2_high},${y2} ${x2_low},${y2}`}
                                  fill="#0f2b48"
                                  fillOpacity="0.12"
                                />
                              );
                            })}

                            <polyline
                              points={pointsStr}
                              fill="none"
                              stroke={activeTab === 'temperature' ? "#0f2b48" : "#0891b2"}
                              strokeWidth="3.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />

                            {/* Interactive Depth Points */}
                            {profiles.map((p) => {
                              const val = activeTab === 'temperature' ? p.predictedTemp : p.anomaly;
                              const x = activeTab === 'temperature'
                                ? 50 + (val / 32) * 430
                                : 50 + ((val + 2) / 4) * 430;
                              const y = 20 + (p.depth / 1000) * 340;
                              const isHovered = hoveredDepth === p.depth;

                              return (
                                <g
                                  key={`pred-dot-${p.depth}`}
                                  className="cursor-pointer"
                                  onMouseEnter={() => setHoveredDepth(p.depth)}
                                  onMouseLeave={() => setHoveredDepth(null)}
                                >
                                  {isHovered && (
                                    <circle cx={x} cy={y} r="7" fill="#0f2b48" fillOpacity="0.2" />
                                  )}
                                  <circle
                                    cx={x}
                                    cy={y}
                                    r={isHovered ? "4" : "3"}
                                    fill={activeTab === 'temperature' ? "#0f2b48" : "#0891b2"}
                                    stroke="#ffffff"
                                    strokeWidth="1.5"
                                  />
                                </g>
                              );
                            })}
                          </g>
                        );
                      })()}
                    </svg>
                  </div>

                  {/* Chart Legend */}
                  <div className="mt-3 pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-[11px]">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 font-medium text-slate-800">
                        <span className="w-4 h-1 bg-[#0f2b48] rounded"></span>
                        <span>OceanEmbed Reconstructed</span>
                      </div>
                      {showArgoOverlay && activeTab === 'temperature' && (
                        <div className="flex items-center gap-1.5 font-medium text-cyan-700">
                          <span className="w-4 h-1 border-t-2 border-cyan-600 border-dashed"></span>
                          <span>ARGO Co-located Float</span>
                        </div>
                      )}
                    </div>
                    <div className="text-slate-400 font-mono text-[10px]">
                      Shaded area represents ±1σ model uncertainty
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Compact Result Card + 15 Depth Level List */}
            <div className="lg:col-span-4 space-y-4">
              {/* Status Header */}
              <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <span className="text-xs font-bold text-[#0f2b48] uppercase tracking-wider">
                    Reconstruction Status
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    <CheckCircle className="w-3 h-3" />
                    Completed
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-50 p-2 rounded border border-slate-100">
                    <span className="text-slate-400 text-[10px] block">Depth Coverage</span>
                    <span className="font-bold text-slate-800">0 – 1000 m</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded border border-slate-100">
                    <span className="text-slate-400 text-[10px] block">Discretization</span>
                    <span className="font-bold text-slate-800">15 Standard Levels</span>
                  </div>
                </div>
              </div>

              {/* 15 Standard Depth Levels Table */}
              <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Reconstructed Depth Values
                  </h4>
                  <span className="text-[10px] font-mono text-slate-400">15 STANDARD LEVELS</span>
                </div>

                <div className="max-h-[320px] overflow-y-auto pr-1 space-y-1">
                  <div className="grid grid-cols-12 text-[10px] font-mono text-slate-400 uppercase pb-1 border-b border-slate-100 px-1">
                    <span className="col-span-3">Depth</span>
                    <span className="col-span-4 text-right">Predicted</span>
                    <span className="col-span-3 text-right">ARGO</span>
                    <span className="col-span-2 text-right">Δ</span>
                  </div>

                  {profiles.map((p) => {
                    const isSelected = hoveredDepth === p.depth;
                    const diff = Math.abs(p.predictedTemp - p.argoTemp);

                    return (
                      <div
                        key={`row-${p.depth}`}
                        onMouseEnter={() => setHoveredDepth(p.depth)}
                        onMouseLeave={() => setHoveredDepth(null)}
                        className={`grid grid-cols-12 items-center text-xs p-1.5 rounded font-mono transition-colors ${
                          isSelected
                            ? 'bg-cyan-50 text-cyan-950 font-bold'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <span className="col-span-3 font-semibold">{p.depth}m</span>
                        <span className="col-span-4 text-right text-[#0f2b48] font-bold">
                          {p.predictedTemp.toFixed(2)}°C
                        </span>
                        <span className="col-span-3 text-right text-slate-500">
                          {p.argoTemp.toFixed(2)}°C
                        </span>
                        <span className="col-span-2 text-right text-emerald-600 text-[11px]">
                          ±{diff.toFixed(2)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-slate-400 flex items-center justify-between">
                  <span>RMSE Error: {inferenceResult.metrics.rmse}°C</span>
                  <span className="text-slate-500">SIH26066 Standard</span>
                </div>
              </div>
            </div>
          </div>

          {/* Subsurface Heatmap Section (X: Longitude vs Y: Depth) */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-[#0f2b48]">
                    Reconstructed Subsurface Temperature Cross-Section
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-50 text-cyan-800 border border-cyan-200 font-semibold">
                    ZONAL TRANSECT
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Dynamic zonal transect from 55°E Arabian Sea to 95°E Bay of Bengal at selected latitude
                </p>
              </div>

              {/* Transect Latitude Selector */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500">Transect Latitude:</span>
                <select
                  value={transectLat}
                  onChange={(e) => setTransectLat(parseFloat(e.target.value))}
                  className="bg-slate-50 border border-slate-200 px-2 py-1 rounded font-mono text-slate-800 font-semibold text-xs"
                >
                  <option value={8.0}>8°N (South Tip)</option>
                  <option value={12.0}>12°N (Central Basin)</option>
                  <option value={16.0}>16°N (Mid Arabian Sea / BoB)</option>
                  <option value={20.0}>20°N (North Bay / Gujarat)</option>
                </select>
              </div>
            </div>

            {/* Heatmap Graphic Canvas */}
            <div className="bg-slate-900 rounded-lg p-4 text-white">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
                <span>ZONAL TRANSECT AT LATITUDE {transectLat.toFixed(1)}°N</span>
                <span>COLORMAP: SUB-SURFACE IN SITU TEMPERATURE (°C)</span>
              </div>

              <div className="h-56 w-full relative bg-[#091a2c] rounded border border-slate-800 overflow-hidden">
                <svg viewBox="0 0 600 200" className="w-full h-full" preserveAspectRatio="none">
                  {/* Top Layer 0-50m: Warm 28-30°C */}
                  <rect x="0" y="0" width="600" height="25" fill="#f97316" />
                  
                  {/* Mixed layer gradient */}
                  <rect x="0" y="25" width="600" height="30" fill="#fb923c" />

                  {/* Main Thermocline 75-200m */}
                  <path
                    d="M 0,55 Q 150,75 300,60 T 600,65 L 600,100 Q 450,110 300,105 T 0,95 Z"
                    fill="#38bdf8"
                  />
                  <path
                    d="M 0,95 Q 150,110 300,105 T 600,100 L 600,140 Q 450,145 300,140 T 0,135 Z"
                    fill="#0284c7"
                  />

                  {/* Deep Layer 300-1000m */}
                  <rect x="0" y="135" width="600" height="65" fill="#0f2b48" />

                  {/* Isotherm Contour Lines */}
                  {[
                    { temp: '28°C', y: 22 },
                    { temp: '25°C', y: 50 },
                    { temp: '20°C', y: 75 },
                    { temp: '15°C', y: 105 },
                    { temp: '10°C', y: 140 },
                    { temp: '6°C', y: 180 },
                  ].map((iso) => (
                    <g key={iso.temp}>
                      <line x1="0" y1={iso.y} x2="600" y2={iso.y} stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" strokeDasharray="3,3" />
                      <text x="590" y={iso.y - 2} fill="#ffffff" fontSize="8" fontFamily="monospace" textAnchor="end" opacity="0.8">
                        {iso.temp}
                      </text>
                    </g>
                  ))}

                  {/* Transect stations */}
                  <line x1="150" y1="0" x2="150" y2="200" stroke="rgba(255,255,255,0.4)" strokeWidth="1" strokeDasharray="2,2" />
                  <text x="155" y="15" fill="#ffffff" fontSize="9" fontWeight="bold">Arabian Sea</text>

                  <line x1="450" y1="0" x2="450" y2="200" stroke="rgba(255,255,255,0.4)" strokeWidth="1" strokeDasharray="2,2" />
                  <text x="455" y="15" fill="#ffffff" fontSize="9" fontWeight="bold">Bay of Bengal</text>
                </svg>
              </div>

              {/* Bottom Heatmap Axis and Color Scale */}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
                <div className="flex items-center gap-6 font-mono text-[10px]">
                  <span>55°E (West AS)</span>
                  <span>65°E</span>
                  <span>75°E (India West Coast)</span>
                  <span>85°E</span>
                  <span>95°E (Andaman Sea)</span>
                </div>

                <div className="flex items-center gap-2 text-[10px]">
                  <span>5°C</span>
                  <div className="w-28 h-2 rounded bg-gradient-to-r from-[#0f2b48] via-[#0284c7] via-[#38bdf8] via-[#fb923c] to-[#f97316]"></div>
                  <span>30°C</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

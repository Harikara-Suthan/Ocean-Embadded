import React, { useState } from 'react';
import { NORTH_INDIAN_OCEAN_GRID, PRESET_LOCATIONS } from '../../data/oceanData';
import { SurfaceObservationPoint, OceanVariable } from '../../types/ocean';
import { Database, Filter, Calendar, MapPin, Layers, ArrowRight, Check, Activity, RefreshCw, Download, FileSpreadsheet, Eye } from 'lucide-react';
import { PageId } from '../layout/Sidebar';
import { estimateSurfaceParams, getRegionFromCoordinates } from '../../services/oceanInferenceEngine';

interface OceanDataViewProps {
  onSelectStationForReconstruction?: (presetId: string) => void;
  onNavigate?: (page: PageId) => void;
  onCoordinateSelect?: (lat: number, lon: number) => void;
}

export const OceanDataView: React.FC<OceanDataViewProps> = ({
  onSelectStationForReconstruction,
  onNavigate,
  onCoordinateSelect,
}) => {
  const [selectedVar, setSelectedVar] = useState<OceanVariable>('sst');
  const [activeLat, setActiveLat] = useState<number>(14.5);
  const [activeLon, setActiveLon] = useState<number>(89.2);
  const [selectedSeason, setSelectedSeason] = useState<'monsoon' | 'post-monsoon' | 'pre-monsoon' | 'winter'>('post-monsoon');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Compute live surface observations for current coordinate
  const currentRegion = getRegionFromCoordinates(activeLat, activeLon);
  const currentParams = estimateSurfaceParams(activeLat, activeLon);

  const handleMapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // SVG coordinate space: X from 40 to 110 (lon 40°E to 110°E), Y from 0 to 32 (lat 30°N to 0°N)
    const normX = clickX / rect.width;
    const normY = clickY / rect.height;

    const clickedLon = Number((40 + normX * 70).toFixed(1));
    const clickedLat = Number((30 - normY * 30).toFixed(1));

    if (clickedLat >= 0 && clickedLat <= 30 && clickedLon >= 45 && clickedLon <= 105) {
      setActiveLat(clickedLat);
      setActiveLon(clickedLon);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleDownloadCSV = () => {
    const headers = ['Station/Point', 'Latitude_N', 'Longitude_E', 'Region', 'SST_degC', 'SSS_PSU', 'SSH_m', 'CurrentU_mps', 'CurrentV_mps', 'WindU_mps', 'WindV_mps'];
    const rows = NORTH_INDIAN_OCEAN_GRID.map(pt => [
      pt.name,
      pt.lat,
      pt.lon,
      pt.region,
      pt.sst,
      pt.sss,
      pt.ssh,
      pt.currentU,
      pt.currentV,
      pt.windU,
      pt.windV,
    ]);

    // Add current custom inspected point
    rows.unshift([
      `Custom-Inspect-${activeLat}N-${activeLon}E`,
      activeLat,
      activeLon,
      currentRegion,
      currentParams.sst,
      currentParams.sss,
      currentParams.ssh,
      currentParams.currentU,
      currentParams.currentV,
      currentParams.windU,
      currentParams.windV,
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `OceanEmbed_Surface_Observations_${activeLat}N_${activeLon}E.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  const getVariableMeta = (v: OceanVariable) => {
    switch (v) {
      case 'sst':
        return { name: 'Sea Surface Temperature', unit: '°C', min: 26.0, max: 30.5, source: 'OISST / GHRSST (0.25°)' };
      case 'sss':
        return { name: 'Sea Surface Salinity', unit: 'PSU', min: 28.0, max: 37.0, source: 'SMAP / OISSS (0.25°)' };
      case 'ssh':
        return { name: 'Sea Surface Height / SLA', unit: 'm', min: -0.15, max: 0.20, source: 'CMEMS / Jason-3 Altimetry' };
      case 'currents':
        return { name: 'Surface Currents (U/V)', unit: 'm/s', min: 0, max: 0.8, source: 'OSCAR Ocean Surface Currents' };
      case 'winds':
        return { name: 'Surface Winds (10m U/V)', unit: 'm/s', min: 2.0, max: 10.0, source: 'ASCAT / ERA5 Reanalysis' };
    }
  };

  const currentMeta = getVariableMeta(selectedVar);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Heading */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
              SIH26066 • Input Data Layer
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-[#0f2b48]">
              Ocean Data
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Daily multi-source surface observations used as model inputs. Click anywhere on the map to inspect live coordinates.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadCSV}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>{downloadSuccess ? 'Exported CSV!' : 'Export Gridded CSV'}</span>
            </button>
            <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-amber-50 text-amber-800 border border-amber-200/80 font-medium">
              0.25° MULTI-SENSOR GRID
            </span>
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">Region</label>
            <div className="font-semibold text-slate-800 bg-slate-50 px-2.5 py-1.5 rounded border border-slate-200">
              {currentRegion}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">Inspected Latitude</label>
            <div className="font-mono text-[#0f2b48] font-bold bg-slate-50 px-2.5 py-1.5 rounded border border-slate-200 flex items-center justify-between">
              <span>{activeLat.toFixed(1)}°N</span>
              <span className="text-[10px] text-slate-400">5°N–30°N</span>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">Inspected Longitude</label>
            <div className="font-mono text-[#0f2b48] font-bold bg-slate-50 px-2.5 py-1.5 rounded border border-slate-200 flex items-center justify-between">
              <span>{activeLon.toFixed(1)}°E</span>
              <span className="text-[10px] text-slate-400">45°E–105°E</span>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">Spatial Resolution</label>
            <div className="font-mono text-slate-700 bg-slate-50 px-2.5 py-1.5 rounded border border-slate-200">
              0.25° × 0.25° (~27km)
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">Season Scenario</label>
            <select
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(e.target.value as any)}
              className="w-full text-slate-800 bg-slate-50 px-2 py-1.5 rounded border border-slate-200 text-xs focus:outline-none focus:border-cyan-600"
            >
              <option value="post-monsoon">Post-Monsoon (Sept-Nov)</option>
              <option value="monsoon">SW Monsoon (June-Aug)</option>
              <option value="pre-monsoon">Pre-Monsoon (March-May)</option>
              <option value="winter">Winter Cooling (Dec-Feb)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Map + Station Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Large Interactive Ocean Map */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-[#0f2b48] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyan-600" />
                <span>Interactive North Indian Ocean Map Canvas</span>
              </h3>
              <p className="text-[11px] text-slate-500">
                Click any water point on the canvas to place a coordinate probe and inspect live surface telemetry.
              </p>
            </div>

            {/* Variable Layer Selector */}
            <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-md border border-slate-200 text-xs">
              {(['sst', 'sss', 'ssh', 'currents', 'winds'] as OceanVariable[]).map((v) => (
                <button
                  key={v}
                  onClick={() => setSelectedVar(v)}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium uppercase transition-colors ${
                    selectedVar === v
                      ? 'bg-[#0f2b48] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {v === 'currents' ? 'Currents' : v === 'winds' ? 'Winds' : v.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* SVG Map Canvas */}
          <div className="relative mt-4 bg-slate-900 rounded-lg p-3 text-white overflow-hidden border border-slate-800">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2 px-2">
              <span>ACTIVE LAYER: <span className="text-cyan-400 font-semibold">{currentMeta.name.toUpperCase()}</span></span>
              <span>CLICK MAP TO POSITION PROBE</span>
            </div>

            <div className="relative w-full aspect-[16/9] min-h-[300px] sm:min-h-[380px] bg-[#091a2c] rounded border border-slate-800 flex items-center justify-center cursor-crosshair">
              {/* Scientific Grid Coordinate Background */}
              <svg
                viewBox="40 0 70 32"
                className="w-full h-full"
                preserveAspectRatio="xMidYMid meet"
                onClick={handleMapClick}
              >
                <defs>
                  <pattern id="grid" width="5" height="5" patternUnits="userSpaceOnUse">
                    <path d="M 5 0 L 0 0 0 5" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.3" />
                  </pattern>

                  <linearGradient id="oceanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#082f49" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#0369a1" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#0284c7" stopOpacity="0.6" />
                  </linearGradient>
                </defs>

                {/* Ocean Area Grid Fill */}
                <rect x="40" y="0" width="70" height="32" fill="url(#oceanGradient)" />
                <rect x="40" y="0" width="70" height="32" fill="url(#grid)" />

                {/* Latitude and Longitude Grid Lines */}
                {[5, 10, 15, 20, 25].map((lat) => (
                  <line
                    key={`lat-${lat}`}
                    x1="45"
                    y1={30 - lat}
                    x2="105"
                    y2={30 - lat}
                    stroke="rgba(255,255,255,0.15)"
                    strokeWidth="0.2"
                    strokeDasharray="1,1"
                  />
                ))}

                {[50, 60, 70, 80, 90, 100].map((lon) => (
                  <line
                    key={`lon-${lon}`}
                    x1={lon}
                    y1="2"
                    x2={lon}
                    y2="29"
                    stroke="rgba(255,255,255,0.15)"
                    strokeWidth="0.2"
                    strokeDasharray="1,1"
                  />
                ))}

                {/* Landmass Simplification - Indian Subcontinent */}
                <polygon
                  points="68,28 72,25 76,23 78,21 82,21 86,22 88,23 90,25 89,28 85,27 82,18 80,12 79,9 77,8 75,10 73,14 71,19 69,24"
                  fill="#1e293b"
                  stroke="#475569"
                  strokeWidth="0.4"
                />

                {/* Sri Lanka */}
                <ellipse cx="80.5" cy="7" rx="1.2" ry="1.8" fill="#1e293b" stroke="#475569" strokeWidth="0.3" />

                {/* Arabian Peninsula */}
                <polygon
                  points="45,30 55,28 58,22 56,16 53,13 45,15"
                  fill="#1e293b"
                  stroke="#475569"
                  strokeWidth="0.4"
                />

                {/* Myanmar / SE Asia */}
                <polygon
                  points="92,27 96,25 98,20 100,15 104,12 105,8 105,30"
                  fill="#1e293b"
                  stroke="#475569"
                  strokeWidth="0.4"
                />

                {/* Andaman Islands */}
                <line x1="93" y1="14" x2="93.5" y2="10" stroke="#94a3b8" strokeWidth="0.7" strokeLinecap="round" />

                {/* Map Regional Water Labels */}
                <text x="58" y="16" fill="#94a3b8" fontSize="2" fontWeight="bold" opacity="0.6" letterSpacing="0.2">ARABIAN SEA</text>
                <text x="86" y="15" fill="#94a3b8" fontSize="2" fontWeight="bold" opacity="0.6" letterSpacing="0.2">BAY OF BENGAL</text>
                <text x="68" y="2" fill="#94a3b8" fontSize="1.8" fontWeight="bold" opacity="0.5" letterSpacing="0.2">EQUATORIAL INDIAN OCEAN</text>

                {/* Coordinate text labels */}
                <text x="44" y="25" fill="#64748b" fontSize="1.2" fontFamily="monospace">5°N</text>
                <text x="44" y="15" fill="#64748b" fontSize="1.2" fontFamily="monospace">15°N</text>
                <text x="44" y="5" fill="#64748b" fontSize="1.2" fontFamily="monospace">25°N</text>

                <text x="50" y="31" fill="#64748b" fontSize="1.2" fontFamily="monospace">50°E</text>
                <text x="70" y="31" fill="#64748b" fontSize="1.2" fontFamily="monospace">70°E</text>
                <text x="90" y="31" fill="#64748b" fontSize="1.2" fontFamily="monospace">90°E</text>

                {/* Fixed Station Nodes */}
                {NORTH_INDIAN_OCEAN_GRID.map((pt) => {
                  const svgX = pt.lon;
                  const svgY = 30 - pt.lat;

                  return (
                    <g
                      key={pt.id}
                      className="cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveLat(pt.lat);
                        setActiveLon(pt.lon);
                      }}
                    >
                      <circle
                        cx={svgX}
                        cy={svgY}
                        r="1.2"
                        fill="#06b6d4"
                        stroke="#ffffff"
                        strokeWidth="0.3"
                      />
                    </g>
                  );
                })}

                {/* Active Interactive Probe Target Pin */}
                {(() => {
                  const probeX = activeLon;
                  const probeY = 30 - activeLat;
                  return (
                    <g className="transition-all duration-200">
                      <circle cx={probeX} cy={probeY} r="3.2" fill="none" stroke="#f59e0b" strokeWidth="0.5" className="animate-ping" opacity="0.75" />
                      <circle cx={probeX} cy={probeY} r="1.8" fill="#f59e0b" stroke="#ffffff" strokeWidth="0.5" />
                      {/* Crosshairs */}
                      <line x1={probeX - 3} y1={probeY} x2={probeX + 3} y2={probeY} stroke="#f59e0b" strokeWidth="0.3" />
                      <line x1={probeX} y1={probeY - 3} x2={probeX} y2={probeY + 3} stroke="#f59e0b" strokeWidth="0.3" />
                      <text x={probeX + 2.5} y={probeY - 1} fill="#fef08a" fontSize="1.3" fontWeight="bold" fontFamily="monospace">
                        PROBE [{activeLat.toFixed(1)}°N, {activeLon.toFixed(1)}°E]
                      </text>
                    </g>
                  );
                })()}
              </svg>
            </div>

            {/* Bottom Colormap Legend */}
            <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <div className="flex items-center gap-2">
                <span>Color Scale ({currentMeta.unit}):</span>
                <div className="flex items-center gap-1">
                  <span className="font-mono text-[10px]">{currentMeta.min}</span>
                  <div className="w-24 h-2 rounded bg-gradient-to-r from-blue-600 via-cyan-400 to-amber-500"></div>
                  <span className="font-mono text-[10px]">{currentMeta.max}</span>
                </div>
              </div>
              <span className="text-slate-400 text-[10px]">Coordinate updates dynamically on map click</span>
            </div>
          </div>
        </div>

        {/* Selected Point Inspector */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded font-semibold">
                  Live Probe Telemetry
                </span>
                <h3 className="text-base font-bold text-[#0f2b48] mt-1">
                  {currentRegion}
                </h3>
                <p className="text-xs font-mono text-slate-500">
                  {activeLat.toFixed(2)}°N, {activeLon.toFixed(2)}°E
                </p>
              </div>
            </div>

            {/* Surface Variable Values for Selected Point */}
            <div className="mt-4 space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-100">
                <span className="text-slate-600 font-medium">Sea Surface Temp (SST)</span>
                <span className="font-mono font-bold text-[#0f2b48]">{currentParams.sst.toFixed(2)} °C</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-100">
                <span className="text-slate-600 font-medium">Sea Surface Salinity (SSS)</span>
                <span className="font-mono font-bold text-[#0f2b48]">{currentParams.sss.toFixed(2)} PSU</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-100">
                <span className="text-slate-600 font-medium">Sea Surface Height (SSH)</span>
                <span className="font-mono font-bold text-[#0f2b48]">
                  {currentParams.ssh > 0 ? `+${currentParams.ssh.toFixed(3)}` : currentParams.ssh.toFixed(3)} m
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-100">
                <span className="text-slate-600 font-medium">Surface Current (U / V)</span>
                <span className="font-mono font-bold text-[#0f2b48]">
                  [{currentParams.currentU.toFixed(2)}, {currentParams.currentV.toFixed(2)}] m/s
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-100">
                <span className="text-slate-600 font-medium">Surface Winds 10m (U / V)</span>
                <span className="font-mono font-bold text-[#0f2b48]">
                  [{currentParams.windU.toFixed(1)}, {currentParams.windV.toFixed(1)}] m/s
                </span>
              </div>
            </div>

            {/* CTA to Reconstruction with selected coordinates */}
            <div className="mt-5 pt-3 border-t border-slate-100 space-y-2">
              <button
                onClick={() => {
                  if (onCoordinateSelect) onCoordinateSelect(activeLat, activeLon);
                  if (onNavigate) onNavigate('reconstruction');
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-[#0f2b48] hover:bg-slate-800 text-white rounded text-xs font-medium transition-colors shadow-xs"
              >
                <span>Reconstruct Depth Profile at {activeLat.toFixed(1)}°N, {activeLon.toFixed(1)}°E</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Data Source Details */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs space-y-2">
            <h4 className="font-semibold text-slate-800 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-slate-500" />
              <span>NetCDF-4 Sensor Integration</span>
            </h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Real-time synchronization across GHRSST Level-4 OSTIA, SMAP/OISSS Salinity, CMEMS DUACS SLA altimetry, and ASCAT scatterometer wind stress tensors.
            </p>
          </div>
        </div>
      </div>

      {/* 7 Data-Variable Cards (SST, SSS, SSH/SLA, Surface U, Surface V, Wind U, Wind V) */}
      <div>
        <div className="mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            DATA VARIABLE SPECIFICATIONS
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {[
            { name: 'SST', full: 'Sea Surface Temp', val: `${currentParams.sst.toFixed(1)} °C`, status: 'Available', res: '0.25°' },
            { name: 'SSS', full: 'Sea Surface Salinity', val: `${currentParams.sss.toFixed(1)} PSU`, status: 'Available', res: '0.25°' },
            { name: 'SSH / SLA', full: 'Sea Surface Height', val: `${currentParams.ssh > 0 ? '+' : ''}${currentParams.ssh.toFixed(2)} m`, status: 'Available', res: '0.25°' },
            { name: 'Surface U', full: 'Zonal Current', val: `${currentParams.currentU.toFixed(2)} m/s`, status: 'Available', res: '0.25°' },
            { name: 'Surface V', full: 'Meridional Current', val: `${currentParams.currentV.toFixed(2)} m/s`, status: 'Available', res: '0.25°' },
            { name: 'Wind U', full: 'Zonal 10m Wind', val: `${currentParams.windU.toFixed(1)} m/s`, status: 'Available', res: '0.25°' },
            { name: 'Wind V', full: 'Meridional 10m Wind', val: `${currentParams.windV.toFixed(1)} m/s`, status: 'Available', res: '0.25°' },
          ].map((item) => (
            <div key={item.name} className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-xs font-bold text-slate-800">{item.name}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" title="Connected"></span>
              </div>
              <p className="text-[11px] text-slate-500 truncate">{item.full}</p>
              <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                <span className="font-mono text-[#0f2b48] font-bold">{item.val}</span>
                <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-medium">
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Processing Pipeline Section */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-[#0f2b48]">
            Multi-Source Processing Pipeline
          </h3>
          <p className="text-xs text-slate-500">
            Harmonization from raw satellite telemetry to deep learning tensors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-2 pt-2">
          {[
            { step: '01', title: 'Raw Observations', desc: 'Satellite L3/L4 swaths' },
            { step: '02', title: 'Cleaning', desc: 'Cloud mask & flag filter' },
            { step: '03', title: 'Missing Value Handling', desc: 'DINEOF / Kriging interp' },
            { step: '04', title: 'Spatial Alignment', desc: 'Regrid to 0.25° grid' },
            { step: '05', title: 'Temporal Alignment', desc: 'Daily synchronized slice' },
            { step: '06', title: 'Model-Ready Dataset', desc: 'Normalized [B, C, H, W]' },
          ].map((p, idx) => (
            <div key={p.step} className="p-3 bg-slate-50 rounded border border-slate-200 relative text-xs">
              <div className="text-[10px] font-mono font-bold text-slate-400 mb-1">{p.step}</div>
              <div className="font-semibold text-slate-800">{p.title}</div>
              <div className="text-[10px] text-slate-500 mt-1">{p.desc}</div>
              {idx < 5 && (
                <div className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-slate-400 font-mono text-xs">
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

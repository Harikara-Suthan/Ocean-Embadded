import React from 'react';
import { ArrowRight, BookOpen, Layers, Wind, Compass, Waves, Thermometer, Droplets, MapPin, Gauge } from 'lucide-react';
import { PageId } from '../layout/Sidebar';

interface OverviewViewProps {
  onNavigate: (page: PageId) => void;
  onOpenMethodology: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({ onNavigate, onOpenMethodology }) => {
  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Top Banner / Hero Intro */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#0f2b48] bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              SIH26066
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Ministry of Earth Sciences • INCOIS
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0f2b48]">
            OceanEmbed
          </h1>
          <p className="text-sm sm:text-base font-medium text-slate-700 mt-1">
            Satellite → Subsurface Ocean Intelligence
          </p>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mt-1 leading-relaxed">
            Reconstructing hidden subsurface ocean temperature from surface observations using deep learning.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white border border-slate-200 text-xs font-mono text-slate-700 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Prototype Mode</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-xs">
        {/* Left Hero Content */}
        <div className="lg:col-span-6 flex flex-col justify-center space-y-5">
          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-cyan-50 text-cyan-800 border border-cyan-200/60">
              <span>Deep Learning Framework</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0f2b48] leading-tight">
              From Surface Signals to Subsurface Temperature
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              OceanEmbed learns relationships between surface ocean observations and hidden subsurface temperature structure using deep learning.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('reconstruction')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0f2b48] hover:bg-slate-800 text-white rounded-md text-xs font-medium transition-colors shadow-xs"
            >
              <span>Explore Reconstruction</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenMethodology}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 rounded-md text-xs font-medium border border-slate-200 transition-colors"
            >
              <BookOpen className="w-4 h-4 text-slate-400" />
              <span>View Methodology</span>
            </button>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center gap-6 text-[11px] text-slate-500">
            <div>
              <span className="font-semibold text-slate-700">Domain:</span> North Indian Ocean
            </div>
            <div>
              <span className="font-semibold text-slate-700">Depths:</span> 15 Standard Levels
            </div>
          </div>
        </div>

        {/* Right Abstract Ocean Visualization */}
        <div className="lg:col-span-6 flex flex-col justify-center">
          <div className="bg-slate-900 rounded-lg p-5 text-white font-mono border border-slate-800 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5 text-cyan-400 font-semibold">
                <Waves className="w-3.5 h-3.5" />
                VERTICAL OCEAN STRATIFICATION
              </span>
              <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">
                0 – 1000 m
              </span>
            </div>

            {/* Ocean Depth Layers Visualizer */}
            <div className="mt-4 space-y-2 relative text-xs">
              {/* Surface Layer */}
              <div className="relative group p-2.5 rounded bg-gradient-to-r from-red-500/20 via-orange-500/20 to-amber-500/20 border border-orange-500/30">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="font-semibold text-amber-200">0m (Surface Layer)</span>
                  <span className="text-amber-300 font-bold">~29.5 °C</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5 font-sans flex items-center justify-between">
                  <span>SST • SSS • SSH • Surface Currents • Winds</span>
                  <span className="text-cyan-300 font-mono">Satellite Observed</span>
                </div>
              </div>

              {/* Mixed Layer */}
              <div className="relative p-2.5 rounded bg-amber-500/10 border border-amber-500/20">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-300">20 – 50m (Mixed Layer)</span>
                  <span className="text-slate-200">~28.5 – 27.0 °C</span>
                </div>
                <div className="text-[10px] text-slate-400 font-sans">
                  Turbulent wind-driven homogeneous upper ocean
                </div>
              </div>

              {/* Thermocline */}
              <div className="relative p-2.5 rounded bg-cyan-900/30 border border-cyan-500/30">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-cyan-300 font-semibold">75 – 200m (Main Thermocline)</span>
                  <span className="text-cyan-300 font-bold">~24.0 → 13.5 °C</span>
                </div>
                <div className="text-[10px] text-slate-400 font-sans flex items-center justify-between">
                  <span>Sharp vertical temperature drop (damped gradient)</span>
                  <span className="text-emerald-400 font-mono">AI Reconstructed</span>
                </div>
              </div>

              {/* Deep Ocean */}
              <div className="relative p-2.5 rounded bg-blue-950/60 border border-blue-800/40">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-400">300 – 1000m (Deep Ocean Layer)</span>
                  <span className="text-slate-400">~11.0 → 5.3 °C</span>
                </div>
                <div className="text-[10px] text-slate-500 font-sans">
                  Stable asymptotic abyssal cooling
                </div>
              </div>
            </div>

            {/* Bottom Note */}
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
              <span>OceanEmbed Latent Mapping</span>
              <span className="text-emerald-400 font-medium">Continuous 15-Depth Profile</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Compact Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>Target Region</span>
          </div>
          <div className="text-base font-bold text-[#0f2b48]">
            North Indian Ocean
          </div>
          <div className="text-xs font-mono text-slate-500 mt-0.5">
            5°N – 30°N
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <span>Spatial Resolution</span>
          </div>
          <div className="text-base font-bold text-[#0f2b48]">
            0.25° × 0.25°
          </div>
          <div className="text-xs font-mono text-slate-500 mt-0.5">
            ~27 km Grid Grid
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
            <Gauge className="w-3.5 h-3.5 text-slate-400" />
            <span>Temporal Resolution</span>
          </div>
          <div className="text-base font-bold text-[#0f2b48]">
            Daily
          </div>
          <div className="text-xs font-mono text-slate-500 mt-0.5">
            Multi-source Ingestion
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
            <Waves className="w-3.5 h-3.5 text-slate-400" />
            <span>Reconstruction Depth</span>
          </div>
          <div className="text-base font-bold text-[#0f2b48]">
            0 – 1000 m
          </div>
          <div className="text-xs font-mono text-slate-500 mt-0.5">
            15 Standard Levels
          </div>
        </div>
      </div>

      {/* Surface Observations Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              SURFACE OBSERVATIONS
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              5 multi-modal surface variables required for the SIH26066 framework.
            </p>
          </div>
          <button
            onClick={() => onNavigate('data')}
            className="text-xs font-medium text-[#0f2b48] hover:text-cyan-700 inline-flex items-center gap-1"
          >
            <span>Inspect Data Grids</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {/* Card 1: SST */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                SST
              </span>
              <Thermometer className="w-4 h-4 text-orange-500" />
            </div>
            <h4 className="text-sm font-semibold text-[#0f2b48]">
              Sea Surface Temperature
            </h4>
            <p className="text-[11px] text-slate-500 mt-1 leading-snug">
              Thermal skin boundary and upper boundary condition (°C).
            </p>
            <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-slate-400 font-mono">
              Status: Available (0.25°)
            </div>
          </div>

          {/* Card 2: SSS */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                SSS
              </span>
              <Droplets className="w-4 h-4 text-blue-500" />
            </div>
            <h4 className="text-sm font-semibold text-[#0f2b48]">
              Sea Surface Salinity
            </h4>
            <p className="text-[11px] text-slate-500 mt-1 leading-snug">
              Controls barrier layer formation and halocline density (PSU).
            </p>
            <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-slate-400 font-mono">
              Status: Available (SMAP/OISSS)
            </div>
          </div>

          {/* Card 3: SSH / SLA */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                SSH / SLA
              </span>
              <Waves className="w-4 h-4 text-cyan-600" />
            </div>
            <h4 className="text-sm font-semibold text-[#0f2b48]">
              Sea Surface Height
            </h4>
            <p className="text-[11px] text-slate-500 mt-1 leading-snug">
              Altimetric proxy reflecting integrated vertical water column heat (m).
            </p>
            <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-slate-400 font-mono">
              Status: Available (Altimeter)
            </div>
          </div>

          {/* Card 4: Surface Currents U/V */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                U / V
              </span>
              <Compass className="w-4 h-4 text-emerald-600" />
            </div>
            <h4 className="text-sm font-semibold text-[#0f2b48]">
              Surface Currents
            </h4>
            <p className="text-[11px] text-slate-500 mt-1 leading-snug">
              Zonal and meridional geostrophic & total advection velocities (m/s).
            </p>
            <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-slate-400 font-mono">
              Status: Available (OSCAR)
            </div>
          </div>

          {/* Card 5: Surface Winds U/V */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                U / V
              </span>
              <Wind className="w-4 h-4 text-indigo-500" />
            </div>
            <h4 className="text-sm font-semibold text-[#0f2b48]">
              Surface Winds
            </h4>
            <p className="text-[11px] text-slate-500 mt-1 leading-snug">
              10-meter wind vectors driving Ekman pumping and mixing (m/s).
            </p>
            <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-slate-400 font-mono">
              Status: Available (ASCAT/ERA5)
            </div>
          </div>
        </div>
      </div>

      {/* Conceptual Flow Summary Bar */}
      <div className="p-4 bg-slate-100 border border-slate-200 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-700">
          <span className="font-semibold text-[#0f2b48]">Transformation Pipeline:</span>
          <span>2D Surface Observations → Latent Ocean Embedding → 3D Subsurface Temperature Structure</span>
        </div>
        <button
          onClick={() => onNavigate('embedding')}
          className="text-xs font-semibold text-cyan-700 hover:text-cyan-900 inline-flex items-center gap-1 shrink-0"
        >
          <span>See Ocean Embedding Architecture</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

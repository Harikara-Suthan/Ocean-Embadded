import React from 'react';
import { Building2, Shield, Cpu, Code2, Database, Layers, CheckCircle2, Globe, Flame, Waves, HelpCircle, Activity } from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="border-b border-slate-200 pb-5">
        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
          Problem Specification & Context
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-[#0f2b48] mt-1">
          About OceanEmbed
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Satellite Embedding-Based Deep Learning Framework for Reconstruction of Subsurface Ocean Temperature from Surface Satellite Observations.
        </p>
      </div>

      {/* Official Hackathon Metadata Grid */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
          Problem Statement Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-slate-400 text-[10px] font-mono block uppercase">Problem Statement ID</span>
            <span className="font-bold text-base text-[#0f2b48] font-mono">SIH26066</span>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-slate-400 text-[10px] font-mono block uppercase">Ministry / Organization</span>
            <span className="font-bold text-slate-900 block">Ministry of Earth Sciences (MoES)</span>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-slate-400 text-[10px] font-mono block uppercase">Department / Nodal Agency</span>
            <span className="font-bold text-slate-900 block">INCOIS</span>
            <span className="text-[10px] text-slate-500">Indian National Centre for Ocean Information Services</span>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-slate-400 text-[10px] font-mono block uppercase">Theme</span>
            <span className="font-bold text-slate-900 block">Disaster Management</span>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-slate-400 text-[10px] font-mono block uppercase">Category</span>
            <span className="font-bold text-slate-900 block">Software / AI</span>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-slate-400 text-[10px] font-mono block uppercase">Target Geographic Basin</span>
            <span className="font-bold text-slate-900 block">North Indian Ocean (5°N – 30°N)</span>
          </div>
        </div>
      </div>

      {/* Problem Focus Statement */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-[#0f2b48]">
          Problem Focus
        </h3>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          Operational satellite sensors provide continuous, high-resolution views of the ocean surface (such as SST, SSS, SSH, currents, and winds), but cannot penetrate deeply into the ocean interior where critical thermal energy is stored. In-situ ARGO profiling floats observe vertical depth profiles with high accuracy but are spatially sparse and offer temporal revisits of only ~10 days.
        </p>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          <strong>OceanEmbed</strong> bridges this fundamental observational gap by formulating a multi-modal deep learning framework that projects 2D satellite surface observations into a latent thermodynamic ocean embedding, subsequently reconstructing 3D continuous subsurface temperature fields down to 1000m.
        </p>
      </div>

      {/* Why It Matters Section */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-[#0f2b48]">
            Why It Matters: Key Scientific & Operational Impact
          </h3>
          <p className="text-xs text-slate-500">
            Crucial applications for ocean intelligence, disaster risk reduction, and operational oceanography:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 text-xs">
          <div className="p-3.5 rounded bg-slate-50 border border-slate-200 space-y-1">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <Waves className="w-4 h-4 text-cyan-700" />
              <span>Ocean Circulation</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Provides vertical density structures necessary to diagnose geostrophic currents, baroclinic eddies, and Wyrtki jet dynamics.
            </p>
          </div>

          <div className="p-3.5 rounded bg-slate-50 border border-slate-200 space-y-1">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <Flame className="w-4 h-4 text-orange-600" />
              <span>Upper-Ocean Heat Content</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Enables accurate calculation of Tropical Cyclone Heat Potential (TCHP), a critical factor in rapid cyclone intensification forecasting.
            </p>
          </div>

          <div className="p-3.5 rounded bg-slate-50 border border-slate-200 space-y-1">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <Globe className="w-4 h-4 text-blue-600" />
              <span>Climate Variability</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Tracks Indian Ocean Dipole (IOD), Madden-Julian Oscillation (MJO), and monsoonal heat budget modulations.
            </p>
          </div>

          <div className="p-3.5 rounded bg-slate-50 border border-slate-200 space-y-1">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <Activity className="w-4 h-4 text-red-600" />
              <span>Marine Heatwave Monitoring</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Detects subsurface marine heatwave events that penetrate deeper than surface satellite SST signals can reveal.
            </p>
          </div>

          <div className="p-3.5 rounded bg-slate-50 border border-slate-200 space-y-1">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <Layers className="w-4 h-4 text-emerald-600" />
              <span>Marine Ecosystem Understanding</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Constrains coastal upwelling zones, thermocline depth, and nutrient-rich cold water supply vital for fisheries.
            </p>
          </div>

          <div className="p-3.5 rounded bg-slate-50 border border-slate-200 space-y-1">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <Database className="w-4 h-4 text-indigo-600" />
              <span>Ocean Data Assimilation</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Supplies high-resolution synthetic pseudo-profiles to initialize numerical ocean prediction models at INCOIS.
            </p>
          </div>
        </div>
      </div>

      {/* Production Stack & Architecture Roadmap */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 space-y-4">
        <h3 className="text-sm font-bold text-[#0f2b48] flex items-center gap-2">
          <Code2 className="w-4 h-4 text-slate-600" />
          <span>Technical Architecture & Model Integration Readiness</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-white rounded border border-slate-200">
            <span className="font-semibold text-slate-900 block">AI Layer</span>
            <span className="text-slate-500 text-[11px] font-mono">PyTorch, ViT, CNN</span>
          </div>

          <div className="p-3 bg-white rounded border border-slate-200">
            <span className="font-semibold text-slate-900 block">Data Pipeline</span>
            <span className="text-slate-500 text-[11px] font-mono">NetCDF4, xarray, Dask</span>
          </div>

          <div className="p-3 bg-white rounded border border-slate-200">
            <span className="font-semibold text-slate-900 block">Backend Interface</span>
            <span className="text-slate-500 text-[11px] font-mono">FastAPI REST / gRPC</span>
          </div>

          <div className="p-3 bg-white rounded border border-slate-200">
            <span className="font-semibold text-slate-900 block">Deployment</span>
            <span className="text-slate-500 text-[11px] font-mono">Docker, Kubernetes</span>
          </div>
        </div>

        <div className="pt-2 text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-200">
          <span>Smart India Hackathon 2026 Prototype Demonstration</span>
          <span>Clean Service Separation</span>
        </div>
      </div>
    </div>
  );
};

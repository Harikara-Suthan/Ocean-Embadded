import React from 'react';
import { X, Satellite, Sliders, Cpu, Network, ArrowDown, CheckCircle, Database, Layers } from 'lucide-react';

interface MethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MethodologyModal: React.FC<MethodologyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const steps = [
    {
      num: '01',
      title: 'Surface Observations',
      tech: 'Multi-Sensor Ingestion',
      desc: 'Ingests daily multi-modal satellite & reanalysis products: SST, SSS, SSH/SLA, Surface Currents (U/V), and Surface Winds (U/V).',
      icon: Satellite,
      badge: 'Inputs',
      color: 'border-blue-200 bg-blue-50/40 text-blue-700'
    },
    {
      num: '02',
      title: 'Data Preparation',
      tech: 'Grid Alignment & Quality Control',
      desc: 'Harmonizes spatial grids (0.25° × 0.25°), applies land-sea masking, quality flags, and missing data imputation across the North Indian Ocean basin.',
      icon: Sliders,
      badge: 'Harmonization',
      color: 'border-slate-200 bg-slate-50 text-slate-700'
    },
    {
      num: '03',
      title: 'Ocean Embedding',
      tech: 'Multi-Modal Deep Encoder',
      desc: 'Encodes 2D surface variables into a dense, continuous latent ocean vector representing underlying dynamic and thermodynamic properties.',
      icon: Cpu,
      badge: 'Innovation',
      color: 'border-cyan-200 bg-cyan-50/50 text-cyan-800'
    },
    {
      num: '04',
      title: 'Spatial & Temporal Learning',
      tech: 'CNN / ViT + Transformer',
      desc: 'Learns regional oceanographic teleconnections, monsoonal wind forcing, mesoscale eddies, and temporal dynamics over multi-day time windows.',
      icon: Network,
      badge: 'Spatiotemporal AI',
      color: 'border-indigo-200 bg-indigo-50/40 text-indigo-800'
    },
    {
      num: '05',
      title: 'Depth-Aware Decoder',
      tech: 'Continuous Depth Query MLP',
      desc: 'Conditioned on the latent ocean embedding and explicit target depth coordinates (z ∈ [0, 1000m]) to output vertical temperature profiles.',
      icon: Layers,
      badge: 'Vertical Mapping',
      color: 'border-emerald-200 bg-emerald-50/50 text-emerald-800'
    },
    {
      num: '06',
      title: 'Subsurface Temperature',
      tech: '3D Reconstructed Field',
      desc: 'Generates high-resolution 3D temperature fields at 15 standard depth levels, resolving mixed layer depth, thermocline gradient, and deep isothermal layers.',
      icon: Database,
      badge: 'Output (0-1000m)',
      color: 'border-teal-200 bg-teal-50/50 text-teal-800'
    },
    {
      num: '07',
      title: 'Independent Validation',
      tech: 'In-Situ ARGO Benchmark',
      desc: 'Systematically validated against independent in-situ ARGO profiling floats and World Ocean Atlas (WOA) climatology across all seasons and sub-basins.',
      icon: CheckCircle,
      badge: 'Validation',
      color: 'border-slate-200 bg-slate-50 text-slate-700'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-lg shadow-xl border border-slate-200 my-8 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/60">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
              SIH26066 Architecture
            </span>
            <h3 className="text-base font-bold text-[#0f2b48]">
              OceanEmbed End-to-End Methodology
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          <p className="text-xs text-slate-600 leading-relaxed">
            OceanEmbed addresses the fundamental challenge that ocean satellites can only observe surface parameters, while crucial heat content and thermal stratification reside subsurface. The deep learning pipeline bridges this gap via latent multi-modal representations:
          </p>

          <div className="space-y-3">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={step.num} className="relative">
                  <div className={`p-4 rounded-lg border ${step.color} transition-all`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-white border border-slate-200/60 text-slate-700">
                          {step.num}
                        </span>
                        <div>
                          <h4 className="text-sm font-semibold text-slate-900">
                            {step.title}
                          </h4>
                          <span className="text-[11px] font-mono text-slate-500">
                            {step.tech}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-white/80 border border-slate-200/60 text-slate-600">
                        {step.badge}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-slate-600 pl-10 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className="flex justify-center -my-1 py-1">
                      <ArrowDown className="w-3.5 h-3.5 text-slate-300" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Theoretical Foundations */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-2">
            <h5 className="font-semibold text-slate-800">Physical & Mathematical Consistency</h5>
            <ul className="list-disc pl-4 text-slate-600 space-y-1">
              <li><strong>Ekman Dynamics & Wind Stress:</strong> Surface winds induce divergence/convergence controlling thermocline depth.</li>
              <li><strong>Steric Height Principle:</strong> Sea Surface Height (SSH) anomalies integrate vertical thermal expansion and halosteric effects.</li>
              <li><strong>Monotonic Stratification:</strong> Depth-aware decoder preserves stable density profiles to avoid unphysical thermal inversions in the deep layer.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
          <span className="text-slate-400 font-mono">Prototype Specification • SIH26066</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#0f2b48] text-white rounded text-xs font-medium hover:bg-slate-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

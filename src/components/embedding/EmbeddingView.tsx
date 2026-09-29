import React, { useState } from 'react';
import { Cpu, Layers, Sliders, ArrowDown, Sparkles, Activity, ShieldCheck, HelpCircle, RefreshCw, Download, FileCode, Check } from 'lucide-react';
import { DEMO_EMBEDDING_VECTORS } from '../../data/oceanData';

export const EmbeddingView: React.FC = () => {
  // Interactive sliders for testing latent space response
  const [sstVal, setSstVal] = useState(29.2);
  const [sssVal, setSssVal] = useState(33.5);
  const [sshVal, setSshVal] = useState(0.08);
  const [windSpeed, setWindSpeed] = useState(6.2);
  const [currentSpeed, setCurrentSpeed] = useState(0.35);
  const [copiedJson, setCopiedJson] = useState(false);

  // Active neural attention view
  const [selectedAttentionSource, setSelectedAttentionSource] = useState<'SST' | 'SSS' | 'SSH' | 'Currents' | 'Winds'>('SST');

  // Derive dynamic latent values based on input parameters (for convincing interactive demonstration)
  const calculateLatentValue = (baseVal: number, index: number) => {
    const sstFactor = (sstVal - 28.0) * 0.4;
    const sssFactor = (sssVal - 34.0) * 0.2;
    const sshFactor = sshVal * 1.5;
    const windFactor = (windSpeed - 5.0) * 0.1;
    const currentFactor = (currentSpeed - 0.3) * 0.5;

    let modified = baseVal;
    if (index % 5 === 0) modified += sstFactor + sshFactor;
    if (index % 5 === 1) modified -= sssFactor;
    if (index % 5 === 2) modified += windFactor;
    if (index % 5 === 3) modified += currentFactor;
    if (index % 5 === 4) modified += (sstFactor - windFactor);

    return Math.max(-0.99, Math.min(0.99, Number(modified.toFixed(2))));
  };

  const latentVectors = DEMO_EMBEDDING_VECTORS.map((v) => ({
    ...v,
    val: calculateLatentValue(v.val, v.index),
  }));

  // Detect dominant oceanographic regime based on current parameter mix
  const detectRegime = () => {
    if (sstVal > 29.5 && sssVal < 33.0 && sshVal > 0.08) {
      return {
        name: 'Bay of Bengal Warm Pool / Barrier Layer',
        description: 'Thick low-salinity freshwater cap prevents vertical thermal mixing, creating intense heat entrapment.',
        confidence: '94.2%',
      };
    }
    if (sstVal < 27.5 && sssVal > 35.5 && sshVal < -0.05) {
      return {
        name: 'Coastal Upwelling Cell / Cold Dome',
        description: 'Ekman divergence draws cold, saline subsurface water to the upper photic layer.',
        confidence: '91.8%',
      };
    }
    if (currentSpeed > 0.5 && Math.abs(sshVal) < 0.05) {
      return {
        name: 'Equatorial Jet / Wave Advection',
        description: 'Strong zonal current shear driving Kelvin/Rossby wave propagations across the basin.',
        confidence: '88.5%',
      };
    }
    if (sssVal > 36.0) {
      return {
        name: 'Arabian Sea High-Salinity Water (ASHSW)',
        description: 'High surface evaporation driving deep convective vertical overturning and deep mixed layer.',
        confidence: '89.4%',
      };
    }
    return {
      name: 'Stratified Tropical Basin Regime',
      description: 'Standard multi-layer thermal stratification with balanced surface atmospheric forcing.',
      confidence: '86.1%',
    };
  };

  const regime = detectRegime();

  const handleResetDefaults = () => {
    setSstVal(29.2);
    setSssVal(33.5);
    setSshVal(0.08);
    setWindSpeed(6.2);
    setCurrentSpeed(0.35);
  };

  const handleExportEmbeddingJson = () => {
    const payload = {
      model: 'OceanEmbed-v1.4',
      framework: 'PyTorch / VisionTransformer + MLP Decoder',
      surfaceInputs: {
        sst_degC: sstVal,
        sss_psu: sssVal,
        ssh_m: sshVal,
        windSpeed_mps: windSpeed,
        currentSpeed_mps: currentSpeed,
      },
      detectedRegime: regime,
      latentVectorDim: 128,
      topActivatedLatentDimensions: latentVectors.map(v => ({
        index: v.index,
        latentValue: v.val,
        featureLabel: v.label,
      })),
      timestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `OceanEmbed_Latent_Vector_${sstVal}C_${sssVal}PSU.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded font-semibold border border-cyan-200/60">
              Core AI Innovation
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-[#0f2b48] mt-1">
              Ocean Embedding
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Learning a compact representation of the ocean state from multi-modal surface observations.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportEmbeddingJson}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
            >
              {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <FileCode className="w-3.5 h-3.5 text-cyan-700" />}
              <span>{copiedJson ? 'Exported JSON!' : 'Export Latent Embedding (.JSON)'}</span>
            </button>
            <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200">
              128-D LATENT MANIFOLD
            </span>
          </div>
        </div>
      </div>

      {/* Horizontal AI Pipeline Architecture */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#0f2b48]">
              Multi-Modal Encoding & Latent Representation Pipeline
            </h3>
            <p className="text-xs text-slate-500">
              Transforming disparate 2D surface observation fields into a dense thermodynamic state vector.
            </p>
          </div>
        </div>

        {/* Visual Pipeline Flow */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
          {/* Box 1: Surface Inputs */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col h-full justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold">01 Inputs</span>
              <h4 className="text-xs font-bold text-slate-900 mt-1">Multi-Modal Surface Observations</h4>
            </div>
            <div className="mt-3 space-y-1 font-mono text-[11px] text-slate-600">
              <div className="px-1.5 py-0.5 bg-white rounded border border-slate-200 flex justify-between">
                <span>SST</span> <span className="text-slate-400">{sstVal.toFixed(1)}°C</span>
              </div>
              <div className="px-1.5 py-0.5 bg-white rounded border border-slate-200 flex justify-between">
                <span>SSS</span> <span className="text-slate-400">{sssVal.toFixed(1)} PSU</span>
              </div>
              <div className="px-1.5 py-0.5 bg-white rounded border border-slate-200 flex justify-between">
                <span>SSH</span> <span className="text-slate-400">{sshVal > 0 ? `+${sshVal}` : sshVal}m</span>
              </div>
              <div className="px-1.5 py-0.5 bg-white rounded border border-slate-200 flex justify-between">
                <span>Flow</span> <span className="text-slate-400">{currentSpeed.toFixed(2)}m/s</span>
              </div>
              <div className="px-1.5 py-0.5 bg-white rounded border border-slate-200 flex justify-between">
                <span>Winds</span> <span className="text-slate-400">{windSpeed.toFixed(1)}m/s</span>
              </div>
            </div>
          </div>

          {/* Box 2: Multi-Modal Encoder */}
          <div className="p-4 rounded-lg bg-blue-50/50 border border-blue-200 flex flex-col h-full justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase text-blue-600 font-semibold">02 Neural Encoder</span>
              <h4 className="text-xs font-bold text-[#0f2b48] mt-1">Multi-Modal Encoder</h4>
            </div>
            <div className="mt-3 text-[11px] text-slate-600 space-y-1.5">
              <p className="leading-snug">
                CNN / Vision Transformer spatial feature extractor with cross-channel attention.
              </p>
              <div className="p-1.5 bg-white rounded border border-blue-100 font-mono text-[10px] text-blue-900">
                f_enc(SST, SSS, SSH, U, V) → z
              </div>
            </div>
          </div>

          {/* Box 3: Ocean Embedding */}
          <div className="p-4 rounded-lg bg-cyan-50 border-2 border-cyan-400/80 flex flex-col h-full justify-between shadow-xs">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-cyan-800 font-bold">03 Core Latent</span>
                <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
              </div>
              <h4 className="text-xs font-bold text-cyan-950 mt-1">Ocean Embedding (z)</h4>
            </div>
            <div className="mt-3 text-[11px] text-cyan-900 space-y-1">
              <p className="leading-snug font-medium">
                Compact 128-d latent representation capturing stratified ocean state.
              </p>
              <div className="font-mono text-[10px] text-cyan-800 bg-white/80 p-1 rounded border border-cyan-200">
                dim: [B, C_latent, H, W]
              </div>
            </div>
          </div>

          {/* Box 4: Latent Representation Mapping */}
          <div className="p-4 rounded-lg bg-indigo-50/50 border border-indigo-200 flex flex-col h-full justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase text-indigo-600 font-semibold">04 State Dynamics</span>
              <h4 className="text-xs font-bold text-[#0f2b48] mt-1">Latent Ocean Representation</h4>
            </div>
            <div className="mt-3 text-[11px] text-slate-600 space-y-1">
              <p className="leading-snug">
                Preserves non-linear vertical thermal structure, barrier layers & thermocline slope.
              </p>
              <div className="p-1.5 bg-white rounded border border-indigo-100 font-mono text-[10px] text-indigo-900">
                z_ocean ∈ ℝ^(128)
              </div>
            </div>
          </div>

          {/* Box 5: Depth-Aware Reconstruction */}
          <div className="p-4 rounded-lg bg-emerald-50/50 border border-emerald-200 flex flex-col h-full justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase text-emerald-600 font-semibold">05 Decoder</span>
              <h4 className="text-xs font-bold text-[#0f2b48] mt-1">Depth-Aware Reconstruction</h4>
            </div>
            <div className="mt-3 text-[11px] text-slate-600 space-y-1">
              <p className="leading-snug">
                Decodes continuous temperature T(z) across standard depths (0 – 1000m).
              </p>
              <div className="p-1.5 bg-white rounded border border-emerald-100 font-mono text-[10px] text-emerald-900">
                T(z) = f_dec(z_ocean, depth)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Regime Classifier */}
      <div className="p-4 bg-cyan-950 text-white rounded-lg border border-cyan-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 bg-cyan-900/80 px-2 py-0.5 rounded">
              LATENT REGIME CLASSIFIER
            </span>
            <span className="text-xs text-slate-300 font-mono">Similarity Match: {regime.confidence}</span>
          </div>
          <h4 className="text-base font-bold text-white">
            {regime.name}
          </h4>
          <p className="text-xs text-slate-300 mt-0.5 max-w-2xl leading-relaxed">
            {regime.description}
          </p>
        </div>

        <button
          onClick={handleResetDefaults}
          className="inline-flex items-center gap-1.5 text-xs text-cyan-200 hover:text-white font-mono px-3 py-1.5 rounded bg-cyan-900/60 border border-cyan-700/60 shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Sliders</span>
        </button>
      </div>

      {/* Vector/Matrix Representation Inspector */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-[#0f2b48]">
              Learned Ocean Representation Vector
            </h3>
            <p className="text-xs text-slate-500">
              Visualizing the latent vector matrix extracted from multi-modal inputs.
            </p>
          </div>
        </div>

        {/* Mathematical vector formula banner */}
        <div className="p-4 bg-slate-900 rounded-lg text-white font-mono text-xs space-y-3">
          <div className="flex items-center justify-between text-slate-400 text-[11px]">
            <span>SURFACE FEATURE TENSOR: [ SST | SSS | SSH | U | V | Wind U | Wind V ]</span>
            <span className="text-cyan-400">ENCODER: f_θ</span>
          </div>

          <div className="p-3 bg-slate-950 rounded border border-slate-800 text-cyan-300 flex flex-wrap items-center gap-1.5 overflow-x-auto text-[11px]">
            <span className="text-slate-500 font-bold">z = [</span>
            {latentVectors.map((v, i) => (
              <span
                key={v.index}
                className={`px-1 rounded ${
                  v.val > 0.4
                    ? 'bg-amber-900/60 text-amber-200'
                    : v.val < -0.4
                    ? 'bg-blue-900/60 text-cyan-200'
                    : 'text-slate-300'
                }`}
              >
                {v.val > 0 ? `+${v.val.toFixed(2)}` : v.val.toFixed(2)}
                {i < latentVectors.length - 1 ? ',' : ''}
              </span>
            ))}
            <span className="text-slate-500 font-bold">... (dim=128) ]</span>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
            <span className="text-emerald-400">✓ Learned Ocean Representation (Latent Embeddings)</span>
            <span className="text-slate-500">Continuous Latent Manifold</span>
          </div>
        </div>

        {/* Interactive Feature Perturbation Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
          {/* Sliders on Left */}
          <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Interactive Surface Input Perturbation
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Adjust surface variables to observe real-time latent embedding activation responses.
              </p>
            </div>

            {/* Slider 1: SST */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-600">SST (°C)</span>
                <span className="font-mono font-bold text-[#0f2b48]">{sstVal.toFixed(1)} °C</span>
              </div>
              <input
                type="range"
                min="24.0"
                max="31.5"
                step="0.1"
                value={sstVal}
                onChange={(e) => setSstVal(parseFloat(e.target.value))}
                className="w-full accent-[#0f2b48] cursor-pointer"
              />
            </div>

            {/* Slider 2: SSS */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-600">SSS (PSU)</span>
                <span className="font-mono font-bold text-[#0f2b48]">{sssVal.toFixed(1)} PSU</span>
              </div>
              <input
                type="range"
                min="28.0"
                max="37.0"
                step="0.1"
                value={sssVal}
                onChange={(e) => setSssVal(parseFloat(e.target.value))}
                className="w-full accent-[#0f2b48] cursor-pointer"
              />
            </div>

            {/* Slider 3: SSH */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-600">SSH / SLA (m)</span>
                <span className="font-mono font-bold text-[#0f2b48]">
                  {sshVal > 0 ? `+${sshVal.toFixed(2)}` : sshVal.toFixed(2)} m
                </span>
              </div>
              <input
                type="range"
                min="-0.20"
                max="0.25"
                step="0.01"
                value={sshVal}
                onChange={(e) => setSshVal(parseFloat(e.target.value))}
                className="w-full accent-[#0f2b48] cursor-pointer"
              />
            </div>

            {/* Slider 4: Winds */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-600">Surface Wind Speed (m/s)</span>
                <span className="font-mono font-bold text-[#0f2b48]">{windSpeed.toFixed(1)} m/s</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="12.0"
                step="0.1"
                value={windSpeed}
                onChange={(e) => setWindSpeed(parseFloat(e.target.value))}
                className="w-full accent-[#0f2b48] cursor-pointer"
              />
            </div>

            {/* Slider 5: Current Flow */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-600">Surface Current Speed (m/s)</span>
                <span className="font-mono font-bold text-[#0f2b48]">{currentSpeed.toFixed(2)} m/s</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={currentSpeed}
                onChange={(e) => setCurrentSpeed(parseFloat(e.target.value))}
                className="w-full accent-[#0f2b48] cursor-pointer"
              />
            </div>
          </div>

          {/* Latent Dimension Breakdown on Right */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-lg p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Latent Dimension Feature Activation
                </h4>
                <span className="text-[10px] font-mono text-slate-400">Sample Top-16 Basis</span>
              </div>
              <p className="text-[11px] text-slate-500 mb-3">
                Each dimension in the ocean embedding learns distinct physical ocean dynamics:
              </p>

              <div className="grid grid-cols-2 gap-2 text-xs">
                {latentVectors.map((vec) => {
                  const isPositive = vec.val >= 0;
                  const absVal = Math.abs(vec.val);
                  return (
                    <div key={vec.index} className="p-2 rounded bg-slate-50 border border-slate-100 flex flex-col justify-between">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-600 font-medium truncate pr-1">{vec.label}</span>
                        <span className="font-mono font-bold text-slate-800">
                          {isPositive ? `+${vec.val.toFixed(2)}` : vec.val.toFixed(2)}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden flex">
                        {isPositive ? (
                          <div
                            className="bg-amber-500 h-full rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(100, absVal * 100)}%` }}
                          />
                        ) : (
                          <div
                            className="bg-blue-600 h-full rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(100, absVal * 100)}%` }}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] text-slate-400 flex items-center justify-between font-mono">
              <span>Embedding Loss: L_reconstruction + λ L_physics</span>
              <span>Normalized L2 Space</span>
            </div>
          </div>
        </div>
      </div>

      {/* Explanatory Card: WHY OCEAN EMBEDDING? */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 space-y-3">
        <div className="flex items-center gap-2 text-[#0f2b48]">
          <HelpCircle className="w-4 h-4 text-cyan-700" />
          <h3 className="text-sm font-bold uppercase tracking-wider">
            WHY OCEAN EMBEDDING?
          </h3>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          The model compresses multiple surface observations into a meaningful latent representation that captures hidden ocean dynamics relevant to subsurface temperature.
        </p>

        <p className="text-xs text-slate-600 leading-relaxed">
          Direct pixel-to-depth regression often suffers from high noise and unphysical thermal inversions. By first projecting surface multi-modal fields (SST, SSS, SSH, currents, winds) into a shared latent space, OceanEmbed captures integrated baroclinic wave structures, thermocline shoaling, and heat storage before decoding continuous vertical profiles.
        </p>

        <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <span className="font-medium text-slate-700">Prototype Note:</span>
          <span>Presented as proposed framework concept for SIH26066 demonstration.</span>
        </div>
      </div>
    </div>
  );
};

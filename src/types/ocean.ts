export type OceanVariable = 'sst' | 'sss' | 'ssh' | 'currents' | 'winds';

export interface SurfaceObservationPoint {
  id: string;
  name: string;
  lat: number;
  lon: number;
  region: 'Arabian Sea' | 'Bay of Bengal' | 'Equatorial Indian Ocean';
  sst: number;       // °C (Sea Surface Temperature)
  sss: number;       // PSU (Sea Surface Salinity)
  ssh: number;       // m (Sea Surface Height / SLA)
  currentU: number;  // m/s (Zonal surface current)
  currentV: number;  // m/s (Meridional surface current)
  windU: number;     // m/s (Zonal 10m wind)
  windV: number;     // m/s (Meridional 10m wind)
}

export interface DepthLevelData {
  depth: number;       // meters: 0, 5, 10, 20, 30, 50, 75, 100, 125, 150, 200, 300, 500, 700, 1000
  predictedTemp: number; // °C
  argoTemp: number;      // °C (Sample ARGO comparison)
  climatologyTemp: number; // °C (WOA reference baseline)
  uncertainty: number;   // ±°C
  anomaly: number;       // °C departure from climatology
}

export interface PresetLocation {
  id: string;
  name: string;
  subname: string;
  lat: number;
  lon: number;
  region: 'Arabian Sea' | 'Bay of Bengal' | 'Equatorial Indian Ocean';
  description: string;
  surfaceParams: {
    sst: number;
    sss: number;
    ssh: number;
    currentU: number;
    currentV: number;
    windU: number;
    windV: number;
  };
  mld: number; // Mixed Layer Depth (m)
  thermoclineDepth: number; // Thermocline (m)
  argoFloatId: string;
  reconstructedProfiles: DepthLevelData[];
}

export interface EmbeddingFeature {
  dimIndex: number;
  latentValue: number;
  primarySensitivity: 'Thermal (SST/SSH)' | 'Halocline (SSS)' | 'Dynamic (Currents)' | 'Atmospheric (Winds)' | 'Stratification';
  activationWeight: number;
}

export interface ValidationMetric {
  name: string;
  code: string;
  value: string;
  unit: string;
  baselineValue: string;
  description: string;
  status: 'Demo Metric' | 'Reference Target';
}

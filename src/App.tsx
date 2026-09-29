import React, { useState } from 'react';
import { Sidebar, PageId } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { OverviewView } from './components/overview/OverviewView';
import { OceanDataView } from './components/oceanData/OceanDataView';
import { EmbeddingView } from './components/embedding/EmbeddingView';
import { ReconstructionView } from './components/reconstruction/ReconstructionView';
import { ValidationView } from './components/validation/ValidationView';
import { AboutView } from './components/about/AboutView';
import { MethodologyModal } from './components/methodology/MethodologyModal';

export default function App() {
  const [activePage, setActivePage] = useState<PageId>('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);

  // Global shared coordinate state across pages
  const [selectedLat, setSelectedLat] = useState<number>(14.5);
  const [selectedLon, setSelectedLon] = useState<number>(89.2);

  const handleCoordinateSelect = (lat: number, lon: number) => {
    setSelectedLat(lat);
    setSelectedLon(lon);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased text-slate-900">
      {/* Sidebar (Desktop permanent, Mobile drawer) */}
      <Sidebar
        activePage={activePage}
        onSelectPage={(page) => setActivePage(page)}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area with left margin offset on desktop */}
      <div className="lg:pl-64 flex flex-col flex-1 min-w-0">
        <Header
          activePage={activePage}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onOpenMethodology={() => setIsMethodologyOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {activePage === 'overview' && (
            <OverviewView
              onNavigate={(page) => setActivePage(page)}
              onOpenMethodology={() => setIsMethodologyOpen(true)}
            />
          )}

          {activePage === 'data' && (
            <OceanDataView
              onNavigate={(page) => setActivePage(page)}
              onCoordinateSelect={handleCoordinateSelect}
            />
          )}

          {activePage === 'embedding' && (
            <EmbeddingView />
          )}

          {activePage === 'reconstruction' && (
            <ReconstructionView
              initialLat={selectedLat}
              initialLon={selectedLon}
            />
          )}

          {activePage === 'validation' && (
            <ValidationView />
          )}

          {activePage === 'about' && (
            <AboutView />
          )}
        </main>

        {/* Global Minimal Footer */}
        <footer className="border-t border-slate-200 bg-white px-4 sm:px-8 py-4 text-xs text-slate-500">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-800">OceanEmbed</span>
              <span>•</span>
              <span>SIH26066 Physical AI Engine</span>
              <span>•</span>
              <span>MoES / INCOIS</span>
            </div>
            <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
              <span>Active Probe: [{selectedLat.toFixed(1)}°N, {selectedLon.toFixed(1)}°E]</span>
              <span>15 Standard Depth Levels (0–1000m)</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Methodology Modal */}
      <MethodologyModal
        isOpen={isMethodologyOpen}
        onClose={() => setIsMethodologyOpen(false)}
      />
    </div>
  );
}

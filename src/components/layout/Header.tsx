import React from 'react';
import { Menu, Radio, Sparkles, SlidersHorizontal, ArrowUpRight } from 'lucide-react';
import { PageId } from './Sidebar';

interface HeaderProps {
  activePage: PageId;
  onOpenMobileMenu: () => void;
  onOpenMethodology: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activePage,
  onOpenMobileMenu,
  onOpenMethodology,
}) => {
  const getPageTitle = () => {
    switch (activePage) {
      case 'overview':
        return 'Executive Overview';
      case 'data':
        return 'Surface Ocean Observations';
      case 'embedding':
        return 'Multi-Modal Ocean Embedding';
      case 'reconstruction':
        return '3D Subsurface Reconstruction';
      case 'validation':
        return 'ARGO Independent Validation';
      case 'about':
        return 'Project & Organization Details';
      default:
        return 'OceanEmbed Dashboard';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 py-3.5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="p-1.5 -ml-1 text-slate-600 hover:text-slate-900 rounded-md hover:bg-slate-100 lg:hidden"
          aria-label="Open navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider hidden sm:inline">
              OceanEmbed
            </span>
            <span className="text-slate-300 hidden sm:inline">/</span>
            <h2 className="text-sm font-semibold text-slate-900">
              {getPageTitle()}
            </h2>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Prototype Status Pill */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Prototype Mode</span>
        </div>

        {/* Methodology Shortcut */}
        <button
          onClick={onOpenMethodology}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-[#0f2b48] bg-slate-100 hover:bg-slate-200/80 rounded border border-slate-200 transition-colors"
        >
          <span>Methodology</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
        </button>
      </div>
    </header>
  );
};

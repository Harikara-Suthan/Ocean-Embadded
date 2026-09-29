import React from 'react';
import { Layers, Database, Cpu, Activity, CheckCircle2, Info, Compass, ShieldAlert } from 'lucide-react';

export type PageId = 'overview' | 'data' | 'embedding' | 'reconstruction' | 'validation' | 'about';

interface SidebarProps {
  activePage: PageId;
  onSelectPage: (page: PageId) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  onSelectPage,
  isOpen,
  onClose,
}) => {
  const navItems: { id: PageId; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'overview', label: 'Overview', icon: Layers },
    { id: 'data', label: 'Ocean Data', icon: Database },
    { id: 'embedding', label: 'Ocean Embedding', icon: Cpu },
    { id: 'reconstruction', label: 'Reconstruction', icon: Activity },
    { id: 'validation', label: 'Validation', icon: CheckCircle2 },
    { id: 'about', label: 'About', icon: Info },
  ];

  const handleNavClick = (id: PageId) => {
    onSelectPage(id);
    onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/30 z-40 lg:hidden backdrop-blur-xs"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Branding */}
        <div>
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-md bg-[#0f2b48] flex items-center justify-center text-white font-semibold text-sm shadow-xs">
                OE
              </div>
              <div>
                <h1 className="text-sm font-bold tracking-tight text-[#0f2b48] uppercase">
                  Ocean Embed
                </h1>
                <p className="text-[11px] text-slate-500 font-medium tracking-wide">
                  Satellite → Subsurface AI
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-3 space-y-1">
            <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Navigation
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-medium transition-colors text-left ${
                    isActive
                      ? 'bg-[#0f2b48] text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-300' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.id === 'embedding' && (
                    <span className={`ml-auto text-[10px] px-1.5 py-0.5 rounded font-mono ${isActive ? 'bg-cyan-900/60 text-cyan-200' : 'bg-slate-100 text-slate-500'}`}>
                      Core
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Metadata */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="rounded border border-slate-200/80 bg-white p-3 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#0f2b48] font-mono">SIH26066</span>
              <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-medium">
                Prototype
              </span>
            </div>
            <p className="text-[11px] text-slate-600 font-medium leading-tight">
              Smart India Hackathon
            </p>
            <p className="text-[10px] text-slate-400">
              MoES / INCOIS
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

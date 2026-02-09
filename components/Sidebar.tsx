import React from 'react';
import { 
  LayoutGrid, 
  Layers, 
  Settings, 
  LogOut, 
  Plus, 
  Box,
  Zap
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 h-screen bg-zinc-950 border-r border-zinc-800 flex flex-col justify-between shrink-0">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8 text-zinc-100 font-semibold tracking-tight">
          <div className="w-8 h-8 bg-purple-500/10 border border-purple-500/20 rounded-lg flex items-center justify-center text-purple-400">
            <Zap size={18} fill="currentColor" />
          </div>
          Diff-Check
        </div>

        <nav className="space-y-1">
          <NavItem icon={<LayoutGrid size={18} />} label="Projects" active />
          <NavItem icon={<Layers size={18} />} label="Queue" />
          <NavItem icon={<Box size={18} />} label="Design System" />
        </nav>

        <div className="mt-8">
          <div className="px-3 mb-2 text-xs font-medium text-zinc-500 uppercase tracking-wider">
            Recent Scans
          </div>
          <div className="space-y-1">
            <ProjectItem name="Dashboard V2" time="2m ago" />
            <ProjectItem name="Login Flow" time="1h ago" />
            <ProjectItem name="Settings Page" time="3h ago" />
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-zinc-900">
        <nav className="space-y-1">
          <NavItem icon={<Settings size={18} />} label="Settings" />
          <NavItem icon={<LogOut size={18} />} label="Log Out" />
        </nav>
      </div>
    </aside>
  );
};

const NavItem: React.FC<{ icon: React.ReactNode; label: string; active?: boolean }> = ({ icon, label, active }) => (
  <button 
    className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200
      ${active 
        ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' 
        : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
      }`}
  >
    {icon}
    {label}
  </button>
);

const ProjectItem: React.FC<{ name: string; time: string }> = ({ name, time }) => (
  <button className="w-full flex items-center justify-between px-3 py-2 text-sm text-zinc-400 rounded-md hover:bg-zinc-900 hover:text-zinc-100 transition-colors group">
    <span className="truncate">{name}</span>
    <span className="text-xs text-zinc-600 group-hover:text-zinc-500">{time}</span>
  </button>
);
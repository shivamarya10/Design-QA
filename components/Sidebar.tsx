import React from 'react';
import { 
  MousePointer2, 
  Hand,
  Type,
  Square,
  ImageIcon,
  MoreHorizontal,
  LayoutGrid
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  return (
    <aside className="fixed left-6 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-4 pointer-events-none">
       {/* Main Tool Palette */}
       <div className="pointer-events-auto bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-2 flex flex-col gap-2 w-14 items-center ring-1 ring-black/5">
          <ToolButton icon={<MousePointer2 size={18} />} active label="Select" />
          <ToolButton icon={<Hand size={18} />} label="Pan" />
          <div className="w-8 h-px bg-stone-200/50" />
          <ToolButton icon={<Square size={18} />} label="Shape" />
          <ToolButton icon={<Type size={18} />} label="Text" />
          <ToolButton icon={<ImageIcon size={18} />} label="Image" />
          <div className="w-8 h-px bg-stone-200/50" />
          <ToolButton icon={<MoreHorizontal size={18} />} label="More" />
       </div>

       {/* Project Info Pill */}
       <div className="pointer-events-auto bg-white/80 backdrop-blur-xl rounded-full border border-white/60 shadow-sm py-2 px-3 flex items-center gap-2 absolute -left-0 -top-24 w-max ring-1 ring-black/5">
          <div className="w-8 h-8 bg-charcoal rounded-full flex items-center justify-center text-white shadow-lg">
             <LayoutGrid size={14} />
          </div>
          <div className="flex flex-col pr-2">
             <span className="text-xs font-bold text-charcoal font-display">Diff-Check V3</span>
             <span className="text-[10px] text-warmGrey">Infinite Canvas</span>
          </div>
       </div>
    </aside>
  );
};

const ToolButton: React.FC<{ icon: React.ReactNode; label: string; active?: boolean }> = ({ icon, label, active }) => (
  <button 
    className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200 group relative
      ${active 
        ? 'bg-charcoal text-white shadow-lg shadow-black/20' 
        : 'text-warmGrey hover:bg-stone-100 hover:text-charcoal'
      }`}
  >
    {icon}
    {/* Tooltip */}
    <span className="absolute left-full ml-3 px-2 py-1 bg-charcoal text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
      {label}
    </span>
  </button>
);
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DesignError } from '../types';

interface DesignIssueOverlayProps {
  error: DesignError;
  isHovered: boolean;
  isSelected: boolean;
  onHover: (id: string | null) => void;
  scale: number; // To keep stroke width consistent visually
}

export const DesignIssueOverlay: React.FC<DesignIssueOverlayProps> = ({ error, isHovered, isSelected, onHover, scale }) => {
  const isActive = isHovered || isSelected;

  // Highlighter Colors
  const colors = {
    spacing: { border: 'border-blue-500', bg: 'bg-blue-500', text: 'text-blue-600', fill: 'bg-blue-500/10' }, 
    contrast: { border: 'border-amber-500', bg: 'bg-amber-500', text: 'text-amber-600', fill: 'bg-amber-500/10' }, 
    brand: { border: 'border-rose-500', bg: 'bg-rose-500', text: 'text-rose-600', fill: 'bg-rose-500/10' },     
    alignment: { border: 'border-violet-500', bg: 'bg-violet-500', text: 'text-violet-600', fill: 'bg-violet-500/10' }, 
  };

  const style = colors[error.type] || colors.alignment;
  
  // The "Sketchy" CSS Formula
  const organicBorderRadius = '255px 15px 225px 15px / 15px 225px 15px 255px';

  return (
    <motion.div
      className="absolute z-30"
      style={{
        left: `${error.coordinates.x}%`,
        top: `${error.coordinates.y}%`,
        width: `${error.coordinates.w}%`,
        height: `${error.coordinates.h}%`,
      }}
      onMouseEnter={() => onHover(error.id)}
      onMouseLeave={() => onHover(null)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Hand-Drawn Box */}
      <div 
        className={`absolute inset-0 transition-all duration-300 border-2 ${style.border} ${isActive ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}
        style={{
            borderRadius: organicBorderRadius,
            borderWidth: `${Math.max(2, 2.5 / scale)}px`, // Keep visible at low zoom
            transform: 'rotate(-0.5deg)', // Slight imperfection
            backgroundColor: isActive ? style.fill.replace('bg-', 'rgba(') : 'transparent', // Hacky tailwind conversion or just rely on css classes
        }}
      >
        {/* Fill layer for hover */}
        <div className={`absolute inset-0 w-full h-full ${style.fill} opacity-0 transition-opacity ${isActive ? '!opacity-100' : ''}`} style={{ borderRadius: organicBorderRadius }} />
      </div>
      
      {/* Double Stroke Effect on Selection (Second offset box) */}
      {isActive && (
        <div 
            className={`absolute inset-0 border-2 ${style.border} opacity-60 pointer-events-none`}
            style={{
                borderRadius: '15px 225px 15px 255px / 255px 15px 225px 15px', // Inverted formula
                borderWidth: `${Math.max(2, 2 / scale)}px`,
                transform: 'rotate(1deg) scale(1.02)',
            }}
        />
      )}

      {/* Invisible Click Zone */}
      <div className="absolute inset-0 cursor-pointer bg-transparent" />

      {/* "Comment Card" Popover */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute left-[105%] top-0 z-50 flex items-start"
            style={{ 
                transformOrigin: 'top left',
                // Counter-scale the popover so it says readable regardless of zoom
                transform: `scale(${1/scale})` 
            }}
          >
            {/* Sketchy Line Connector */}
            <div className={`w-8 h-[2px] mt-4 ${style.bg} opacity-50 absolute -left-8`} style={{ transform: 'rotate(-10deg)' }} />

            {/* The Card */}
            <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-xl border border-white/50 p-4 w-64 ring-1 ring-black/5">
              <div className="flex items-center gap-2 mb-2">
                 <div className={`w-2.5 h-2.5 rounded-full ${style.bg}`} />
                 <span className={`text-[10px] font-bold font-display uppercase tracking-wider ${style.text}`}>
                   {error.type}
                 </span>
              </div>
              <h4 className="font-display font-bold text-charcoal text-base mb-1 leading-tight">
                {error.type === 'spacing' ? 'Padding Inconsistency' : 
                 error.type === 'contrast' ? 'Accessibility Risk' : 
                 error.type === 'brand' ? 'Brand Violation' : 'Alignment Issue'}
              </h4>
              <p className="text-sm text-warmGrey leading-relaxed font-sans">
                {error.message}
              </p>
              
              {/* Action Footer */}
              <div className="mt-3 pt-3 border-t border-stone-100 flex justify-between items-center">
                <button className="text-xs font-bold text-charcoal hover:underline">Fix this</button>
                <div className="flex -space-x-1.5">
                   <div className="w-5 h-5 rounded-full bg-blue-100 border border-white flex items-center justify-center text-[8px] text-blue-600 font-bold">JD</div>
                   <div className="w-5 h-5 rounded-full bg-green-100 border border-white flex items-center justify-center text-[8px] text-green-600 font-bold">AI</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
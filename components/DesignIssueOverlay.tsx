import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DesignError } from '../types';

interface DesignIssueOverlayProps {
  error: DesignError;
  isHovered: boolean;
  onHover: (id: string | null) => void;
}

export const DesignIssueOverlay: React.FC<DesignIssueOverlayProps> = ({ error, isHovered, onHover }) => {
  const colors = {
    spacing: { border: 'border-blue-500', text: 'text-blue-500', shadow: 'shadow-blue-500/50', bg: 'bg-blue-500' },
    contrast: { border: 'border-orange-500', text: 'text-orange-500', shadow: 'shadow-orange-500/50', bg: 'bg-orange-500' },
    brand: { border: 'border-red-500', text: 'text-red-500', shadow: 'shadow-red-500/50', bg: 'bg-red-500' },
    alignment: { border: 'border-purple-500', text: 'text-purple-500', shadow: 'shadow-purple-500/50', bg: 'bg-purple-500' },
  };

  const style = colors[error.type] || colors.alignment;
  const isRightSide = error.coordinates.x > 60; // Flip tooltip if on the right side

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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      {/* Smart Reticles (Corner Brackets) */}
      <div className={`absolute top-0 left-0 w-3 h-3 border-l-[2px] border-t-[2px] rounded-tl-[1px] transition-all duration-300 ${style.border} ${isHovered ? `shadow-[0_0_10px_0] ${style.shadow} opacity-100` : 'opacity-70'}`} />
      <div className={`absolute top-0 right-0 w-3 h-3 border-r-[2px] border-t-[2px] rounded-tr-[1px] transition-all duration-300 ${style.border} ${isHovered ? `shadow-[0_0_10px_0] ${style.shadow} opacity-100` : 'opacity-70'}`} />
      <div className={`absolute bottom-0 left-0 w-3 h-3 border-l-[2px] border-b-[2px] rounded-bl-[1px] transition-all duration-300 ${style.border} ${isHovered ? `shadow-[0_0_10px_0] ${style.shadow} opacity-100` : 'opacity-70'}`} />
      <div className={`absolute bottom-0 right-0 w-3 h-3 border-r-[2px] border-b-[2px] rounded-br-[1px] transition-all duration-300 ${style.border} ${isHovered ? `shadow-[0_0_10px_0] ${style.shadow} opacity-100` : 'opacity-70'}`} />

      {/* Invisible Interactive Zone */}
      <div className="absolute inset-0 cursor-crosshair bg-transparent" />

      {/* Glassmorphic Tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, x: isRightSide ? -10 : 10 }}
            animate={{ opacity: 1, x: isRightSide ? -20 : 20 }}
            exit={{ opacity: 0, x: isRightSide ? -10 : 10 }}
            className={`absolute top-0 flex items-start z-50 ${isRightSide ? 'right-full flex-row-reverse' : 'left-full flex-row'}`}
            style={{ marginTop: '-8px' }}
          >
            {/* Connector Line */}
            <div className={`flex items-center h-8 ${isRightSide ? 'flex-row-reverse' : ''}`}>
               <div className={`w-8 h-[1px] ${style.bg} opacity-50`} />
               <div className={`w-1.5 h-1.5 rounded-full ${style.bg} shadow-sm ${isRightSide ? '-mr-0.5' : '-ml-0.5'}`} />
            </div>

            {/* Tooltip Card */}
            <div className={`
              backdrop-blur-md bg-zinc-900/90 
              border border-zinc-800
              rounded-lg shadow-2xl 
              p-3 min-w-[200px] max-w-[280px]
              ${isRightSide ? 'mr-2' : 'ml-2'}
            `}>
              <div className="flex items-center gap-2 mb-1.5 border-b border-zinc-800/50 pb-1.5">
                <div className={`w-2 h-2 rounded-full ${style.bg} shadow-sm`} />
                <span className={`text-[10px] font-bold uppercase tracking-wider ${style.text}`}>{error.type}</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {error.message}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

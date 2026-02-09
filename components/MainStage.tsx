import React, { useRef, useState } from 'react';
import { Upload, ZoomIn, ZoomOut, MousePointer2 } from 'lucide-react';
import { DesignError, CanvasItem } from '../types';
import { DesignIssueOverlay } from './DesignIssueOverlay';
import { motion } from 'framer-motion';

interface MainStageProps {
  items: CanvasItem[];
  onItemsChange: (items: CanvasItem[]) => void;
  errors: DesignError[];
  hoveredIssueId: string | null;
  onHoverIssue: (id: string | null) => void;
  selectedIssueId: string | null;
  onSelectIssue: (id: string | null) => void;
  selectedItemId: string | null;
  onSelectItem: (id: string | null) => void;
  onFileUpload: (files: FileList) => void;
}

export const MainStage: React.FC<MainStageProps> = ({ 
  items,
  errors,
  hoveredIssueId,
  onHoverIssue,
  selectedIssueId,
  onSelectIssue,
  selectedItemId,
  onSelectItem,
  onFileUpload
}) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Infinite Canvas Interactions ---

  const handleWheel = (e: React.WheelEvent) => {
    // Zoom with Ctrl/Meta + Scroll
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const zoomSensitivity = 0.001;
      const newScale = Math.min(Math.max(0.2, scale - e.deltaY * zoomSensitivity), 4);
      setScale(newScale);
    } else {
      // Pan with Scroll
      e.preventDefault(); 
      setPosition(prev => ({
        x: prev.x - e.deltaX / scale,
        y: prev.y - e.deltaY / scale
      }));
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // Middle click or Space+Click to pan (Logic simplified here: just click on background pans)
    if (e.target === e.currentTarget || (e.button === 1)) {
      setIsPanning(true);
      onSelectItem(null); // Deselect items if clicking background
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPosition(prev => ({
        x: prev.x + e.movementX / scale,
        y: prev.y + e.movementY / scale
      }));
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  // --- Drag & Drop for Files ---

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileUpload(e.dataTransfer.files);
    }
  };

  return (
    <main className="flex-1 h-screen relative overflow-hidden bg-alabaster select-none">
       {/* Dot Grid Background */}
       <div className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage: 'radial-gradient(#1A1A1A 1.5px, transparent 1.5px)',
            backgroundSize: '24px 24px',
            transform: `translate(${position.x * scale % 24}px, ${position.y * scale % 24}px)` 
          }}
        />

      <div 
        ref={containerRef}
        className={`w-full h-full ${isPanning ? 'cursor-grabbing' : 'cursor-grab'}`}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onDragOver={(e) => { e.preventDefault(); setIsDraggingFile(true); }}
        onDragLeave={() => setIsDraggingFile(false)}
        onDrop={handleDrop}
      >
        {/* The Infinite Plane */}
        <div 
          className="w-full h-full flex items-center justify-center transform-gpu origin-center"
          style={{
            transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
            transition: isPanning ? 'none' : 'transform 0.1s ease-out'
          }}
        >
          {items.map((item) => {
             const isSelected = selectedItemId === item.id;
             return (
               <div
                 key={item.id}
                 className={`absolute transition-shadow duration-300 rounded-lg group ${isSelected ? 'z-20' : 'z-10'}`}
                 style={{
                   left: item.x,
                   top: item.y,
                   width: item.width,
                   height: item.height, 
                   zIndex: item.zIndex
                 }}
                 onMouseDown={(e) => {
                   e.stopPropagation(); // Stop panning
                   onSelectItem(item.id);
                 }}
               >
                 {/* Focus Border (Blue/Purple halo) */}
                 <div className={`absolute -inset-4 rounded-xl border-2 border-dashed transition-all duration-200 pointer-events-none
                    ${isSelected ? 'border-violet-500 opacity-100 scale-105' : 'border-stone-300 opacity-0 group-hover:opacity-100'}`} 
                 />

                 {/* The Image */}
                 <img 
                   src={item.src} 
                   alt="UI Screen" 
                   className="block w-full h-auto rounded-lg shadow-2xl pointer-events-none"
                   draggable={false}
                 />
                 
                 {/* Scanning Indicator Overlay */}
                 {item.isScanning && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] rounded-lg flex flex-col items-center justify-center z-50">
                       <div className="w-10 h-10 border-2 border-charcoal border-t-transparent rounded-full animate-spin mb-2" />
                       <span className="font-display font-bold text-charcoal text-xs">Scanning...</span>
                    </div>
                 )}
                 
                 {/* Errors Overlay (Only show if not scanning) */}
                 {!item.isScanning && errors.filter(e => e.itemId === item.id).map(error => (
                   <DesignIssueOverlay
                     key={error.id}
                     error={error}
                     isHovered={hoveredIssueId === error.id}
                     isSelected={selectedIssueId === error.id}
                     onHover={onHoverIssue}
                     scale={scale}
                   />
                 ))}
               </div>
             );
          })}

          {/* Empty State Call to Action */}
          {items.length === 0 && (
             <motion.div 
               initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
               className={`
                 flex flex-col items-center justify-center p-12 rounded-3xl border-2 border-dashed
                 ${isDraggingFile ? 'border-charcoal bg-white/50 scale-105' : 'border-stone-300 bg-white/20'}
                 transition-all duration-300 cursor-pointer backdrop-blur-sm
               `}
               onClick={() => fileInputRef.current?.click()}
             >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*"
                  multiple
                  onChange={(e) => e.target.files && onFileUpload(e.target.files)}
                />
                <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center mb-4 text-charcoal">
                  <Upload size={32} />
                </div>
                <h3 className="font-display font-bold text-2xl text-charcoal mb-1">Upload UI Screens</h3>
                <p className="text-warmGrey font-medium">Drag & drop to start collaborating</p>
             </motion.div>
          )}
        </div>
      </div>

      {/* Global Drag Overlay */}
      {items.length > 0 && isDraggingFile && (
          <div className="absolute inset-0 z-50 bg-alabaster/80 backdrop-blur-md flex items-center justify-center pointer-events-none">
             <div className="text-center">
                <Upload size={64} className="mx-auto text-charcoal mb-4 animate-bounce" />
                <h2 className="font-display font-bold text-3xl text-charcoal">Drop to Add Screen</h2>
             </div>
          </div>
      )}

      {/* Zoom Controls */}
      <div className="absolute bottom-6 left-6 flex items-center gap-2 bg-white/80 backdrop-blur rounded-xl border border-white/60 shadow-lg p-1.5 z-50 ring-1 ring-black/5">
           <button onClick={() => setScale(s => Math.max(0.2, s - 0.1))} className="p-2 hover:bg-stone-100 rounded-lg text-charcoal transition-colors">
             <ZoomOut size={18} />
           </button>
           <span className="font-mono text-xs w-10 text-center font-bold text-warmGrey">{Math.round(scale * 100)}%</span>
           <button onClick={() => setScale(s => Math.min(4, s + 0.1))} className="p-2 hover:bg-stone-100 rounded-lg text-charcoal transition-colors">
             <ZoomIn size={18} />
           </button>
      </div>
    </main>
  );
};
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, ZoomIn, ZoomOut, MousePointer2, Hand } from 'lucide-react';
import { DesignError } from '../types';
import { DesignIssueOverlay } from './DesignIssueOverlay';

interface MainStageProps {
  image: string | null;
  onImageUpload: (file: File) => void;
  onClearImage: () => void;
  isScanning: boolean;
  errors: DesignError[];
  hoveredIssueId: string | null;
  onHoverIssue: (id: string | null) => void;
}

export const MainStage: React.FC<MainStageProps> = ({ 
  image, 
  onImageUpload, 
  onClearImage, 
  isScanning, 
  errors,
  hoveredIssueId,
  onHoverIssue
}) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset view when a new image is loaded
  useEffect(() => {
    if (image) {
      setScale(0.85);
      setPosition({ x: 0, y: 0 });
    }
  }, [image]);

  const handleWheel = (e: React.WheelEvent) => {
    if (!image) return;
    
    // Zoom with Ctrl/Meta + Wheel (or trackpad pinch)
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const zoomSensitivity = 0.001;
      const newScale = Math.min(Math.max(0.1, scale - e.deltaY * zoomSensitivity), 5);
      setScale(newScale);
    } else {
      // Pan with Wheel
      e.preventDefault(); // Prevent browser back/forward swipe
      setPosition(prev => ({
        x: prev.x - e.deltaX,
        y: prev.y - e.deltaY
      }));
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!image) return;
    // Allow panning with left click (if not on an interactive element) or middle click
    if (e.button === 0 || e.button === 1) {
      setIsDraggingCanvas(true);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDraggingCanvas) {
      setPosition(prev => ({
        x: prev.x + e.movementX,
        y: prev.y + e.movementY
      }));
    }
  };

  const handleMouseUp = () => {
    setIsDraggingCanvas(false);
  };

  // Drag & Drop Handling
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(true);
  };

  const handleDragLeave = () => {
    setIsDraggingFile(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        onImageUpload(file);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onImageUpload(e.target.files[0]);
    }
  };

  return (
    <main className="flex-1 h-screen bg-zinc-950 relative overflow-hidden flex flex-col">
      
      {/* Header Toolbar */}
      <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-6 z-20 bg-zinc-950/80 backdrop-blur-sm shrink-0">
        <div className="flex items-center gap-4">
          <h1 className="text-zinc-100 font-medium">Canvas</h1>
          {image && (
             <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 text-xs border border-zinc-700">
               1920 x 1080
             </span>
          )}
        </div>
        <div className="flex items-center gap-2 bg-zinc-900 rounded-lg p-1 border border-zinc-800">
           <button 
             onClick={() => setScale(s => Math.max(0.1, s - 0.1))}
             className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-md transition-colors"
             title="Zoom Out"
           >
            <ZoomOut size={16} />
           </button>
           <span className="text-xs text-zinc-400 font-mono w-12 text-center select-none">
             {Math.round(scale * 100)}%
           </span>
           <button 
             onClick={() => setScale(s => Math.min(5, s + 0.1))}
             className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-md transition-colors"
             title="Zoom In"
           >
            <ZoomIn size={16} />
           </button>
        </div>
      </header>

      {/* Infinite Canvas */}
      <div 
        ref={containerRef}
        className={`
          flex-1 relative overflow-hidden outline-none
          ${!image ? 'cursor-default' : isDraggingCanvas ? 'cursor-grabbing' : 'cursor-grab'}
        `}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Background Layer: Dot Pattern */}
        <div className="absolute inset-0 pointer-events-none z-0"
          style={{
            backgroundColor: '#09090b',
            backgroundImage: 'radial-gradient(#27272a 1.5px, transparent 1.5px)',
            backgroundSize: '24px 24px',
            transform: `translate(${position.x % 24}px, ${position.y % 24}px)` // Parallax effect on dots for realism
          }}
        />

        {/* Vignette Overlay */}
        <div className="absolute inset-0 pointer-events-none z-10 bg-[radial-gradient(circle_at_center,transparent_0%,#09090b_100%)] opacity-80" />

        {/* Content Layer (Pan & Zoom) */}
        <div 
          className="absolute inset-0 flex items-center justify-center z-10"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: 'center center',
            transition: isDraggingCanvas ? 'none' : 'transform 0.1s ease-out'
          }}
        >
          <AnimatePresence mode="wait">
            {!image ? (
              // Empty State Dropzone (Fixed Scale inverse to prevent zoom effect on UI)
              <motion.div 
                key="dropzone"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                // Reset scale effect for the UI element so it stays readable
                style={{ transform: `scale(${1/scale})` }} 
                className={`
                  w-[480px] h-[320px] rounded-xl border-2 border-dashed transition-all duration-300
                  flex flex-col items-center justify-center gap-4 cursor-pointer relative overflow-hidden backdrop-blur-sm
                  ${isDraggingFile 
                    ? 'border-purple-500 bg-purple-500/10 shadow-[0_0_50px_-10px_rgba(168,85,247,0.3)]' 
                    : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-900/60'
                  }
                `}
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileSelect}
                />
                
                <div className={`
                  w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300
                  ${isDraggingFile ? 'bg-purple-500/20 text-purple-400' : 'bg-zinc-800 text-zinc-500'}
                `}>
                  <Upload size={28} />
                </div>
                
                <div className="text-center space-y-1">
                  <p className="text-lg font-medium text-zinc-200">
                    {isDraggingFile ? 'Drop it here' : 'Upload UI Screenshot'}
                  </p>
                  <p className="text-sm text-zinc-500">
                    Supports PNG, JPG, WEBP
                  </p>
                </div>
              </motion.div>
            ) : (
              // Image Container
              <motion.div 
                key="preview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative shadow-2xl shadow-black/80 group select-none"
              >
                <img 
                  src={image} 
                  alt="Uploaded Design" 
                  className="max-w-none block rounded-sm pointer-events-none"
                  draggable={false}
                  // Using max-w-none to allow natural size, let scale handle zoom
                  style={{ maxHeight: '80vh', objectFit: 'contain' }}
                />
                
                {/* Overlay Controls (Close Button) - Fixed scale so it doesn't shrink/grow weirdly */}
                <div className="absolute -top-12 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-auto">
                   <button 
                    onClick={(e) => { e.stopPropagation(); onClearImage(); }}
                    className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 text-zinc-400 hover:text-red-400 rounded-lg border border-zinc-800 hover:border-red-500/30 transition-colors text-sm font-medium shadow-lg"
                  >
                    <X size={14} />
                    Clear
                  </button>
                </div>

                {/* Scanning Effect */}
                {isScanning && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-sm z-30">
                    <motion.div
                      className="absolute left-0 right-0 h-0.5 bg-purple-500 shadow-[0_0_30px_5px_rgba(168,85,247,0.6)] z-20"
                      initial={{ top: "0%" }}
                      animate={{ top: "100%" }}
                      transition={{ 
                        duration: 1.5, 
                        ease: "linear",
                        repeat: Infinity,
                      }}
                    />
                     <motion.div 
                      className="absolute inset-0 bg-purple-500/5"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 0.2, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  </div>
                )}

                {/* Design Issue Overlays */}
                {!isScanning && errors.map((error) => (
                  <DesignIssueOverlay
                    key={error.id}
                    error={error}
                    isHovered={hoveredIssueId === error.id}
                    onHover={onHoverIssue}
                  />
                ))}

              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Global Drop Overlay (When dragging file over existing image) */}
        {image && isDraggingFile && (
          <div className="absolute inset-0 z-50 bg-purple-500/20 backdrop-blur-sm border-4 border-purple-500 border-dashed m-4 rounded-xl flex items-center justify-center pointer-events-none">
             <div className="bg-zinc-950 p-6 rounded-xl border border-purple-500/30 shadow-2xl flex flex-col items-center gap-3">
               <Upload size={32} className="text-purple-400" />
               <p className="text-zinc-200 font-medium">Drop to replace image</p>
             </div>
          </div>
        )}
      </div>
      
      {/* Footer Controls / Hint */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
        <div className="px-4 py-2 bg-zinc-950/80 backdrop-blur-md rounded-full border border-zinc-800/50 shadow-xl flex items-center gap-3 text-xs text-zinc-500">
           <div className="flex items-center gap-1.5">
             <MousePointer2 size={12} />
             <span>Click + Drag to pan</span>
           </div>
           <div className="w-1 h-3 bg-zinc-800 rounded-full" />
           <div className="flex items-center gap-1.5">
             <span className="font-mono bg-zinc-800 px-1 rounded text-[10px]">CTRL</span>
             <span>+ Scroll to zoom</span>
           </div>
        </div>
      </div>

    </main>
  );
};
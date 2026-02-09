import React from 'react';
import { DesignError } from '../types';
import { AlertTriangle, Ruler, Palette, Move, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface IssuesPanelProps {
  errors: DesignError[];
  isScanning: boolean;
  onHoverIssue: (id: string | null) => void;
}

export const IssuesPanel: React.FC<IssuesPanelProps> = ({ errors, isScanning, onHoverIssue }) => {
  const getIcon = (type: DesignError['type']) => {
    switch (type) {
      case 'spacing': return <Ruler size={14} />;
      case 'contrast': return <Palette size={14} />;
      case 'alignment': return <Move size={14} />;
      default: return <AlertTriangle size={14} />;
    }
  };

  const getSeverityColor = (severity: 'low' | 'high') => {
    return severity === 'high' ? 'text-red-400 bg-red-500/10 border-red-500/20' : 'text-amber-400 bg-amber-500/10 border-amber-500/20';
  };

  return (
    <aside className="w-80 bg-zinc-950 border-l border-zinc-800 flex flex-col shrink-0 h-screen">
      <div className="p-6 border-b border-zinc-900">
        <h2 className="text-zinc-100 font-semibold mb-1">Issues Found</h2>
        <p className="text-xs text-zinc-500">
          {isScanning ? 'Analyzing design...' : `${errors.length} issues detected`}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <AnimatePresence mode="wait">
          {isScanning ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-full text-zinc-600 gap-4"
            >
              <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm">Scanning pixels...</p>
            </motion.div>
          ) : errors.length === 0 ? (
             <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center h-full text-zinc-600 gap-4 text-center px-4"
            >
              <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center">
                <CheckCircle2 size={24} className="text-zinc-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-400">No issues found</p>
                <p className="text-xs mt-1">Or no scan run yet. Drag an image to start.</p>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-3">
               {errors.map((error, index) => (
                <motion.div
                  key={error.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onMouseEnter={() => onHoverIssue(error.id)}
                  onMouseLeave={() => onHoverIssue(null)}
                  className="group p-3 rounded-lg border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 hover:border-zinc-700 transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`p-1.5 rounded-md ${getSeverityColor(error.severity)}`}>
                        {getIcon(error.type)}
                      </span>
                      <span className="text-xs font-medium text-zinc-300 capitalize">{error.type} Error</span>
                    </div>
                    {error.severity === 'high' && (
                      <span className="text-[10px] uppercase font-bold text-red-500 tracking-wider">High</span>
                    )}
                  </div>
                  <p className="text-sm text-zinc-400 group-hover:text-zinc-200 transition-colors leading-relaxed">
                    {error.message}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="p-4 border-t border-zinc-900 bg-zinc-950">
        <button 
          disabled={errors.length === 0 || isScanning}
          className="w-full py-2.5 px-4 bg-zinc-100 text-zinc-950 font-medium text-sm rounded-md hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Export Report
        </button>
      </div>
    </aside>
  );
};
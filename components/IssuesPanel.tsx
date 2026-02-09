import React from 'react';
import { DesignError } from '../types';
import { AlertTriangle, Ruler, Palette, Move, CheckCircle2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface IssuesPanelProps {
  errors: DesignError[];
  onHoverIssue: (id: string | null) => void;
  selectedIssueId: string | null;
  onSelectIssue: (id: string | null) => void;
  selectedItemId: string | null;
}

export const IssuesPanel: React.FC<IssuesPanelProps> = ({ 
  errors, 
  onHoverIssue, 
  selectedIssueId, 
  onSelectIssue,
  selectedItemId
}) => {
  const [isOpen, setIsOpen] = React.useState(true);

  // Filter errors based on selected item context
  // If no item is selected, show nothing (or could show all, but context-aware is cleaner)
  const displayErrors = selectedItemId 
    ? errors.filter(e => e.itemId === selectedItemId)
    : [];

  const getIcon = (type: DesignError['type']) => {
    switch (type) {
      case 'spacing': return <Ruler size={14} />;
      case 'contrast': return <Palette size={14} />;
      case 'alignment': return <Move size={14} />;
      default: return <AlertTriangle size={14} />;
    }
  };

  if (!selectedItemId) {
      return null; // Don't show panel if no image is focused
  }

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed right-6 top-6 z-40 bg-white shadow-lg rounded-full p-3 border border-stone-100 hover:scale-105 transition-transform"
      >
        <AlertTriangle size={20} className="text-charcoal" />
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-white">
          {displayErrors.length}
        </span>
      </button>
    );
  }

  return (
    <aside className="fixed right-6 top-6 bottom-6 z-40 w-80 flex flex-col pointer-events-none">
      <div className="pointer-events-auto bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex flex-col h-full overflow-hidden ring-1 ring-black/5">
        
        {/* Header */}
        <div className="p-5 border-b border-stone-100 flex justify-between items-start bg-white/40">
          <div>
             <h2 className="text-charcoal font-display font-bold text-lg leading-none">Context Review</h2>
             <p className="text-xs text-warmGrey mt-1 font-medium">
               {displayErrors.length} issues on selected screen
             </p>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-stone-400 hover:text-charcoal transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          <AnimatePresence mode="wait">
            {displayErrors.length === 0 ? (
               <motion.div 
                 initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                 className="flex flex-col items-center justify-center h-40 text-stone-400 gap-2 text-center"
               >
                 <CheckCircle2 size={24} className="text-green-500" />
                 <p className="text-sm font-medium text-charcoal">All Clear!</p>
               </motion.div>
            ) : (
              <div className="space-y-2">
                 {displayErrors.map((error, index) => {
                   const isSelected = selectedIssueId === error.id;
                   
                   return (
                    <motion.div
                      key={error.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => onSelectIssue(error.id)}
                      onMouseEnter={() => onHoverIssue(error.id)}
                      onMouseLeave={() => onHoverIssue(null)}
                      className={`
                        group p-3 rounded-xl border transition-all duration-200 cursor-pointer relative
                        ${isSelected 
                          ? 'bg-stone-50 border-charcoal shadow-md scale-[1.02]' 
                          : 'bg-white border-stone-100 hover:border-stone-300 hover:shadow-sm'
                        }
                      `}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`
                          mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center shrink-0
                          ${error.type === 'brand' ? 'bg-red-50 text-red-600' : 'bg-stone-100 text-charcoal'}
                        `}>
                          {getIcon(error.type)}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-charcoal uppercase tracking-wide mb-0.5">{error.type}</p>
                          <p className="text-sm text-warmGrey leading-snug line-clamp-2">
                            {error.message}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                 })}
              </div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-stone-100 bg-white/40">
          <button className="w-full py-2.5 bg-charcoal text-white font-display font-bold text-sm rounded-xl hover:bg-black transition-all shadow-lg shadow-black/10">
            Export Feedback
          </button>
        </div>
      </div>
    </aside>
  );
};
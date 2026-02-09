import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { IssuesPanel } from './components/IssuesPanel';
import { MainStage } from './components/MainStage';
import { DesignError, CanvasItem } from './types';

function App() {
  const [items, setItems] = useState<CanvasItem[]>([]);
  const [errors, setErrors] = useState<DesignError[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  
  // Issue Selection State
  const [hoveredIssueId, setHoveredIssueId] = useState<string | null>(null);
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);

  // --- Keyboard Nav for Issues ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only navigate errors if an item is selected
      if (!selectedItemId) return;
      const relevantErrors = errors.filter(err => err.itemId === selectedItemId);
      if (relevantErrors.length === 0) return;

      if (e.key === 'Escape') setSelectedIssueId(null);
      
      if (e.key === 'j' || e.key === 'ArrowRight') {
        setSelectedIssueId(prev => {
          if (!prev) return relevantErrors[0].id;
          const idx = relevantErrors.findIndex(e => e.id === prev);
          return relevantErrors[(idx + 1) % relevantErrors.length].id;
        });
      }
      
      if (e.key === 'k' || e.key === 'ArrowLeft') {
        setSelectedIssueId(prev => {
          if (!prev) return relevantErrors[relevantErrors.length - 1].id;
          const idx = relevantErrors.findIndex(e => e.id === prev);
          return relevantErrors[(idx - 1 + relevantErrors.length) % relevantErrors.length].id;
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [errors, selectedItemId]);

  // --- File Upload & Auto-Positioning Logic ---
  const handleFileUpload = (files: FileList) => {
    Array.from(files).forEach((file, index) => {
       if (!file.type.startsWith('image/')) return;

       const objectUrl = URL.createObjectURL(file);
       const newItemId = `item-${Date.now()}-${index}`;
       
       // Auto-Position: Place to the right of the last item + gap
       const gap = 50; 
       const defaultWidth = 375; // Mobile Width assumption
       const lastItem = items[items.length - 1];
       const startX = lastItem ? lastItem.x + lastItem.width + gap : -200;
       
       // Create Item
       const newItem: CanvasItem = {
         id: newItemId,
         type: 'image',
         src: objectUrl,
         x: startX,
         y: -300, // Center vertically roughly
         width: defaultWidth, 
         height: 812, // Mobile Height assumption (real app would load image to get dims)
         zIndex: items.length + 1,
         isScanning: true
       };

       setItems(prev => [...prev, newItem]);
       setSelectedItemId(newItemId); // Auto-focus new item

       // --- Trigger Mock AI Scan ---
       simulateAIScan(newItemId);
    });
  };

  const simulateAIScan = (itemId: string) => {
    setTimeout(() => {
      // 1. Stop Scanning state
      setItems(prev => prev.map(i => i.id === itemId ? { ...i, isScanning: false } : i));

      // 2. Generate Random Mock Errors
      const newErrors: DesignError[] = [
        {
          id: `err-${itemId}-1`,
          itemId,
          type: 'contrast',
          message: 'Header text failed contrast check (3.5:1).',
          severity: 'high',
          coordinates: { x: 10, y: 5, w: 40, h: 5 }
        },
        {
          id: `err-${itemId}-2`,
          itemId,
          type: 'spacing',
          message: 'Inconsistent padding on card container.',
          severity: 'low',
          coordinates: { x: 5, y: 20, w: 90, h: 15 }
        },
        {
          id: `err-${itemId}-3`,
          itemId,
          type: 'brand',
          message: 'Detected hex #0000FF. Brand uses #3B82F6.',
          severity: 'high',
          coordinates: { x: 50, y: 80, w: 30, h: 8 }
        }
      ];

      setErrors(prev => [...prev, ...newErrors]);
    }, 2000);
  };

  return (
    <div className="w-full h-screen overflow-hidden bg-alabaster font-sans">
      <Sidebar />
      
      <MainStage 
        items={items}
        onItemsChange={setItems}
        errors={errors}
        hoveredIssueId={hoveredIssueId}
        onHoverIssue={setHoveredIssueId}
        selectedIssueId={selectedIssueId}
        onSelectIssue={setSelectedIssueId}
        selectedItemId={selectedItemId}
        onSelectItem={setSelectedItemId}
        onFileUpload={handleFileUpload}
      />

      <IssuesPanel 
        errors={errors} 
        onHoverIssue={setHoveredIssueId}
        selectedIssueId={selectedIssueId}
        onSelectIssue={setSelectedIssueId}
        selectedItemId={selectedItemId}
      />
    </div>
  );
}

export default App;
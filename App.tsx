import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { IssuesPanel } from './components/IssuesPanel';
import { MainStage } from './components/MainStage';
import { DesignError } from './types';

function App() {
  const [image, setImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [errors, setErrors] = useState<DesignError[]>([]);
  const [hoveredIssueId, setHoveredIssueId] = useState<string | null>(null);

  // Clean up object URL to prevent memory leaks
  useEffect(() => {
    return () => {
      if (image) URL.revokeObjectURL(image);
    };
  }, [image]);

  const handleImageUpload = (file: File) => {
    const objectUrl = URL.createObjectURL(file);
    setImage(objectUrl);
    setErrors([]); // Clear previous errors
    setIsScanning(true);

    // Simulate AI scanning latency
    setTimeout(() => {
      setIsScanning(false);
      // Generate some consistent mock errors based on the "Design System"
      setErrors([
        {
          id: '1',
          type: 'spacing',
          message: 'Inconsistent padding. Expected 24px, found 20px.',
          severity: 'low',
          coordinates: { x: 15, y: 15, w: 20, h: 10 }
        },
        {
          id: '2',
          type: 'contrast',
          message: 'Text contrast ratio is 3.5:1. WCAG AA requires 4.5:1.',
          severity: 'high',
          coordinates: { x: 45, y: 35, w: 30, h: 8 }
        },
        {
          id: '3',
          type: 'alignment',
          message: 'Button is not aligned to the grid column.',
          severity: 'low',
          coordinates: { x: 70, y: 80, w: 15, h: 10 }
        },
        {
          id: '4',
          type: 'brand',
          message: 'Primary color hex #6D28D9 deviates from brand guidelines.',
          severity: 'high',
          coordinates: { x: 40, y: 60, w: 20, h: 15 }
        }
      ]);
    }, 2500);
  };

  const handleClearImage = () => {
    setImage(null);
    setErrors([]);
    setIsScanning(false);
  };

  return (
    <div className="flex h-screen w-full bg-zinc-950 text-zinc-100 overflow-hidden font-sans selection:bg-purple-500/30">
      <Sidebar />
      <MainStage 
        image={image}
        onImageUpload={handleImageUpload}
        onClearImage={handleClearImage}
        isScanning={isScanning}
        errors={errors}
        hoveredIssueId={hoveredIssueId}
        onHoverIssue={setHoveredIssueId}
      />
      <IssuesPanel 
        errors={errors} 
        isScanning={isScanning}
        onHoverIssue={setHoveredIssueId}
      />
    </div>
  );
}

export default App;
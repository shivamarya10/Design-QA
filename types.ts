export interface DesignError {
  id: string;
  itemId: string; // Link error to specific canvas item
  type: "spacing" | "contrast" | "brand" | "alignment";
  message: string;
  severity: "low" | "high";
  coordinates: { x: number; y: number; w: number; h: number }; // Percentage (0-100)
}

export interface CanvasItem {
  id: string;
  type: 'image';
  src: string; // Blob URL
  x: number;
  y: number;
  width: number; // Pixels
  height: number; // Pixels
  zIndex: number;
  isScanning: boolean;
}

export interface Project {
  id: string;
  name: string;
  lastEdited: string;
}
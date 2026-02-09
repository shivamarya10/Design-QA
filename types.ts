export interface DesignError {
  id: string;
  type: "spacing" | "contrast" | "brand" | "alignment";
  message: string;
  severity: "low" | "high";
  coordinates: { x: number; y: number; w: number; h: number }; // Percentage (0-100)
}

export interface Project {
  id: string;
  name: string;
  lastEdited: string;
}

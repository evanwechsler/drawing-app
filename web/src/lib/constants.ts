import { Brushes, Canvases } from "@/types/painting-settings";

export const BRUSHES: Brushes = {
  "1mm": 1,
  "1.5mm": 1.5,
  "2mm": 2,
  "3mm": 3,
  "6mm": 6,
  "10mm": 10,
  "12mm": 12,
} as const;

export const CANVASES: Canvases = {
  "5x7": {
    width: 5,
    height: 7,
    allowableBrushes: ["1mm", "2mm"],
  },
  "20x30": {
    width: 20,
    height: 30,
    allowableBrushes: ["1.5mm", "2mm", "3mm", "6mm", "10mm", "12mm"],
  },
  "24x36": {
    width: 24,
    height: 36,
    allowableBrushes: ["1.5mm", "2mm", "3mm", "6mm", "10mm", "12mm"],
  },
} as const;

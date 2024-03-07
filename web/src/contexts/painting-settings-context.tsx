"use client";

import { BrushName, CanvasName } from "@/types/painting-settings";
import { createContext, useContext, useEffect, useState } from "react";

export type PaintingSettingContextValue = {
  selectedCanvas: CanvasName | null;
  selectedBrush: BrushName | null;
  setSelectedCanvas: (canvas: CanvasName | null) => void;
  setSelectedBrush: (brush: BrushName | null) => void;
};

const PaintingSettingsContext = createContext<PaintingSettingContextValue>({
  selectedCanvas: null,
  selectedBrush: null,
  setSelectedCanvas: () => {},
  setSelectedBrush: () => {},
});

export default function PaintingSettingsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedCanvas, setSelectedCanvasState] = useState<CanvasName | null>(
    null,
  );
  const [selectedBrush, setSelectedBrush] = useState<BrushName | null>(null);

  const setSelectedCanvas = (canvas: CanvasName | null) => {
    // store the selected canvas in local storage
    if (typeof window !== "undefined") {
      if (canvas) {
        localStorage.setItem("selectedCanvas", canvas);
      } else {
        localStorage.removeItem("selectedCanvas");
      }
    }
    setSelectedCanvasState(canvas);
  };

  useEffect(() => {
    // try to get the selected canvas from local storage
    if (typeof window !== "undefined") {
      const selectedCanvas = localStorage.getItem(
        "selectedCanvas",
      ) as CanvasName;
      if (selectedCanvas) {
        setSelectedCanvas(selectedCanvas);
      }
    }
  }, []);

  const value = {
    selectedCanvas,
    selectedBrush,
    setSelectedCanvas,
    setSelectedBrush,
  };

  return (
    <PaintingSettingsContext.Provider value={value}>
      {children}
    </PaintingSettingsContext.Provider>
  );
}

export function usePaintingSettings() {
  return useContext(PaintingSettingsContext);
}

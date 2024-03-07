import BrushSelector from "@/components/brush-selector";
import { ColorPicker } from "@/components/color-picker";
import { HexCode } from "@/lib/colors";
import { BrushName } from "@/types/painting-settings";
import React from "react";

export default function Sidebar({
  color,
  onColorChange,
  brush,
  onBrushChange,
}: {
  color: HexCode;
  onColorChange: (color: HexCode) => void;
  brush: BrushName;
  onBrushChange: (brush: BrushName) => void;
}) {
  return (
    <div className="flex h-full flex-col items-center gap-4 bg-neutral-700 px-4 py-8">
      <ColorPicker color={color} onColorChange={onColorChange} />
      <BrushSelector selectedBrush={brush} onBrushChange={onBrushChange} />
    </div>
  );
}

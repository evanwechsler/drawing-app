"use client";

import DrawingCanvas from "@/components/drawing-canvas";
import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { HexCode } from "@/lib/colors";
import { BrushName } from "@/types/painting-settings";
import { Redo, Undo } from "lucide-react";
import React from "react";
import useMeasure from "react-use-measure";

export default function ArtBoard({ children }: { children: React.ReactNode }) {
  const [selectedColor, setSelectedColor] = React.useState<HexCode>("00a243");
  const [selectedBrush, setSelectedBrush] = React.useState<BrushName>("2mm");
  const [containerRef, { width, height }] = useMeasure();
  const [strokeStack, setStrokeStack] = React.useState<fabric.Object[]>([]);
  const [redoStack, setRedoStack] = React.useState<fabric.Object[]>([]);

  function clearDrawing(): void {
    setStrokeStack([]);
    setRedoStack([]);
  }

  const undo = () => {
    const last = strokeStack.pop();
    if (last) {
      setRedoStack([...redoStack, last]);
    }

    const newStack = [...strokeStack];
    setStrokeStack(newStack);
  };

  const redo = () => {
    const last = redoStack.pop();
    if (last) {
      setStrokeStack([...strokeStack, last]);
    }

    const newStack = [...redoStack];
    setRedoStack(newStack);
  };

  const addStroke = (stroke: fabric.Object) => {
    setStrokeStack([...strokeStack, stroke]);
    setRedoStack([]);
  };

  return (
    <>
      <div className="mb-4 flex w-full px-4">
        <div>
          <Button variant="outline" onClick={() => undo()}>
            <Undo className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={() => redo()}>
            <Redo className="h-4 w-4" />
          </Button>
        </div>
        <Button
          variant="destructive"
          onClick={() => clearDrawing()}
          className="ml-auto"
        >
          Clear
        </Button>
      </div>
      <div className="relative flex h-full w-full grow bg-neutral-700">
        <Sidebar
          color={selectedColor}
          onColorChange={setSelectedColor}
          brush={selectedBrush}
          onBrushChange={setSelectedBrush}
        />
        <div className="relative flex w-full grow" ref={containerRef}>
          {width && height && (
            <DrawingCanvas
              width={width}
              height={height}
              color={selectedColor}
              brush={selectedBrush}
              strokes={strokeStack}
              addStroke={addStroke}
            />
          )}
        </div>
      </div>
    </>
  );
}

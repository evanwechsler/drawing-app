"use client";

import { useEffect, useState } from "react";
import { fabric } from "fabric";
import { usePaintingSettings } from "@/contexts/painting-settings-context";
import { BRUSHES, CANVASES } from "@/lib/constants";
import { HexCode } from "@/lib/colors";
import { BrushName } from "@/types/painting-settings";
import chroma from "chroma-js";

type MyCanvas = fabric.Canvas & {
  isDragging: boolean;
  lastPosX: number;
  lastPosY: number;
  lowerCanvasEl: HTMLCanvasElement;
};

type MyStaticCanvas = fabric.StaticCanvas & {
  lowerCanvasEl: HTMLCanvasElement;
};

type MyBrush = fabric.BaseBrush & {
  limitedToCanvasSize: boolean;
};

const DrawingCanvas = ({
  width,
  height,
  color,
  brush,
  strokes,
  addStroke,
}: {
  width: number;
  height: number;
  color: HexCode;
  brush: BrushName;
  strokes: fabric.Object[];
  addStroke: (stroke: fabric.Object) => void;
}): JSX.Element => {
  const [drawingCanvas, setDrawingCanvas] = useState<MyCanvas>();
  const [backgroundCanvas, setBackgroundCanvas] = useState<MyStaticCanvas>();
  const [backgroundRect, setBackgroundRect] = useState<fabric.Rect>();
  const [selectedTool, setSelectedTool] = useState<"draw" | "pan">("draw");
  const [lastZoom, setLastZoom] = useState<number>(0.75);
  const [lastCenterPoint, setLastCenterPoint] = useState<{
    x: number;
    y: number;
  }>({
    x: width / 2,
    y: height / 2,
  });

  const [lastViewportTransform, setLastViewportTransform] = useState<number[]>([
    0.75,
    0,
    0,
    0.75,
    (width - width * 0.75) / 2,
    100,
  ]);

  const { selectedCanvas } = usePaintingSettings();

  useEffect(() => {
    if (!selectedCanvas) return;
    const newDrawingCanvas = new fabric.Canvas("drawingCanvas", {
      isDrawingMode: true,
      selection: false,
      width: width,
      height: height,
    }) as MyCanvas;
    (newDrawingCanvas.freeDrawingBrush as MyBrush).limitedToCanvasSize = true;

    const newBackgroundCanvas = new fabric.StaticCanvas("backgroundCanvas", {
      selection: false,
      width: newDrawingCanvas.getWidth(),
      height: newDrawingCanvas.getHeight(),
    }) as MyStaticCanvas;

    const aspectRatio =
      CANVASES[selectedCanvas].height / CANVASES[selectedCanvas].width;

    // Create a large rectangle that serves as the drawing area background
    const newBackgroundRect = new fabric.Rect({
      left: 0,
      top: 0,
      fill: "rgba(255, 255, 255, 1)", // Semi-transparent or any color you prefer
      selectable: false,
      evented: false,
      excludeFromExport: true,
      width: newDrawingCanvas.getWidth(),
      height: newBackgroundCanvas.getWidth() * aspectRatio,
    });
    newDrawingCanvas.add(newBackgroundRect);
    newDrawingCanvas.add(...strokes);
    newDrawingCanvas.setViewportTransform(lastViewportTransform);

    setBackgroundRect(newBackgroundRect);

    drawGrid(newBackgroundCanvas);

    newDrawingCanvas.on(
      "mouse:wheel",
      function (this: MyCanvas, opt: fabric.IEvent<Event>) {
        const event = opt.e as WheelEvent;
        const delta = event.deltaY;
        let zoom = this.getZoom();
        zoom *= 0.999 ** delta;
        if (zoom > 20) zoom = 20;
        if (zoom < 0.01) zoom = 0.01;
        this.zoomToPoint({ x: event.offsetX, y: event.offsetY }, zoom);
        opt.e.preventDefault();
        opt.e.stopPropagation();
        this.lastPosX = event.offsetX;
        this.lastPosY = event.offsetY;

        setLastCenterPoint({ x: event.offsetX, y: event.offsetY });
        setLastZoom(zoom);
        setLastViewportTransform(this.viewportTransform ?? [1, 0, 0, 1, 0, 0]);
        // setDrawingCanvas(this);
      },
    );

    newDrawingCanvas.on("mouse:down", function (this: MyCanvas, opt) {
      const evt = opt.e;
      if (evt.altKey === true) {
        evt.preventDefault();
        evt.stopPropagation();
        this.isDragging = true;
        this.lastPosX = evt.clientX;
        this.lastPosY = evt.clientY;
        setLastCenterPoint({ x: evt.clientX, y: evt.clientY });
        setLastViewportTransform(this.viewportTransform ?? [1, 0, 0, 1, 0, 0]);
        // setDrawingCanvas(this);
      }
    });
    newDrawingCanvas.on("mouse:move", function (this: MyCanvas, opt) {
      if (this.isDragging) {
        const e = opt.e;
        this.relativePan(
          new fabric.Point(
            e.clientX - this.lastPosX,
            e.clientY - this.lastPosY,
          ),
        );
        this.requestRenderAll();
        this.lastPosX = e.clientX;
        this.lastPosY = e.clientY;
        setLastCenterPoint({ x: e.clientX, y: e.clientY });
        setLastViewportTransform(this.viewportTransform ?? [1, 0, 0, 1, 0, 0]);

        // setDrawingCanvas(this);
      }
    });
    newDrawingCanvas.on("mouse:up", function (this: MyCanvas, opt) {
      this.isDragging = false;
      // setDrawingCanvas(this);
    });

    newDrawingCanvas.on("path:created", function (options: fabric.IEvent) {
      const path = (options as object as { path: fabric.Path }).path;
      addStroke(path);
    });

    setDrawingCanvas(newDrawingCanvas);
    setBackgroundCanvas(newBackgroundCanvas);

    const handleAltEvent = (keyUp: boolean) => {
      if (keyUp) {
        newDrawingCanvas.isDrawingMode = true;
      } else {
        newDrawingCanvas.isDrawingMode = false;
      }
    };

    const handleAltDown = (e: KeyboardEvent) => {
      if (e.key === "Alt") {
        handleAltEvent(false);
      }
    };

    const handleAltUp = (e: KeyboardEvent) => {
      if (e.key === "Alt") {
        handleAltEvent(true);
      }
    };

    document.addEventListener("keydown", handleAltDown);

    document.addEventListener("keyup", handleAltUp);

    return () => {
      if (newDrawingCanvas) {
        newDrawingCanvas.dispose();
        setDrawingCanvas(undefined);
        setBackgroundRect(undefined);
      }
      if (newBackgroundCanvas) {
        newBackgroundCanvas.dispose();
        setBackgroundCanvas(undefined);
      }

      document.removeEventListener("keydown", handleAltDown);
      document.removeEventListener("keyup", handleAltUp);
    };
  }, [selectedCanvas, width, height, strokes]);

  useEffect(() => {
    if (!drawingCanvas) return;
    drawingCanvas.freeDrawingBrush.color = `rgb(${chroma(`#${color}`).rgb().join(",")})`;
    drawingCanvas.freeDrawingBrush.width = BRUSHES[brush];
  }, [color, brush, drawingCanvas]);

  function drawGrid(canvas: fabric.StaticCanvas) {
    // clear the canvas
    canvas.clear();
    canvas.backgroundColor = "#404040";

    const gridOptions = {
      distance: 50, // Distance between grid lines
      width: canvas.getWidth() ?? 0,
      height: canvas.getHeight() ?? 0,
      stroke: "#525252", // Grid line color
    };

    for (let i = 0; i < gridOptions.width / gridOptions.distance; i++) {
      canvas.add(
        new fabric.Line(
          [
            i * gridOptions.distance,
            0,
            i * gridOptions.distance,
            gridOptions.height,
          ],
          { stroke: gridOptions.stroke, selectable: false },
        ),
      );
      canvas.add(
        new fabric.Line(
          [
            0,
            i * gridOptions.distance,
            gridOptions.width,
            i * gridOptions.distance,
          ],
          { stroke: gridOptions.stroke, selectable: false },
        ),
      );
    }

    canvas.renderAll();
  }

  return (
    <div className="">
      <div className="relative">
        <div className="bg-[url('../../public/grid.png)] absolute left-0 top-0 z-0 h-full w-full" />
        <canvas
          id="backgroundCanvas"
          className="absolute left-0 top-0 z-0 border-none"
        />
        <canvas
          id="drawingCanvas"
          className="z-1 absolute left-0 top-0 border-none"
        />
      </div>
    </div>
  );
};

export default DrawingCanvas;

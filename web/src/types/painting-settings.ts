export type CanvasName = "5x7" | "20x30" | "24x36";

export type Canvases = Record<
  CanvasName,
  {
    width: number;
    height: number;
    allowableBrushes: BrushName[];
  }
>;

export type BrushName =
  | "1mm"
  | "1.5mm"
  | "2mm"
  | "3mm"
  | "6mm"
  | "10mm"
  | "12mm";

export type Brushes = Record<BrushName, number>;

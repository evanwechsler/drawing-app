"use client";

import CanvasWrapper from "@/components/art-board";
import DrawingCanvas from "@/components/drawing-canvas";
import { Button } from "@/components/ui/button";
import { usePaintingSettings } from "@/contexts/painting-settings-context";
import { ArrowBigLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import useMeasure from "react-use-measure";

export default function Page() {
  const { selectedCanvas, setSelectedCanvas } = usePaintingSettings();
  const router = useRouter();

  useEffect(() => {
    if (!selectedCanvas) {
      router.push("/");
    }
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="mb-4 flex flex-col gap-4 px-4 py-3">
        <Button
          variant="outline"
          onClick={() => {
            setSelectedCanvas(null);
            router.push("/");
          }}
          className="w-fit"
        >
          <ArrowBigLeft className="mr-1 h-4 w-4" />
          Back
        </Button>
        <p>Selected Canvas: {selectedCanvas}</p>
      </div>
      <CanvasWrapper>test</CanvasWrapper>
      {/* <DrawingCanvas /> */}
    </div>
  );
}

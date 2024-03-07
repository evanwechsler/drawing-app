"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BRUSHES } from "@/lib/constants";
import { BrushName } from "@/types/painting-settings";
import React from "react";

type Props = {
  onBrushChange: (brush: BrushName) => void;
  selectedBrush: BrushName;
};

export default function BrushSelector({ onBrushChange, selectedBrush }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{selectedBrush}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Brushes</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {Object.entries(BRUSHES).map(([name, size]) => (
          <DropdownMenuItem
            key={name}
            onClick={() => onBrushChange(name as BrushName)}
          >
            {name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

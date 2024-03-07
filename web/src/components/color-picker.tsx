"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { HexCode, colorPaletteSortedByHsl } from "@/lib/colors";

export function ColorPicker({
  color,
  onColorChange,
}: {
  color: HexCode;
  onColorChange: (color: HexCode) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(color);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <div
          className="h-8 w-8 rounded-full"
          style={{ backgroundColor: `#${value}` }}
        />
      </PopoverTrigger>
      <PopoverContent
        className="max-h-[500px] w-[300px] overflow-y-scroll p-0"
        align="start"
      >
        <Command>
          <CommandInput placeholder="Search framework..." />
          <CommandEmpty>No framework found.</CommandEmpty>
          <CommandGroup>
            {Array.from(colorPaletteSortedByHsl).map(([hex, name]) => (
              <CommandItem
                key={hex}
                value={hex}
                onSelect={(currentValue) => {
                  setValue(
                    (currentValue as HexCode) === value
                      ? color
                      : (currentValue as HexCode),
                  );
                  setOpen(false);
                  onColorChange(currentValue as HexCode);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === hex ? "opacity-100" : "opacity-0",
                  )}
                />
                <span
                  className="mr-2 h-4 w-4 rounded-md"
                  style={{ backgroundColor: `#${hex}` }}
                />
                {name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

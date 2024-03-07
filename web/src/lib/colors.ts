import chroma from "chroma-js";
import * as cd from "color-diff";

export const COLORS = {
  ebe400: "Cadmium Free Yellow Light",
  e0ba00: "Cadmium Free Yellow Medium",
  eabc2a: "Cadmium Free Yellow Deep",
  f27328: "Cadmium Free Orange",
  c92d43: "Cadmium Free Red Medium",
  "68131e": "Pyrrole Crimson",
  af2e4b: "Cadmium Free Red Deep",
  EEBBBA: "Light Pink",
  D956B5: "Medium Magenta",
  bb4388: "Deep Magenta",
  "826ed7": "Brilliant Purple",
  "578cea": "Light Blue Violet",
  "0536C4": "Cobalt Blue Hue",
  "354475": "Prussian Blue Hue",
  "0082ce": "Brilliant Blue",
  "0b6dc1": "Cerulean Blue Hue",
  "38b4de": "Light Blue Permanent",
  "00bdb2": "Bright Aqua Green",
  "00bfd0": "Cobalt Teal",
  "007a87": "Cobalt Turquoise",
  "008c5d": "Emerald Green",
  "0c7354": "Green Deep Permanent",
  "0d3924": "Viridian Hue Permanent",
  "2f3c45": "Hooker's Green Deep Hue Permanent",
  "45664d": "Chromium Oxide Green",
  "00a243": "Light Green Permanent",
  "7cbc35": "Vivid Lime Green",
  "806c30": "Bronze Yellow",
  c08d42: "Yellow Oxide",
  dcab5e: "Naples Yellow Hue",
  a8644e: "Raw Sienna",
  "884349": "Red Oxide",
  "834143": "Burnt Sienna",
  "413b42": "Burnt Umber",
  "76553e": "Raw Umber",
  cfbc9c: "Unbleached Titanium",
  cdd3c2: "Parchment",
  e1eaf5: "Titanium White",
  "727b84": "Neutral Gray 5",
  "39424d": "Ivory Black",
  "333b48": "Mars Black",
  c1cad5: "Iridescent Rich Silver",
  "704521": "Iridescent Rich Bronze",
  "95533a": "Iridescent Rich Copper",
  "3b2a32": "Muted Violet",
  "253036": "Muted Turquoise",
  "51352e": "Muted Pink",
  "27343f": "Muted Green",
  "272a35": "Muted Grey",
  "1f2881": "Phthaloeyanine Blue Red Shade",
  "666662": "Neutral Grays",
  "272e39": "Payne's Gray",
  e3e52d: "Yellow Light Hansa",
  eab700: "Yellow Orange Azo",
  ff4291: "Fluorcent Pink",
  "2c2768": "Dioxazine Purple",
  "5b305c": "Quinacridone Blue Violet",
  c2de5a: "Brilliant Yellow Green",
  "1b1dc2": "Ultramarine Blue Red Shade",
  ed7b00: "Vivid Red Orange",
  e54e3e: "Quinacridone Red",
  a23b3f: "Napthol Crimson",
  "274e3f": "Sap Green",
  e6db85: "Iridescent Bright Gold",
  "080d4d": "Phthalocyanine Blue Green Shade",
  ad3b21: "Cadmium Free Red Light",
  "0064c4": "Cerulean Blue",
} as const;

export type HexCode = keyof typeof COLORS;
export type ColorName = (typeof COLORS)[HexCode];

// Function to convert hex color to RGB, as color-diff expects colors in RGB format

const hexToLab = (hex: string): cd.LabColor => {
  const lab = chroma(`#${hex}`).lab();

  return {
    L: lab[0],
    a: lab[1],
    b: lab[2],
  };
};

const hexToHSL = (hex: string): [number, number, number] => {
  return chroma(`#${hex}`).hsl();
};

export const colorPaletteSortedByHsl: Map<string, string> = new Map(
  Object.keys(COLORS)
    .sort((a, b) => {
      const aHsl = hexToHSL(a);
      const bHsl = hexToHSL(b);

      return aHsl[0] - bHsl[0] || aHsl[1] - bHsl[1] || aHsl[2] - bHsl[2];
    })
    .map((color) => {
      return [color, COLORS[color as HexCode]];
    }),
);

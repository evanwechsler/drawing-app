"use client";

import { usePaintingSettings } from "@/contexts/painting-settings-context";
import { CANVASES } from "@/lib/constants";
import { CanvasName } from "@/types/painting-settings";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const { selectedCanvas, setSelectedCanvas } = usePaintingSettings();
  const router = useRouter();

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center gap-8">
      <Image
        src="/logo-large.png"
        alt="Acrylic Logo"
        width={400}
        height={200}
      />
      <h1 className="text-2xl font-bold">Choose a canvas to get started</h1>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {Object.entries(CANVASES).map(([name, { width, height }]) => {
          const className = ``;

          return (
            <button
              key={name}
              className="flex flex-col items-center justify-between gap-2 rounded-lg border border-slate-300 p-4 shadow-md transition-shadow hover:shadow-lg"
              onClick={() => {
                setSelectedCanvas(name as CanvasName);
                router.push("/paint");
              }}
            >
              <div className="flex grow flex-col justify-center">
                <div
                  className="rounded-sm border border-black"
                  style={{
                    width: `${height * 0.5}rem`,
                    height: `${width * 0.5}rem`,
                  }}
                />
              </div>
              <div className="gap2 flex flex-col">
                <span className="text-lg font-bold">{name}</span>
              </div>
            </button>
          );
        })}
      </div>
    </main>
  );
}

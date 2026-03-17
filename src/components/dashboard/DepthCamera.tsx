import { Eye } from "lucide-react";
import SensorCard from "./SensorCard";
import { useEffect, useRef } from "react";

const DepthCamera = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = 320, h = 240;
    canvas.width = w;
    canvas.height = h;

    const draw = () => {
      const imageData = ctx.createImageData(w, h);
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const i = (y * w + x) * 4;
          // Simulate depth gradient with noise
          const base = Math.sin(x * 0.02) * 40 + Math.cos(y * 0.03) * 30 + 120;
          const noise = (Math.random() - 0.5) * 30;
          const depth = Math.max(0, Math.min(255, base + noise + y * 0.3));

          // Color map: near=warm, far=cool (turquoise to deep blue)
          const t = depth / 255;
          imageData.data[i] = Math.floor(20 + t * 30);      // R
          imageData.data[i + 1] = Math.floor(80 + (1 - t) * 150); // G
          imageData.data[i + 2] = Math.floor(120 + t * 100);  // B
          imageData.data[i + 3] = 255;
        }
      }
      ctx.putImageData(imageData, 0, 0);
    };

    draw();
    const interval = setInterval(draw, 600);
    return () => clearInterval(interval);
  }, []);

  return (
    <SensorCard title="Depth Camera — RGBD" icon={<Eye size={14} />} status="online">
      <div className="relative w-full aspect-video rounded bg-muted overflow-hidden">
        <canvas ref={canvasRef} className="w-full h-full object-cover" />
        <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-primary/40" />
        <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-primary/40" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-primary/40" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-primary/40" />
        {/* Depth scale */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col items-center gap-0.5">
          <span className="font-mono text-[8px] text-foreground/70">0m</span>
          <div className="w-2 h-16 rounded-full" style={{ background: "linear-gradient(to bottom, hsl(175 80% 60%), hsl(220 60% 30%))" }} />
          <span className="font-mono text-[8px] text-foreground/70">5m</span>
        </div>
      </div>
      <div className="flex gap-4 mt-2 font-mono text-[11px]">
        <div className="text-muted-foreground">Res: <span className="text-foreground">640×480</span></div>
        <div className="text-muted-foreground">FPS: <span className="text-foreground">30</span></div>
        <div className="text-muted-foreground">Range: <span className="text-foreground">0.3–5.0m</span></div>
      </div>
    </SensorCard>
  );
};

export default DepthCamera;

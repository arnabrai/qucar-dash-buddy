import { MapPin } from "lucide-react";
import SensorCard from "./SensorCard";
import { useEffect, useState, useRef } from "react";

const LocalizationMap = () => {
  const [pos, setPos] = useState({ x: 50, y: 50, heading: 0 });
  const [trail, setTrail] = useState<{ x: number; y: number }[]>([{ x: 50, y: 50 }]);
  const animRef = useRef<number>();
  const timeRef = useRef(0);

  useEffect(() => {
    const tick = () => {
      timeRef.current += 0.03;
      const t = timeRef.current;
      // Figure-8 path
      const nx = 50 + Math.sin(t) * 30;
      const ny = 50 + Math.sin(t * 2) * 18;
      const heading = Math.atan2(
        Math.cos(t * 2) * 18 * 2,
        Math.cos(t) * 30
      );

      setPos({ x: nx, y: ny, heading });
      setTrail(prev => {
        const next = [...prev, { x: nx, y: ny }];
        return next.length > 120 ? next.slice(-120) : next;
      });
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, []);

  const trailPath = trail.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");

  return (
    <SensorCard title="Localization" icon={<MapPin size={14} />} status="online">
      <div className="relative w-full aspect-[4/3] rounded bg-muted overflow-hidden">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Grid */}
          {Array.from({ length: 11 }, (_, i) => (
            <g key={i}>
              <line x1={i * 10} y1={0} x2={i * 10} y2={100} stroke="hsl(175 80% 45% / 0.06)" strokeWidth={0.3} />
              <line x1={0} y1={i * 10} x2={100} y2={i * 10} stroke="hsl(175 80% 45% / 0.06)" strokeWidth={0.3} />
            </g>
          ))}
          {/* Axes */}
          <line x1={50} y1={0} x2={50} y2={100} stroke="hsl(175 80% 45% / 0.12)" strokeWidth={0.3} />
          <line x1={0} y1={50} x2={100} y2={50} stroke="hsl(175 80% 45% / 0.12)" strokeWidth={0.3} />

          {/* Waypoints */}
          {[{ x: 30, y: 35 }, { x: 70, y: 35 }, { x: 70, y: 65 }, { x: 30, y: 65 }].map((wp, i) => (
            <g key={i}>
              <circle cx={wp.x} cy={wp.y} r={1.5} fill="none" stroke="hsl(45 90% 55% / 0.4)" strokeWidth={0.4} />
              <circle cx={wp.x} cy={wp.y} r={0.5} fill="hsl(45 90% 55% / 0.6)" />
            </g>
          ))}

          {/* Trail */}
          <path d={trailPath} fill="none" stroke="hsl(175 80% 45% / 0.3)" strokeWidth={0.6} strokeLinecap="round" />

          {/* Car position */}
          <g transform={`translate(${pos.x}, ${pos.y}) rotate(${(pos.heading * 180) / Math.PI})`}>
            {/* Direction cone */}
            <polygon points="0,-3 -1.5,1 1.5,1" fill="hsl(175 80% 45% / 0.5)" stroke="hsl(175 80% 45%)" strokeWidth={0.3} />
            <circle cx={0} cy={0} r={1} fill="hsl(175 80% 60%)" />
            {/* Glow */}
            <circle cx={0} cy={0} r={3} fill="hsl(175 80% 45% / 0.15)" />
          </g>

          {/* Labels */}
          <text x={3} y={6} fill="hsl(175 80% 45% / 0.3)" fontSize={3} fontFamily="monospace">X(m)</text>
          <text x={92} y={53} fill="hsl(175 80% 45% / 0.3)" fontSize={3} fontFamily="monospace">Y</text>
        </svg>
      </div>
      <div className="grid grid-cols-3 gap-2 mt-2 font-mono text-[11px]">
        <div className="text-muted-foreground">X: <span className="text-foreground">{((pos.x - 50) / 10).toFixed(2)}m</span></div>
        <div className="text-muted-foreground">Y: <span className="text-foreground">{((pos.y - 50) / 10).toFixed(2)}m</span></div>
        <div className="text-muted-foreground">θ: <span className="text-foreground">{((pos.heading * 180) / Math.PI).toFixed(1)}°</span></div>
      </div>
    </SensorCard>
  );
};

export default LocalizationMap;

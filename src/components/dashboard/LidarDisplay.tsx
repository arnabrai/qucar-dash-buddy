import { Radar } from "lucide-react";
import SensorCard from "./SensorCard";
import { useEffect, useState } from "react";

const LidarDisplay = () => {
  const [points, setPoints] = useState<{ angle: number; dist: number }[]>([]);

  useEffect(() => {
    const generate = () => {
      const pts = Array.from({ length: 60 }, (_, i) => ({
        angle: (i / 60) * Math.PI * 2,
        dist: 30 + Math.random() * 50 + Math.sin(i * 0.3) * 15,
      }));
      setPoints(pts);
    };
    generate();
    const interval = setInterval(generate, 800);
    return () => clearInterval(interval);
  }, []);

  const cx = 80, cy = 80, r = 70;

  return (
    <SensorCard title="LIDAR — RP A2M8" icon={<Radar size={14} />} status="online">
      <div className="flex items-center justify-center">
        <svg viewBox="0 0 160 160" className="w-full max-w-[200px]">
          {/* Grid rings */}
          {[0.33, 0.66, 1].map((s, i) => (
            <circle key={i} cx={cx} cy={cy} r={r * s} fill="none" stroke="hsl(175 80% 45% / 0.1)" strokeWidth={0.5} />
          ))}
          {/* Cross */}
          <line x1={cx} y1={cy - r} x2={cx} y2={cy + r} stroke="hsl(175 80% 45% / 0.08)" strokeWidth={0.5} />
          <line x1={cx - r} y1={cy} x2={cx + r} y2={cy} stroke="hsl(175 80% 45% / 0.08)" strokeWidth={0.5} />
          {/* Points */}
          {points.map((p, i) => {
            const x = cx + Math.cos(p.angle) * (p.dist / 100) * r;
            const y = cy + Math.sin(p.angle) * (p.dist / 100) * r;
            return <circle key={i} cx={x} cy={y} r={1.2} fill="hsl(175 80% 45%)" opacity={0.8} />;
          })}
          {/* Car */}
          <rect x={cx - 3} y={cy - 5} width={6} height={10} rx={1.5} fill="hsl(175 80% 45% / 0.4)" stroke="hsl(175 80% 45%)" strokeWidth={0.5} />
        </svg>
      </div>
      <div className="grid grid-cols-2 gap-2 mt-2 font-mono text-[11px]">
        <div className="text-muted-foreground">Range: <span className="text-foreground">12.0m</span></div>
        <div className="text-muted-foreground">RPM: <span className="text-foreground">660</span></div>
      </div>
    </SensorCard>
  );
};

export default LidarDisplay;

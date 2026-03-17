import { CircleDot } from "lucide-react";
import SensorCard from "./SensorCard";
import { useEffect, useState } from "react";

const EncoderDisplay = () => {
  const [ticks, setTicks] = useState({ fl: 12450, fr: 12465, rl: 12440, rr: 12458 });

  useEffect(() => {
    const interval = setInterval(() => {
      setTicks(prev => ({
        fl: prev.fl + Math.floor(Math.random() * 5),
        fr: prev.fr + Math.floor(Math.random() * 5),
        rl: prev.rl + Math.floor(Math.random() * 5),
        rr: prev.rr + Math.floor(Math.random() * 5),
      }));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <SensorCard title="Wheel Encoders" icon={<CircleDot size={14} />} status="online">
      <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
        <WheelTick label="FL" value={ticks.fl} />
        <WheelTick label="FR" value={ticks.fr} />
        <WheelTick label="RL" value={ticks.rl} />
        <WheelTick label="RR" value={ticks.rr} />
      </div>
    </SensorCard>
  );
};

const WheelTick = ({ label, value }: { label: string; value: number }) => (
  <div className="bg-muted rounded px-2 py-1.5 flex items-center justify-between">
    <span className="text-primary text-[10px]">{label}</span>
    <span className="text-foreground tabular-nums">{value}</span>
  </div>
);

export default EncoderDisplay;

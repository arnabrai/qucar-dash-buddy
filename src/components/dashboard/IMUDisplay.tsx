import { RotateCcw } from "lucide-react";
import SensorCard from "./SensorCard";
import { useEffect, useState } from "react";

const IMUDisplay = () => {
  const [data, setData] = useState({ ax: 0.02, ay: -0.01, az: 9.81, gx: 0.1, gy: -0.05, gz: 0.02 });

  useEffect(() => {
    const interval = setInterval(() => {
      setData({
        ax: +(0.02 + (Math.random() - 0.5) * 0.04).toFixed(3),
        ay: +(-0.01 + (Math.random() - 0.5) * 0.04).toFixed(3),
        az: +(9.81 + (Math.random() - 0.5) * 0.02).toFixed(3),
        gx: +(0.1 + (Math.random() - 0.5) * 0.2).toFixed(3),
        gy: +(-0.05 + (Math.random() - 0.5) * 0.2).toFixed(3),
        gz: +(0.02 + (Math.random() - 0.5) * 0.1).toFixed(3),
      });
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <SensorCard title="IMU — MPU9250" icon={<RotateCcw size={14} />} status="online">
      <div className="space-y-3 font-mono text-[11px]">
        <div>
          <div className="text-muted-foreground text-[10px] uppercase tracking-wider mb-1">Accelerometer (m/s²)</div>
          <div className="grid grid-cols-3 gap-2">
            <DataValue label="X" value={data.ax} />
            <DataValue label="Y" value={data.ay} />
            <DataValue label="Z" value={data.az} />
          </div>
        </div>
        <div>
          <div className="text-muted-foreground text-[10px] uppercase tracking-wider mb-1">Gyroscope (rad/s)</div>
          <div className="grid grid-cols-3 gap-2">
            <DataValue label="X" value={data.gx} />
            <DataValue label="Y" value={data.gy} />
            <DataValue label="Z" value={data.gz} />
          </div>
        </div>
      </div>
    </SensorCard>
  );
};

const DataValue = ({ label, value }: { label: string; value: number }) => (
  <div className="bg-muted rounded px-2 py-1.5">
    <span className="text-primary text-[10px]">{label}</span>
    <div className="text-foreground tabular-nums">{value.toFixed(3)}</div>
  </div>
);

export default IMUDisplay;

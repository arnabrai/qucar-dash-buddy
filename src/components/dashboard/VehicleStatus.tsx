import { Car, Battery, Gauge, Thermometer } from "lucide-react";
import SensorCard from "./SensorCard";
import { useEffect, useState } from "react";

const VehicleStatus = () => {
  const [speed, setSpeed] = useState(0);
  const [steering, setSteering] = useState(0);
  const [battery, setBattery] = useState(78);
  const [temp, setTemp] = useState(42);

  useEffect(() => {
    const interval = setInterval(() => {
      setSpeed(+(Math.random() * 1.2).toFixed(2));
      setSteering(+((Math.random() - 0.5) * 40).toFixed(1));
      setBattery(prev => Math.max(10, prev - Math.random() * 0.1));
      setTemp(+(42 + (Math.random() - 0.5) * 3).toFixed(1));
    }, 700);
    return () => clearInterval(interval);
  }, []);

  return (
    <SensorCard title="Vehicle Status" icon={<Car size={14} />} status="online">
      <div className="grid grid-cols-2 gap-3">
        <StatusItem
          icon={<Gauge size={14} />}
          label="Speed"
          value={`${speed.toFixed(2)} m/s`}
        />
        <StatusItem
          icon={<Car size={14} />}
          label="Steering"
          value={`${steering > 0 ? "+" : ""}${steering.toFixed(1)}°`}
        />
        <StatusItem
          icon={<Battery size={14} />}
          label="Battery"
          value={`${battery.toFixed(0)}%`}
          warn={battery < 20}
        />
        <StatusItem
          icon={<Thermometer size={14} />}
          label="Temp"
          value={`${temp.toFixed(1)}°C`}
          warn={temp > 55}
        />
      </div>
    </SensorCard>
  );
};

const StatusItem = ({ icon, label, value, warn }: { icon: React.ReactNode; label: string; value: string; warn?: boolean }) => (
  <div className="bg-muted rounded-md p-2.5 font-mono">
    <div className="flex items-center gap-1.5 text-muted-foreground text-[10px] uppercase tracking-wider mb-1">
      {icon}
      {label}
    </div>
    <div className={`text-sm tabular-nums ${warn ? "text-hud-warn" : "text-foreground"}`}>
      {value}
    </div>
  </div>
);

export default VehicleStatus;

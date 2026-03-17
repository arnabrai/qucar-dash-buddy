import { Activity, Wifi } from "lucide-react";
import { useEffect, useState } from "react";

const HeaderBar = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="flex items-center justify-between px-6 py-3 border-b border-border bg-card/50 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-hud-success animate-pulse" />
        <h1 className="font-mono text-sm font-semibold text-primary hud-glow-text tracking-wider uppercase">
          QCar2 Dashboard
        </h1>
      </div>
      <div className="flex items-center gap-4 font-mono text-[11px] text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Activity size={12} className="text-hud-success" />
          <span>ROS2 Connected</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Wifi size={12} className="text-primary" />
          <span>192.168.2.10</span>
        </div>
        <span className="text-foreground tabular-nums">
          {time.toLocaleTimeString("en-US", { hour12: false })}
        </span>
      </div>
    </header>
  );
};

export default HeaderBar;

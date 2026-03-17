import { Activity } from "lucide-react";
import { useEffect, useState } from "react";
import { useRos } from "@/hooks/useRosBridge";
import ConnectionPanel from "./ConnectionPanel";

const HeaderBar = () => {
  const [time, setTime] = useState(new Date());
  const { connected, url } = useRos();

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Extract host from ws URL
  const host = (() => {
    try { return new URL(url).host; } catch { return url; }
  })();

  return (
    <header className="flex items-center justify-between px-6 py-3 border-b border-border bg-card/50 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${connected ? "bg-hud-success" : "bg-hud-danger"} animate-pulse`} />
        <h1 className="font-mono text-sm font-semibold text-primary hud-glow-text tracking-wider uppercase">
          QCar2 Dashboard
        </h1>
      </div>
      <div className="flex items-center gap-4 font-mono text-[11px] text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Activity size={12} className={connected ? "text-hud-success" : "text-hud-danger"} />
          <span>{connected ? "ROS2 Connected" : "ROS2 Offline"}</span>
        </div>
        <span className="text-foreground/50">{host}</span>
        <span className="text-foreground tabular-nums">
          {time.toLocaleTimeString("en-US", { hour12: false })}
        </span>
        <ConnectionPanel />
      </div>
    </header>
  );
};

export default HeaderBar;

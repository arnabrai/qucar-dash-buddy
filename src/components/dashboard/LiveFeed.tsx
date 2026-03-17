import { Video } from "lucide-react";
import SensorCard from "./SensorCard";

const LiveFeed = () => {
  return (
    <SensorCard title="Camera Feed" icon={<Video size={14} />} status="online">
      <div className="relative w-full aspect-video rounded bg-muted overflow-hidden flex items-center justify-center">
        <div className="hud-grid-bg absolute inset-0" />
        <div className="relative z-10 flex flex-col items-center gap-2 text-muted-foreground">
          <Video size={32} className="text-primary opacity-50" />
          <span className="font-mono text-xs">RGBD STREAM — 640×480 @ 30fps</span>
          <span className="font-mono text-[10px] text-primary">● LIVE</span>
        </div>
        {/* HUD overlay corners */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-primary/40" />
        <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-primary/40" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-primary/40" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-primary/40" />
      </div>
    </SensorCard>
  );
};

export default LiveFeed;

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface SensorCardProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  status?: "online" | "warning" | "offline";
}

const statusColors = {
  online: "bg-hud-success",
  warning: "bg-hud-warn",
  offline: "bg-hud-danger",
};

const SensorCard = ({ title, icon, children, status = "online" }: SensorCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg bg-card hud-border hud-glow p-4 flex flex-col gap-3"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-primary font-mono text-xs uppercase tracking-widest">
          {icon}
          <span>{title}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className={`w-1.5 h-1.5 rounded-full ${statusColors[status]} animate-pulse`} />
          <span className="font-mono text-[10px] text-muted-foreground uppercase">{status}</span>
        </div>
      </div>
      <div className="flex-1">{children}</div>
    </motion.div>
  );
};

export default SensorCard;

import { Wifi, WifiOff, Loader2 } from "lucide-react";
import { useRos } from "@/hooks/useRosBridge";
import { useState } from "react";

const ConnectionPanel = () => {
  const { connected, connecting, error, connect, disconnect, url } = useRos();
  const [inputUrl, setInputUrl] = useState(url);
  const [open, setOpen] = useState(false);

  const handleConnect = () => {
    connect(inputUrl);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 font-mono text-[11px] px-2 py-1 rounded hud-border transition-colors hover:bg-secondary"
      >
        {connected ? (
          <Wifi size={12} className="text-hud-success" />
        ) : connecting ? (
          <Loader2 size={12} className="text-hud-warn animate-spin" />
        ) : (
          <WifiOff size={12} className="text-hud-danger" />
        )}
        <span className={connected ? "text-hud-success" : "text-muted-foreground"}>
          {connected ? "Connected" : connecting ? "Connecting..." : "Disconnected"}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-card hud-border rounded-lg p-4 z-50 shadow-xl">
          <div className="font-mono text-xs text-muted-foreground uppercase tracking-wider mb-3">
            ROS2 Bridge Connection
          </div>

          <div className="space-y-3">
            <div>
              <label className="font-mono text-[10px] text-muted-foreground uppercase">WebSocket URL</label>
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="ws://192.168.2.10:9090"
                className="w-full mt-1 bg-muted rounded px-3 py-2 font-mono text-xs text-foreground border-none outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {error && (
              <div className="font-mono text-[11px] text-hud-danger">{error}</div>
            )}

            <div className="flex gap-2">
              {connected ? (
                <button
                  onClick={disconnect}
                  className="flex-1 font-mono text-xs py-1.5 rounded bg-hud-danger/20 text-hud-danger hud-border hover:bg-hud-danger/30 transition-colors"
                >
                  Disconnect
                </button>
              ) : (
                <button
                  onClick={handleConnect}
                  disabled={connecting}
                  className="flex-1 font-mono text-xs py-1.5 rounded bg-primary/20 text-primary hud-border hover:bg-primary/30 transition-colors disabled:opacity-50"
                >
                  {connecting ? "Connecting..." : "Connect"}
                </button>
              )}
            </div>

            <div className="font-mono text-[10px] text-muted-foreground space-y-1">
              <div>On your QCar2, run:</div>
              <code className="block bg-muted rounded px-2 py-1.5 text-primary">
                ros2 launch rosbridge_server<br />
                rosbridge_websocket_launch.xml
              </code>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectionPanel;

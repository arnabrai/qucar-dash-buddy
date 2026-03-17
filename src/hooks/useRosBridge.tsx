import { createContext, useContext, useEffect, useRef, useState, useCallback, ReactNode } from "react";

interface RosBridgeMessage {
  op: string;
  topic?: string;
  type?: string;
  msg?: any;
  id?: string;
}

interface RosContextType {
  connected: boolean;
  connecting: boolean;
  error: string | null;
  connect: (url: string) => void;
  disconnect: () => void;
  subscribe: (topic: string, type: string, callback: (msg: any) => void) => () => void;
  url: string;
}

const RosContext = createContext<RosContextType | null>(null);

export const useRos = () => {
  const ctx = useContext(RosContext);
  if (!ctx) throw new Error("useRos must be used within RosProvider");
  return ctx;
};

export const useRosTopic = <T = any>(topic: string, type: string, fallback: T): T => {
  const { subscribe, connected } = useRos();
  const [data, setData] = useState<T>(fallback);

  useEffect(() => {
    if (!connected) return;
    const unsub = subscribe(topic, type, (msg) => setData(msg));
    return unsub;
  }, [topic, type, connected, subscribe]);

  return data;
};

export const RosProvider = ({ children }: { children: ReactNode }) => {
  const wsRef = useRef<WebSocket | null>(null);
  const subscribersRef = useRef<Map<string, Set<(msg: any) => void>>>(new Map());
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [url, setUrl] = useState(() => localStorage.getItem("qcar2_ros_url") || "ws://192.168.2.10:9090");

  const connect = useCallback((newUrl: string) => {
    // Cleanup old connection
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    setUrl(newUrl);
    localStorage.setItem("qcar2_ros_url", newUrl);
    setConnecting(true);
    setError(null);

    const ws = new WebSocket(newUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      setConnecting(false);
      setError(null);

      // Re-subscribe to all active topics
      subscribersRef.current.forEach((_, topic) => {
        // We store type in the key as topic::type
      });
    };

    ws.onmessage = (event) => {
      try {
        const data: RosBridgeMessage = JSON.parse(event.data);
        if (data.op === "publish" && data.topic) {
          const callbacks = subscribersRef.current.get(data.topic);
          callbacks?.forEach((cb) => cb(data.msg));
        }
      } catch (e) {
        console.error("Failed to parse rosbridge message:", e);
      }
    };

    ws.onerror = () => {
      setError("Connection failed");
      setConnecting(false);
    };

    ws.onclose = () => {
      setConnected(false);
      setConnecting(false);
    };
  }, []);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setConnected(false);
  }, []);

  const subscribe = useCallback((topic: string, type: string, callback: (msg: any) => void) => {
    // Add to subscribers
    if (!subscribersRef.current.has(topic)) {
      subscribersRef.current.set(topic, new Set());
    }
    subscribersRef.current.get(topic)!.add(callback);

    // Send subscribe message
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const msg: RosBridgeMessage = {
        op: "subscribe",
        topic,
        type,
        id: `sub_${topic}_${Date.now()}`,
      };
      wsRef.current.send(JSON.stringify(msg));
    }

    // Return unsubscribe function
    return () => {
      const subs = subscribersRef.current.get(topic);
      if (subs) {
        subs.delete(callback);
        if (subs.size === 0) {
          subscribersRef.current.delete(topic);
          // Send unsubscribe
          if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ op: "unsubscribe", topic }));
          }
        }
      }
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      wsRef.current?.close();
    };
  }, []);

  return (
    <RosContext.Provider value={{ connected, connecting, error, connect, disconnect, subscribe, url }}>
      {children}
    </RosContext.Provider>
  );
};

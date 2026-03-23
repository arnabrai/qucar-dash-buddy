import sys
import time
import cv2

from config import AppConfig
from hardware.camera_manager import CameraManager
from hardware.safety_monitor import SafetyMonitor
from hardware.car_controller import CarController
from perception.lane_cv import LaneDetector
from control.pid_controller import PIDController

class Supervisor:
    def __init__(self, preview_mode=False):
        self.cfg = AppConfig()
        self.preview_mode = preview_mode
        self.running = True
        self.autonomous = False
        
        print("[Supervisor] Initializing subsystem drivers...")
        self.camera = CameraManager(self.cfg)
        self.safety = SafetyMonitor(self.cfg)
        self.car = CarController(self.cfg)
        
        self.perception = LaneDetector(self.cfg)
        self.controller = PIDController(self.cfg)

    def print_menu(self):
        print("\n" + "="*40)
        print(" 🚗 QCar2 Autonomous Lane Following  🚗 ")
        print("="*40)
        print(f" Mode: {'[PREVIEW] Motors DISABLED' if self.preview_mode else '[LIVE] Motors ENABLED'}")
        print("\n Controls (Focus OpenCV Window):")
        print("  [a] - Start Autonomous Driving")
        print("  [s] - Stop Car (Manual Override)")
        print("  [q] - Quit & Shutdown Hardware")
        print("="*40 + "\n")

    def run(self):
        # 1. Hardware Initialization Sequence
        try:
            self.camera.initialize()
            self.safety.initialize()
            self.car.initialize()
        except Exception as e:
            print(f"[FATAL] Failed to initialize hardware: {e}")
            self.shutdown()
            return
            
        print("[Supervisor] All systems nominal. Starting main loop.")
        self.print_menu()
        
        fps_counter = 0
        fps_start = time.time()
        fps_display = 0.0

        obstacle_cleared_frames = 0
        was_blocked = False

        try:
            while self.running:
                loop_start = time.time()

                # --- 1. Perception Step ---
                frame = self.camera.get_frame()
                if frame is None:
                    print("[Supervisor] Warning: Dropped or empty frame.")
                    time.sleep(0.01)
                    continue
                
                error, hud = self.perception.process_frame(frame)

                # --- 2. Safety / LiDAR Step ---
                is_clear, dist = self.safety.is_path_clear()

                # --- 3. Control & Arbitration Step ---
                if not is_clear:
                    # Obstacle Detected -> Immediate Stop
                    self.car.stop()
                    self.controller.reset_state()
                    was_blocked = True
                    cv2.putText(hud, f"!!! OBSTACLE {dist:.2f}m !!!", (180, 250), 
                                cv2.FONT_HERSHEY_SIMPLEX, 1.2, (0, 0, 255), 4)
                    
                else:
                    if was_blocked:
                        # Obstacle just cleared -> Wait N frames before resuming
                        obstacle_cleared_frames += 1
                        if obstacle_cleared_frames < self.cfg.safety.resume_time_frames:
                            self.car.stop()
                            cv2.putText(hud, f"CLEARING ({obstacle_cleared_frames}/{self.cfg.safety.resume_time_frames})", 
                                        (280, 250), cv2.FONT_HERSHEY_SIMPLEX, 1.2, (0, 255, 255), 4)
                        else:
                            was_blocked = False
                            obstacle_cleared_frames = 0
                    
                    if not was_blocked:
                        # Path is clear, are we autonomous?
                        if self.autonomous and not self.preview_mode:
                            dt = max(time.time() - loop_start, 0.01) # Avoid div by zero
                            steering = self.controller.compute(error, dt)
                            self.car.drive(self.cfg.control.base_speed, steering)
                            
                            status_text = f"AUTO [Spd:{self.cfg.control.base_speed:.2f} Str:{steering:+.2f}]"
                            cv2.putText(hud, status_text, (380, 40), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)
                        else:
                            self.car.stop()
                            status_text = "PREVIEW [MOTORS OFF]" if self.preview_mode else "MANUAL [Press 'a']"
                            cv2.putText(hud, status_text, (380, 40), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 255), 2)

                # --- 4. Diagnostics & Display ---
                fps_counter += 1
                if time.time() - fps_start >= 1.0:
                    fps_display = fps_counter / (time.time() - fps_start)
                    fps_counter = 0
                    fps_start = time.time()

                cv2.putText(hud, f"FPS: {fps_display:.1f}", (20, 160), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
                cv2.imshow("QCar2 Perception & Control", hud)
                
                # --- 5. Input Handling ---
                key = cv2.waitKey(1) & 0xFF
                if key == ord('q'):
                    print("\n[Supervisor] 'q' pressed. Initiating shutdown...")
                    self.running = False
                elif key == ord('a'):
                    if not self.autonomous:
                        print("[Supervisor] --> Autonomous Mode ENGAGED <--")
                    self.autonomous = True
                    self.controller.reset_state()
                elif key == ord('s'):
                    if self.autonomous:
                        print("[Supervisor] --> Autonomous Mode DISABLED <--")
                    self.autonomous = False
                    self.car.stop()

        except KeyboardInterrupt:
            print("\n[Supervisor] Caught KeyboardInterrupt (Ctrl+C). Shutting down...")
        except Exception as e:
            print(f"\n[Supervisor] FATAL Loop Error: {e}")
            import traceback
            traceback.print_exc()
        finally:
            self.shutdown()

    def shutdown(self):
        print("\n[Supervisor] Shutting down all hardware...")
        try:
            cv2.destroyAllWindows()
        except: pass
        self.car.terminate()
        self.safety.terminate()
        self.camera.terminate()
        print("[Supervisor] Shutdown complete. Goodbye!")

if __name__ == "__main__":
    is_preview = "--preview" in sys.argv
    app = Supervisor(preview_mode=is_preview)
    app.run()

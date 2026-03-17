import HeaderBar from "@/components/dashboard/HeaderBar";
import LiveFeed from "@/components/dashboard/LiveFeed";
import LidarDisplay from "@/components/dashboard/LidarDisplay";
import IMUDisplay from "@/components/dashboard/IMUDisplay";
import VehicleStatus from "@/components/dashboard/VehicleStatus";
import EncoderDisplay from "@/components/dashboard/EncoderDisplay";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col hud-grid-bg">
      <HeaderBar />
      <main className="flex-1 p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-[1400px] mx-auto">
          {/* Left column: Camera feed */}
          <div className="lg:col-span-2">
            <LiveFeed />
          </div>

          {/* Right column: Vehicle + LIDAR */}
          <div className="flex flex-col gap-4">
            <VehicleStatus />
            <LidarDisplay />
          </div>

          {/* Bottom row */}
          <div className="lg:col-span-2">
            <IMUDisplay />
          </div>
          <div>
            <EncoderDisplay />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;

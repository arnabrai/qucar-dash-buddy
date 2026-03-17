import HeaderBar from "@/components/dashboard/HeaderBar";
import LiveFeed from "@/components/dashboard/LiveFeed";
import DepthCamera from "@/components/dashboard/DepthCamera";
import LidarDisplay from "@/components/dashboard/LidarDisplay";
import IMUDisplay from "@/components/dashboard/IMUDisplay";
import VehicleStatus from "@/components/dashboard/VehicleStatus";
import EncoderDisplay from "@/components/dashboard/EncoderDisplay";
import LocalizationMap from "@/components/dashboard/LocalizationMap";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col hud-grid-bg">
      <HeaderBar />
      <main className="flex-1 p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-[1600px] mx-auto">
          {/* Row 1: RGB + Depth feeds */}
          <div className="lg:col-span-1">
            <LiveFeed />
          </div>
          <div className="lg:col-span-1">
            <DepthCamera />
          </div>
          <div className="lg:col-span-1">
            <VehicleStatus />
          </div>

          {/* Row 2: Localization + LIDAR + IMU */}
          <div>
            <LocalizationMap />
          </div>
          <div>
            <LidarDisplay />
          </div>
          <div className="flex flex-col gap-4">
            <IMUDisplay />
            <EncoderDisplay />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;

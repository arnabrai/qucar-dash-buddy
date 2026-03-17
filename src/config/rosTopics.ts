// QCar2 ROS2 topic configuration
// Update these to match your QCar2's actual topic names and message types

export const ROS_TOPICS = {
  // Camera feeds
  RGB_CAMERA: { topic: "/qcar2/camera/rgb/image_raw", type: "sensor_msgs/msg/Image" },
  DEPTH_CAMERA: { topic: "/qcar2/camera/depth/image_raw", type: "sensor_msgs/msg/Image" },

  // LIDAR
  LIDAR_SCAN: { topic: "/qcar2/lidar/scan", type: "sensor_msgs/msg/LaserScan" },

  // IMU
  IMU: { topic: "/qcar2/imu", type: "sensor_msgs/msg/Imu" },

  // Odometry / Localization
  ODOM: { topic: "/qcar2/odom", type: "nav_msgs/msg/Odometry" },

  // Wheel encoders
  ENCODERS: { topic: "/qcar2/encoders", type: "std_msgs/msg/Int32MultiArray" },

  // Vehicle state
  BATTERY: { topic: "/qcar2/battery", type: "sensor_msgs/msg/BatteryState" },
  VELOCITY: { topic: "/qcar2/cmd_vel", type: "geometry_msgs/msg/Twist" },
} as const;

"use client";

import { motion } from "motion/react";
import { useState } from "react";
import {
  FaStar,
  FaGift,
  FaBirthdayCake,
  FaCrown,
  FaGem,
  FaRocket,
  FaSun,
  FaMoon,
  FaCircle,
} from "react-icons/fa";
import ClickSpark from "@/components/ClickSpark";

// Định nghĩa type cho icon data
type IconData = {
  icon: React.ComponentType<{ className?: string }>;
  color: string;
};

// Hàm helper tạo dữ liệu icon bay lên (bên ngoài component để tránh lỗi Math.random)
function createFloatingIcons() {
  // Danh sách các icon với màu sắc đa dạng
  const iconList: IconData[] = [
    { icon: FaStar, color: "#FFD700" }, // Gold
    { icon: FaGift, color: "#FF69B4" }, // Hot pink
    { icon: FaBirthdayCake, color: "#FFB6C1" }, // Light pink
    { icon: FaCrown, color: "#FFD700" }, // Gold
    { icon: FaGem, color: "#9370DB" }, // Medium purple
    { icon: FaRocket, color: "#00CED1" }, // Dark turquoise
    { icon: FaSun, color: "#FFA500" }, // Orange
    { icon: FaMoon, color: "#9370DB" }, // Medium purple
    { icon: FaCircle, color: "#FF69B4" }, // Hot pink
    { icon: FaStar, color: "#FFD700" }, // Gold
    { icon: FaGift, color: "#FF69B4" }, // Hot pink
    { icon: FaGem, color: "#FF6347" }, // Tomato
  ];

  const totalIcons = 60; // Tăng số lượng icon để đảm bảo liên tục
  const duration = 20; // Duration cố định để tốc độ đều
  const delayInterval = duration / totalIcons; // Khoảng cách delay giữa các icon

  return Array.from({ length: totalIcons }, (_, i) => {
    const iconData = iconList[Math.floor(Math.random() * iconList.length)];
    return {
      id: i,
      delay: i * delayInterval, // Delay phân bố đều đặn
      x: Math.random() * 100, // Vị trí ngang ngẫu nhiên
      duration: duration, // Duration cố định
      Icon: iconData.icon,
      color: iconData.color,
      size: 24 + Math.random() * 16, // Kích thước từ 24-40px
    };
  });
}

// Component icon bay lên
function FloatingIcon({
  delay,
  x,
  duration,
  Icon,
  color,
  size,
}: {
  delay: number;
  x: number;
  duration: number;
  Icon: React.ComponentType<{ className?: string }>;
  color: string;
  size: number;
}) {
  return (
    <motion.div
      className="absolute"
      style={{
        color: color,
        fontSize: `${size}px`,
      }}
      initial={{
        x: `${x}vw`,
        y: "100vh",
        opacity: 0,
        rotate: 0,
      }}
      animate={{
        y: "-10vh",
        opacity: [0, 1, 1, 0],
        x: `${x}vw`,
        rotate: [0, 360],
      }}
      transition={{
        duration: duration,
        delay: delay,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      <Icon className="drop-shadow-lg" />
    </motion.div>
  );
}

export default function Home() {
  // Tạo danh sách icon bay lên (chỉ tạo một lần khi mount)
  const [floatingIcons] = useState(() => createFloatingIcons());

  return (
    <ClickSpark sparkColor="#ff4500" sparkCount={10} extraScale={1.8}>
      <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-sky-200 via-pink-100 to-purple-200">
        {/* Các icon bay lên */}
        {floatingIcons.map((item) => (
          <FloatingIcon
            key={item.id}
            delay={item.delay}
            x={item.x}
            duration={item.duration}
            Icon={item.Icon}
            color={item.color}
            size={item.size}
          />
        ))}

        {/* Nội dung - bạn có thể thêm nội dung của mình ở đây */}
        <main className="relative z-10 flex min-h-screen items-center justify-center"></main>
      </div>
    </ClickSpark>
  );
}

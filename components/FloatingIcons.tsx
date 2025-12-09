"use client";

import { motion } from "motion/react";
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
import { useState } from "react";

type IconData = {
  icon: React.ComponentType<{ className?: string }>;
  color: string;
};

function createFloatingIcons() {
  const iconList: IconData[] = [
    { icon: FaStar, color: "#FFD700" }, // Gold
    { icon: FaGift, color: "#FF69B4" }, // Hot pink
    { icon: FaBirthdayCake, color: "#FFB6C1" }, // Light pink
    { icon: FaCrown, color: "#FFD700" }, // Gold
    { icon: FaGem, color: "#9370DB" }, // Medium purple
    { icon: FaRocket, color: "#00CED1" }, // Dark turquoise
    { icon: FaSun, color: "#FFA500" }, // Orange
    { icon: FaMoon, color: "#9370DB" }, // Medium purple
    { icon: FaStar, color: "#FFD700" }, // Gold
    { icon: FaGift, color: "#FF69B4" }, // Hot pink
    { icon: FaGem, color: "#FF6347" }, // Tomato
  ];

  const totalIcons = 30;
  const duration = 20;
  const delayInterval = duration / totalIcons;

  return Array.from({ length: totalIcons }, (_, i) => {
    const iconData = iconList[Math.floor(Math.random() * iconList.length)];
    return {
      id: i,
      delay: i * delayInterval,
      x: Math.random() * 100,
      duration,
      Icon: iconData.icon,
      color: iconData.color,
      size: 24 + Math.random() * 16,
    };
  });
}

type FloatingIconProps = {
  delay: number;
  x: number;
  duration: number;
  Icon: React.ComponentType<{ className?: string }>;
  color: string;
  size: number;
};

function FloatingIcon({
  delay,
  x,
  duration,
  Icon,
  color,
  size,
}: FloatingIconProps) {
  return (
    <motion.div
      className="absolute"
      style={{
        color,
        fontSize: `${size}px`,
      }}
      initial={{
        x: `${x}vw`,
        y: "-10vh",
        opacity: 0,
        rotate: 0,
      }}
      animate={{
        y: "100vh",
        opacity: [0, 1, 1, 0],
        x: `${x}vw`,
        rotate: [0, -360],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      <Icon className="drop-shadow-lg" />
    </motion.div>
  );
}

export default function FloatingIconsField() {
  const [floatingIcons] = useState(() => createFloatingIcons());

  return (
    <>
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
    </>
  );
}

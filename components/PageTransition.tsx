"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

type PageTransitionProps = {
  children: React.ReactNode;
  isActive: boolean;
};

export default function PageTransition({
  children,
  isActive,
}: PageTransitionProps) {
  const [showContent, setShowContent] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [phase, setPhase] = useState<"closing" | "opening" | "none">("none");

  useEffect(() => {
    if (isActive) {
      // Phase 1: Đóng vào (che màn hình cũ) - 600ms
      setIsTransitioning(true);
      setPhase("closing");
      setShowContent(true); // Giữ nội dung hiển thị trong lúc đóng vào
      
      // Sau 600ms (đóng vào xong) + 1000ms delay, chuyển sang phase 2: Mở ra
      const timer1 = setTimeout(() => {
        // Không cần setShowContent(false) vì nội dung đã được thay đổi ở TransitionWrapper
        setPhase("opening");
        
        // Sau khi mở ra xong (600ms nữa), reset trạng thái
        const timer2 = setTimeout(() => {
          setIsTransitioning(false);
          setPhase("none");
        }, 600);
        
        return () => clearTimeout(timer2);
      }, 600 + 1000); // 600ms đóng vào + 1000ms delay để đảm bảo trang tiếp theo đã ready
      
      return () => clearTimeout(timer1);
    } else {
      setShowContent(true);
      setIsTransitioning(false);
      setPhase("none");
    }
  }, [isActive]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Transition overlay - 2 nửa màn hình đóng chéo */}
      {isTransitioning && (
        <>
          {/* Nửa trên trái - tam giác từ góc trên trái */}
          <motion.div
            key="part-top-left"
            className="absolute top-0 left-0 w-full h-full bg-white z-[9999]"
            initial={{
              clipPath: "polygon(0 0, 0 0, 0 0, 0 0)",
            }}
            animate={phase === "closing" ? {
              clipPath: "polygon(0 0, 100% 0, 0 100%, 0 100%)",
            } : phase === "opening" ? {
              clipPath: "polygon(0 0, 0 0, 0 0, 0 0)",
            } : {
              clipPath: "polygon(0 0, 0 0, 0 0, 0 0)",
            }}
            transition={{ 
              duration: 0.6,
              ease: "easeInOut"
            }}
          />
          {/* Nửa dưới phải - tam giác từ góc dưới phải */}
          <motion.div
            key="part-bottom-right"
            className="absolute top-0 left-0 w-full h-full bg-white z-[9999]"
            initial={{
              clipPath: "polygon(100% 100%, 100% 100%, 100% 100%, 100% 100%)",
            }}
            animate={phase === "closing" ? {
              clipPath: "polygon(100% 100%, 0 100%, 100% 0, 100% 100%)",
            } : phase === "opening" ? {
              clipPath: "polygon(100% 100%, 100% 100%, 100% 100%, 100% 100%)",
            } : {
              clipPath: "polygon(100% 100%, 100% 100%, 100% 100%, 100% 100%)",
            }}
            transition={{ 
              duration: 0.6,
              ease: "easeInOut"
            }}
          />
        </>
      )}

      {/* Nội dung */}
      <div className={`relative z-0 ${showContent ? "block" : "opacity-0"}`}>
        {children}
      </div>
    </div>
  );
}


"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import Image from "next/image";

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
      {isTransitioning && ( //isTransitioning
        <>
          {/* Avatar và text ở giữa màn hình - ẩn đi khi bắt đầu phase opening */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[10000] flex flex-col items-center gap-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={
              phase === "opening"
                ? { opacity: 0, scale: 0.8 }
                : { opacity: 1, scale: 1 }
            }
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* Avatar tròn */}
            <div className="relative w-30 h-30 rounded-full overflow-hidden border-4 border-white shadow-2xl">
              <Image
                src="/avt1.jpg"
                alt="Avatar"
                fill
                className="object-cover"
                style={{
                  objectPosition: "10% 30%",
                  transform: "scale(2.0) translateX(0%) translateY(-10%)",
                }}
                priority
              />
            </div>
            {/* Text bên dưới */}
            <motion.p
              className="text-sm font-medium text-gray-700 whitespace-nowrap"
              initial={{ opacity: 0, y: 10 }}
              animate={
                phase === "opening"
                  ? { opacity: 0, y: 10 }
                  : { opacity: 1, y: 0 }
              }
              transition={{
                duration: 0.3,
                delay: phase === "opening" ? 0 : 0.2,
              }}
            >
              made by Trần Anh Tuấn
            </motion.p>
          </motion.div>

          {/* Nửa trên trái - tam giác từ góc trên trái */}
          <motion.div
            key="part-top-left"
            className="absolute top-0 left-0 w-full h-full bg-white z-[9999]"
            initial={{
              clipPath: "polygon(0 0, 0 0, 0 0, 0 0)",
            }}
            animate={
              phase === "closing"
                ? {
                    clipPath: "polygon(0 0, 100% 0, 0 100%, 0 100%)",
                  }
                : phase === "opening"
                ? {
                    clipPath: "polygon(0 0, 0 0, 0 0, 0 0)",
                  }
                : {
                    clipPath: "polygon(0 0, 0 0, 0 0, 0 0)",
                  }
            }
            transition={{
              duration: 0.6,
              ease: "easeInOut",
            }}
          />
          {/* Nửa dưới phải - tam giác từ góc dưới phải */}
          <motion.div
            key="part-bottom-right"
            className="absolute top-0 left-0 w-full h-full bg-white z-[9999]"
            initial={{
              clipPath: "polygon(100% 100%, 100% 100%, 100% 100%, 100% 100%)",
            }}
            animate={
              phase === "closing"
                ? {
                    clipPath: "polygon(100% 100%, 0 100%, 100% 0, 100% 100%)",
                  }
                : phase === "opening"
                ? {
                    clipPath:
                      "polygon(100% 100%, 100% 100%, 100% 100%, 100% 100%)",
                  }
                : {
                    clipPath:
                      "polygon(100% 100%, 100% 100%, 100% 100%, 100% 100%)",
                  }
            }
            transition={{
              duration: 0.6,
              ease: "easeInOut",
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

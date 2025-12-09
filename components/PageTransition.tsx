"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "motion/react";
import Image from "next/image";

type PageTransitionProps = {
  children: React.ReactNode;
  mode: "closing" | "opening" | "closed" | "none";
};

export default function PageTransition({
  children,
  mode,
}: PageTransitionProps) {
  const [showContent, setShowContent] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(
    mode === "closed" || mode === "closing"
  ); // Khởi tạo dựa trên mode ban đầu
  const [phase, setPhase] = useState<"closing" | "opening" | "closed" | "none">(
    mode === "closed" ? "closed" : "none"
  ); // Khởi tạo dựa trên mode ban đầu
  const [hasShownInitialAvatar, setHasShownInitialAvatar] = useState(false); // Track xem đã hiển thị avatar lần đầu chưa
  const isFirstMountRef = useRef(true); // Track xem đây có phải là lần mount đầu tiên không

  useEffect(() => {
    if (mode === "closing") {
      // Phase đóng: che màn hình
      setIsTransitioning(true);
      setPhase("closing");
      setShowContent(true);

      // Sau khi đóng xong (800ms), chuyển sang trạng thái đóng hoàn toàn
      const timer = setTimeout(() => {
        setPhase("closed");
        setIsTransitioning(true); // Giữ overlay hiển thị
      }, 800);

      return () => clearTimeout(timer);
    } else if (mode === "closed") {
      // Trạng thái đóng hoàn toàn: overlay che màn hình
      setIsTransitioning(true);
      setPhase("closed");
      setShowContent(true);
    } else if (mode === "opening") {
      // Phase mở: mở ra từ trạng thái đóng
      setIsTransitioning(true);
      setPhase("opening");
      setShowContent(true);

      // Sau khi mở xong (800ms), reset
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setPhase("none");
      }, 800);

      return () => clearTimeout(timer);
    } else {
      // Không có transition
      setShowContent(true);
      setIsTransitioning(false);
      setPhase("none");
    }
  }, [mode]);

  // Đánh dấu đã hiển thị avatar sau khi phase chuyển sang "opening" (tức là đã hiển thị xong)
  useEffect(() => {
    if (
      phase === "opening" &&
      isFirstMountRef.current &&
      !hasShownInitialAvatar
    ) {
      setHasShownInitialAvatar(true);
      isFirstMountRef.current = false;
    }
  }, [phase, hasShownInitialAvatar]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Transition overlay - 2 nửa màn hình đóng chéo */}
      {isTransitioning && ( //isTransitioning
        <>
          {/* Avatar và text ở giữa màn hình - chỉ hiển thị khi load trang lần đầu */}
          {!hasShownInitialAvatar &&
            (phase === "closed" || phase === "closing") && (
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[10000] flex flex-col items-center gap-4"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={
                  phase === "closed"
                    ? { opacity: 1, scale: 1 }
                    : { opacity: 0, scale: 0.8 }
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
                    phase === "closed"
                      ? { opacity: 1, y: 0 }
                      : { opacity: 0, y: 10 }
                  }
                  transition={{
                    duration: 0.3,
                    delay: phase === "closed" ? 0.2 : 0,
                  }}
                >
                  made by Trần Anh Tuấn
                </motion.p>
              </motion.div>
            )}

          {/* Nửa trên trái - tam giác từ góc trên trái */}
          <motion.div
            key={`part-top-left-${phase}`}
            className="absolute top-0 left-0 w-full h-full bg-white z-[9999]"
            initial={
              phase === "opening"
                ? {
                    clipPath: "polygon(0 0, 100% 0, 0 100%, 0 100%)",
                  }
                : phase === "closed"
                ? {
                    clipPath: "polygon(0 0, 100% 0, 0 100%, 0 100%)",
                  }
                : {
                    clipPath: "polygon(0 0, 0 0, 0 0, 0 0)",
                  }
            }
            animate={
              phase === "closing" || phase === "closed"
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
              duration: 0.8,
              ease: "easeInOut",
            }}
          />
          {/* Nửa dưới phải - tam giác từ góc dưới phải */}
          <motion.div
            key={`part-bottom-right-${phase}`}
            className="absolute top-0 left-0 w-full h-full bg-white z-[9999]"
            initial={
              phase === "opening"
                ? {
                    clipPath: "polygon(100% 100%, 0 100%, 100% 0, 100% 100%)",
                  }
                : phase === "closed"
                ? {
                    clipPath: "polygon(100% 100%, 0 100%, 100% 0, 100% 100%)",
                  }
                : {
                    clipPath:
                      "polygon(100% 100%, 100% 100%, 100% 100%, 100% 100%)",
                  }
            }
            animate={
              phase === "closing" || phase === "closed"
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
              duration: 0.8,
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

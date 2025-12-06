"use client";

import Lottie, { LottieRefCurrentProps } from "lottie-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

type Phase = 1 | 2 | 3;

export default function CuteDoggie() {
  const [animationData, setAnimationData] = useState(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [phase, setPhase] = useState<Phase>(1);
  const [isDeleting, setIsDeleting] = useState(false);
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/Cute Doggie.json")
      .then((res) => res.json())
      .then((data) => setAnimationData(data))
      .catch((err) => console.error("Error loading animation:", err));
  }, []);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const parent = containerRef.current.parentElement;
        if (parent) {
          setContainerWidth(parent.offsetWidth || window.innerWidth);
        } else {
          // Fallback nếu không tìm thấy parent
          setContainerWidth(window.innerWidth);
        }
      } else {
        // Fallback khi component chưa mount
        setContainerWidth(window.innerWidth);
      }
    };

    // Cập nhật ngay lập tức
    updateWidth();

    // Đợi một chút để đảm bảo DOM đã render
    const timeout = setTimeout(updateWidth, 100);

    window.addEventListener("resize", updateWidth);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("resize", updateWidth);
    };
  }, []);

  // Giữ nguyên kích thước con chó
  const dogWidth = 200;
  const maxX = Math.max(0, containerWidth - dogWidth);

  // Xử lý click vào con chó
  const handleDogClick = () => {
    if (phase === 1) {
      setPhase(2);
    }
  };

  // Xử lý hiệu ứng xóa text
  useEffect(() => {
    if (phase === 2) {
      // Sau 2 giây, bắt đầu xóa
      const deleteTimeout = setTimeout(() => {
        setIsDeleting(true);
        // Sau khi xóa xong (1 giây), chuyển sang phase 3
        setTimeout(() => {
          setIsDeleting(false);
          setPhase(3);
        }, 1000);
      }, 2000);
      return () => clearTimeout(deleteTimeout);
    }
  }, [phase]);

  // Nội dung text theo phase
  const getChatText = () => {
    if (phase === 1) {
      return "Bấm vào tớ nè";
    } else if (phase === 2) {
      return isDeleting ? "" : "abc";
    } else {
      return "xyz";
    }
  };

  // Làm chậm animation - tăng duration
  // 30 giây cho 1920px, tỷ lệ với chiều rộng
  const baseWidth = 1920;
  const baseDuration = 40; // Tăng từ 20 lên 30 để chậm hơn nữa
  const duration =
    containerWidth > 0
      ? (containerWidth / baseWidth) * baseDuration
      : baseDuration;

  if (!animationData || containerWidth === 0 || maxX <= 0) return null;

  return (
    <div
      ref={containerRef}
      className="absolute bottom-0 left-0 right-0 z-15 pointer-events-none"
    >
      {/* Ô chat trên đầu con chó - không bị flip, di chuyển cùng con chó */}
      <motion.div
        className="absolute -bottom-5 z-20"
        animate={{
          x: [0, maxX, 0], // Di chuyển cùng với con chó
        }}
        transition={{
          duration: duration,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          width: dogWidth, // Cùng chiều rộng với con chó để căn giữa đúng
        }}
      >
        <motion.div
          className="absolute -top-50 left-1/2 -translate-x-1/2"
          animate={{
            y: [0, -5, 0], // Hiệu ứng nhẹ nhàng lên xuống
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="relative bg-white rounded-lg px-4 py-2 shadow-lg border-2 border-pink-300">
            <motion.p
              className="text-sm font-semibold text-pink-600 whitespace-nowrap"
              animate={{
                opacity: isDeleting ? [1, 0] : 1,
                scale: isDeleting ? [1, 0.8] : 1,
              }}
              transition={{
                duration: isDeleting ? 1 : 0,
                ease: "easeInOut",
              }}
            >
              {getChatText()}
            </motion.p>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full">
              <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-pink-300"></div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Con chó với flip */}
      <motion.div
        className="absolute -bottom-5 z-15 cursor-pointer"
        style={{ pointerEvents: "auto" }}
        animate={{
          x: [0, maxX, 0],
          scaleX: [-1, -1, 1, 1, -1], // -1 để quay sang phải, 1 để quay sang trái
        }}
        transition={{
          duration: duration,
          repeat: Infinity,
          ease: "linear",
          times: [0, 0.49, 0.5, 0.99, 1],
        }}
        onClick={handleDogClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Lottie
          lottieRef={lottieRef}
          animationData={animationData}
          loop={true}
          autoplay={true}
          style={{
            width: dogWidth,
            height: 200, // Giữ nguyên kích thước
          }}
        />
      </motion.div>
    </div>
  );
}

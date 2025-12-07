"use client";

import { Cake } from "lucide-react";
import {
  motion,
  useAnimation,
  useAnimationFrame,
  useMotionValue,
} from "motion/react";
import { useRouter, usePathname } from "next/navigation";
import { type RefObject, useRef, useState, useEffect } from "react";
import { useTransition } from "@/contexts/TransitionContext";

const SLIDE_THRESHOLD = 200;
// Container width = 288px (w-72), nút bắt đầu ở 8px (left-2), nút width = 48px (w-12)
// SLIDE_MAX_DISTANCE = 288 - 8 - 48 = 232px
// Giảm xuống 200px để bánh kem chỉ kéo đến gần cuối, không ra ngoài hẳn
const SLIDE_MAX_DISTANCE = 222;
const PERCENTAGE_MULTIPLIER = 100;
const BUTTON_WIDTH = 48; // w-12
const BUTTON_START_OFFSET = 8; // left-2

// Component particles effect
function ParticlesEffect({
  x,
  threshold,
}: {
  x: ReturnType<typeof useMotionValue<number>>;
  threshold: number;
}) {
  const [showParticles, setShowParticles] = useState(false);
  const [particles] = useState(() =>
    Array.from({ length: 10 }, (_, i) => {
      // Sử dụng một pattern thay vì Math.random để tránh impure function
      const seed = (i * 7 + 13) % 100; // Tạo số giả ngẫu nhiên từ index
      return {
        id: i,
        offsetX: ((seed / 100) * 100 - 50) * (i % 2 === 0 ? 1 : -1),
        delay: i * 0.1,
      };
    })
  );

  useEffect(() => {
    const unsubscribe = x.on("change", (latest) => {
      setShowParticles(latest > threshold);
    });
    return () => unsubscribe();
  }, [x, threshold]);

  if (!showParticles) return null;

  return (
    <div className="absolute inset-0 overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute h-1 w-1 rounded-full bg-white"
          initial={{
            x: x.get(),
            y: "50%",
            opacity: 0,
          }}
          animate={{
            x: x.get() + particle.offsetX,
            y: "50%",
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: particle.delay,
          }}
        />
      ))}
    </div>
  );
}

export type PowerOffSlideProps = {
  onPowerOff?: () => void;
  label?: string;
  className?: string;
  duration?: number;
  disabled?: boolean;
  href?: string; // URL để navigate sau khi slide xong
};

export default function PowerOffSlide({
  onPowerOff,
  label = "Đi thổi nến nào",
  className = "",
  duration = 2000,
  disabled = false,
  href,
}: PowerOffSlideProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { triggerTransition } = useTransition();
  const [isPoweringOff, setIsPoweringOff] = useState(false);
  const x = useMotionValue(0);
  const controls = useAnimation();
  const constraintsRef = useRef(null);
  const textRef: RefObject<HTMLDivElement | null> = useRef(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const prevPathnameRef = useRef(pathname);

  // Reset trạng thái khi pathname thay đổi (back/forward)
  useEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      // Reset sau một chút để tránh cascading renders
      const timer = setTimeout(() => {
        setIsPoweringOff(false);
        x.set(0);
        controls.set({ x: 0 });
      }, 0);
      prevPathnameRef.current = pathname;
      return () => clearTimeout(timer);
    }
  }, [pathname, x, controls]);

  // Cập nhật hiệu ứng progress khi slide
  useEffect(() => {
    const unsubscribe = x.on("change", (latest) => {
      if (progressRef.current && constraintsRef.current) {
        const containerWidth = (constraintsRef.current as HTMLElement)
          .offsetWidth;
        // Tính width của progress để bao phủ từ đầu đến vị trí của bánh kem + vượt qua một chút
        // Progress width = (vị trí bắt đầu + x + width của nút + offset) / containerWidth
        const OVERFLOW_OFFSET = 10; // Vượt qua bánh kem 20px
        const progressWidth =
          (BUTTON_START_OFFSET + latest + BUTTON_WIDTH + OVERFLOW_OFFSET) /
          containerWidth;
        const progress = Math.min(progressWidth, 1);
        progressRef.current.style.width = `${progress * 100}%`;
        progressRef.current.style.opacity = `${Math.min(
          latest / SLIDE_MAX_DISTANCE,
          1
        )}`;
      }
    });
    return () => unsubscribe();
  }, [x]);

  useAnimationFrame((t) => {
    const animDuration = duration;
    const progress = (t % animDuration) / animDuration;
    if (textRef.current) {
      textRef.current.style.setProperty(
        "--x",
        `${(1 - progress) * PERCENTAGE_MULTIPLIER}%`
      );
    }
  });

  const handleDragEnd = async () => {
    if (disabled) {
      return;
    }
    const dragDistance = x.get();
    if (dragDistance > SLIDE_THRESHOLD) {
      await controls.start({ x: SLIDE_MAX_DISTANCE });
      setIsPoweringOff(true);

      // Gọi callback nếu có
      if (onPowerOff) {
        onPowerOff();
      }

      // Trigger transition ngay lập tức
      triggerTransition();

      // Navigate sau khi đóng vào xong + delay: đóng vào (800ms) + delay (500ms) = 1300ms
      // Navigate trước khi mở ra để nội dung mới được load
      setTimeout(() => {
        if (href) {
          router.push(href);
        }
      }, 1300);
    } else {
      controls.start({ x: 0 });
    }
  };

  return (
    <div className={`flex h-auto items-center justify-center ${className}`}>
      <div className="w-72">
        <div
          className="relative h-16 overflow-hidden rounded-full border-2 border-white/30 bg-gradient-to-r from-pink-200/80 via-purple-200/80 to-indigo-200/80 backdrop-blur-sm shadow-2xl"
          ref={constraintsRef}
          style={{
            boxShadow:
              "0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
            opacity: 0.85, // Giảm opacity để nhìn thấy các icon phía sau
          }}
        >
          {/* Phần đã slide - với hiệu ứng gradient và glow */}
          <motion.div
            ref={progressRef}
            className="absolute left-0 top-0 z-0 h-full rounded-full bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400"
            style={{
              width: "0%",
              opacity: 0,
              boxShadow:
                "inset 0 0 20px rgba(255, 255, 255, 0.3), 0 0 30px rgba(147, 51, 234, 0.5)",
            }}
          />

          {/* Text label */}
          <div
            className="absolute left-1/2 top-1/2 z-[1] pointer-events-none"
            style={{ transform: "translate(-45%, -50%)" }}
          >
            <div className="select-none text-center font-semibold text-white text-lg drop-shadow-lg whitespace-nowrap">
              {label}
            </div>
          </div>

          {/* Nút Cake với hiệu ứng */}
          <motion.div
            animate={controls}
            aria-disabled={disabled || isPoweringOff}
            className={`absolute top-2 left-2 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-white to-pink-100 shadow-xl ${
              disabled || isPoweringOff
                ? "cursor-not-allowed opacity-50"
                : "cursor-grab active:cursor-grabbing"
            }`}
            drag={disabled || isPoweringOff ? false : "x"}
            dragConstraints={{ left: 0, right: SLIDE_MAX_DISTANCE }}
            dragElastic={0}
            dragMomentum={false}
            onDragEnd={handleDragEnd}
            style={{ x, zIndex: 20 }}
            tabIndex={disabled || isPoweringOff ? -1 : 0}
            whileHover={isPoweringOff ? {} : { scale: 1.05 }}
            whileTap={isPoweringOff ? {} : { scale: 0.95 }}
          >
            <motion.div
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Cake className="text-pink-500" size={28} />
            </motion.div>
          </motion.div>

          {/* Hiệu ứng particles khi slide */}
          {!isPoweringOff && (
            <ParticlesEffect x={x} threshold={SLIDE_THRESHOLD * 0.5} />
          )}
        </div>
      </div>
    </div>
  );
}

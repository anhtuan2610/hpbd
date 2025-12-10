"use client";

import Lottie, { LottieRefCurrentProps } from "lottie-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import TextType from "./TextType";

type Phase = 1 | 2 | 3;

export default function CuteDoggie() {
  const [animationData, setAnimationData] = useState(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [phase, setPhase] = useState<Phase>(1);
  const [textKey, setTextKey] = useState(0); // Key để force re-render TextType
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/Cute Doggie.json")
      .then((res) => res.json())
      .then((data) => setAnimationData(data))
      .catch(() => {});
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
      // Chuyển thẳng sang phase 2, TextType sẽ tự reset và chạy text mới
      setPhase(2);
      setTextKey((prev) => prev + 1);
    }
  };

  // Tự động chuyển từ phase 2 sang phase 3 sau khi typing xong
  useEffect(() => {
    if (phase === 2) {
      // Ước tính thời gian typing: "Há lu, Tuấn nè !" có khoảng 15 ký tự
      // typingSpeed = 50ms, pauseDuration = 1000ms (giảm từ 2000ms)
      // Tổng thời gian: 15 * 50 + 1000 = 1750ms
      const typingTime = "Há lu, Tuấn nè !".length * 50;
      const totalTime = typingTime + 1500; // pauseDuration + thời gian đọc (giảm delay)

      const timeout = setTimeout(() => {
        setPhase(3);
        setTextKey((prev) => prev + 1);
      }, totalTime);

      return () => clearTimeout(timeout);
    }
  }, [phase]);

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
      className="absolute bottom-20 left-0 right-0 z-15 pointer-events-none"
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
          minWidth: dogWidth, // Chiều rộng tối thiểu bằng con chó để căn giữa đúng
        }}
      >
        <div
          className="absolute -top-50 left-1/2 -translate-x-1/2"
          style={{ width: "max-content", maxWidth: "500px" }}
        >
          <div className="relative bg-white rounded-lg px-4 py-2 shadow-lg border-2 border-pink-300">
            {phase === 1 ? (
              <TextType
                key={`phase-1-${textKey}`}
                text="Bấm vào tớ nè"
                as="p"
                className="text-sm font-semibold text-pink-600 break-words"
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  lineHeight: "1.5em",
                  width: "100%",
                }}
                typingSpeed={50}
                pauseDuration={0}
                deletingSpeed={30}
                loop={false}
                showCursor={true}
                variableSpeed={undefined}
                onSentenceComplete={undefined}
              />
            ) : phase === 2 ? (
              <TextType
                key={`phase-2-${textKey}`}
                text="Há lu, Tuấn nè !"
                as="p"
                className="text-sm font-semibold text-pink-600 break-words"
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  lineHeight: "1.5em",
                  wordBreak: "break-word",
                }}
                typingSpeed={50}
                pauseDuration={1500}
                deletingSpeed={30}
                loop={false}
                showCursor={true}
                variableSpeed={undefined}
                onSentenceComplete={undefined}
              />
            ) : (
              <div
                className="text-sm font-semibold text-pink-600 break-words"
                style={{ lineHeight: "1.5em" }}
              >
                <div>
                  <TextType
                    key={`phase-3-line1-${textKey}`}
                    text="Chúc Quyên tuổi mới"
                    as="span"
                    className=""
                    typingSpeed={50}
                    pauseDuration={0}
                    loop={false}
                    showCursor={false}
                    variableSpeed={undefined}
                    onSentenceComplete={undefined}
                  />
                </div>
                <div>
                  <TextType
                    key={`phase-3-line2-${textKey}`}
                    text="hay ăn chóng lớn nhé !"
                    as="span"
                    className=""
                    typingSpeed={50}
                    initialDelay={"Chúc Quyên tuổi mới".length * 50}
                    pauseDuration={3000}
                    loop={false}
                    showCursor={true}
                    variableSpeed={undefined}
                    onSentenceComplete={undefined}
                  />
                </div>
              </div>
            )}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full">
              <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-pink-300"></div>
            </div>
          </div>
        </div>
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

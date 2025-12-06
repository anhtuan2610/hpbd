"use client";

import Lottie, { LottieRefCurrentProps } from "lottie-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

export default function CuteDoggie() {
  const [animationData, setAnimationData] = useState(null);
  const [containerWidth, setContainerWidth] = useState(1920);
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
          setContainerWidth(parent.offsetWidth);
        }
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const dogWidth = 200;
  const maxX = containerWidth - dogWidth;

  if (!animationData) return null;

  return (
    <div
      ref={containerRef}
      className="absolute bottom-0 left-0 right-0 z-15 pointer-events-none"
    >
      <motion.div
        className="absolute -bottom-5 z-15"
        animate={{
          x: [0, maxX, 0],
          scaleX: [-1, -1, 1, 1, -1], // -1 để quay sang phải, 1 để quay sang trái
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear",
          times: [0, 0.49, 0.5, 0.99, 1],
        }}
      >
        <Lottie
          lottieRef={lottieRef}
          animationData={animationData}
          loop={true}
          autoplay={true}
          style={{
            width: dogWidth,
            height: 200,
          }}
        />
      </motion.div>
    </div>
  );
}

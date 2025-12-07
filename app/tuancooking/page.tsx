"use client";

import { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import ClickSpark from "@/components/ClickSpark";
import AnimatedLink from "@/components/AnimatedLink";
import CakeSvg from "@/components/CakeSvg";
import CandleSvg from "@/components/CandleSvg";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import ThemeButton from "@/components/ThemeButton";

type CandlePosition = {
  id: number;
  x: number; // Percentage from left (0-100)
  y: number; // Percentage from top (0-100)
};

export default function Page2() {
  const [candles, setCandles] = useState<CandlePosition[]>([]);
  const hasSetInitialTheme = useRef(false);
  const { theme, systemTheme, resolvedTheme, setTheme } = useTheme();

  // Force light mode on initial mount (only once)
  useEffect(() => {
    if (!hasSetInitialTheme.current) {
      setTheme("light");
      hasSetInitialTheme.current = true;
    }
  }, [setTheme]);

  useEffect(() => {
    console.log("=== Theme Info ===");
    console.log("Current theme:", theme);
    console.log("System theme:", systemTheme);
    console.log("Resolved theme:", resolvedTheme);
    console.log("==================");
  }, [theme, systemTheme, resolvedTheme]);

  const handleCakeSurfaceClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setCandles((prev) => [
      ...prev,
      {
        id: Date.now(),
        x: Math.max(0, Math.min(100, x)), // Clamp between 0-100
        y: Math.max(0, Math.min(100, y)), // Clamp between 0-100
      },
    ]);
  };

  const backgroundColor = resolvedTheme === "dark" ? "#212121" : undefined;
  const backgroundClass =
    resolvedTheme === "dark"
      ? ""
      : "bg-gradient-to-br from-sky-200 via-pink-100 to-purple-200";

  return (
    <ClickSpark sparkColor="#ffb6c1" sparkCount={12} extraScale={4}>
      <div
        className={`relative h-screen w-full overflow-hidden transition-colors duration-400 ${backgroundClass}`}
        style={backgroundColor ? { backgroundColor } : undefined}
      >
        {/* Các icon bay lên */}
        {/* <FloatingIconsField /> */}

        {/* Nội dung màn hình mới */}
        <main className="relative z-10 flex h-full items-center justify-center">
          <div className="relative">
            <CakeSvg />
            {/* Border để xác định bề mặt bánh kem */}
            <div
              className="absolute rounded-full flex items-center justify-center cursor-pointer"
              style={{
                width: "80%",
                height: "clamp(25%, 30vh, 35%)",
                top: "0%",
                left: "50%",
                transform: "translateX(-50%)",
              }}
              onClick={handleCakeSurfaceClick}
            >
              {/* Render các cây nến đã được thêm */}
              {candles.map((candle) => (
                <div
                  key={candle.id}
                  className="absolute"
                  style={{
                    left: `${candle.x}%`,
                    top: `${candle.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <div className="relative w-4 md:w-6">
                    <CandleSvg hideFlameHeight={50} />
                    {/* <FireAnimation /> */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Nút Back */}
        <AnimatedLink
          href="/"
          className="absolute bottom-8 left-8 z-20 rounded-full bg-pink-300  px-8 py-4 text-lg font-bold text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl active:scale-95"
        >
          ← Back
        </AnimatedLink>

        {/* Theme Toggler ở giữa màn hình, hơi bên trên */}
        <div className="absolute top-[15%] left-1/2 -translate-x-1/2 z-20">
          {/* <AnimatedThemeToggler className="rounded-full bg-white/80 dark:bg-gray-800/80 p-3 shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-colors" /> */}
          <ThemeButton />
        </div>
      </div>
    </ClickSpark>
  );
}

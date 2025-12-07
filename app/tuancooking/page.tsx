"use client";

import { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import ClickSpark from "@/components/ClickSpark";
import AnimatedLink from "@/components/AnimatedLink";
import CakeSvg from "@/components/CakeSvg";
import CandleSvg from "@/components/CandleSvg";
import ThemeButton from "@/components/ThemeButton";
import FireAnimation from "@/components/FireAnimation";
import { StarsBackground } from "@/components/animate-ui/components/backgrounds/stars";
import { useBlowDetection } from "@/hooks/useBlowDetection";

type CandlePosition = {
  id: number;
  x: number; // Percentage from left (0-100)
  y: number; // Percentage from top (0-100)
};

export default function Page2() {
  const [candles, setCandles] = useState<CandlePosition[]>([]);
  const [blowDetected, setBlowDetected] = useState(false);
  const hasSetInitialTheme = useRef(false);
  const { theme, systemTheme, resolvedTheme, setTheme } = useTheme();

  // Xử lý khi phát hiện tiếng thổi
  const handleBlowDetected = () => {
    console.log("🔥 Xử lý tiếng thổi - sẽ tắt nến ở đây");
    // Hiển thị indicator
    setBlowDetected(true);
    // Ẩn indicator sau 1 giây
    setTimeout(() => {
      setBlowDetected(false);
    }, 1000);
    // TODO: Xử lý tắt nến sau
  };

  // Sử dụng hook phát hiện tiếng thổi
  const {
    startListening,
    isListening,
    hasPermission,
    error,
    isLoading,
    permissionStatus,
  } = useBlowDetection(handleBlowDetected, 0.5, 0.7);

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

  const content = (
    <>
      {/* Indicator khi phát hiện tiếng thổi */}
      {blowDetected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-green-500/90 text-white px-8 py-6 rounded-2xl shadow-2xl animate-pulse scale-110">
            <div className="text-center">
              <div className="text-6xl mb-2">💨</div>
              <div className="text-2xl font-bold">Đã phát hiện tiếng thổi!</div>
              <div className="text-lg mt-1">Blow Detected!</div>
            </div>
          </div>
        </div>
      )}

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
                  {resolvedTheme === "dark" && <FireAnimation />}
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

      {/* Nút bật microphone và trạng thái */}
      {!hasPermission && !isLoading && (
        <div className="fixed top-4 right-4 z-30">
          <button
            onClick={startListening}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg font-bold text-lg flex items-center gap-2 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <span className="text-2xl">🎤</span>
            <span>Bật Microphone</span>
          </button>
        </div>
      )}

      {/* Hiển thị loading */}
      {isLoading && (
        <div className="fixed top-4 right-4 z-30 bg-yellow-500 text-white px-6 py-3 rounded-full shadow-lg font-bold text-lg flex items-center gap-2">
          <span className="text-2xl animate-spin">⏳</span>
          <span>Đang yêu cầu quyền...</span>
        </div>
      )}

      {/* Hiển thị trạng thái đang nghe */}
      {isListening && hasPermission && (
        <div className="fixed top-4 right-4 z-30 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg font-bold text-lg flex items-center gap-2 animate-pulse">
          <span className="text-2xl">🎧</span>
          <span>Đang nghe...</span>
        </div>
      )}

      {/* Hiển thị lỗi */}
      {error && (
        <div className="fixed top-4 right-4 z-30 bg-red-500 text-white px-6 py-4 rounded-2xl shadow-lg font-bold text-sm max-w-sm">
          <div className="flex items-start gap-2">
            <span className="text-2xl">⚠️</span>
            <div className="flex-1">
              <div className="font-bold mb-2">Lỗi:</div>
              <div className="text-xs whitespace-pre-line leading-relaxed">
                {error}
              </div>
              {permissionStatus === "denied" && (
                <button
                  onClick={() => {
                    window.location.reload();
                  }}
                  className="mt-3 bg-white text-red-500 px-4 py-2 rounded-lg text-xs font-bold hover:bg-gray-100 transition-colors"
                >
                  🔄 Làm mới trang
                </button>
              )}
            </div>
            <button
              onClick={() => {
                // Đóng thông báo lỗi (error sẽ được clear khi thử lại)
                window.location.reload();
              }}
              className="ml-2 text-white hover:text-gray-200 text-xl"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );

  return (
    <ClickSpark sparkColor="#ffb6c1" sparkCount={12} extraScale={4}>
      {resolvedTheme === "dark" ? (
        <StarsBackground
          className="relative h-screen w-full overflow-hidden"
          speed={50}
          starColor="#fff"
          pointerEvents={false}
        >
          {content}
        </StarsBackground>
      ) : (
        <div
          className={`relative h-screen w-full overflow-hidden transition-colors duration-400 ${backgroundClass}`}
          style={backgroundColor ? { backgroundColor } : undefined}
        >
          {content}
        </div>
      )}
    </ClickSpark>
  );
}

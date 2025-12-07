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
import {
  Progress,
  ProgressIndicator,
} from "@/components/animate-ui/primitives/radix/progress";

type CandlePosition = {
  id: number;
  x: number; // Percentage from left (0-100)
  y: number; // Percentage from top (0-100)
};

export default function Page2() {
  const [candles, setCandles] = useState<CandlePosition[]>([]);
  const [showBlowSuccess, setShowBlowSuccess] = useState(false);
  const [isBlowConfirmed, setIsBlowConfirmed] = useState(true); // Cho phép thổi lần đầu
  const hasSetInitialTheme = useRef(false);
  const { theme, systemTheme, resolvedTheme, setTheme } = useTheme();

  // Xử lý khi phát hiện tiếng thổi
  const handleBlowDetected = () => {
    // Chỉ xử lý nếu đã xác nhận lần thổi trước đó
    if (!isBlowConfirmed) {
      return; // Bỏ qua nếu chưa xác nhận
    }

    console.log("🔥 Xử lý tiếng thổi - sẽ tắt nến ở đây");
    // Hiển thị thông báo và chặn thổi tiếp
    setShowBlowSuccess(true);
    setIsBlowConfirmed(false);
    // TODO: Xử lý tắt nến sau
  };

  // Xử nhận thổi thành công
  const handleConfirmBlow = () => {
    setShowBlowSuccess(false);
    setIsBlowConfirmed(true); // Cho phép thổi tiếp
  };

  // Sử dụng hook phát hiện tiếng thổi
  // threshold: 0.4 (thấp hơn cho mobile - dễ phát hiện)
  // sensitivity: 0.6 (thấp hơn cho mobile - dễ phát hiện)
  // canTrigger: chỉ trigger khi đã xác nhận lần thổi trước
  const {
    startListening,
    isListening,
    hasPermission,
    error,
    isLoading,
    permissionStatus,
    blowProgress, // Lấy progress để hiển thị
  } = useBlowDetection(handleBlowDetected, 0.4, 0.6, () => isBlowConfirmed);

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
      {/* Thông báo khi phát hiện tiếng thổi - chỉ hiện 1 lần, cần xác nhận */}
      {showBlowSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-linear-to-br from-green-500 to-emerald-600 text-white px-8 py-8 rounded-3xl shadow-2xl max-w-md mx-4 border-4 border-white/20">
            <div className="text-center">
              <div className="text-7xl mb-4 animate-bounce">🎉</div>
              <div className="text-3xl font-bold mb-2">Thổi thành công!</div>
              <div className="text-lg mb-6 opacity-90">
                Bạn đã thổi tắt nến rồi!
              </div>
              <button
                onClick={handleConfirmBlow}
                className="bg-white text-green-600 px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
              >
                Xác nhận
              </button>
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

      {/* Nút bật microphone - chỉ hiển thị khi dark mode */}
      {!hasPermission && !isLoading && resolvedTheme === "dark" && (
        <div className="fixed top-4 right-4 z-30">
          <button
            onClick={startListening}
            className="bg-linear-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-700 hover:via-pink-700 hover:to-red-700 text-white px-8 py-4 rounded-full shadow-2xl font-bold text-lg flex items-center gap-3 transition-all duration-300 hover:scale-110 active:scale-95 border-2 border-white/30 backdrop-blur-sm"
          >
            <span className="text-3xl animate-pulse">🎂</span>
            <span className="bg-white/20 px-4 py-1 rounded-full">
              Bắt đầu thổi nến!
            </span>
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

      {/* Hiển thị trạng thái đang nghe - chỉ hiển thị khi dark mode */}
      {isListening && hasPermission && resolvedTheme === "dark" && (
        <div className="fixed top-4 right-4 z-30 bg-linear-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl font-bold text-sm border-2 border-white/30 backdrop-blur-sm min-w-[320px]">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl animate-pulse">💨</span>
              <span className="bg-white/20 px-4 py-2 rounded-full">
                Đang nghe... Hãy thổi vào microphone!
              </span>
            </div>
            {/* Progress bar */}
            <div className="w-full">
              <Progress
                value={blowProgress}
                className="h-3 bg-white/20 rounded-full overflow-hidden relative"
              >
                <ProgressIndicator
                  className="h-full w-full rounded-full"
                  style={{
                    background:
                      "linear-gradient(90deg, #fbbf24, #f59e0b, #ef4444)",
                  }}
                />
              </Progress>
              <div className="text-xs mt-1 text-center opacity-90">
                {Math.round(blowProgress)}% - Thổi mạnh hơn!
              </div>
            </div>
          </div>
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

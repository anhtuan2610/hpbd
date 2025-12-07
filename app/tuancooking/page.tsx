"use client";

import { useState, useEffect, useRef } from "react";
import { flushSync } from "react-dom";
import { useTheme } from "next-themes";
import Image from "next/image";
import Lottie from "lottie-react";
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
  const [partyAnimationData, setPartyAnimationData] = useState<unknown>(null);
  const hasSetInitialTheme = useRef(false);
  const hasShownSuccess = useRef(false); // Track xem đã hiện thông báo chưa
  const stopListeningRef = useRef<(() => void) | null>(null);
  const { theme, systemTheme, resolvedTheme, setTheme } = useTheme();

  // Load pháo hoa animation
  useEffect(() => {
    fetch("/Party.json")
      .then((res) => res.json())
      .then((data) => setPartyAnimationData(data))
      .catch((err) => console.error("Error loading party animation:", err));
  }, []);

  // Sử dụng hook phát hiện tiếng thổi
  // threshold: 0.4 (thấp hơn cho mobile - dễ phát hiện)
  // sensitivity: 0.6 (thấp hơn cho mobile - dễ phát hiện)
  // canTrigger: chỉ trigger khi đã xác nhận lần thổi trước
  const {
    startListening,
    stopListening,
    isListening,
    hasPermission,
    error,
    isLoading,
    permissionStatus,
    blowProgress, // Lấy progress để hiển thị
  } = useBlowDetection(
    () => {
      // Xử lý khi phát hiện tiếng thổi
      // Chỉ xử lý nếu đã xác nhận lần thổi trước đó và chưa hiện thông báo
      if (!isBlowConfirmed || hasShownSuccess.current) {
        return; // Bỏ qua nếu chưa xác nhận hoặc đã hiện thông báo
      }

      console.log("🔥 Xử lý tiếng thổi - sẽ tắt nến ở đây");
      // Hiển thị thông báo và chặn thổi tiếp
      hasShownSuccess.current = true; // Đánh dấu đã hiện
      setShowBlowSuccess(true);
      setIsBlowConfirmed(false);
      // Dừng nghe microphone sau khi thổi thành công
      if (stopListeningRef.current) {
        stopListeningRef.current();
      }
      // TODO: Xử lý tắt nến sau
    },
    0.4,
    0.6,
    () => isBlowConfirmed
  );

  // Lưu stopListening vào ref để có thể dùng trong callback
  useEffect(() => {
    stopListeningRef.current = stopListening;
  }, [stopListening]);

  // Hàm chuyển theme với animation mượt mà (giống ThemeButton)
  const changeThemeWithAnimation = (newTheme: "light" | "dark") => {
    // Tìm ThemeButton container để lấy vị trí cho animation
    const themeButtonContainer = document.querySelector(
      "[data-theme-button-container]"
    ) as HTMLElement;
    if (!themeButtonContainer) {
      // Nếu không tìm thấy, chuyển theme bình thường
      setTheme(newTheme);
      return;
    }

    const rect = themeButtonContainer.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    // Calculate max radius to cover entire screen from button center
    const distanceToCorners = [
      Math.hypot(x, y),
      Math.hypot(window.innerWidth - x, y),
      Math.hypot(x, window.innerHeight - y),
      Math.hypot(window.innerWidth - x, window.innerHeight - y),
    ];
    const maxRadius = Math.max(...distanceToCorners) + 100;

    // Set CSS variables BEFORE starting transition
    document.documentElement.style.setProperty("--x", `${x}px`);
    document.documentElement.style.setProperty("--y", `${y}px`);
    document.documentElement.style.setProperty("--radius", `${maxRadius}px`);
    document.documentElement.style.setProperty(
      "--transition-duration",
      "400ms"
    );

    // Check if browser supports View Transition API
    if (!document.startViewTransition) {
      setTheme(newTheme);
      return;
    }

    // Start transition - CSS animation will handle the circle expand
    document.startViewTransition(() => {
      flushSync(() => {
        setTheme(newTheme);
      });
    });
  };

  // Xử nhận thổi thành công
  const handleConfirmBlow = () => {
    setShowBlowSuccess(false);
    setIsBlowConfirmed(true); // Cho phép thổi tiếp
    hasShownSuccess.current = false; // Reset để có thể hiện lại nếu cần
    stopListening(); // Đảm bảo dừng nghe microphone

    // Chuyển theme với animation mượt mà
    setTimeout(() => {
      changeThemeWithAnimation("light");
    }, 100); // Delay nhỏ để đảm bảo modal đã đóng

    // Reset permission state để nút "Thổi nến" hiển thị lại khi chuyển về dark mode
    // Note: Không thể reset trực tiếp hasPermission từ hook,
    // nhưng khi chuyển về dark mode và chưa có permission, nút sẽ tự hiển thị
  };

  // Force light mode on initial mount (only once)
  useEffect(() => {
    if (!hasSetInitialTheme.current) {
      setTheme("light");
      hasSetInitialTheme.current = true;
    }
  }, [setTheme]);

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
      {/* Pháo hoa animation khi thổi thành công - nằm trên thông báo */}
      {showBlowSuccess && partyAnimationData && (
        <div className="fixed inset-0 z-[60] pointer-events-none">
          <Lottie
            animationData={partyAnimationData}
            loop={false}
            autoplay={true}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      )}

      {/* Thông báo khi phát hiện tiếng thổi - chỉ hiện 1 lần, cần xác nhận */}
      {showBlowSuccess && (
        <div className="fixed inset-0 z-[50] flex items-center justify-center">
          <div className="bg-linear-to-br from-green-500 to-emerald-600 text-white px-8 py-8 rounded-3xl shadow-2xl max-w-md mx-4 border-4 border-white/20">
            <div className="text-center">
              <div className="text-7xl mb-4 animate-bounce">🎉</div>
              <div className="text-3xl font-bold mb-2">
                Chúc Quyên tuổi 25 mọi thứ tốt đẹp!
              </div>
              <button
                onClick={handleConfirmBlow}
                className="bg-white text-green-600 px-8 py-3 mt-2 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
              >
                Oki
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Các icon bay lên */}
      {/* <FloatingIconsField /> */}

      {/* Nội dung màn hình mới */}
      <main className="relative z-10 flex h-full items-center justify-center">
        <div className="relative flex flex-col items-center gap-8 mb-15">
          {/* Mũi tên trỏ vào bánh kem (từ trên xuống) */}
          {candles.length === 0 && (
            <div className="absolute -top-30 left-20 -translate-x-1/2 pointer-events-none z-30">
              <p
                className="absolute text-lg font-semibold text-pink-600 drop-shadow-lg whitespace-nowrap"
                style={{
                  top: "-30px",
                  left: "20%",
                  transform: "translateX(-50%)",
                  rotate: "-10deg",
                }}
              >
                Cắm nến vào đây nè
              </p>
              <div className="relative w-30 h-30">
                <Image
                  src="/arrow.png"
                  alt="Arrow pointing to cake"
                  fill
                  className="object-contain"
                  style={{ transform: "rotate(90deg)" }}
                />
              </div>
            </div>
          )}
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

          {/* Progress bar - chỉ hiển thị khi đang nghe */}
          {isListening && hasPermission && resolvedTheme === "dark" && (
            <div className="w-64 md:w-80 mt-4">
              <Progress
                value={blowProgress}
                className="h-3 bg-white/20 dark:bg-gray-700/30 rounded-full overflow-hidden relative"
              >
                <ProgressIndicator
                  className="h-full w-full rounded-full bg-white/40 backdrop-blur-sm"
                  style={{
                    background: "rgba(255, 255, 255, 0.4)",
                    backdropFilter: "blur(8px)",
                  }}
                />
              </Progress>
            </div>
          )}
        </div>
      </main>

      {/* Theme Toggler ở giữa màn hình, hơi bên trên */}
      <div
        className="absolute top-[5%] left-1/2 -translate-x-1/2 z-20"
        data-theme-button-container
      >
        {/* <AnimatedThemeToggler className="rounded-full bg-white/80 dark:bg-gray-800/80 p-3 shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-colors" /> */}
        <ThemeButton />
      </div>

      {/* Nút Back */}
      <AnimatedLink
        href="/"
        className="absolute bottom-10 left-8 z-20 rounded-full bg-pink-300  px-8 py-4 text-lg font-bold text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl active:scale-95"
      >
        ← Back
      </AnimatedLink>

      {/* Nút bật microphone - chỉ hiển thị khi dark mode và không đang nghe */}
      {!isListening && !isLoading && resolvedTheme === "dark" && (
        <div className="absolute bottom-11 right-8 z-20">
          <button
            onClick={startListening}
            className="bg-linear-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 text-white px-4 py-2.5 rounded-full shadow-lg font-semibold text-sm flex items-center gap-2 transition-all duration-300 hover:scale-105 active:scale-95 border border-white/20 backdrop-blur-sm"
          >
            <span className="text-lg animate-pulse">🎂</span>
            <span>Thổi nến</span>
          </button>
        </div>
      )}

      {/* Hiển thị loading */}
      {isLoading && (
        <div className="absolute bottom-8 right-8 z-20 bg-yellow-500 text-white px-4 py-2 rounded-full shadow-lg font-semibold text-sm flex items-center gap-2">
          <span className="text-lg animate-spin">⏳</span>
          <span>Đang yêu cầu quyền...</span>
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

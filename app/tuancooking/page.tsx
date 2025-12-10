"use client";

import { useState, useEffect, useRef } from "react";
import { flushSync } from "react-dom";
import { useTheme } from "next-themes";
import ClickSpark from "@/components/ClickSpark";
import ThemeButton from "@/components/ThemeButton";
import { StarsBackground } from "@/components/animate-ui/components/backgrounds/stars";
import { useBlowDetection } from "@/hooks/useBlowDetection";
import CardAnimation from "@/components/CardAnimation";
import CakeWithCandles from "@/components/CakeWithCandles";
import AgeNumberDisplay from "@/components/AgeNumberDisplay";
import BlowProgressBar from "@/components/BlowProgressBar";
import BlowButton from "@/components/BlowButton";
import BackButton from "@/components/BackButton";
import BlowSuccessModal from "@/components/BlowSuccessModal";
import ErrorNotification from "@/components/ErrorNotification";
import LoadingIndicator from "@/components/LoadingIndicator";
import Image from "next/image";

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
  const hasShownSuccess = useRef(false); // Track xem đã hiện thông báo chưa
  const stopListeningRef = useRef<(() => void) | null>(null);
  const { resolvedTheme, setTheme } = useTheme();

  // Load flower animation
  // useEffect(() => {
  //   fetch("/flower-animatino.json")
  //     .then((res) => res.json())
  //     .then((data) => setFlowerAnimationData(data))
  //     .catch((err) => console.error("Error loading flower animation:", err));
  // }, []);

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
    // Giới hạn tối đa 24 nến
    if (candles.length >= 24) {
      return; // Không thêm nến nữa nếu đã đạt giới hạn
    }

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
      {/* Các icon bay lên */}
      {/* <FloatingIconsField /> */}

      {/* Theme Toggler ở giữa màn hình, hơi bên trên */}
      <div
        className="absolute top-[5%] right-4 z-20 lg:left-1/2 lg:-translate-x-1/2 lg:right-auto"
        data-theme-button-container
      >
        {/* Mũi tên chỉ vào nút toggle ở góc 8 giờ */}
        <div className="absolute -bottom-4 -left-22 pointer-events-none z-30">
          <p
            className="absolute text-base font-semibold text-pink-600 dark:text-pink-400 drop-shadow-lg whitespace-nowrap"
            style={{
              bottom: "50px",
              left: "-40px",
              rotate: "-10deg",
            }}
          >
            Sáng / Tối
          </p>
          <div className="relative w-20 h-20">
            <Image
              src="/arrow.png"
              alt="Arrow pointing to theme button"
              fill
              className="object-contain"
              style={{ transform: "rotate(30deg)" }}
            />
          </div>
        </div>
        {/* <AnimatedThemeToggler className="rounded-full bg-white/80 dark:bg-gray-800/80 p-3 shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-colors" /> */}
        <ThemeButton />
      </div>

      {/* Nội dung màn hình mới */}
      <main className="relative z-10 flex h-full items-center justify-center">
        <div className="flex flex-col lg:flex-row items-center justify-center h-fit lg:mb-0 gap-10 mt-20 lg:gap-8">
          <div className="relative flex flex-col items-center gap-8">
            <CakeWithCandles
              candles={candles}
              onCakeClick={handleCakeSurfaceClick}
              resolvedTheme={resolvedTheme}
            />
            <AgeNumberDisplay resolvedTheme={resolvedTheme} />
            <BlowProgressBar
              isListening={isListening}
              hasPermission={hasPermission}
              resolvedTheme={resolvedTheme}
              blowProgress={blowProgress}
            />
          </div>
          <div className="lg:ml-8">
            <CardAnimation />
          </div>
        </div>
      </main>

      <BackButton resolvedTheme={resolvedTheme} />
      <BlowButton
        isListening={isListening}
        isLoading={isLoading}
        resolvedTheme={resolvedTheme}
        onStartListening={startListening}
      />
      <BlowSuccessModal show={showBlowSuccess} onConfirm={handleConfirmBlow} />
      <LoadingIndicator isLoading={isLoading} />
      <ErrorNotification error={error} permissionStatus={permissionStatus} />

      {/* Flower animation ở dưới cùng màn hình */}
      {/* {flowerAnimationData && (
        <div className="fixed bottom-0 left-0 right-0 z-20 pointer-events-none overflow-visible">
          <Lottie
            animationData={flowerAnimationData}
            loop={false}
            autoplay={true}
            style={{
              width: "100%",
              height: "clamp(150px, 20vh, 300px)",
              display: "block",
            }}
            className="w-full"
          />
        </div>
      )} */}
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

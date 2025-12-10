"use client";

import { memo } from "react";
import Image from "next/image";
import CakeSvg from "@/components/CakeSvg";
import CandleSvg from "@/components/CandleSvg";
import FireAnimation from "@/components/FireAnimation";

type CandlePosition = {
  id: number;
  x: number;
  y: number;
};

type CakeWithCandlesProps = {
  candles: CandlePosition[];
  onCakeClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  resolvedTheme: string | undefined;
};

const CakeWithCandles = memo(function CakeWithCandles({
  candles,
  onCakeClick,
  resolvedTheme,
}: CakeWithCandlesProps) {
  return (
    <div className="relative flex flex-col items-center gap-8">
      {/* Mũi tên trỏ vào bánh kem (từ trên xuống) */}
      {candles.length === 0 && (
        <div className="absolute -top-10 left-20 -translate-x-1/2 pointer-events-none z-30">
          <p
            className="absolute text-base font-semibold text-pink-600 dark:text-pink-400 drop-shadow-lg whitespace-nowrap"
            style={{
              top: "-50px",
              left: "-20%",
              transform: "translateX(-50%)",
              rotate: "-30deg",
            }}
          >
            Cắm nến vào đây nhé
          </p>
          <div className="relative w-20 h-20">
            <Image
              src="/arrow.png"
              alt="Arrow pointing to cake"
              fill
              className="object-contain"
              style={{ transform: "rotate(70deg)" }}
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
        onClick={onCakeClick}
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
  );
});

CakeWithCandles.displayName = "CakeWithCandles";

export default CakeWithCandles;

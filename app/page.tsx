"use client";

import Image from "next/image";
import ClickSpark from "@/components/ClickSpark";
import CurvedLoop from "@/components/CurvedLoop";
import FloatingIconsField from "@/components/FloatingIcons";
import PowerOffSlide from "@/components/smoothui/power-off-slide";
import CuteDoggie from "@/components/CuteDoggie";

export default function Home() {
  return (
    <ClickSpark sparkColor="#ffb6c1" sparkCount={12} extraScale={4}>
      <div className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-sky-200 via-pink-100 to-purple-200 transition-colors duration-400">
        {/* Các icon bay lên */}
        <FloatingIconsField />

        {/* Nội dung */}
        <main className="relative z-10 flex h-full items-start justify-center">
          <CurvedLoop marqueeText="Happy Birthday! Chúc mừng bạn Quyên tuổi mới zui zẻ! " />
        </main>

        {/* Slide Button ở giữa màn hình */}
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <div className="relative pointer-events-auto">
            {/* Mũi tên trỏ vào bánh kem (bên trái nút) */}
            <div className="absolute -top-24 left-7 pointer-events-none">
              <p
                className="absolute text-lg font-semibold text-pink-600 drop-shadow-lg whitespace-nowrap"
                style={{
                  top: "30px",
                  left: "90%", // Điều chỉnh giá trị này để di chuyển text trái/phải
                  transform: "translateX(-50%)", // Căn giữa text
                  rotate: "30deg",
                }}
              >
                Kéo cái này nhé
              </p>
              <div className="relative w-30 h-30">
                <Image
                  src="/arrow.png"
                  alt="Arrow pointing to cake button"
                  fill
                  className="object-contain"
                  style={{ transform: "rotate(180deg)" }}
                />
              </div>
            </div>
            <PowerOffSlide
              label="Đi thổi nến nào"
              onPowerOff={() => {}}
              href="/tuancooking"
              className=""
            />
          </div>
        </div>

        {/* Phần dưới cùng màn hình - nơi các con vật đứng */}
        <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none">
          {/* Mặt đất đơn giản */}
          <div
            className="w-full bg-gradient-to-t from-green-600 to-green-500"
            style={{
              height: "160px",
            }}
          />

          {/* Animation chó con */}
          <CuteDoggie />
        </div>
      </div>
    </ClickSpark>
  );
}

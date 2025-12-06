"use client";

import ClickSpark from "@/components/ClickSpark";
import CurvedLoop from "@/components/CurvedLoop";
import FloatingIconsField from "@/components/FloatingIcons";
import PowerOffSlide from "@/components/smoothui/power-off-slide";
import CuteDoggie from "@/components/CuteDoggie";

export default function Home() {
  return (
    <ClickSpark sparkColor="#ffb6c1" sparkCount={12} extraScale={4}>
      <div className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-sky-200 via-pink-100 to-purple-200">
        {/* Các icon bay lên */}
        <FloatingIconsField />

        {/* Nội dung */}
        <main className="relative z-10 flex h-full items-start justify-center">
          <CurvedLoop marqueeText="Happy Birthday! Chúc mừng Quyên sinh nhật vui vẻ nhé! " />
        </main>

        {/* Slide Button ở giữa màn hình */}
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <div className="pointer-events-auto">
            <PowerOffSlide
              label="Đi thổi nến nào"
              onPowerOff={() => {
                console.log("Power off triggered");
              }}
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
              height: "60px",
            }}
          />

          {/* Animation chó con */}
          <CuteDoggie />
        </div>
      </div>
    </ClickSpark>
  );
}

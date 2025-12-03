"use client";

import ClickSpark from "@/components/ClickSpark";
import CurvedLoop from "@/components/CurvedLoop";
import FloatingIconsField from "@/components/FloatingIcons";

export default function Home() {
  return (
    <ClickSpark sparkColor="#ff4500" sparkCount={10} extraScale={1.8}>
      <div className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-sky-200 via-pink-100 to-purple-200">
        {/* Các icon bay lên */}
        <FloatingIconsField />

        {/* Nội dung */}
        <main className="relative z-10 flex h-full items-start justify-center">
          <CurvedLoop marqueeText="Happy Birthday! Chúc mừng Quyên sinh nhật vui vẻ nhé! " />
        </main>
      </div>
    </ClickSpark>
  );
}

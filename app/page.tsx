"use client";

import ClickSpark from "@/components/ClickSpark";
import CurvedLoop from "@/components/CurvedLoop";
import FloatingIconsField from "@/components/FloatingIcons";
import Link from "next/link";

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

        {/* Nút Next */}
        <Link
          href="/tuancooking"
          className="absolute bottom-8 right-8 z-20 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 px-8 py-4 text-lg font-bold text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl active:scale-95"
        >
          Next →
        </Link>
      </div>
    </ClickSpark>
  );
}

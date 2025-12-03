"use client";

import ClickSpark from "@/components/ClickSpark";
import FloatingIconsField from "@/components/FloatingIcons";
import Link from "next/link";

export default function Page2() {
  return (
    <ClickSpark sparkColor="#ff4500" sparkCount={10} extraScale={1.8}>
      <div className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-sky-200 via-pink-100 to-purple-200">
        {/* Các icon bay lên */}
        <FloatingIconsField />

        {/* Nội dung màn hình mới */}
        <main className="relative z-10 flex h-full items-center justify-center">
          <div className="text-center">
            <h1 className="mb-8 text-6xl font-bold text-white drop-shadow-lg">
              🎉 Chúc mừng sinh nhật! 🎉
            </h1>
            <p className="text-2xl text-white drop-shadow-md">
              Màn hình mới của bạn đây!
            </p>
          </div>
        </main>

        {/* Nút Back */}
        <Link
          href="/"
          className="absolute bottom-8 left-8 z-20 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-8 py-4 text-lg font-bold text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl active:scale-95"
        >
          ← Back
        </Link>
      </div>
    </ClickSpark>
  );
}

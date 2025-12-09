"use client";

import { memo } from "react";
import AnimatedLink from "@/components/AnimatedLink";
import { ArrowLeft } from "lucide-react";

type BackButtonProps = {
  resolvedTheme: string | undefined;
};

const BackButton = memo(function BackButton({
  resolvedTheme,
}: BackButtonProps) {
  if (resolvedTheme !== "light") {
    return null;
  }

  return (
    <AnimatedLink
      href="/"
      className="absolute top-[5%] left-4 z-20 rounded-full bg-pink-300 w-12 h-12 flex items-center justify-center text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl active:scale-95"
    >
      <ArrowLeft size={24} />
    </AnimatedLink>
  );
});

BackButton.displayName = "BackButton";

export default BackButton;

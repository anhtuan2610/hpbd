"use client";

import { memo } from "react";

type BlowButtonProps = {
  isListening: boolean;
  isLoading: boolean;
  resolvedTheme: string | undefined;
  onStartListening: () => void;
};

const BlowButton = memo(function BlowButton({
  isListening,
  isLoading,
  resolvedTheme,
  onStartListening,
}: BlowButtonProps) {
  if (isListening || isLoading || resolvedTheme !== "dark") {
    return null;
  }

  return (
    <div className="absolute top-[5%] left-4 z-20">
      <button
        onClick={onStartListening}
        className="bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-full shadow-lg font-medium text-sm flex items-center gap-2 transition-all duration-300 hover:scale-105 active:scale-95 border border-white/30 backdrop-blur-md"
      >
        <span className="text-lg">🎂</span>
        <span>Thủi nến</span>
      </button>
    </div>
  );
});

BlowButton.displayName = "BlowButton";

export default BlowButton;

"use client";

import { memo } from "react";
import { NumberTicker } from "@/components/ui/number-ticker";
import { SparklesText } from "@/components/ui/sparkles-text";

type AgeNumberDisplayProps = {
  resolvedTheme: string | undefined;
};

const AgeNumberDisplay = memo(function AgeNumberDisplay({
  resolvedTheme,
}: AgeNumberDisplayProps) {
  if (resolvedTheme !== "dark") return null;

  return (
    <div className="absolute -top-25 lg:-top-30 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
      <SparklesText
        colors={{ first: "#FFB6C1", second: "#FF69B4" }}
        sparklesCount={4}
      >
        <NumberTicker
          value={24}
          startValue={0}
          className="text-5xl lg:text-7xl font-semibold tracking-tighter text-white px-1"
        />
      </SparklesText>
    </div>
  );
});

AgeNumberDisplay.displayName = "AgeNumberDisplay";

export default AgeNumberDisplay;


"use client";

import { memo } from "react";
import {
  Progress,
  ProgressIndicator,
} from "@/components/animate-ui/primitives/radix/progress";

type BlowProgressBarProps = {
  isListening: boolean;
  hasPermission: boolean;
  resolvedTheme: string | undefined;
  blowProgress: number;
};

const BlowProgressBar = memo(function BlowProgressBar({
  isListening,
  hasPermission,
  resolvedTheme,
  blowProgress,
}: BlowProgressBarProps) {
  if (!isListening || !hasPermission || resolvedTheme !== "dark") {
    return null;
  }

  return (
    <div className="w-64 md:w-80 mt-4">
      <Progress
        value={blowProgress}
        className="h-3 bg-white/20 dark:bg-gray-700/30 rounded-full overflow-hidden relative"
      >
        <ProgressIndicator
          className="h-full w-full rounded-full bg-white/40 backdrop-blur-sm"
          style={{
            background: "rgba(255, 255, 255, 0.4)",
            backdropFilter: "blur(8px)",
          }}
        />
      </Progress>
    </div>
  );
});

BlowProgressBar.displayName = "BlowProgressBar";

export default BlowProgressBar;


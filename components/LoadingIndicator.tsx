"use client";

import { memo } from "react";

type LoadingIndicatorProps = {
  isLoading: boolean;
};

const LoadingIndicator = memo(function LoadingIndicator({
  isLoading,
}: LoadingIndicatorProps) {
  if (!isLoading) return null;

  return (
    <div className="absolute bottom-8 right-8 z-20 bg-yellow-500 text-white px-4 py-2 rounded-full shadow-lg font-semibold text-sm flex items-center gap-2">
      <span className="text-lg animate-spin">⏳</span>
      <span>Đang yêu cầu quyền...</span>
    </div>
  );
});

LoadingIndicator.displayName = "LoadingIndicator";

export default LoadingIndicator;


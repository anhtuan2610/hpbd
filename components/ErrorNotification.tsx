"use client";

import { memo } from "react";

type ErrorNotificationProps = {
  error: string | null;
  permissionStatus: string | undefined;
};

const ErrorNotification = memo(function ErrorNotification({
  error,
  permissionStatus,
}: ErrorNotificationProps) {
  if (!error) return null;

  return (
    <div className="fixed top-4 right-4 z-30 bg-red-500 text-white px-6 py-4 rounded-2xl shadow-lg font-bold text-sm max-w-sm">
      <div className="flex items-start gap-2">
        <span className="text-2xl">⚠️</span>
        <div className="flex-1">
          <div className="font-bold mb-2">Lỗi:</div>
          <div className="text-xs whitespace-pre-line leading-relaxed">
            {error}
          </div>
          {permissionStatus === "denied" && (
            <button
              onClick={() => {
                window.location.reload();
              }}
              className="mt-3 bg-white text-red-500 px-4 py-2 rounded-lg text-xs font-bold hover:bg-gray-100 transition-colors"
            >
              🔄 Làm mới trang
            </button>
          )}
        </div>
        <button
          onClick={() => {
            window.location.reload();
          }}
          className="ml-2 text-white hover:text-gray-200 text-xl"
        >
          ✕
        </button>
      </div>
    </div>
  );
});

ErrorNotification.displayName = "ErrorNotification";

export default ErrorNotification;


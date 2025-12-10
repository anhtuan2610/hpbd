"use client";

import { memo, useState, useEffect } from "react";
import Lottie from "lottie-react";

type BlowSuccessModalProps = {
  show: boolean;
  onConfirm: () => void;
};

const BlowSuccessModal = memo(function BlowSuccessModal({
  show,
  onConfirm,
}: BlowSuccessModalProps) {
  const [partyAnimationData, setPartyAnimationData] = useState<unknown>(null);

  // Load pháo hoa animation
  useEffect(() => {
    if (show) {
      fetch("/Party.json")
        .then((res) => res.json())
        .then((data) => setPartyAnimationData(data))
        .catch(() => {});
    }
  }, [show]);

  if (!show) return null;

  return (
    <>
      {/* Pháo hoa animation khi thổi thành công - nằm trên thông báo */}
      {partyAnimationData && (
        <div className="fixed inset-0 z-[60] pointer-events-none">
          <Lottie
            animationData={partyAnimationData}
            loop={false}
            autoplay={true}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      )}

      {/* Thông báo khi phát hiện tiếng thổi - chỉ hiện 1 lần, cần xác nhận */}
      <div className="fixed inset-0 z-[50] flex items-center justify-center">
        <div className="bg-linear-to-br from-green-500 to-emerald-600 text-white px-8 py-8 rounded-3xl shadow-2xl max-w-md mx-4 border-4 border-white/20">
          <div className="text-center">
            <div className="text-7xl mb-4 animate-bounce">🎉</div>
            <div className="text-3xl font-bold mb-2">
              Chúc Quyên tuổi 24 mọi thứ tốt đẹp nhất!
            </div>
            <button
              onClick={onConfirm}
              className="bg-white text-green-600 px-8 py-3 mt-2 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
            >
              Oki
            </button>
          </div>
        </div>
      </div>
    </>
  );
});

BlowSuccessModal.displayName = "BlowSuccessModal";

export default BlowSuccessModal;

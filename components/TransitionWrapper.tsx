"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import PageTransition from "./PageTransition";
import {
  TransitionProvider,
  useTransition,
} from "@/contexts/TransitionContext";

type TransitionWrapperInnerProps = {
  children: React.ReactNode;
};

function TransitionWrapperInner({ children }: TransitionWrapperInnerProps) {
  const pathname = usePathname();
  const { isTransitioning, setIsTransitioning } = useTransition();
  const [displayChildren, setDisplayChildren] = useState(children);
  const prevPathnameRef = useRef<string | null>(null);
  const [transitionMode, setTransitionMode] = useState<
    "closing" | "opening" | "closed" | "none"
  >("closed"); // Bắt đầu ở trạng thái đóng
  const isManualTransitionRef = useRef(false);
  const manualTransitionStartTimeRef = useRef<number | null>(null);

  // Listen to manual transition trigger (từ slide button)
  useEffect(() => {
    if (isTransitioning) {
      // Đánh dấu manual trigger ngay lập tức
      isManualTransitionRef.current = true;
      manualTransitionStartTimeRef.current = Date.now();

      // Đóng page hiện tại
      setTransitionMode("closing");
    }
  }, [isTransitioning]);

  // Trigger transition tự động khi pathname thay đổi (back/forward navigation)
  useEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      // Nếu có manual trigger đang chạy (từ slide button)
      if (isManualTransitionRef.current) {
        // Đã đóng page cũ rồi (từ useEffect manual transition)
        // Đảm bảo transition đóng đã hoàn thành (800ms) trước khi cập nhật children
        const elapsed = manualTransitionStartTimeRef.current
          ? Date.now() - manualTransitionStartTimeRef.current
          : 0;
        const remainingCloseTime = Math.max(0, 800 - elapsed);

        const timer = setTimeout(() => {
          // Bây giờ pathname đã thay đổi, cập nhật children và mở page mới
          setDisplayChildren(children);
          // Page mới bắt đầu ở trạng thái đóng
          setTransitionMode("closed");

          // Sau 1s delay, mở page mới
          setTimeout(() => {
            setTransitionMode("opening");

            // Sau khi mở xong, reset
            setTimeout(() => {
              setTransitionMode("none");
              setIsTransitioning(false);
              isManualTransitionRef.current = false;
              manualTransitionStartTimeRef.current = null;
            }, 800);
          }, 1000);
        }, remainingCloseTime);

        prevPathnameRef.current = pathname;
        return () => {
          clearTimeout(timer);
        };
      } else {
        // Không có manual trigger - tự động transition (back/forward navigation)
        // Nếu đã có page trước đó, đóng page cũ trước
        if (prevPathnameRef.current !== null) {
          setTransitionMode("closing");

          // Sau khi đóng xong (800ms) + 1000ms delay, cập nhật children và mở page mới
          const timer = setTimeout(() => {
            setDisplayChildren(children);
            // Page mới bắt đầu ở trạng thái đóng
            setTransitionMode("closed");

            // Sau 1s delay, mở page mới
            setTimeout(() => {
              setTransitionMode("opening");

              // Sau khi mở xong, reset
              setTimeout(() => {
                setTransitionMode("none");
              }, 800);
            }, 1000);
          }, 800 + 1000); // 800ms đóng + 1000ms delay

          prevPathnameRef.current = pathname;
          return () => {
            clearTimeout(timer);
          };
        } else {
          // Lần đầu mount: bắt đầu ở trạng thái đóng, sau đó mở ra
          setDisplayChildren(children);
          setTransitionMode("closed");

          // Sau 1s delay, mở page
          setTimeout(() => {
            setTransitionMode("opening");

            setTimeout(() => {
              setTransitionMode("none");
            }, 800);
          }, 1000);

          prevPathnameRef.current = pathname;
        }
      }
    } else {
      // Cập nhật children mà không trigger transition
      setDisplayChildren(children);
    }
  }, [pathname, children, setIsTransitioning]);

  return (
    <PageTransition mode={transitionMode}>{displayChildren}</PageTransition>
  );
}

export default function TransitionWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TransitionProvider>
      <TransitionWrapperInner>{children}</TransitionWrapperInner>
    </TransitionProvider>
  );
}

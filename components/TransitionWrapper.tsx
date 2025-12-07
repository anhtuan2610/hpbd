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

  // Listen to manual transition trigger (từ slide button)
  useEffect(() => {
    if (isTransitioning) {
      // Đánh dấu manual trigger ngay lập tức
      isManualTransitionRef.current = true;

      // Đóng page hiện tại
      setTransitionMode("closing");

      // Sau 800ms (đóng xong) + 1000ms delay, navigate và mở page mới
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
            setIsTransitioning(false);
            isManualTransitionRef.current = false;
          }, 800);
        }, 1000);
      }, 800);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [isTransitioning, children, setIsTransitioning]);

  // Trigger transition tự động khi pathname thay đổi (back/forward navigation)
  useEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      // Nếu không có manual trigger đang chạy
      if (!isManualTransitionRef.current) {
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
      } else {
        // Pathname đã thay đổi nhưng có manual trigger, chỉ cập nhật children
        prevPathnameRef.current = pathname;
        setDisplayChildren(children);
      }
    } else {
      // Cập nhật children mà không trigger transition
      setDisplayChildren(children);
    }
  }, [pathname, children]);

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

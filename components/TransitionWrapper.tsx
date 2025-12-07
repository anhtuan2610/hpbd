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
  const prevPathnameRef = useRef(pathname);
  const [shouldTransition, setShouldTransition] = useState(false);
  const isManualTransitionRef = useRef(false);

  // Listen to manual transition trigger (từ slide button)
  useEffect(() => {
    if (isTransitioning) {
      isManualTransitionRef.current = true;
      // Wrap setState trong setTimeout để tránh cascading renders
      const initTimer = setTimeout(() => {
        setShouldTransition(true);
      }, 0);

      // Sau 600ms (đóng vào) + 1000ms (delay), thay đổi nội dung (lúc này router đã navigate)
      const timer = setTimeout(() => {
        // Cập nhật children với nội dung mới từ router
        setDisplayChildren(children);
        // Sau khi transition hoàn tất (600ms mở ra), reset trạng thái
        setTimeout(() => {
          setShouldTransition(false);
          setIsTransitioning(false);
          isManualTransitionRef.current = false;
        }, 1000);
      }, 1000 + 1000);

      return () => {
        clearTimeout(initTimer);
        clearTimeout(timer);
      };
    }
  }, [isTransitioning, children, setIsTransitioning]);

  // Trigger transition tự động khi pathname thay đổi (back/forward navigation)
  useEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      // Nếu không có manual trigger đang chạy, trigger transition tự động
      if (!isManualTransitionRef.current) {
        // Wrap setState trong setTimeout để tránh cascading renders
        const initTimer = setTimeout(() => {
          setShouldTransition(true);
        }, 0);

        // Sau 600ms (đóng vào) + 1000ms (delay), thay đổi nội dung
        const timer = setTimeout(() => {
          setDisplayChildren(children);
          // Sau khi transition hoàn tất (600ms mở ra), reset trạng thái
          setTimeout(() => {
            setShouldTransition(false);
          }, 1000);
        }, 1000 + 1000);

        prevPathnameRef.current = pathname;
        return () => {
          clearTimeout(initTimer);
          clearTimeout(timer);
        };
      } else {
        // Pathname đã thay đổi nhưng có manual trigger, chỉ cập nhật children
        prevPathnameRef.current = pathname;
        setTimeout(() => {
          setDisplayChildren(children);
        }, 0);
      }
    } else {
      // Cập nhật children mà không trigger transition
      setTimeout(() => {
        setDisplayChildren(children);
      }, 0);
    }
  }, [pathname, children]);

  return (
    <PageTransition isActive={shouldTransition}>
      {displayChildren}
    </PageTransition>
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

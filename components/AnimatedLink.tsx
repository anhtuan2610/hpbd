"use client";

import Link from "next/link";
import { useTransition } from "@/contexts/TransitionContext";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

type AnimatedLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
};

export default function AnimatedLink({
  href,
  children,
  className = "",
  onClick,
}: AnimatedLinkProps) {
  const { triggerTransition } = useTransition();
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    if (onClick) {
      onClick();
    }

    // Trigger transition trước
    triggerTransition();

    // Navigate sau khi đóng vào xong + delay: đóng vào (800ms) + delay (500ms) = 1300ms
    setTimeout(() => {
      router.push(href);
    }, 1300);
  };

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}

